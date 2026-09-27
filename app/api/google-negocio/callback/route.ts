import { NextResponse } from "next/server"
import { getPerfil } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  trocarCodigoPorTokens,
  emailDoIdToken,
  primeiraLocationDaConta,
} from "@/lib/google/negocio"

export async function GET(request: Request) {
  const perfil = await getPerfil()
  if (!perfil) return NextResponse.redirect(new URL("/sistema/login", request.url))

  const voltarHref = perfil.role === "admin" ? "/sistema/admin/clientes" : "/sistema/vendedor/clientes"
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const clienteId = url.searchParams.get("state")
  const erroGoogle = url.searchParams.get("error")

  function redirecionarComErro(mensagem: string) {
    const destino = new URL(voltarHref, request.url)
    destino.searchParams.set("google_erro", mensagem)
    return NextResponse.redirect(destino)
  }

  if (erroGoogle) return redirecionarComErro("Conexão cancelada.")
  if (!code || !clienteId) return redirecionarComErro("Resposta inválida do Google.")

  const supabase = await createClient()
  const query = supabase.from("clientes").select("id").eq("id", clienteId)
  const { data: cliente } =
    perfil.role === "admin" ? await query.maybeSingle() : await query.eq("vendedor_id", perfil.id).maybeSingle()

  if (!cliente) return redirecionarComErro("Cliente não encontrado.")

  try {
    const tokens = await trocarCodigoPorTokens(code)
    if (!tokens.refresh_token) {
      return redirecionarComErro(
        "O Google não retornou permissão de acesso contínuo. Remova o acesso da ORTH em myaccount.google.com/permissions e tente conectar de novo."
      )
    }

    const location = await primeiraLocationDaConta(tokens.access_token)
    if (!location) {
      return redirecionarComErro(
        "Não encontramos nenhum perfil do Google Meu Negócio nessa conta. Confirme se a conta usada é a mesma que administra o perfil do cliente."
      )
    }

    const admin = createAdminClient()
    const { error } = await admin.from("google_negocio_conexoes").upsert(
      {
        cliente_id: clienteId,
        vendedor_id: perfil.id,
        google_email: emailDoIdToken(tokens.id_token ?? ""),
        location_name: location.name,
        location_display_name: location.displayName,
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token,
        access_token_expira_em: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        ativo: true,
        ultimo_erro: null,
      },
      { onConflict: "cliente_id" }
    )

    if (error) return redirecionarComErro(`Erro ao salvar conexão: ${error.message}`)

    const destino = new URL(voltarHref, request.url)
    destino.searchParams.set("google_ok", "1")
    return NextResponse.redirect(destino)
  } catch (err) {
    return redirecionarComErro(err instanceof Error ? err.message : "Erro inesperado.")
  }
}
