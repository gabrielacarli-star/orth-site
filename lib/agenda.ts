import { createAdminClient } from "@/lib/supabase/admin"
import type { Agendamento } from "@/lib/types"

export interface CompromissoComVendedor extends Agendamento {
  vendedorNome: string
  participantesNomes: string[]
}

export async function buscarProximosCompromissos(opts: {
  vendedorId?: string
  limite?: number
}): Promise<CompromissoComVendedor[]> {
  const admin = createAdminClient()
  const agora = new Date().toISOString()

  const { data: vendedoresData } = await admin.from("vendedores").select("id, perfis(nome)")
  const nomesPorVendedor = new Map(
    (vendedoresData ?? []).map((v) => [
      v.id,
      (v.perfis as unknown as { nome: string } | null)?.nome ?? "—",
    ])
  )

  let agendamentos: Agendamento[]

  if (opts.vendedorId) {
    const { data: participacoes } = await admin
      .from("agendamento_participantes")
      .select("agendamento_id")
      .eq("vendedor_id", opts.vendedorId)
    const idsComoParticipante = (participacoes ?? []).map((p) => p.agendamento_id)

    const [{ data: proprios }, { data: comoConvidado }] = await Promise.all([
      admin
        .from("agendamentos")
        .select("*")
        .eq("vendedor_id", opts.vendedorId)
        .eq("status", "agendado")
        .gte("data_hora", agora)
        .order("data_hora", { ascending: true }),
      idsComoParticipante.length > 0
        ? admin
            .from("agendamentos")
            .select("*")
            .in("id", idsComoParticipante)
            .eq("status", "agendado")
            .gte("data_hora", agora)
            .order("data_hora", { ascending: true })
        : Promise.resolve({ data: [] as Agendamento[] }),
    ])

    const vistos = new Set<string>()
    agendamentos = [...(proprios ?? []), ...(comoConvidado ?? [])]
      .filter((a) => {
        if (vistos.has(a.id)) return false
        vistos.add(a.id)
        return true
      })
      .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
  } else {
    const { data } = await admin
      .from("agendamentos")
      .select("*")
      .eq("status", "agendado")
      .gte("data_hora", agora)
      .order("data_hora", { ascending: true })
    agendamentos = data ?? []
  }

  const limitados = agendamentos.slice(0, opts.limite ?? 5)

  const { data: participantesData } =
    limitados.length > 0
      ? await admin
          .from("agendamento_participantes")
          .select("agendamento_id, vendedor_id")
          .in(
            "agendamento_id",
            limitados.map((a) => a.id)
          )
      : { data: [] }

  const participantesPorAgendamento = new Map<string, string[]>()
  for (const p of participantesData ?? []) {
    const lista = participantesPorAgendamento.get(p.agendamento_id) ?? []
    lista.push(nomesPorVendedor.get(p.vendedor_id) ?? "—")
    participantesPorAgendamento.set(p.agendamento_id, lista)
  }

  return limitados.map((a) => ({
    ...a,
    vendedorNome: nomesPorVendedor.get(a.vendedor_id) ?? "—",
    participantesNomes: participantesPorAgendamento.get(a.id) ?? [],
  }))
}
