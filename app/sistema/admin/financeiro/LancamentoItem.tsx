"use client"

import { useActionState, useState, useTransition } from "react"
import {
  atualizarLancamento,
  marcarStatusLancamento,
  removerLancamento,
  type LancamentoFormState,
} from "@/lib/actions/financeiro"
import { formatBRL } from "@/components/sistema/StatCard"
import type { FinanceiroLancamento } from "@/lib/types"

const initialState: LancamentoFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3 py-1.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR")
}

export function LancamentoItem({ lancamento: l }: { lancamento: FinanceiroLancamento }) {
  const [editando, setEditando] = useState(false)
  const [marcando, startMarcar] = useTransition()
  const [removendo, startRemover] = useTransition()
  const acaoComId = atualizarLancamento.bind(null, l.id)
  const [state, formAction, pending] = useActionState(acaoComId, initialState)

  if (editando) {
    return (
      <form
        action={formAction}
        className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-orth-line/10 last:border-b-0"
      >
        <select name="tipo" defaultValue={l.tipo} className={inputClass}>
          <option value="receita">Receita (a receber)</option>
          <option value="despesa">Despesa (a pagar)</option>
        </select>
        <input name="valor" type="number" step="0.01" min="0.01" defaultValue={l.valor} required className={inputClass} />
        <input
          name="descricao"
          defaultValue={l.descricao}
          required
          className={`sm:col-span-2 ${inputClass}`}
        />
        <input name="categoria" defaultValue={l.categoria ?? ""} placeholder="Categoria" className={inputClass} />
        <input name="cliente_nome" defaultValue={l.cliente_nome ?? ""} placeholder="Cliente" className={inputClass} />
        <input name="data_prevista" type="date" defaultValue={l.data_prevista} required className={inputClass} />
        <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
          <input type="checkbox" name="recorrente" defaultChecked={l.recorrente} className="rounded accent-orth-electric" />
          É recorrente (mensalidade)
        </label>

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
          <button type="button" onClick={() => setEditando(false)} className="text-xs text-orth-muted hover:text-white">
            {state?.success ? "Fechar" : "Cancelar"}
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="py-3 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-medium rounded px-1.5 py-0.5 ${
              l.tipo === "receita" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
            }`}
          >
            {l.tipo === "receita" ? "Receita" : "Despesa"}
          </span>
          <p className="text-white text-sm font-medium">{l.descricao}</p>
          {l.recorrente && <span className="text-orth-muted text-xs">(recorrente)</span>}
        </div>
        <p className="text-orth-sky text-sm mt-0.5">{formatBRL(l.valor)}</p>
        <p className="text-orth-muted text-xs mt-0.5">
          {[l.categoria, l.cliente_nome].filter(Boolean).join(" · ")}
        </p>
        <p className="text-orth-muted text-xs mt-0.5">
          Previsto: {formatarData(l.data_prevista)}
          {l.status === "pago" && l.data_pago && ` · Pago em ${formatarData(l.data_pago)}`}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={() => startMarcar(() => marcarStatusLancamento(l.id, l.status !== "pago"))}
          disabled={marcando}
          className={`text-xs rounded-lg px-2.5 py-1.5 border transition-colors ${
            l.status === "pago"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "border-orth-line/20 text-orth-muted hover:border-orth-electric"
          }`}
        >
          {l.status === "pago" ? "Pago" : "Marcar como pago"}
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setEditando(true)} className="text-xs text-orth-muted hover:text-white transition-colors">
            editar
          </button>
          <button
            onClick={() => {
              if (confirm(`Remover o lançamento "${l.descricao}"?`)) {
                startRemover(() => removerLancamento(l.id))
              }
            }}
            disabled={removendo}
            className="text-xs text-orth-muted hover:text-red-400 transition-colors"
          >
            remover
          </button>
        </div>
      </div>
    </div>
  )
}
