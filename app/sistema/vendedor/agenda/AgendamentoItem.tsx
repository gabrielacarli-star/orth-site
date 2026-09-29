"use client"

import { useActionState, useState, useTransition } from "react"
import { atualizarAgendamento, removerAgendamento, type AgendamentoFormState } from "@/lib/actions/agendamentos"
import type { Agendamento } from "@/lib/types"

const initialState: AgendamentoFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3 py-1.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function AgendamentoItem({
  agendamento,
  todosVendedores,
  participantes,
  souDono,
}: {
  agendamento: Agendamento
  todosVendedores: { id: string; nome: string }[]
  participantes: string[]
  souDono: boolean
}) {
  const [editando, setEditando] = useState(false)
  const [removendo, startRemover] = useTransition()
  const acaoComId = atualizarAgendamento.bind(null, agendamento.id)
  const [state, formAction, pending] = useActionState(acaoComId, initialState)

  const nomePorId = new Map(todosVendedores.map((v) => [v.id, v.nome]))
  const nomesParticipantes = participantes.map((id) => nomePorId.get(id) ?? "—")
  const outrasPessoas = todosVendedores.filter((v) => v.id !== agendamento.vendedor_id)

  if (editando) {
    const d = new Date(agendamento.data_hora)
    const dataDefault = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    const horaDefault = `${pad(d.getHours())}:${pad(d.getMinutes())}`

    return (
      <form
        action={formAction}
        className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-orth-line/10 last:border-b-0"
      >
        <input name="titulo" defaultValue={agendamento.titulo} placeholder="Título" required className={inputClass} />
        <input
          name="cliente_nome"
          defaultValue={agendamento.cliente_nome ?? ""}
          placeholder="Nome do cliente (opcional)"
          className={inputClass}
        />
        <input name="data" type="date" defaultValue={dataDefault} required className={inputClass} />
        <input name="hora" type="time" defaultValue={horaDefault} required className={inputClass} />
        <input
          name="duracao_minutos"
          type="number"
          min="15"
          step="15"
          defaultValue={agendamento.duracao_minutos}
          placeholder="Duração (min)"
          className={inputClass}
        />
        <input
          name="notas"
          defaultValue={agendamento.notas ?? ""}
          placeholder="Notas (opcional)"
          className={inputClass}
        />

        {outrasPessoas.length > 0 && (
          <div className="sm:col-span-2">
            <p className="text-orth-muted text-xs mb-1.5">Participantes</p>
            <div className="flex flex-wrap gap-3">
              {outrasPessoas.map((v) => (
                <label key={v.id} className="flex items-center gap-1.5 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    name="participantes"
                    value={v.id}
                    defaultChecked={participantes.includes(v.id)}
                    className="rounded accent-orth-electric"
                  />
                  {v.nome}
                </label>
              ))}
            </div>
          </div>
        )}

        {state?.error && (
          <p className="sm:col-span-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}

        <div className="sm:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="text-xs rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-3 py-1.5 disabled:opacity-60"
          >
            {pending ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="text-xs text-orth-muted hover:text-white"
          >
            {state?.success ? "Fechar" : "Cancelar"}
          </button>
        </div>
      </form>
    )
  }

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
        {nomesParticipantes.length > 0 && (
          <p className="text-orth-muted text-xs mt-0.5">Com: {nomesParticipantes.join(", ")}</p>
        )}
        {agendamento.notas && (
          <p className="text-orth-muted text-xs mt-0.5">{agendamento.notas}</p>
        )}
      </div>
      {souDono && (
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setEditando(true)}
            className="text-xs text-orth-muted hover:text-white transition-colors"
          >
            editar
          </button>
          <button
            onClick={() => startRemover(() => removerAgendamento(agendamento.id))}
            disabled={removendo}
            className="text-xs text-orth-muted hover:text-red-400 transition-colors"
          >
            remover
          </button>
        </div>
      )}
    </div>
  )
}
