import { startOfMonth, endOfMonth, parse, isValid } from "date-fns"
import { requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { MonthCalendar } from "@/components/sistema/MonthCalendar"
import { NovoAgendamentoForm } from "./NovoAgendamentoForm"
import { AgendamentoItem } from "./AgendamentoItem"
import type { Agendamento } from "@/lib/types"

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>
}) {
  const perfil = await requireVendedor()
  const { mes: mesParam } = await searchParams

  const mesParseado = mesParam ? parse(mesParam, "yyyy-MM", new Date()) : new Date()
  const mes = isValid(mesParseado) ? mesParseado : new Date()

  const inicio = startOfMonth(mes)
  const fim = endOfMonth(mes)

  const supabase = await createClient()
  const { data } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("vendedor_id", perfil.id)
    .gte("data_hora", inicio.toISOString())
    .lte("data_hora", fim.toISOString())
    .order("data_hora", { ascending: true })

  const agendamentos = (data ?? []) as Agendamento[]

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Agenda</h1>

      <MonthCalendar mes={mes} agendamentos={agendamentos} />

      <NovoAgendamentoForm />

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
        <h3 className="text-orth-muted text-sm uppercase tracking-wide pb-2">
          Compromissos do mês
        </h3>
        {agendamentos.map((a) => (
          <AgendamentoItem key={a.id} agendamento={a} />
        ))}
        {agendamentos.length === 0 && (
          <p className="py-4 text-center text-orth-muted text-sm">
            Nenhum compromisso neste mês.
          </p>
        )}
      </div>
    </div>
  )
}
