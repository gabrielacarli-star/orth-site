"use client"

import { useActionState, useRef, useEffect } from "react"
import { criarAgendamento, type AgendamentoFormState } from "@/lib/actions/agendamentos"

const initialState: AgendamentoFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function NovoAgendamentoForm({
  todosVendedores,
  vendedores,
  vendedorSelecionado,
  meuId,
}: {
  todosVendedores: { id: string; nome: string }[]
  vendedores?: { id: string; nome: string }[]
  vendedorSelecionado?: string
  meuId: string
}) {
  const [state, formAction, pending] = useActionState(criarAgendamento, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state?.success])

  const outrasPessoas = todosVendedores.filter((v) => v.id !== meuId)

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5"
    >
      <h3 className="sm:col-span-2 text-white text-sm font-medium">Novo compromisso</h3>

      {vendedores && (
        <select
          name="vendedor_id"
          required
          defaultValue={vendedorSelecionado}
          className={`sm:col-span-2 ${inputClass}`}
        >
          {vendedores.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nome}
            </option>
          ))}
        </select>
      )}

      <input name="titulo" placeholder="Título (ex: Reunião com cliente)" required className={inputClass} />
      <input name="cliente_nome" placeholder="Nome do cliente (opcional)" className={inputClass} />
      <input name="data" type="date" required className={inputClass} />
      <input name="hora" type="time" required className={inputClass} />
      <input
        name="duracao_minutos"
        type="number"
        min="15"
        step="15"
        defaultValue={60}
        placeholder="Duração (min)"
        className={inputClass}
      />
      <input name="notas" placeholder="Notas (opcional)" className={inputClass} />

      {outrasPessoas.length > 0 && (
        <div className="sm:col-span-2">
          <p className="text-orth-muted text-xs mb-1.5">Convidar outras pessoas (opcional)</p>
          <div className="flex flex-wrap gap-3">
            {outrasPessoas.map((v) => (
              <label key={v.id} className="flex items-center gap-1.5 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="participantes"
                  value={v.id}
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

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Adicionar à agenda"}
      </button>
    </form>
  )
}
