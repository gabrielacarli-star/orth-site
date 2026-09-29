"use server"

import { revalidatePath } from "next/cache"
import { requireVendedor } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export interface AgendamentoFormState {
  error?: string
  success?: boolean
}

function lerParticipantes(formData: FormData, excluir: string) {
  return [...new Set(formData.getAll("participantes").map(String))].filter((id) => id && id !== excluir)
}

async function salvarParticipantes(agendamentoId: string, vendedorIds: string[]) {
  const admin = createAdminClient()
  await admin.from("agendamento_participantes").delete().eq("agendamento_id", agendamentoId)
  if (vendedorIds.length > 0) {
    await admin.from("agendamento_participantes").insert(
      vendedorIds.map((vendedor_id) => ({ agendamento_id: agendamentoId, vendedor_id }))
    )
  }
}

export async function criarAgendamento(
  _prevState: AgendamentoFormState,
  formData: FormData
): Promise<AgendamentoFormState> {
  const perfil = await requireVendedor()
  const admin = createAdminClient()

  const titulo = String(formData.get("titulo") || "").trim()
  const cliente_nome = String(formData.get("cliente_nome") || "").trim() || null
  const data = String(formData.get("data") || "")
  const hora = String(formData.get("hora") || "")
  const duracao_minutos = Number(formData.get("duracao_minutos") || 60)
  const notas = String(formData.get("notas") || "").trim() || null
  const vendedorIdForm = String(formData.get("vendedor_id") || "").trim()
  const vendedor_id = perfil.role === "admin" && vendedorIdForm ? vendedorIdForm : perfil.id

  if (!titulo || !data || !hora) {
    return { error: "Preencha o título, a data e o horário." }
  }

  const data_hora = new Date(`${data}T${hora}:00`)
  if (Number.isNaN(data_hora.getTime())) {
    return { error: "Data ou horário inválido." }
  }

  const { data: criado, error } = await admin
    .from("agendamentos")
    .insert({
      vendedor_id,
      titulo,
      cliente_nome,
      data_hora: data_hora.toISOString(),
      duracao_minutos: Number.isFinite(duracao_minutos) ? duracao_minutos : 60,
      notas,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  const participantes = lerParticipantes(formData, vendedor_id)
  if (participantes.length > 0) await salvarParticipantes(criado.id, participantes)

  revalidatePath("/sistema/vendedor/agenda")
  revalidatePath("/sistema/vendedor")
  return { success: true }
}

export async function atualizarAgendamento(
  id: string,
  _prevState: AgendamentoFormState,
  formData: FormData
): Promise<AgendamentoFormState> {
  const perfil = await requireVendedor()
  const admin = createAdminClient()

  const { data: existente } = await admin
    .from("agendamentos")
    .select("id, vendedor_id")
    .eq("id", id)
    .maybeSingle()
  if (!existente) return { error: "Compromisso não encontrado." }
  if (perfil.role !== "admin" && existente.vendedor_id !== perfil.id) {
    return { error: "Você não tem acesso a esse compromisso." }
  }

  const titulo = String(formData.get("titulo") || "").trim()
  const cliente_nome = String(formData.get("cliente_nome") || "").trim() || null
  const data = String(formData.get("data") || "")
  const hora = String(formData.get("hora") || "")
  const duracao_minutos = Number(formData.get("duracao_minutos") || 60)
  const notas = String(formData.get("notas") || "").trim() || null

  if (!titulo || !data || !hora) {
    return { error: "Preencha o título, a data e o horário." }
  }

  const data_hora = new Date(`${data}T${hora}:00`)
  if (Number.isNaN(data_hora.getTime())) {
    return { error: "Data ou horário inválido." }
  }

  const { error } = await admin
    .from("agendamentos")
    .update({
      titulo,
      cliente_nome,
      data_hora: data_hora.toISOString(),
      duracao_minutos: Number.isFinite(duracao_minutos) ? duracao_minutos : 60,
      notas,
    })
    .eq("id", id)

  if (error) return { error: error.message }

  await salvarParticipantes(id, lerParticipantes(formData, existente.vendedor_id))

  revalidatePath("/sistema/vendedor/agenda")
  revalidatePath("/sistema/vendedor")
  return { success: true }
}

export async function removerAgendamento(id: string) {
  const perfil = await requireVendedor()
  const supabase = await createClient()
  const query = supabase.from("agendamentos").delete().eq("id", id)
  const { error } =
    perfil.role === "admin" ? await query : await query.eq("vendedor_id", perfil.id)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/vendedor/agenda")
}
