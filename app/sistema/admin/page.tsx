import { createClient } from "@/lib/supabase/server"
import { StatCard, formatBRL } from "@/components/sistema/StatCard"
import type { Venda } from "@/lib/types"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const [{ count: vendedoresAtivos }, { data: vendasMes }, { data: pendentes }] =
    await Promise.all([
      supabase
        .from("vendedores")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true),
      supabase
        .from("vendas")
        .select("valor_venda, comissao_valor")
        .gte("data_venda", inicioMes.toISOString().slice(0, 10)),
      supabase.from("vendas").select("comissao_valor").eq("status_comissao", "pendente"),
    ])

  const vendas = (vendasMes ?? []) as Pick<Venda, "valor_venda" | "comissao_valor">[]
  const totalVendidoMes = vendas.reduce((acc, v) => acc + Number(v.valor_venda), 0)
  const totalComissaoMes = vendas.reduce((acc, v) => acc + Number(v.comissao_valor), 0)
  const totalPendente = (pendentes ?? []).reduce(
    (acc, v) => acc + Number(v.comissao_valor),
    0
  )

  return (
    <div>
      <h1 className="font-display text-2xl text-white mb-6">Painel</h1>

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
    </div>
  )
}
