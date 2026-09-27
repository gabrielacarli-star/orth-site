"use client"

import { useActionState, useRef, useEffect, useState, useTransition } from "react"
import {
  adicionarPreco,
  removerPreco,
  atualizarValorMinimo,
  type PrecoFormState,
} from "@/lib/actions/precos"
import type { TabelaPreco } from "@/lib/types"

const initialState: PrecoFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

function MinimoInput({ preco }: { preco: TabelaPreco }) {
  const [valor, setValor] = useState(preco.valor_minimo != null ? String(preco.valor_minimo) : "")
  const [pending, startTransition] = useTransition()

  function salvar() {
    const numero = valor.trim() ? Number(valor.replace(",", ".")) : null
    if (numero !== null && (!Number.isFinite(numero) || numero < 0)) return
    startTransition(() => atualizarValorMinimo(preco.id, numero))
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="text-orth-muted text-xs">mínimo R$</span>
      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="sem mínimo"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onBlur={salvar}
        disabled={pending}
        className="w-24 rounded-md bg-orth-dark border border-orth-line/20 px-2 py-1 text-white text-sm"
      />
    </div>
  )
}

export function PrecosManager({ precos }: { precos: TabelaPreco[] }) {
  const [state, formAction, pending] = useActionState(adicionarPreco, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [removing, startRemove] = useTransition()

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state?.success])

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
        {precos.map((p) => (
          <div key={p.id} className="py-3 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white text-sm font-medium">{p.servico}</p>
              <p className="text-orth-sky text-sm">{p.valor_descricao}</p>
              {p.condicao_pagamento && (
                <p className="text-orth-muted text-xs mt-0.5">{p.condicao_pagamento}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <MinimoInput preco={p} />
              <button
                onClick={() => startRemove(() => removerPreco(p.id))}
                disabled={removing}
                className="text-xs text-orth-muted hover:text-red-400 transition-colors shrink-0"
              >
                remover
              </button>
            </div>
          </div>
        ))}
        {precos.length === 0 && (
          <p className="py-4 text-center text-orth-muted text-sm">Nenhum item cadastrado.</p>
        )}
      </div>
      <p className="text-orth-muted text-xs">
        O “mínimo” bloqueia o gerador de proposta: o vendedor não consegue gerar um PDF cobrando
        menos que isso por esse item (mensal). Deixe em branco pra não ter limite.
      </p>

      <form
        ref={formRef}
        action={formAction}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5"
      >
        <h3 className="sm:col-span-2 text-white text-sm font-medium">Adicionar item à tabela</h3>
        <input name="servico" placeholder="Serviço (ex: Criação de site)" required className={inputClass} />
        <input
          name="valor_descricao"
          placeholder="Valor (ex: A partir de R$ 4.000,00)"
          required
          className={inputClass}
        />
        <input
          name="condicao_pagamento"
          placeholder="Condição de pagamento (opcional)"
          className={`sm:col-span-2 ${inputClass}`}
        />
        <input
          name="ordem"
          type="number"
          placeholder="Ordem de exibição"
          defaultValue={precos.length + 1}
          className={inputClass}
        />
        <input
          name="valor_minimo"
          type="number"
          step="0.01"
          min="0"
          placeholder="Valor mínimo mensal (opcional)"
          className={inputClass}
        />

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
          {pending ? "Adicionando..." : "Adicionar item"}
        </button>
      </form>
    </div>
  )
}
