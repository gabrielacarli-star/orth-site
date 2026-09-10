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
  return {
    nome: String(formData.get("nome") || "").trim(),
    telefone: String(formData.get("telefone") || "").trim() || null,
    email: String(formData.get("email") || "").trim() || null,
    empresa: String(formData.get("empresa") || "").trim() || null,
    origem: String(formData.get("origem") || "").trim() || null,
    notas: String(formData.get("notas") || "").trim() || null,
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
