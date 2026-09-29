"use client"

import { useActionState, useState, useTransition } from "react"
import {
  atualizarSenha,
  removerSenha,
  revelarSenha,
  type SenhaFormState,
} from "@/lib/actions/senhas"
import type { SenhaAcesso } from "@/lib/types"

const initialState: SenhaFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3 py-1.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function SenhaItem({ senha }: { senha: SenhaAcesso }) {
  const [editando, setEditando] = useState(false)
  const [revelando, startRevelar] = useTransition()
  const [removendo, startRemover] = useTransition()
  const [senhaRevelada, setSenhaRevelada] = useState<string | null>(null)
  const [erroRevelar, setErroRevelar] = useState<string | null>(null)

  const acaoComId = atualizarSenha.bind(null, senha.id)
  const [state, formAction, pending] = useActionState(acaoComId, initialState)

  function mostrarOuEsconder() {
    if (senhaRevelada !== null) {
      setSenhaRevelada(null)
      return
    }
    setErroRevelar(null)
    startRevelar(async () => {
      try {
        setSenhaRevelada(await revelarSenha(senha.id))
      } catch (err) {
        setErroRevelar(err instanceof Error ? err.message : "Erro ao revelar senha.")
      }
    })
  }

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      // clipboard indisponível, ignora
    }
  }

  if (editando) {
    return (
      <form
        action={formAction}
        className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-orth-line/10 last:border-b-0"
      >
        <input name="titulo" defaultValue={senha.titulo} placeholder="Título" required className={inputClass} />
        <input name="usuario" defaultValue={senha.usuario ?? ""} placeholder="Usuário/e-mail" className={inputClass} />
        <input name="senha" type="password" placeholder="Nova senha (deixe em branco pra manter)" className={inputClass} />
        <input name="url" defaultValue={senha.url ?? ""} placeholder="Link de acesso" className={inputClass} />
        <input
          name="notas"
          defaultValue={senha.notas ?? ""}
          placeholder="Notas"
          className={`sm:col-span-2 ${inputClass}`}
        />

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
        <p className="text-white text-sm font-medium">{senha.titulo}</p>
        {senha.usuario && <p className="text-orth-muted text-xs">{senha.usuario}</p>}
        {senha.url && (
          <a
            href={senha.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orth-sky text-xs hover:underline"
          >
            {senha.url}
          </a>
        )}
        {senha.notas && <p className="text-orth-muted text-xs mt-0.5">{senha.notas}</p>}
        {senhaRevelada !== null && (
          <div className="mt-1.5 flex items-center gap-2">
            <code className="text-emerald-400 text-xs bg-orth-dark rounded px-2 py-1">{senhaRevelada}</code>
            <button onClick={() => copiar(senhaRevelada)} className="text-xs text-orth-muted hover:text-white">
              copiar
            </button>
          </div>
        )}
        {erroRevelar && <p className="text-red-400 text-xs mt-1">{erroRevelar}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button onClick={mostrarOuEsconder} disabled={revelando} className="text-xs text-orth-muted hover:text-white transition-colors">
          {revelando ? "..." : senhaRevelada !== null ? "ocultar" : "mostrar"}
        </button>
        <button onClick={() => setEditando(true)} className="text-xs text-orth-muted hover:text-white transition-colors">
          editar
        </button>
        <button
          onClick={() => {
            if (confirm(`Remover a senha "${senha.titulo}"?`)) {
              startRemover(() => removerSenha(senha.id))
            }
          }}
          disabled={removendo}
          className="text-xs text-orth-muted hover:text-red-400 transition-colors"
        >
          remover
        </button>
      </div>
    </div>
  )
}
