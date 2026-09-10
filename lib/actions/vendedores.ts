"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"

export interface VendedorFormState {
  error?: string
  success?: boolean
}

export async function criarVendedor(
  _prevState: VendedorFormState,
  formData: FormData
): Promise<VendedorFormState> {
  await requireAdmin()

  const nome = String(formData.get("nome") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const senha = String(formData.get("senha") || "")
  const cpf = String(formData.get("cpf") || "").trim() || null
  const cnpj = String(formData.get("cnpj") || "").trim() || null
  const telefone = String(formData.get("telefone") || "").trim() || null
  const comissaoRaw = String(formData.get("comissao_percentual") || "20")
  const comissao_percentual = Number(comissaoRaw.replace(",", "."))

  if (!nome || !email || senha.length < 8) {
    return { error: "Preencha nome, e-mail e uma senha com pelo menos 8 caracteres." }
  }
  if (!Number.isFinite(comissao_percentual) || comissao_percentual < 0 || comissao_percentual > 100) {
    return { error: "Percentual de comissão inválido." }
  }

  const admin = createAdminClient()

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  })

  if (createError || !created.user) {
    return { error: createError?.message ?? "Não foi possível criar o login." }
  }

  const { error: perfilError } = await admin.from("perfis").insert({
    id: created.user.id,
    role: "vendedor",
    nome,
  })

  if (perfilError) {
    await admin.auth.admin.deleteUser(created.user.id)
    return { error: perfilError.message }
  }

  const { error: vendedorError } = await admin.from("vendedores").insert({
    id: created.user.id,
    cpf,
    cnpj,
    telefone,
    comissao_percentual,
  })

  if (vendedorError) {
    await admin.auth.admin.deleteUser(created.user.id)
    return { error: vendedorError.message }
  }

  revalidatePath("/sistema/admin/vendedores")
  return { success: true }
}

export async function atualizarVendedor(
  vendedorId: string,
  dados: { comissao_percentual?: number; ativo?: boolean; telefone?: string | null }
) {
  await requireAdmin()
  const admin = createAdminClient()
  const { error } = await admin.from("vendedores").update(dados).eq("id", vendedorId)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/admin/vendedores")
}
