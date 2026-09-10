"use client"

import { useTransition } from "react"
import { removerAgendamento } from "@/lib/actions/agendamentos"
import type { Agendamento } from "@/lib/types"

export function AgendamentoItem({ agendamento }: { agendamento: Agendamento }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="py-3 flex items-start justify-between gap-4">
      <div>
        <p className="text-white text-sm font-medium">{agendamento.titulo}</p>
        {agendamento.cliente_nome && (
          <p className="text-orth-muted text-xs">{agendamento.cliente_nome}</p>
        )}
        <p className="text-orth-sky text-xs mt-0.5">
          {new Date(agendamento.data_hora).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })}{" "}
          · {agendamento.duracao_minutos} min
        </p>
        {agendamento.notas && (
          <p className="text-orth-muted text-xs mt-0.5">{agendamento.notas}</p>
        )}
      </div>
      <button
        onClick={() => startTransition(() => removerAgendamento(agendamento.id))}
        disabled={pending}
        className="text-xs text-orth-muted hover:text-red-400 transition-colors shrink-0"
      >
        remover
      </button>
    </div>
  )
}
