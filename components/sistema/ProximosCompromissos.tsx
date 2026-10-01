import Link from "next/link"
import type { CompromissoComVendedor } from "@/lib/agenda"

function formatarQuando(dataHora: string) {
  const data = new Date(dataHora)
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)

  const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  if (data.toDateString() === hoje.toDateString()) return `Hoje, ${hora}`
  if (data.toDateString() === amanha.toDateString()) return `Amanhã, ${hora}`
  return `${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}, ${hora}`
}

export function ProximosCompromissos({
  compromissos,
  mostrarVendedor = false,
  linkAgenda,
}: {
  compromissos: CompromissoComVendedor[]
  mostrarVendedor?: boolean
  linkAgenda: string
}) {
  return (
    <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5">
      <h2 className="text-orth-muted text-sm uppercase tracking-wide mb-3">
        Próximos compromissos
      </h2>

      {compromissos.length === 0 ? (
        <p className="text-orth-muted text-sm">Nenhum compromisso agendado.</p>
      ) : (
        <div className="divide-y divide-orth-line/10">
          {compromissos.map((c) => (
            <div key={c.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{c.titulo}</p>
                {c.cliente_nome && (
                  <p className="text-orth-muted text-xs truncate">{c.cliente_nome}</p>
                )}
                {mostrarVendedor && (
                  <p className="text-orth-muted text-xs truncate">
                    {[c.vendedorNome, ...c.participantesNomes].filter(Boolean).join(" + ")}
                  </p>
                )}
              </div>
              <span className="text-orth-sky text-xs whitespace-nowrap shrink-0">
                {formatarQuando(c.data_hora)}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link
        href={linkAgenda}
        className="inline-block mt-4 text-orth-sky text-sm hover:text-white transition-colors"
      >
        Ver agenda completa →
      </Link>
    </div>
  )
}
