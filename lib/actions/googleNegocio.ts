"use server"

import { revalidatePath } from "next/cache"
import { requireVendedor } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"

export interface GoogleNegocioFormState {
  error?: string
  success?: boolean
}

async function verificarDono(conexaoId: string, vendedorId: string, isAdmin: boolean) {
  const admin = createAdminClient()
  const { data } = await admin
    .from("google_negocio_conexoes")
    .select("id, vendedor_id")
    .eq("id", conexaoId)
    .maybeSingle()
  if (!data) return false
  return isAdmin || data.vendedor_id === vendedorId
}

export async function atualizarConfigGoogleNegocio(
  conexaoId: string,
  _prevState: GoogleNegocioFormState,
  formData: FormData
): Promise<GoogleNegocioFormState> {
  const perfil = await requireVendedor()
  const podeEditar = await verificarDono(conexaoId, perfil.id, perfil.role === "admin")
  if (!podeEditar) return { error: "Você não tem acesso a essa conexão." }

  const descricao_negocio = String(formData.get("descricao_negocio") || "").trim() || null
  const palavras_chave = String(formData.get("palavras_chave") || "").trim() || null
  const ativo = formData.get("ativo") === "on"

  const admin = createAdminClient()
  const { error } = await admin
    .from("google_negocio_conexoes")
    .update({ descricao_negocio, palavras_chave, ativo })
    .eq("id", conexaoId)

  if (error) return { error: error.message }

  revalidatePath("/sistema/vendedor/clientes")
  revalidatePath("/sistema/admin/clientes")
  return { success: true }
}

export async function desconectarGoogleNegocio(conexaoId: string) {
  const perfil = await requireVendedor()
  const podeEditar = await verificarDono(conexaoId, perfil.id, perfil.role === "admin")
  if (!podeEditar) throw new Error("Você não tem acesso a essa conexão.")

  const admin = createAdminClient()
  const { error } = await admin.from("google_negocio_conexoes").delete().eq("id", conexaoId)
  if (error) throw new Error(error.message)

  revalidatePath("/sistema/vendedor/clientes")
  revalidatePath("/sistema/admin/clientes")
}
