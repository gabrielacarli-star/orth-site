"use client"

import { useActionState, useRef, useEffect } from "react"
import { criarSenha, type SenhaFormState } from "@/lib/actions/senhas"

const initialState: SenhaFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function NovaSenhaForm() {
  const [state, formAction, pending] = useActionState(criarSenha, initialState)
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
      <h3 className="sm:col-span-2 text-white text-sm font-medium">Nova senha</h3>
      <input name="titulo" placeholder="Título (ex: Instagram ORTH)" required className={inputClass} />
      <input name="usuario" placeholder="Usuário/e-mail de login" className={inputClass} />
      <input name="senha" type="password" placeholder="Senha" required className={inputClass} />
      <input name="url" placeholder="Link de acesso (opcional)" className={inputClass} />
      <input
        name="notas"
        placeholder="Notas (opcional)"
        className={`sm:col-span-2 ${inputClass}`}
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
        {pending ? "Salvando..." : "Salvar senha"}
      </button>
    </form>
  )
}
