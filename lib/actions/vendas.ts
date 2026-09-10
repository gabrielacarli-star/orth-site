"use server"

import { revalidatePath } from "next/cache"
import type { SupabaseClient } from "@supabase/supabase-js"
import { requireAdmin, requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export interface VendaFormState {
  error?: string
  success?: boolean
}

const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10MB

async function uploadArquivo(
  supabase: SupabaseClient,
  bucket: "comprovantes" | "contratos",
  vendedorId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() || "bin"
  const path = `${vendedorId}/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
  })
  if (error) throw new Error(`Falha ao enviar ${bucket}: ${error.message}`)
  return path
}

export async function registrarVenda(
  _prevState: VendaFormState,
  formData: FormData
): Promise<VendaFormState> {
  const perfil = await requireVendedor()
  const supabase = await createClient()

  const cliente_nome = String(formData.get("cliente_nome") || "").trim()
  const servico = String(formData.get("servico") || "").trim()
  const valorRaw = String(formData.get("valor_venda") || "").replace(",", ".")
  const valor_venda = Number(valorRaw)
  const data_venda = String(formData.get("data_venda") || "") || undefined
  const observacoes = String(formData.get("observacoes") || "").trim() || null
  const comprovante = formData.get("comprovante") as File | null
  const contrato = formData.get("contrato") as File | null

  if (!cliente_nome || !servico) {
    return { error: "Preencha o cliente e o serviço vendido." }
  }
  if (!Number.isFinite(valor_venda) || valor_venda <= 0) {
    return { error: "Informe um valor de venda válido." }
  }
  if (!comprovante || comprovante.size === 0) {
    return { error: "Anexe o comprovante de pagamento do cliente." }
  }
  if (!contrato || contrato.size === 0) {
    return { error: "Anexe o contrato assinado." }
  }
  if (comprovante.size > MAX_FILE_BYTES || contrato.size > MAX_FILE_BYTES) {
    return { error: "Cada arquivo deve ter no máximo 10MB." }
  }

  const { data: vendedor } = await supabase
    .from("vendedores")
    .select("comissao_percentual")
    .eq("id", perfil.id)
    .single()

  const comissao_percentual = vendedor?.comissao_percentual ?? 20

  let comprovante_path: string
  let contrato_path: string
  try {
    comprovante_path = await uploadArquivo(supabase, "comprovantes", perfil.id, comprovante)
    contrato_path = await uploadArquivo(supabase, "contratos", perfil.id, contrato)
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao enviar os arquivos." }
  }

  const { error } = await supabase.from("vendas").insert({
    vendedor_id: perfil.id,
    cliente_nome,
    servico,
    valor_venda,
    comissao_percentual,
    comprovante_path,
    contrato_path,
    observacoes,
    ...(data_venda ? { data_venda } : {}),
  })

  if (error) return { error: error.message }

  revalidatePath("/sistema/vendedor/vendas")
  revalidatePath("/sistema/vendedor")
  revalidatePath("/sistema/admin/vendas")
  return { success: true }
}

export async function registrarVendaAdmin(
  _prevState: VendaFormState,
  formData: FormData
): Promise<VendaFormState> {
  await requireAdmin()
  const admin = createAdminClient()

  const vendedor_id = String(formData.get("vendedor_id") || "").trim()
  const cliente_nome = String(formData.get("cliente_nome") || "").trim()
  const servico = String(formData.get("servico") || "").trim()
  const valorRaw = String(formData.get("valor_venda") || "").replace(",", ".")
  const valor_venda = Number(valorRaw)
  const data_venda = String(formData.get("data_venda") || "") || undefined
  const observacoes = String(formData.get("observacoes") || "").trim() || null
  const comprovante = formData.get("comprovante") as File | null
  const contrato = formData.get("contrato") as File | null

  if (!vendedor_id) {
    return { error: "Selecione o vendedor responsável pela venda." }
  }
  if (!cliente_nome || !servico) {
    return { error: "Preencha o cliente e o serviço vendido." }
  }
  if (!Number.isFinite(valor_venda) || valor_venda <= 0) {
    return { error: "Informe um valor de venda válido." }
  }
  if (!comprovante || comprovante.size === 0) {
    return { error: "Anexe o comprovante de pagamento do cliente." }
  }
  if (!contrato || contrato.size === 0) {
    return { error: "Anexe o contrato assinado." }
  }
  if (comprovante.size > MAX_FILE_BYTES || contrato.size > MAX_FILE_BYTES) {
    return { error: "Cada arquivo deve ter no máximo 10MB." }
  }

  const { data: vendedor } = await admin
    .from("vendedores")
    .select("comissao_percentual")
    .eq("id", vendedor_id)
    .single()

  if (!vendedor) {
    return { error: "Vendedor não encontrado." }
  }

  let comprovante_path: string
  let contrato_path: string
  try {
    comprovante_path = await uploadArquivo(admin, "comprovantes", vendedor_id, comprovante)
    contrato_path = await uploadArquivo(admin, "contratos", vendedor_id, contrato)
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falha ao enviar os arquivos." }
  }

  const { error } = await admin.from("vendas").insert({
    vendedor_id,
    cliente_nome,
    servico,
    valor_venda,
    comissao_percentual: vendedor.comissao_percentual,
    comprovante_path,
    contrato_path,
    observacoes,
    ...(data_venda ? { data_venda } : {}),
  })

  if (error) return { error: error.message }

  revalidatePath("/sistema/admin/vendas")
  revalidatePath("/sistema/admin")
  revalidatePath("/sistema/vendedor/vendas")
  return { success: true }
}

export async function marcarComoPaga(vendaId: string) {
  await requireAdmin()
  const admin = createAdminClient()
  const { error } = await admin
    .from("vendas")
    .update({ status_comissao: "paga" })
    .eq("id", vendaId)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/admin/vendas")
}

export async function gerarUrlArquivo(
  bucket: "comprovantes" | "contratos",
  path: string
): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 5)
  if (error || !data) throw new Error("Não foi possível gerar o link do arquivo.")
  return data.signedUrl
}
