"use client"

import { useActionState } from "react"
import Link from "next/link"
import { login, type LoginState } from "@/lib/actions/auth"
import { Logo } from "@/components/Logo"

const initialState: LoginState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-orth-dark">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size={40} />
        </div>

        <div className="bg-orth-navy/60 border border-orth-line/10 rounded-2xl p-8">
          <h1 className="font-display text-2xl text-white mb-1 text-center">
            Sistema de Vendedores
          </h1>
          <p className="text-orth-muted text-sm text-center mb-6">
            Entre com o login e senha cadastrados
          </p>

          <form action={formAction} className="space-y-4">
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
                placeholder="voce@exemplo.com"
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
                autoComplete="current-password"
                className="w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric"
                placeholder="••••••••"
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
              {pending ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-orth-muted text-xs mt-6">
          <Link href="/" className="hover:text-white transition-colors">
            ← Voltar para o site da ORTH
          </Link>
        </p>
      </div>
    </div>
  )
}
