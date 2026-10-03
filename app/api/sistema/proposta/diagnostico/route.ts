import Anthropic from "@anthropic-ai/sdk"
import { getPerfil } from "@/lib/dal"
import { SYSTEM_PROMPT_DIAGNOSTICO_PROPOSTA } from "@/lib/ai/conhecimentoOrth"

interface ItemEntrada {
  nome?: string
  descricao?: string
}

export async function POST(request: Request) {
  const perfil = await getPerfil()
  if (!perfil) {
    return new Response("Não autorizado", { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "A geração automática ainda não foi configurada. Peça para o admin configurar a chave da API da Anthropic (ANTHROPIC_API_KEY) nas variáveis de ambiente da Vercel.",
      { status: 503 }
    )
  }

  let body: {
    clienteNome?: string
    clienteSegmento?: string
    tituloProposta?: string
    itens?: ItemEntrada[]
  }
  try {
    body = await request.json()
  } catch {
    return new Response("JSON inválido", { status: 400 })
  }

  const clienteNome = String(body.clienteNome || "").trim()
  const clienteSegmento = String(body.clienteSegmento || "").trim()
  const tituloProposta = String(body.tituloProposta || "").trim()
  const itens = Array.isArray(body.itens) ? body.itens : []

  if (!clienteNome) {
    return new Response("Preencha o nome do cliente antes de gerar o diagnóstico.", {
      status: 400,
    })
  }

  const nomesItens = itens
    .map((i) => String(i?.nome || "").trim())
    .filter(Boolean)
    .join(", ")

  const linhas = [`Cliente: ${clienteNome}`]
  if (clienteSegmento) linhas.push(`Segmento e cidade: ${clienteSegmento}`)
  if (tituloProposta) linhas.push(`Proposta: ${tituloProposta}`)
  if (nomesItens) linhas.push(`Itens da proposta: ${nomesItens}`)
  linhas.push('\nEscreva o diagnóstico "O que identificamos" pra essa proposta.')

  const client = new Anthropic()

  try {
    const resposta = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 600,
      system: SYSTEM_PROMPT_DIAGNOSTICO_PROPOSTA,
      messages: [{ role: "user", content: linhas.join("\n") }],
    })

    const texto = resposta.content
      .filter((bloco) => bloco.type === "text")
      .map((bloco) => bloco.text)
      .join("\n")
      .trim()

    if (!texto) {
      return new Response("Não foi possível gerar o diagnóstico. Tente novamente.", {
        status: 502,
      })
    }

    return Response.json({ texto })
  } catch {
    return new Response("Não foi possível gerar o diagnóstico. Tente novamente em instantes.", {
      status: 502,
    })
  }
}
