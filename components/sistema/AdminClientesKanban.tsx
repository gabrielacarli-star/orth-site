"use client"

import { useState } from "react"
import { KanbanClientes } from "@/components/sistema/KanbanClientes"
import type { Cliente, GoogleNegocioConexao } from "@/lib/types"

interface Grupo {
  vendedorId: string
  nome: string
  clientes: Cliente[]
}

export function AdminClientesKanban({
  grupos,
  conexoesPorCliente,
}: {
  grupos: Grupo[]
  conexoesPorCliente: Map<string, GoogleNegocioConexao>
}) {
  const [ativoId, setAtivoId] = useState(grupos[0]?.vendedorId ?? "")
  const grupoAtivo = grupos.find((g) => g.vendedorId === ativoId) ?? grupos[0]

  if (!grupoAtivo) {
    return (
      <p className="py-4 text-center text-orth-muted text-sm rounded-xl border border-orth-line/10 bg-orth-navy/40">
        Nenhum vendedor cadastrado ainda.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {grupos.map((g) => (
          <button
            key={g.vendedorId}
            onClick={() => setAtivoId(g.vendedorId)}
            className={`text-sm rounded-lg px-3.5 py-2 transition-colors ${
              g.vendedorId === grupoAtivo.vendedorId
                ? "bg-orth-electric text-white"
                : "border border-orth-line/20 text-orth-muted hover:text-white hover:border-orth-electric"
            }`}
          >
            {g.nome}
            <span className="ml-1.5 opacity-70">({g.clientes.length})</span>
          </button>
        ))}
      </div>

      <KanbanClientes clientes={grupoAtivo.clientes} conexoesPorCliente={conexoesPorCliente} />
    </div>
  )
}
