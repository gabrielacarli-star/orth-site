"use client"

import { useActionState, useState } from "react"
import { atualizarProposta, type PropostaFormState } from "@/lib/actions/clientes"
import { formatBRL } from "@/components/sistema/StatCard"
import type { Cliente } from "@/lib/types"

const initialState: PropostaFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3 py-1.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function PropostaEditor({ cliente }: { cliente: Cliente }) {
  const [aberto, setAberto] = useState(false)
  const acaoComId = atualizarProposta.bind(null, cliente.id)
  const [state, formAction, pending] = useActionState(acaoComId, initialState)

  if (!aberto) {
    return cliente.proposta_enviada ? (
      <button
        onClick={() => setAberto(true)}
        className="text-left text-xs rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 hover:border-amber-500/40 transition-colors"
      >
        <span className="text-amber-400 font-medium">
          Proposta {cliente.proposta_valor ? formatBRL(cliente.proposta_valor) : ""}
        </span>
        {cliente.proposta_data && (
          <span className="text-orth-muted">
            {" "}
            em {new Date(cliente.proposta_data + "T00:00:00").toLocaleDateString("pt-BR")}
          </span>
        )}
        {cliente.proposta_produtos && (
          <p className="text-orth-muted truncate max-w-[220px]">{cliente.proposta_produtos}</p>
        )}
      </button>
    ) : (
      <button
        onClick={() => setAberto(true)}
        className="text-xs rounded-lg border border-orth-line/20 px-2.5 py-1.5 text-orth-muted hover:text-white hover:border-orth-electric transition-colors"
      >
        + Registrar proposta
      </button>
    )
  }

  return (
    <form
      action={formAction}
      className="w-64 rounded-lg border border-orth-line/20 bg-orth-dark/60 p-3 space-y-2"
    >
      <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
        <input
          type="checkbox"
          name="proposta_enviada"
          defaultChecked={cliente.proposta_enviada}
          className="rounded accent-orth-electric"
        />
        Proposta enviada?
      </label>
      <input
        name="proposta_valor"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Valor da proposta (R$)"
        defaultValue={cliente.proposta_valor ?? ""}
        className={inputClass}
      />
      <input
        name="proposta_produtos"
        placeholder="Produtos/serviços propostos"
        defaultValue={cliente.proposta_produtos ?? ""}
        className={inputClass}
      />
      <input
        name="proposta_data"
        type="date"
        defaultValue={cliente.proposta_data ?? new Date().toISOString().slice(0, 10)}
        className={inputClass}
      />
      {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      {state?.success && <p className="text-emerald-400 text-xs">Proposta salva.</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="text-xs rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-3 py-1.5 disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="text-xs text-orth-muted hover:text-white"
        >
          {state?.success ? "Fechar" : "Cancelar"}
        </button>
      </div>
    </form>
  )
}
