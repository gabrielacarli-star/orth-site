import Anthropic from "@anthropic-ai/sdk"
import { createAdminClient } from "@/lib/supabase/admin"
import { renovarAccessToken, publicarLocalPost } from "@/lib/google/negocio"
import { gerarPromptPostGoogleNegocio } from "@/lib/ai/postGoogleNegocio"

export const maxDuration = 300

interface ConexaoComCliente {
  id: string
  location_name: string
  refresh_token: string
  descricao_negocio: string | null
  palavras_chave: string | null
  clientes: { nome: string; empresa: string | null } | null
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get("authorization")
    if (auth !== `Bearer ${cronSecret}`) {
      return new Response("Não autorizado", { status: 401 })
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ ok: false, motivo: "ANTHROPIC_API_KEY não configurada" })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("google_negocio_conexoes")
    .select("id, location_name, refresh_token, descricao_negocio, palavras_chave, clientes(nome, empresa)")
    .eq("ativo", true)

  if (error) return Response.json({ ok: false, motivo: error.message }, { status: 500 })

  const conexoes = (data ?? []) as unknown as ConexaoComCliente[]
  const client = new Anthropic()
  const resultados: { conexaoId: string; status: "publicado" | "erro"; detalhe?: string }[] = []

  for (const conexao of conexoes) {
    try {
      const tokens = await renovarAccessToken(conexao.refresh_token)

      const { system, user } = gerarPromptPostGoogleNegocio({
        nomeCliente: conexao.clientes?.empresa || conexao.clientes?.nome || "Negócio",
        descricaoNegocio: conexao.descricao_negocio,
        palavrasChave: conexao.palavras_chave,
      })

      const resposta = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system,
        messages: [{ role: "user", content: user }],
      })

      const conteudo = resposta.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim()

      if (!conteudo) throw new Error("A IA não gerou conteúdo.")

      await publicarLocalPost(tokens.access_token, conexao.location_name, conteudo)

      await admin
        .from("google_negocio_conexoes")
        .update({
          access_token: tokens.access_token,
          access_token_expira_em: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          ultimo_post_em: new Date().toISOString(),
          ultimo_erro: null,
        })
        .eq("id", conexao.id)

      await admin
        .from("google_negocio_posts")
        .insert({ conexao_id: conexao.id, conteudo, status: "publicado" })

      resultados.push({ conexaoId: conexao.id, status: "publicado" })
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : "Erro desconhecido"

      await admin.from("google_negocio_conexoes").update({ ultimo_erro: mensagem }).eq("id", conexao.id)
      await admin
        .from("google_negocio_posts")
        .insert({ conexao_id: conexao.id, conteudo: "", status: "erro", erro_mensagem: mensagem })

      resultados.push({ conexaoId: conexao.id, status: "erro", detalhe: mensagem })
    }
  }

  return Response.json({ ok: true, total: conexoes.length, resultados })
}
