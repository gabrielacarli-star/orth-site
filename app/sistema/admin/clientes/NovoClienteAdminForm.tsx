"use client"

import { useActionState, useRef, useEffect } from "react"
import { criarClienteAdmin, type ClienteFormState } from "@/lib/actions/clientes"

const initialState: ClienteFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function NovoClienteAdminForm({
  vendedores,
}: {
  vendedores: { id: string; nome: string }[]
}) {
  const [state, formAction, pending] = useActionState(criarClienteAdmin, initialState)
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
      <h3 className="sm:col-span-2 text-white text-sm font-medium">Novo cliente (lead)</h3>

      <select name="vendedor_id" required defaultValue="" className={`sm:col-span-2 ${inputClass}`}>
        <option value="" disabled>
          Vendedor(a) responsável...
        </option>
        {vendedores.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nome}
          </option>
        ))}
      </select>

      <input name="nome" placeholder="Nome do cliente" required className={inputClass} />
      <input name="empresa" placeholder="Empresa (opcional)" className={inputClass} />
      <input name="telefone" placeholder="Telefone / WhatsApp" className={inputClass} />
      <input name="email" type="email" placeholder="E-mail" className={inputClass} />
      <input name="origem" placeholder="Como chegou até vocês (opcional)" className={inputClass} />
      <input name="notas" placeholder="Notas (opcional)" className={inputClass} />

      <div className="sm:col-span-2 border-t border-orth-line/10 pt-3 space-y-2">
        <label className="flex items-center gap-2 text-sm text-orth-muted cursor-pointer">
          <input type="checkbox" name="proposta_enviada" className="rounded accent-orth-electric" />
          Já foi enviada uma proposta pra esse cliente?
        </label>
        <p className="text-orth-muted text-xs">
          Se marcar, preencha os campos abaixo (ignorados se não marcar):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="proposta_valor"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Valor da proposta (R$)"
            className={inputClass}
          />
          <input
            name="proposta_data"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
          <input
            name="proposta_produtos"
            placeholder="Produtos/serviços propostos (ex: site + Google Ads)"
            className={`sm:col-span-2 ${inputClass}`}
          />
        </div>
      </div>

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || vendedores.length === 0}
        className="sm:col-span-2 rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Adicionar cliente"}
      </button>
    </form>
  )
}
