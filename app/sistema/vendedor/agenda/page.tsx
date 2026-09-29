import { startOfMonth, endOfMonth, parse, isValid } from "date-fns"
import Link from "next/link"
import { requireVendedor } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"
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

  const admin = createAdminClient()

  const { data: vendedoresData } = await admin
    .from("vendedores")
    .select("id, perfis(nome)")
    .eq("ativo", true)
    .order("created_at", { ascending: true })

  const todosVendedores = (vendedoresData ?? []).map((v) => ({
    id: v.id,
    nome: (v.perfis as unknown as { nome: string } | null)?.nome ?? "—",
  }))

  let vendedorAlvo = perfil.id
  if (isAdmin && vendedorParam && todosVendedores.some((v) => v.id === vendedorParam)) {
    vendedorAlvo = vendedorParam
  }

  const { data: participacoes } = await admin
    .from("agendamento_participantes")
    .select("agendamento_id")
    .eq("vendedor_id", vendedorAlvo)
  const idsComoParticipante = (participacoes ?? []).map((p) => p.agendamento_id)

  const [{ data: proprios }, { data: comoConvidado }] = await Promise.all([
    admin
      .from("agendamentos")
      .select("*")
      .eq("vendedor_id", vendedorAlvo)
      .gte("data_hora", inicio.toISOString())
      .lte("data_hora", fim.toISOString()),
    idsComoParticipante.length > 0
      ? admin
          .from("agendamentos")
          .select("*")
          .in("id", idsComoParticipante)
          .gte("data_hora", inicio.toISOString())
          .lte("data_hora", fim.toISOString())
      : Promise.resolve({ data: [] as Agendamento[] }),
  ])

  const agendamentos = [...(proprios ?? []), ...(comoConvidado ?? [])].sort(
    (a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
  ) as Agendamento[]

  const { data: todosParticipantes } =
    agendamentos.length > 0
      ? await admin
          .from("agendamento_participantes")
          .select("agendamento_id, vendedor_id")
          .in(
            "agendamento_id",
            agendamentos.map((a) => a.id)
          )
      : { data: [] }

  const participantesPorAgendamento = new Map<string, string[]>()
  for (const p of todosParticipantes ?? []) {
    const lista = participantesPorAgendamento.get(p.agendamento_id) ?? []
    lista.push(p.vendedor_id)
    participantesPorAgendamento.set(p.agendamento_id, lista)
  }

  const vendedorQuery = isAdmin ? `&vendedor=${vendedorAlvo}` : ""

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Agenda</h1>

      {isAdmin && (
        <div className="flex flex-wrap gap-2">
          {todosVendedores.map((v) => (
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

      <NovoAgendamentoForm
        todosVendedores={todosVendedores}
        vendedores={isAdmin ? todosVendedores : undefined}
        vendedorSelecionado={vendedorAlvo}
        meuId={perfil.id}
      />

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
        <h3 className="text-orth-muted text-sm uppercase tracking-wide pb-2">
          Compromissos do mês
        </h3>
        {agendamentos.map((a) => (
          <AgendamentoItem
            key={a.id}
            agendamento={a}
            todosVendedores={todosVendedores}
            participantes={participantesPorAgendamento.get(a.id) ?? []}
            souDono={a.vendedor_id === perfil.id || isAdmin}
          />
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
