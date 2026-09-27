import Anthropic from "@anthropic-ai/sdk"
import { getPerfil } from "@/lib/dal"
import { SYSTEM_PROMPT_ASSISTENTE } from "@/lib/ai/conhecimentoOrth"

interface MensagemEntrada {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: Request) {
  const perfil = await getPerfil()
  if (!perfil) {
    return new Response("Não autorizado", { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "O assistente ainda não foi configurado. Peça para o admin configurar a chave da API da Anthropic (ANTHROPIC_API_KEY) nas variáveis de ambiente da Vercel.",
      { status: 503 }
    )
  }

  let body: { mensagens?: MensagemEntrada[] }
  try {
    body = await request.json()
  } catch {
    return new Response("JSON inválido", { status: 400 })
  }

  const historico = (Array.isArray(body.mensagens) ? body.mensagens : [])
    .filter(
      (m): m is MensagemEntrada =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.trim() }))

  if (historico.length === 0 || historico[historico.length - 1].role !== "user") {
    return new Response("Envie uma pergunta.", { status: 400 })
  }

  const client = new Anthropic()

  const stream = client.messages.stream({
    model: "claude-opus-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT_ASSISTENTE,
    output_config: { effort: "low" },
    messages: historico,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      stream.on("text", (texto) => {
        controller.enqueue(encoder.encode(texto))
      })
      try {
        await stream.finalMessage()
      } catch {
        controller.enqueue(
          encoder.encode("\n\n[Erro ao gerar a resposta. Tente novamente em instantes.]")
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
