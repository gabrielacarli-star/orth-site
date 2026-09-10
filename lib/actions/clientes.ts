"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin, requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { StatusCliente } from "@/lib/types"

export interface ClienteFormState {
  error?: string
  success?: boolean
}

function lerCampos(formData: FormData) {
  const propostaEnviada = formData.get("proposta_enviada") === "on"
  const valorRaw = String(formData.get("proposta_valor") || "").replace(",", ".")
  const valor = Number(valorRaw)

  return {
    nome: String(formData.get("nome") || "").trim(),
    telefone: String(formData.get("telefone") || "").trim() || null,
    email: String(formData.get("email") || "").trim() || null,
    empresa: String(formData.get("empresa") || "").trim() || null,
    origem: String(formData.get("origem") || "").trim() || null,
    notas: String(formData.get("notas") || "").trim() || null,
    proposta_enviada: propostaEnviada,
    proposta_valor: propostaEnviada && Number.isFinite(valor) && valor > 0 ? valor : null,
    proposta_produtos:
      (propostaEnviada && String(formData.get("proposta_produtos") || "").trim()) || null,
    proposta_data: propostaEnviada
      ? String(formData.get("proposta_data") || "") || new Date().toISOString().slice(0, 10)
      : null,
    status: propostaEnviada ? ("proposta_enviada" as const) : undefined,
  }
}

export async function criarCliente(
  _prevState: ClienteFormState,
  formData: FormData
): Promise<ClienteFormState> {
  const perfil = await requireVendedor()
  const supabase = await createClient()
  const campos = lerCampos(formData)

  if (!campos.nome) return { error: "Informe o nome do cliente." }

  const { error } = await supabase.from("clientes").insert({
    vendedor_id: perfil.id,
    ...campos,
  })

  if (error) return { error: error.message }

  revalidatePath("/sistema/vendedor/clientes")
  revalidatePath("/sistema/admin/clientes")
  return { success: true }
}

export async function criarClienteAdmin(
  _prevState: ClienteFormState,
  formData: FormData
): Promise<ClienteFormState> {
  await requireAdmin()
  const admin = createAdminClient()
  const campos = lerCampos(formData)
  const vendedor_id = String(formData.get("vendedor_id") || "").trim()

  if (!vendedor_id) return { error: "Selecione o vendedor responsável." }
  if (!campos.nome) return { error: "Informe o nome do cliente." }

  const { error } = await admin.from("clientes").insert({
    vendedor_id,
    ...campos,
  })

  if (error) return { error: error.message }

  revalidatePath("/sistema/admin/clientes")
  revalidatePath("/sistema/vendedor/clientes")
  return { success: true }
}

export interface PropostaFormState {
  error?: string
  success?: boolean
}

export async function atualizarProposta(
  clienteId: string,
  _prevState: PropostaFormState,
  formData: FormData
): Promise<PropostaFormState> {
  const perfil = await requireVendedor()
  const supabase = await createClient()

  const propostaEnviada = formData.get("proposta_enviada") === "on"
  const valorRaw = String(formData.get("proposta_valor") || "").replace(",", ".")
  const valor = Number(valorRaw)

  if (propostaEnviada && (!Number.isFinite(valor) || valor <= 0)) {
    return { error: "Informe o valor da proposta." }
  }

  const dados = {
    proposta_enviada: propostaEnviada,
    proposta_valor: propostaEnviada ? valor : null,
    proposta_produtos: propostaEnviada
      ? String(formData.get("proposta_produtos") || "").trim() || null
      : null,
    proposta_data: propostaEnviada
      ? String(formData.get("proposta_data") || "") || new Date().toISOString().slice(0, 10)
      : null,
    ...(propostaEnviada ? { status: "proposta_enviada" as const } : {}),
  }

  const query = supabase.from("clientes").update(dados).eq("id", clienteId)
  const { error } =
    perfil.role === "admin" ? await query : await query.eq("vendedor_id", perfil.id)

  if (error) return { error: error.message }

  revalidatePath("/sistema/vendedor/clientes")
  revalidatePath("/sistema/admin/clientes")
  return { success: true }
}

export async function atualizarStatusCliente(clienteId: string, status: StatusCliente) {
  const perfil = await requireVendedor()
  const supabase = await createClient()

  const query = supabase.from("clientes").update({ status }).eq("id", clienteId)
  const { error } =
    perfil.role === "admin" ? await query : await query.eq("vendedor_id", perfil.id)

  if (error) throw new Error(error.message)
  revalidatePath("/sistema/vendedor/clientes")
  revalidatePath("/sistema/admin/clientes")
}
