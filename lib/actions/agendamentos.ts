"use server"

import { revalidatePath } from "next/cache"
import { requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"

export interface AgendamentoFormState {
  error?: string
  success?: boolean
}

export async function criarAgendamento(
  _prevState: AgendamentoFormState,
  formData: FormData
): Promise<AgendamentoFormState> {
  const perfil = await requireVendedor()
  const supabase = await createClient()

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

  const { error } = await supabase.from("agendamentos").insert({
    vendedor_id: perfil.id,
    titulo,
    cliente_nome,
    data_hora: data_hora.toISOString(),
    duracao_minutos: Number.isFinite(duracao_minutos) ? duracao_minutos : 60,
    notas,
  })

  if (error) return { error: error.message }

  revalidatePath("/sistema/vendedor/agenda")
  revalidatePath("/sistema/vendedor")
  return { success: true }
}

export async function removerAgendamento(id: string) {
  const perfil = await requireVendedor()
  const supabase = await createClient()
  const { error } = await supabase
    .from("agendamentos")
    .delete()
    .eq("id", id)
    .eq("vendedor_id", perfil.id)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/vendedor/agenda")
}
