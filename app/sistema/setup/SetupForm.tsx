"use client"

import { useActionState } from "react"
import { criarPrimeiroAdmin, type SetupState } from "@/lib/actions/setup"

const initialState: SetupState = {}

export function SetupForm() {
  const [state, formAction, pending] = useActionState(criarPrimeiroAdmin, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm text-orth-muted mb-1.5">
          Seu nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          className="w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric"
          placeholder="Cláudia"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-orth-muted mb-1.5">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric"
          placeholder="orthdigital@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="senha" className="block text-sm text-orth-muted mb-1.5">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric"
          placeholder="mínimo 8 caracteres"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium py-2.5 disabled:opacity-60"
      >
        {pending ? "Criando..." : "Criar conta de administrador(a)"}
      </button>
    </form>
  )
}
