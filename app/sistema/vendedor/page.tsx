import Link from "next/link"
import { requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { StatCard, formatBRL } from "@/components/sistema/StatCard"

export default async function VendedorDashboardPage() {
  const perfil = await requireVendedor()
  const supabase = await createClient()

  const inicioAno = `${new Date().getFullYear()}-01-01`
  const inicioMes = new Date()
  inicioMes.setDate(1)
  const inicioMesStr = inicioMes.toISOString().slice(0, 10)

  const [{ data: vendasAno }, { data: proximoAgendamento }] = await Promise.all([
    supabase
      .from("vendas")
      .select("valor_venda, comissao_valor, status_comissao, data_venda")
      .eq("vendedor_id", perfil.id)
      .gte("data_venda", inicioAno),
    supabase
      .from("agendamentos")
      .select("titulo, cliente_nome, data_hora")
      .eq("vendedor_id", perfil.id)
      .eq("status", "agendado")
      .gte("data_hora", new Date().toISOString())
      .order("data_hora", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const todas = vendasAno ?? []
  const doMes = todas.filter((v) => v.data_venda >= inicioMesStr)
  const comissaoMes = doMes.reduce((acc, v) => acc + Number(v.comissao_valor ?? 0), 0)
  const comissaoAno = todas.reduce((acc, v) => acc + Number(v.comissao_valor ?? 0), 0)
  const comissaoPendente = todas
    .filter((v) => v.status_comissao === "pendente")
    .reduce((acc, v) => acc + Number(v.comissao_valor ?? 0), 0)
  const comissaoPaga = todas
    .filter((v) => v.status_comissao === "paga")
    .reduce((acc, v) => acc + Number(v.comissao_valor ?? 0), 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-white">Olá, {perfil.nome.split(" ")[0]}</h1>
        <Link
          href="/sistema/vendedor/vendas/nova"
          className="text-sm rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-4 py-2"
        >
          + Registrar venda
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Comissão este mês" value={formatBRL(comissaoMes)} />
        <StatCard label="Comissão este ano" value={formatBRL(comissaoAno)} />
        <StatCard label="Comissão paga" value={formatBRL(comissaoPaga)} />
        <StatCard label="Comissão pendente" value={formatBRL(comissaoPendente)} />
      </div>

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5">
        <h2 className="text-orth-muted text-sm uppercase tracking-wide mb-2">
          Próximo compromisso
        </h2>
        {proximoAgendamento ? (
          <div>
            <p className="text-white text-sm font-medium">{proximoAgendamento.titulo}</p>
            {proximoAgendamento.cliente_nome && (
              <p className="text-orth-muted text-sm">{proximoAgendamento.cliente_nome}</p>
            )}
            <p className="text-orth-sky text-sm mt-1">
              {new Date(proximoAgendamento.data_hora).toLocaleString("pt-BR", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
          </div>
        ) : (
          <p className="text-orth-muted text-sm">Nenhum compromisso agendado.</p>
        )}
        <Link
          href="/sistema/vendedor/agenda"
          className="inline-block mt-3 text-orth-sky text-sm hover:text-white transition-colors"
        >
          Ver agenda completa →
        </Link>
      </div>
    </div>
  )
}
