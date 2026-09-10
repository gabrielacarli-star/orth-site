import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatBRL } from "@/components/sistema/StatCard"
import { VendaFileLink } from "@/components/sistema/VendaFileLink"
import { MarcarPagaButton } from "@/components/sistema/MarcarPagaButton"

interface VendaComVendedor {
  id: string
  cliente_nome: string
  servico: string
  valor_venda: number
  comissao_percentual: number
  comissao_valor: number
  comprovante_path: string | null
  contrato_path: string | null
  status_comissao: "pendente" | "paga"
  data_venda: string
  perfis: { nome: string } | null
}

export default async function AdminVendasPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("vendas")
    .select(
      "id, cliente_nome, servico, valor_venda, comissao_percentual, comissao_valor, comprovante_path, contrato_path, status_comissao, data_venda, perfis(nome)"
    )
    .order("data_venda", { ascending: false })

  const vendas = (data ?? []) as unknown as VendaComVendedor[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-white">Vendas & Comissões</h1>
        <div className="flex gap-2">
          <Link
            href="/sistema/admin/vendas/nova"
            className="text-sm rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-4 py-2"
          >
            + Registrar venda
          </Link>
          <a
            href="/api/sistema/relatorio"
            className="text-sm rounded-lg border border-orth-line/20 hover:border-orth-electric transition-colors text-white font-medium px-4 py-2"
          >
            Exportar tudo (Excel)
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <thead>
            <tr className="text-left text-orth-muted text-xs uppercase tracking-wide">
              <th className="pb-3 font-medium">Data</th>
              <th className="pb-3 font-medium">Vendedor</th>
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
                <td className="py-3 pr-4 text-white text-sm">{v.perfis?.nome ?? "—"}</td>
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
                    <MarcarPagaButton vendaId={v.id} />
                  )}
                </td>
              </tr>
            ))}
            {vendas.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-orth-muted text-sm">
                  Nenhuma venda registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
