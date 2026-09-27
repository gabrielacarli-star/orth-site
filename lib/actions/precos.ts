"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"

export interface PrecoFormState {
  error?: string
  success?: boolean
}

export async function adicionarPreco(
  _prevState: PrecoFormState,
  formData: FormData
): Promise<PrecoFormState> {
  await requireAdmin()

  const servico = String(formData.get("servico") || "").trim()
  const valor_descricao = String(formData.get("valor_descricao") || "").trim()
  const condicao_pagamento = String(formData.get("condicao_pagamento") || "").trim() || null
  const ordemRaw = Number(formData.get("ordem") || "0")
  const valorMinimoRaw = String(formData.get("valor_minimo") || "").trim().replace(",", ".")
  const valor_minimo = valorMinimoRaw ? Number(valorMinimoRaw) : null

  if (!servico || !valor_descricao) {
    return { error: "Preencha o serviço e o valor." }
  }
  if (valor_minimo !== null && (!Number.isFinite(valor_minimo) || valor_minimo < 0)) {
    return { error: "Valor mínimo inválido." }
  }

  const admin = createAdminClient()
  const { error } = await admin.from("tabela_precos").insert({
    servico,
    valor_descricao,
    condicao_pagamento,
    valor_minimo,
    ordem: Number.isFinite(ordemRaw) ? ordemRaw : 0,
  })

  if (error) return { error: error.message }

  revalidatePath("/sistema/admin/precos")
  revalidatePath("/sistema/vendedor/precos")
  return { success: true }
}

export async function atualizarValorMinimo(id: string, valor_minimo: number | null) {
  await requireAdmin()
  const admin = createAdminClient()
  const { error } = await admin.from("tabela_precos").update({ valor_minimo }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/admin/precos")
  revalidatePath("/sistema/proposta")
}

export async function removerPreco(id: string) {
  await requireAdmin()
  const admin = createAdminClient()
  const { error } = await admin.from("tabela_precos").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/admin/precos")
  revalidatePath("/sistema/vendedor/precos")
}

export async function atualizarComissaoPadrao(
  _prevState: PrecoFormState,
  formData: FormData
): Promise<PrecoFormState> {
  await requireAdmin()

  const raw = String(formData.get("comissao_percentual_padrao") || "").replace(",", ".")
  const valor = Number(raw)

  if (!Number.isFinite(valor) || valor < 0 || valor > 100) {
    return { error: "Percentual inválido." }
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from("config")
    .update({ comissao_percentual_padrao: valor, updated_at: new Date().toISOString() })
    .eq("id", true)

  if (error) return { error: error.message }

  revalidatePath("/sistema/admin/precos")
  return { success: true }
}
