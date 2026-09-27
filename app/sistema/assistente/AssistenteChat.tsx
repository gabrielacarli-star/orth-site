"use client"

import { useEffect, useRef, useState } from "react"

interface Mensagem {
  role: "user" | "assistant"
  content: string
}

const SUGESTOES = [
  "Qual a diferença entre landing page e site institucional?",
  "Como responder se o cliente achar Google Ads caro?",
  "Quando faz mais sentido indicar Meta Ads em vez de Google Ads?",
  "O cliente quer um app, mas acho que um web app resolve. Como explico isso?",
]

export function AssistenteChat() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [input, setInput] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  async function enviar(texto: string) {
    const pergunta = texto.trim()
    if (!pergunta || enviando) return

    setErro(null)
    const historico: Mensagem[] = [...mensagens, { role: "user", content: pergunta }]
    setMensagens([...historico, { role: "assistant", content: "" }])
    setInput("")
    setEnviando(true)

    try {
      const resposta = await fetch("/api/sistema/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: historico }),
      })

      if (!resposta.ok || !resposta.body) {
        const textoErro = await resposta.text()
        throw new Error(textoErro || "Não foi possível falar com o assistente.")
      }

      const reader = resposta.body.getReader()
      const decoder = new TextDecoder()

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const pedaco = decoder.decode(value, { stream: true })
        setMensagens((atual) => {
          const copia = [...atual]
          const ultima = copia[copia.length - 1]
          copia[copia.length - 1] = { ...ultima, content: ultima.content + pedaco }
          return copia
        })
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado.")
      setMensagens((atual) => atual.slice(0, -1))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-orth-line/10 bg-orth-navy/30">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 min-h-[320px] max-h-[55vh]">
        {mensagens.length === 0 && (
          <div className="space-y-3">
            <p className="text-orth-muted text-sm">Algumas ideias pra começar:</p>
            <div className="flex flex-col gap-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="text-left text-sm text-orth-sky hover:text-white bg-orth-dark/60 hover:bg-orth-dark border border-orth-line/10 rounded-lg px-3.5 py-2.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensagens.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-orth-electric text-white"
                  : "bg-orth-dark border border-orth-line/10 text-orth-sky"
              }`}
            >
              {m.content || (enviando && i === mensagens.length - 1 ? "..." : "")}
            </div>
          </div>
        ))}
        <div ref={fimRef} />
      </div>

      {erro && (
        <p className="mx-4 sm:mx-6 mb-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {erro}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          enviar(input)
        }}
        className="border-t border-orth-line/10 p-3 sm:p-4 flex gap-2 shrink-0"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua dúvida..."
          disabled={enviando}
          className="flex-1 rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={enviando || !input.trim()}
          className="rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-5 py-2.5 text-sm disabled:opacity-60"
        >
          {enviando ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  )
}
