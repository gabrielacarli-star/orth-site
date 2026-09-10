"use client"

import { useActionState, useRef, useEffect } from "react"
import { criarVendedor, type VendedorFormState } from "@/lib/actions/vendedores"

const initialState: VendedorFormState = {}

const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function CriarVendedorForm({ comissaoPadrao }: { comissaoPadrao: number }) {
  const [state, formAction, pending] = useActionState(criarVendedor, initialState)
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
      <h2 className="sm:col-span-2 font-display text-lg text-white mb-1">
        Cadastrar novo vendedor
      </h2>

      <label className="sm:col-span-2 flex items-center gap-2 text-sm text-orth-muted cursor-pointer">
        <input type="checkbox" name="tambem_admin" className="rounded accent-orth-electric" />
        Esta pessoa também é administradora (acesso completo ao painel admin)
      </label>

      <input name="nome" placeholder="Nome completo" required className={inputClass} />
      <input
        name="email"
        type="email"
        placeholder="E-mail (login)"
        required
        className={inputClass}
      />
      <input
        name="senha"
        type="password"
        placeholder="Senha (mín. 8 caracteres)"
        required
        minLength={8}
        className={inputClass}
      />
      <input name="telefone" placeholder="Telefone" className={inputClass} />
      <input name="cpf" placeholder="CPF" className={inputClass} />
      <input name="cnpj" placeholder="CNPJ (opcional)" className={inputClass} />
      <input
        name="comissao_percentual"
        type="number"
        step="0.01"
        min="0"
        max="100"
        defaultValue={comissaoPadrao}
        placeholder="% de comissão"
        required
        className={inputClass}
      />

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="sm:col-span-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          Vendedor cadastrado com sucesso.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Cadastrando..." : "Cadastrar vendedor"}
      </button>
    </form>
  )
}
