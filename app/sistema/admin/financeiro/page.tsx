import { requireAdmin } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"
import { StatCard, formatBRL } from "@/components/sistema/StatCard"
import { NovoLancamentoForm } from "./NovoLancamentoForm"
import { LancamentoItem } from "./LancamentoItem"
import type { FinanceiroLancamento } from "@/lib/types"

export default async function FinanceiroPage() {
  await requireAdmin()

  const admin = createAdminClient()
  const { data } = await admin
    .from("financeiro_lancamentos")
    .select("*")
    .order("data_prevista", { ascending: false })

  const lancamentos = (data ?? []).map((l) => ({ ...l, valor: Number(l.valor) })) as FinanceiroLancamento[]

  const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
  const mesAtual = hoje.slice(0, 7)

  const aReceber = lancamentos
    .filter((l) => l.tipo === "receita" && l.status === "pendente")
    .reduce((s, l) => s + l.valor, 0)
  const aPagar = lancamentos
    .filter((l) => l.tipo === "despesa" && l.status === "pendente")
    .reduce((s, l) => s + l.valor, 0)
  const recebidoNoMes = lancamentos
    .filter((l) => l.tipo === "receita" && l.status === "pago" && l.data_pago?.startsWith(mesAtual))
    .reduce((s, l) => s + l.valor, 0)
  const pagoNoMes = lancamentos
    .filter((l) => l.tipo === "despesa" && l.status === "pago" && l.data_pago?.startsWith(mesAtual))
    .reduce((s, l) => s + l.valor, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white">Financeiro</h1>
        <p className="text-orth-muted text-sm mt-1">
          Controle de recebíveis e saídas da ORTH. Visível só pra administração.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="A receber" value={formatBRL(aReceber)} hint="Pendente" />
        <StatCard label="A pagar" value={formatBRL(aPagar)} hint="Pendente" />
        <StatCard label="Recebido no mês" value={formatBRL(recebidoNoMes)} />
        <StatCard label="Pago no mês" value={formatBRL(pagoNoMes)} />
      </div>

      <NovoLancamentoForm />

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
        {lancamentos.map((l) => (
          <LancamentoItem key={l.id} lancamento={l} />
        ))}
        {lancamentos.length === 0 && (
          <p className="py-4 text-center text-orth-muted text-sm">Nenhum lançamento cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
