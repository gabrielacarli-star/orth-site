"use client"

import { useActionState, useRef, useEffect } from "react"
import { criarCliente, type ClienteFormState } from "@/lib/actions/clientes"

const initialState: ClienteFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function NovoClienteForm() {
  const [state, formAction, pending] = useActionState(criarCliente, initialState)
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

      <input name="nome" placeholder="Nome do cliente" required className={inputClass} />
      <input name="empresa" placeholder="Empresa (opcional)" className={inputClass} />
      <input name="telefone" placeholder="Telefone / WhatsApp" className={inputClass} />
      <input name="email" type="email" placeholder="E-mail" className={inputClass} />
      <input name="origem" placeholder="Como chegou até você (opcional)" className={inputClass} />
      <input name="notas" placeholder="Notas (opcional)" className={inputClass} />

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
        {pending ? "Salvando..." : "Adicionar cliente"}
      </button>
    </form>
  )
}
