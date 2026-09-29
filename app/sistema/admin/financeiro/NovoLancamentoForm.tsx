"use client"

import { useActionState, useRef, useEffect } from "react"
import { criarLancamento, type LancamentoFormState } from "@/lib/actions/financeiro"

const initialState: LancamentoFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function NovoLancamentoForm() {
  const [state, formAction, pending] = useActionState(criarLancamento, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state?.success])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5"
    >
      <h3 className="sm:col-span-2 text-white text-sm font-medium">Novo lançamento</h3>

      <select name="tipo" defaultValue="receita" className={inputClass}>
        <option value="receita">Receita (a receber)</option>
        <option value="despesa">Despesa (a pagar)</option>
      </select>
      <input
        name="valor"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Valor (R$)"
        required
        className={inputClass}
      />
      <input
        name="descricao"
        placeholder="Descrição (ex: Mensalidade cliente X)"
        required
        className={`sm:col-span-2 ${inputClass}`}
      />
      <input name="categoria" placeholder="Categoria (opcional)" className={inputClass} />
      <input name="cliente_nome" placeholder="Cliente (opcional)" className={inputClass} />
      <input name="data_prevista" type="date" required className={inputClass} />
      <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
        <input type="checkbox" name="recorrente" className="rounded accent-orth-electric" />
        É recorrente (mensalidade)
      </label>

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
        {pending ? "Salvando..." : "Adicionar lançamento"}
      </button>
    </form>
  )
}
