"use client"

import { useState, useTransition } from "react"
import { atualizarVendedor } from "@/lib/actions/vendedores"
import type { VendedorComPerfil } from "@/lib/types"

export function VendedorRow({ vendedor }: { vendedor: VendedorComPerfil }) {
  const [comissao, setComissao] = useState(String(vendedor.comissao_percentual))
  const [pending, startTransition] = useTransition()

  function salvarComissao() {
    const valor = Number(comissao.replace(",", "."))
    if (!Number.isFinite(valor) || valor < 0 || valor > 100) return
    startTransition(() => atualizarVendedor(vendedor.id, { comissao_percentual: valor }))
  }

  function alternarAtivo() {
    startTransition(() => atualizarVendedor(vendedor.id, { ativo: !vendedor.ativo }))
  }

  return (
    <tr className="border-t border-orth-line/10">
      <td className="py-3 pr-4">
        <p className="text-white text-sm font-medium flex items-center gap-1.5">
          {vendedor.perfis?.nome}
          {vendedor.perfis?.role === "admin" && (
            <span className="text-[10px] rounded-full px-1.5 py-0.5 bg-orth-electric/20 text-orth-sky">
              admin
            </span>
          )}
        </p>
        {vendedor.email && <p className="text-orth-muted text-xs">{vendedor.email}</p>}
      </td>
      <td className="py-3 pr-4 text-orth-muted text-sm">{vendedor.telefone || "—"}</td>
      <td className="py-3 pr-4 text-orth-muted text-sm">{vendedor.cpf || vendedor.cnpj || "—"}</td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={comissao}
            onChange={(e) => setComissao(e.target.value)}
            onBlur={salvarComissao}
            disabled={pending}
            className="w-16 rounded-md bg-orth-dark border border-orth-line/20 px-2 py-1 text-white text-sm"
          />
          <span className="text-orth-muted text-sm">%</span>
        </div>
      </td>
      <td className="py-3">
        <button
          onClick={alternarAtivo}
          disabled={pending}
          className={
            vendedor.ativo
              ? "text-xs rounded-full px-2.5 py-1 bg-emerald-500/15 text-emerald-400"
              : "text-xs rounded-full px-2.5 py-1 bg-white/10 text-orth-muted"
          }
        >
          {vendedor.ativo ? "Ativo" : "Inativo"}
        </button>
      </td>
    </tr>
  )
}
