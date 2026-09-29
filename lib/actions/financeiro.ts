"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"

export interface LancamentoFormState {
  error?: string
  success?: boolean
}

export async function criarLancamento(
  _prevState: LancamentoFormState,
  formData: FormData
): Promise<LancamentoFormState> {
  const perfil = await requireAdmin()

  const tipo = formData.get("tipo") === "despesa" ? "despesa" : "receita"
  const descricao = String(formData.get("descricao") || "").trim()
  const valorRaw = String(formData.get("valor") || "").replace(",", ".")
  const valor = Number(valorRaw)
  const categoria = String(formData.get("categoria") || "").trim() || null
  const cliente_nome = String(formData.get("cliente_nome") || "").trim() || null
  const recorrente = formData.get("recorrente") === "on"
  const data_prevista = String(formData.get("data_prevista") || "")

  if (!descricao || !data_prevista) {
    return { error: "Preencha a descrição e a data prevista." }
  }
  if (!Number.isFinite(valor) || valor <= 0) {
    return { error: "Informe um valor válido." }
  }

  const admin = createAdminClient()
  const { error } = await admin.from("financeiro_lancamentos").insert({
    tipo,
    descricao,
    valor,
    categoria,
    cliente_nome,
    recorrente,
    data_prevista,
    criado_por: perfil.id,
  })

  if (error) return { error: error.message }

  revalidatePath("/sistema/admin/financeiro")
  return { success: true }
}

export async function atualizarLancamento(
  id: string,
  _prevState: LancamentoFormState,
  formData: FormData
): Promise<LancamentoFormState> {
  await requireAdmin()

  const tipo = formData.get("tipo") === "despesa" ? "despesa" : "receita"
  const descricao = String(formData.get("descricao") || "").trim()
  const valorRaw = String(formData.get("valor") || "").replace(",", ".")
  const valor = Number(valorRaw)
  const categoria = String(formData.get("categoria") || "").trim() || null
  const cliente_nome = String(formData.get("cliente_nome") || "").trim() || null
  const recorrente = formData.get("recorrente") === "on"
  const data_prevista = String(formData.get("data_prevista") || "")

  if (!descricao || !data_prevista) {
    return { error: "Preencha a descrição e a data prevista." }
  }
  if (!Number.isFinite(valor) || valor <= 0) {
    return { error: "Informe um valor válido." }
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from("financeiro_lancamentos")
    .update({ tipo, descricao, valor, categoria, cliente_nome, recorrente, data_prevista })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/sistema/admin/financeiro")
  return { success: true }
}

export async function marcarStatusLancamento(id: string, pago: boolean) {
  await requireAdmin()
  const admin = createAdminClient()
  const { error } = await admin
    .from("financeiro_lancamentos")
    .update({
      status: pago ? "pago" : "pendente",
      data_pago: pago ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/admin/financeiro")
}

export async function removerLancamento(id: string) {
  await requireAdmin()
  const admin = createAdminClient()
  const { error } = await admin.from("financeiro_lancamentos").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/admin/financeiro")
}
