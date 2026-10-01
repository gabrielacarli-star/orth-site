import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StatCard, formatBRL } from "@/components/sistema/StatCard"
import { RankingVendas, type RankingItem } from "@/components/sistema/RankingVendas"
import { ProximosCompromissos } from "@/components/sistema/ProximosCompromissos"
import { buscarProximosCompromissos } from "@/lib/agenda"

interface VendaComVendedor {
  id: string
  vendedor_id: string
  cliente_nome: string
  valor_venda: number
  comissao_valor: number
  data_venda: string
  perfis: { nome: string } | null
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
  const mesAtual = hoje.slice(0, 7)

  const [{ count: vendedoresAtivos }, { data: vendasData }, { data: pendentes }, compromissos] =
    await Promise.all([
      supabase
        .from("vendedores")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true),
      supabase
        .from("vendas")
        .select("id, vendedor_id, cliente_nome, valor_venda, comissao_valor, data_venda, perfis(nome)")
        .order("data_venda", { ascending: false }),
      supabase.from("vendas").select("comissao_valor").eq("status_comissao", "pendente"),
      buscarProximosCompromissos({ limite: 8 }),
    ])

  const vendas = (vendasData ?? []) as unknown as VendaComVendedor[]
  const vendasDoMes = vendas.filter((v) => v.data_venda.startsWith(mesAtual))

  const totalVendidoMes = vendasDoMes.reduce((acc, v) => acc + Number(v.valor_venda), 0)
  const totalComissaoMes = vendasDoMes.reduce((acc, v) => acc + Number(v.comissao_valor), 0)
  const totalVendidoGeral = vendas.reduce((acc, v) => acc + Number(v.valor_venda), 0)
  const totalComissaoGeral = vendas.reduce((acc, v) => acc + Number(v.comissao_valor), 0)
  const totalPendente = (pendentes ?? []).reduce(
    (acc, v) => acc + Number(v.comissao_valor),
    0
  )

  const porVendedor = new Map<string, RankingItem>()
  for (const v of vendasDoMes) {
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

      <div>
        <h2 className="text-orth-muted text-xs uppercase tracking-wide mb-2">Este mês</h2>
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

      <div className="mt-6">
        <h2 className="text-orth-muted text-xs uppercase tracking-wide mb-2">
          Total geral (todo o período)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Vendido no total" value={formatBRL(totalVendidoGeral)} />
          <StatCard label="Comissão gerada no total" value={formatBRL(totalComissaoGeral)} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <RankingVendas ranking={ranking} />
        <ProximosCompromissos
          compromissos={compromissos}
          mostrarVendedor
          linkAgenda="/sistema/vendedor/agenda"
        />
      </div>

      <div className="mt-6 rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-display text-lg">Todas as vendas</h2>
          <Link
            href="/sistema/admin/vendas"
            className="text-orth-sky text-sm hover:text-white transition-colors"
          >
            Gerenciar vendas →
          </Link>
        </div>
        <div className="divide-y divide-orth-line/10 max-h-[480px] overflow-y-auto">
          {vendas.map((v) => (
            <div key={v.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white text-sm truncate">{v.cliente_nome}</p>
                <p className="text-orth-muted text-xs">
                  {v.perfis?.nome ?? "—"} ·{" "}
                  {new Date(v.data_venda + "T00:00:00").toLocaleDateString("pt-BR")}
                </p>
              </div>
              <p className="text-white text-sm whitespace-nowrap">
                {formatBRL(Number(v.valor_venda))}
              </p>
            </div>
          ))}
          {vendas.length === 0 && (
            <p className="py-4 text-center text-orth-muted text-sm">
              Nenhuma venda registrada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
