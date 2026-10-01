"use client"

import { useState, useTransition } from "react"
import { atualizarStatusCliente } from "@/lib/actions/clientes"
import { PropostaEditor } from "@/components/sistema/PropostaEditor"
import { GoogleNegocioEditor } from "@/components/sistema/GoogleNegocioEditor"
import type { Cliente, GoogleNegocioConexao, StatusCliente } from "@/lib/types"

const COLUNAS: { status: StatusCliente; label: string }[] = [
  { status: "novo", label: "Novo" },
  { status: "em_contato", label: "Em contato" },
  { status: "proposta_enviada", label: "Proposta enviada" },
  { status: "fechado", label: "Fechado" },
  { status: "perdido", label: "Perdido" },
]

export function KanbanClientes({
  clientes,
  conexoesPorCliente,
}: {
  clientes: Cliente[]
  conexoesPorCliente: Map<string, GoogleNegocioConexao>
}) {
  const [clientesAnteriores, setClientesAnteriores] = useState(clientes)
  const [items, setItems] = useState(clientes)
  const [, startTransition] = useTransition()
  const [arrastando, setArrastando] = useState<string | null>(null)

  if (clientes !== clientesAnteriores) {
    setClientesAnteriores(clientes)
    setItems(clientes)
  }

  function mover(clienteId: string, status: StatusCliente) {
    setItems((prev) => prev.map((c) => (c.id === clienteId ? { ...c, status } : c)))
    startTransition(() => {
      atualizarStatusCliente(clienteId, status)
    })
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {COLUNAS.map((coluna) => {
        const clientesDaColuna = items.filter((c) => c.status === coluna.status)
        return (
          <div
            key={coluna.status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const clienteId = e.dataTransfer.getData("text/plain")
              if (clienteId) mover(clienteId, coluna.status)
              setArrastando(null)
            }}
            className="w-[270px] flex-shrink-0 rounded-xl border border-orth-line/10 bg-orth-navy/20 p-3 space-y-3"
          >
            <h3 className="text-xs uppercase tracking-wide text-orth-muted flex items-center justify-between">
              {coluna.label}
              <span className="text-orth-muted/70">{clientesDaColuna.length}</span>
            </h3>

            <div className="space-y-2 min-h-[60px]">
              {clientesDaColuna.map((c) => (
                <div
                  key={c.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", c.id)
                    setArrastando(c.id)
                  }}
                  onDragEnd={() => setArrastando(null)}
                  className={`rounded-lg border border-orth-line/10 bg-orth-dark/60 p-3 space-y-2 cursor-grab active:cursor-grabbing transition-opacity ${
                    arrastando === c.id ? "opacity-40" : ""
                  }`}
                >
                  <p className="text-white text-sm font-medium">{c.nome}</p>
                  {c.empresa && <p className="text-orth-muted text-xs">{c.empresa}</p>}
                  <p className="text-orth-muted text-xs">
                    {[c.telefone, c.email].filter(Boolean).join(" · ") || "—"}
                  </p>
                  {c.notas && <p className="text-orth-muted text-xs line-clamp-2">{c.notas}</p>}

                  <select
                    value={c.status}
                    onChange={(e) => mover(c.id, e.target.value as StatusCliente)}
                    className="w-full text-xs rounded-md bg-orth-dark border border-orth-line/20 px-2 py-1 text-orth-muted cursor-pointer"
                  >
                    {COLUNAS.map((o) => (
                      <option key={o.status} value={o.status} className="bg-orth-dark text-white">
                        {o.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <PropostaEditor cliente={c} />
                    <GoogleNegocioEditor clienteId={c.id} conexao={conexoesPorCliente.get(c.id) ?? null} />
                  </div>
                </div>
              ))}
              {clientesDaColuna.length === 0 && (
                <p className="text-orth-muted/40 text-xs text-center py-6">Nenhum lead aqui</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
