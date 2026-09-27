import { NextResponse } from "next/server"
import { getPerfil } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { gerarUrlDeConsentimento, integracaoGoogleConfigurada } from "@/lib/google/negocio"

export async function GET(request: Request) {
  const perfil = await getPerfil()
  if (!perfil) return new Response("Não autorizado", { status: 401 })

  if (!integracaoGoogleConfigurada()) {
    return new Response(
      "A integração com o Google Meu Negócio ainda não foi configurada (faltam as variáveis GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_OAUTH_REDIRECT_URI).",
      { status: 503 }
    )
  }

  const clienteId = new URL(request.url).searchParams.get("clienteId")
  if (!clienteId) return new Response("clienteId ausente", { status: 400 })

  const supabase = await createClient()
  const query = supabase.from("clientes").select("id").eq("id", clienteId)
  const { data: cliente } =
    perfil.role === "admin" ? await query.maybeSingle() : await query.eq("vendedor_id", perfil.id).maybeSingle()

  if (!cliente) return new Response("Cliente não encontrado.", { status: 404 })

  return NextResponse.redirect(gerarUrlDeConsentimento(clienteId))
}
