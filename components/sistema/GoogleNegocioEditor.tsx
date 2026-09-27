"use client"

import { useActionState, useState, useTransition } from "react"
import {
  atualizarConfigGoogleNegocio,
  desconectarGoogleNegocio,
  type GoogleNegocioFormState,
} from "@/lib/actions/googleNegocio"
import type { GoogleNegocioConexao } from "@/lib/types"

const initialState: GoogleNegocioFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3 py-1.5 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"

export function GoogleNegocioEditor({
  clienteId,
  conexao,
}: {
  clienteId: string
  conexao: GoogleNegocioConexao | null
}) {
  const [aberto, setAberto] = useState(false)
  const acaoComId = atualizarConfigGoogleNegocio.bind(null, conexao?.id ?? "")
  const [state, formAction, pending] = useActionState(acaoComId, initialState)
  const [desconectando, startDesconectar] = useTransition()

  if (!conexao) {
    return (
      <a
        href={`/api/google-negocio/conectar?clienteId=${clienteId}`}
        className="text-xs rounded-lg border border-orth-line/20 px-2.5 py-1.5 text-orth-muted hover:text-white hover:border-orth-electric transition-colors"
      >
        Conectar Google Meu Negócio
      </a>
    )
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className={`text-left text-xs rounded-lg px-2.5 py-1.5 border transition-colors ${
          conexao.ativo
            ? "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40"
            : "bg-orth-dark/60 border-orth-line/20 hover:border-orth-electric"
        }`}
      >
        <span className={conexao.ativo ? "text-emerald-400 font-medium" : "text-orth-muted"}>
          {conexao.ativo ? "Google Meu Negócio ativo" : "Google Meu Negócio pausado"}
        </span>
        {conexao.location_display_name && (
          <p className="text-orth-muted truncate max-w-[220px]">{conexao.location_display_name}</p>
        )}
        <p className="text-orth-muted">
          {conexao.ultimo_post_em
            ? `Último post: ${new Date(conexao.ultimo_post_em).toLocaleDateString("pt-BR")}`
            : "Nenhum post publicado ainda"}
        </p>
        {conexao.ultimo_erro && <p className="text-red-400 truncate max-w-[220px]">{conexao.ultimo_erro}</p>}
      </button>
    )
  }

  return (
    <form action={formAction} className="w-64 rounded-lg border border-orth-line/20 bg-orth-dark/60 p-3 space-y-2">
      <p className="text-xs text-orth-muted">
        {conexao.location_display_name} {conexao.google_email && `· ${conexao.google_email}`}
      </p>
      <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={conexao.ativo}
          className="rounded accent-orth-electric"
        />
        Publicar posts diários automaticamente
      </label>
      <textarea
        name="descricao_negocio"
        placeholder="Descrição curta do negócio do cliente (ramo, diferencial)"
        defaultValue={conexao.descricao_negocio ?? ""}
        rows={2}
        className={inputClass}
      />
      <input
        name="palavras_chave"
        placeholder="Palavras-chave, separadas por vírgula"
        defaultValue={conexao.palavras_chave ?? ""}
        className={inputClass}
      />
      {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      {state?.success && <p className="text-emerald-400 text-xs">Salvo.</p>}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="submit"
          disabled={pending}
          className="text-xs rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-3 py-1.5 disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={() => setAberto(false)} className="text-xs text-orth-muted hover:text-white">
          Fechar
        </button>
        <button
          type="button"
          disabled={desconectando}
          onClick={() => {
            if (confirm("Desconectar o Google Meu Negócio desse cliente?")) {
              startDesconectar(() => desconectarGoogleNegocio(conexao.id))
            }
          }}
          className="text-xs text-red-400 hover:text-red-300 ml-auto"
        >
          Desconectar
        </button>
      </div>
    </form>
  )
}
