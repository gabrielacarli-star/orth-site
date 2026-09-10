"use client"

import { useTransition } from "react"
import { atualizarStatusCliente } from "@/lib/actions/clientes"
import type { StatusCliente } from "@/lib/types"

const OPCOES: { value: StatusCliente; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_contato", label: "Em contato" },
  { value: "proposta_enviada", label: "Proposta enviada" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
]

const CORES: Record<StatusCliente, string> = {
  novo: "bg-white/10 text-orth-muted",
  em_contato: "bg-orth-electric/20 text-orth-sky",
  proposta_enviada: "bg-amber-500/15 text-amber-400",
  fechado: "bg-emerald-500/15 text-emerald-400",
  perdido: "bg-red-500/15 text-red-400",
}

export function StatusClienteSelect({
  clienteId,
  status,
}: {
  clienteId: string
  status: StatusCliente
}) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() =>
          atualizarStatusCliente(clienteId, e.target.value as StatusCliente)
        )
      }
      className={`text-xs rounded-full px-2.5 py-1 border-0 cursor-pointer ${CORES[status]}`}
    >
      {OPCOES.map((o) => (
        <option key={o.value} value={o.value} className="bg-orth-dark text-white">
          {o.label}
        </option>
      ))}
    </select>
  )
}
