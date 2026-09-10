import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StatCard, formatBRL } from "@/components/sistema/StatCard"
import { RankingVendas, type RankingItem } from "@/components/sistema/RankingVendas"

interface VendaComVendedor {
  vendedor_id: string
  valor_venda: number
  comissao_valor: number
  perfis: { nome: string } | null
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const [{ count: vendedoresAtivos }, { data: vendasMesData }, { data: pendentes }] =
    await Promise.all([
      supabase
        .from("vendedores")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true),
      supabase
        .from("vendas")
        .select("vendedor_id, valor_venda, comissao_valor, perfis(nome)")
        .gte("data_venda", inicioMes.toISOString().slice(0, 10)),
      supabase.from("vendas").select("comissao_valor").eq("status_comissao", "pendente"),
    ])

  const vendas = (vendasMesData ?? []) as unknown as VendaComVendedor[]
  const totalVendidoMes = vendas.reduce((acc, v) => acc + Number(v.valor_venda), 0)
  const totalComissaoMes = vendas.reduce((acc, v) => acc + Number(v.comissao_valor), 0)
  const totalPendente = (pendentes ?? []).reduce(
    (acc, v) => acc + Number(v.comissao_valor),
    0
  )

  const porVendedor = new Map<string, RankingItem>()
  for (const v of vendas) {
    const atual = porVendedor.get(v.vendedor_id) ?? {
      vendedorId: v.vendedor_id,
      nome: v.perfis?.nome ?? "—",
      totalVendido: 0,
      comissaoGerada: 0,
      qtdVendas: 0,
    }
    atual.totalVendido += Number(v.valor_venda)
    atual.comissaoGerada += Number(v.comissao_valor)
    atual.qtdVendas += 1
    porVendedor.set(v.vendedor_id, atual)
  }
  const ranking = [...porVendedor.values()].sort((a, b) => b.totalVendido - a.totalVendido)

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="font-display text-2xl text-white">Painel</h1>
        <Link
          href="/sistema/admin/vendas/nova"
          className="text-sm rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-4 py-2"
        >
          + Registrar venda
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Vendedores ativos" value={String(vendedoresAtivos ?? 0)} />
        <StatCard label="Vendido este mês" value={formatBRL(totalVendidoMes)} />
        <StatCard label="Comissão gerada este mês" value={formatBRL(totalComissaoMes)} />
        <StatCard
          label="Comissão pendente de pagamento"
          value={formatBRL(totalPendente)}
          hint="Soma de todas as vendas ainda não marcadas como pagas"
        />
      </div>

      <div className="mt-6">
        <RankingVendas ranking={ranking} />
      </div>
    </div>
  )
}
