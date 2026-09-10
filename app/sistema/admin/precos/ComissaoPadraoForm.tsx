"use client"

import { useActionState } from "react"
import { atualizarComissaoPadrao, type PrecoFormState } from "@/lib/actions/precos"

const initialState: PrecoFormState = {}

export function ComissaoPadraoForm({ valorAtual }: { valorAtual: number }) {
  const [state, formAction, pending] = useActionState(atualizarComissaoPadrao, initialState)

  return (
    <form
      action={formAction}
      className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 flex flex-wrap items-end gap-3"
    >
      <div>
        <label htmlFor="comissao_percentual_padrao" className="block text-sm text-orth-muted mb-1.5">
          Comissão padrão para novos vendedores
        </label>
        <div className="flex items-center gap-2">
          <input
            id="comissao_percentual_padrao"
            name="comissao_percentual_padrao"
            type="number"
            step="0.01"
            min="0"
            max="100"
            defaultValue={valorAtual}
            className="w-28 rounded-lg bg-orth-dark border border-orth-line/20 px-3 py-2 text-white text-sm"
          />
          <span className="text-orth-muted text-sm">%</span>
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-4 py-2 text-sm disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
      {state?.success && <span className="text-emerald-400 text-sm">Salvo.</span>}
      {state?.error && <span className="text-red-400 text-sm">{state.error}</span>}
      <p className="w-full text-orth-muted text-xs mt-1">
        Isso não altera a comissão de vendedores já cadastrados — ajuste o % de cada um
        individualmente na página de Vendedores.
      </p>
    </form>
  )
}
