import { startOfMonth, endOfMonth, parse, isValid } from "date-fns"
import Link from "next/link"
import { requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { MonthCalendar } from "@/components/sistema/MonthCalendar"
import { NovoAgendamentoForm } from "./NovoAgendamentoForm"
import { AgendamentoItem } from "./AgendamentoItem"
import type { Agendamento } from "@/lib/types"

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; vendedor?: string }>
}) {
  const perfil = await requireVendedor()
  const { mes: mesParam, vendedor: vendedorParam } = await searchParams
  const isAdmin = perfil.role === "admin"

  const mesParseado = mesParam ? parse(mesParam, "yyyy-MM", new Date()) : new Date()
  const mes = isValid(mesParseado) ? mesParseado : new Date()

  const inicio = startOfMonth(mes)
  const fim = endOfMonth(mes)

  const supabase = await createClient()

  let vendedores: { id: string; nome: string }[] | undefined
  let vendedorAlvo = perfil.id

  if (isAdmin) {
    const { data: vendedoresData } = await supabase
      .from("vendedores")
      .select("id, perfis(nome)")
      .eq("ativo", true)
      .order("created_at", { ascending: true })

    vendedores = (vendedoresData ?? []).map((v) => ({
      id: v.id,
      nome: (v.perfis as unknown as { nome: string } | null)?.nome ?? "—",
    }))

    if (vendedorParam && vendedores.some((v) => v.id === vendedorParam)) {
      vendedorAlvo = vendedorParam
    }
  }

  const { data } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("vendedor_id", vendedorAlvo)
    .gte("data_hora", inicio.toISOString())
    .lte("data_hora", fim.toISOString())
    .order("data_hora", { ascending: true })

  const agendamentos = (data ?? []) as Agendamento[]
  const vendedorQuery = isAdmin ? `&vendedor=${vendedorAlvo}` : ""

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Agenda</h1>

      {isAdmin && vendedores && (
        <div className="flex flex-wrap gap-2">
          {vendedores.map((v) => (
            <Link
              key={v.id}
              href={`?mes=${mesParam ?? ""}&vendedor=${v.id}`}
              className={
                v.id === vendedorAlvo
                  ? "text-xs rounded-full px-3 py-1.5 bg-orth-electric text-white"
                  : "text-xs rounded-full px-3 py-1.5 bg-white/5 text-orth-muted hover:text-white"
              }
            >
              {v.id === perfil.id ? `${v.nome} (você)` : v.nome}
            </Link>
          ))}
        </div>
      )}

      <MonthCalendar mes={mes} agendamentos={agendamentos} vendedorQuery={vendedorQuery} />

      <NovoAgendamentoForm vendedores={vendedores} vendedorSelecionado={vendedorAlvo} />

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
