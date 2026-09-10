import Link from "next/link"
import { requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { formatBRL } from "@/components/sistema/StatCard"
import { VendaFileLink } from "@/components/sistema/VendaFileLink"
import type { Venda } from "@/lib/types"

export default async function MinhasVendasPage() {
  const perfil = await requireVendedor()
  const supabase = await createClient()

  const { data } = await supabase
    .from("vendas")
    .select("*")
    .eq("vendedor_id", perfil.id)
    .order("data_venda", { ascending: false })

  const vendas = (data ?? []) as Venda[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-white">Minhas Vendas</h1>
        <div className="flex gap-2">
          <Link
            href="/sistema/vendedor/vendas/nova"
            className="text-sm rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-4 py-2"
          >
            + Registrar venda
          </Link>
          <a
            href="/api/sistema/relatorio"
            className="text-sm rounded-lg border border-orth-line/20 hover:border-orth-electric transition-colors text-white font-medium px-4 py-2"
          >
            Exportar Excel
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="text-left text-orth-muted text-xs uppercase tracking-wide">
              <th className="pb-3 font-medium">Data</th>
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Serviço</th>
              <th className="pb-3 font-medium">Valor</th>
              <th className="pb-3 font-medium">Comissão</th>
              <th className="pb-3 font-medium">Arquivos</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((v) => (
              <tr key={v.id} className="border-t border-orth-line/10 align-top">
                <td className="py-3 pr-4 text-orth-muted text-sm whitespace-nowrap">
                  {new Date(v.data_venda + "T00:00:00").toLocaleDateString("pt-BR")}
                </td>
                <td className="py-3 pr-4 text-white text-sm">{v.cliente_nome}</td>
                <td className="py-3 pr-4 text-orth-muted text-sm">{v.servico}</td>
                <td className="py-3 pr-4 text-white text-sm whitespace-nowrap">
                  {formatBRL(Number(v.valor_venda))}
                </td>
                <td className="py-3 pr-4 text-white text-sm whitespace-nowrap">
                  {formatBRL(Number(v.comissao_valor))}
                  <span className="text-orth-muted"> ({v.comissao_percentual}%)</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-col gap-1">
                    <VendaFileLink bucket="comprovantes" path={v.comprovante_path} label="Comprovante" />
                    <VendaFileLink bucket="contratos" path={v.contrato_path} label="Contrato" />
                  </div>
                </td>
                <td className="py-3">
                  {v.status_comissao === "paga" ? (
                    <span className="text-xs rounded-full px-2.5 py-1 bg-emerald-500/15 text-emerald-400">
                      Paga
                    </span>
                  ) : (
                    <span className="text-xs rounded-full px-2.5 py-1 bg-white/10 text-orth-muted">
                      Pendente
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {vendas.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-orth-muted text-sm">
                  Você ainda não registrou nenhuma venda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
