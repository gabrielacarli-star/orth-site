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

async function criarLancamentosFinanceiro(params: {
  cliente_nome: string
  servico: string
  valor_setup: number
  valor_mensalidade: number
  data_venda: string
  data_primeira_mensalidade: string | null
}) {
  const linhas: Record<string, unknown>[] = []

  if (params.valor_setup > 0) {
    linhas.push({
      tipo: "receita",
      descricao: `Setup - ${params.servico} - ${params.cliente_nome}`,
      valor: params.valor_setup,
      categoria: "Venda",
      cliente_nome: params.cliente_nome,
      recorrente: false,
      data_prevista: params.data_venda,
    })
  }
  if (params.valor_mensalidade > 0 && params.data_primeira_mensalidade) {
    linhas.push({
      tipo: "receita",
      descricao: `Mensalidade - ${params.servico} - ${params.cliente_nome}`,
      valor: params.valor_mensalidade,
      categoria: "Venda",
      cliente_nome: params.cliente_nome,
      recorrente: true,
      data_prevista: params.data_primeira_mensalidade,
    })
  }

  if (linhas.length === 0) return

  try {
    const admin = createAdminClient()
    await admin.from("financeiro_lancamentos").insert(linhas)
  } catch {
    // Não bloqueia o registro da venda se o Financeiro falhar; dá pra lançar manualmente depois.
  }
}

export async function registrarVenda(
  _prevState: VendaFormState,
  formData: FormData
): Promise<VendaFormState> {
  const perfil = await requireVendedor()
  const supabase = await createClient()

  const cliente_nome = String(formData.get("cliente_nome") || "").trim()
  const servico = String(formData.get("servico") || "").trim()
  const setupRaw = String(formData.get("valor_setup") || "").replace(",", ".")
  const mensalidadeRaw = String(formData.get("valor_mensalidade") || "").replace(",", ".")
  const valor_setup = setupRaw ? Number(setupRaw) : 0
  const valor_mensalidade = mensalidadeRaw ? Number(mensalidadeRaw) : 0
  const data_venda = String(formData.get("data_venda") || "") || undefined
  const data_primeira_mensalidade = String(formData.get("data_primeira_mensalidade") || "") || null
  const observacoes = String(formData.get("observacoes") || "").trim() || null
  const comprovante = formData.get("comprovante") as File | null
  const contrato = formData.get("contrato") as File | null

  if (!cliente_nome || !servico) {
    return { error: "Preencha o cliente e o serviço vendido." }
  }
  if (!Number.isFinite(valor_setup) || !Number.isFinite(valor_mensalidade)) {
    return { error: "Informe valores válidos pra setup e/ou mensalidade." }
  }
  if (valor_setup <= 0 && valor_mensalidade <= 0) {
    return { error: "Informe o valor de setup e/ou de mensalidade." }
  }
  if (valor_mensalidade > 0 && !data_primeira_mensalidade) {
    return { error: "Informe a data da primeira mensalidade." }
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
  const valor_venda = valor_setup + valor_mensalidade

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
    valor_setup: valor_setup > 0 ? valor_setup : null,
    valor_mensalidade: valor_mensalidade > 0 ? valor_mensalidade : null,
    comissao_percentual,
    comprovante_path,
    contrato_path,
    observacoes,
    ...(data_venda ? { data_venda } : {}),
  })

  if (error) return { error: error.message }

  await criarLancamentosFinanceiro({
    cliente_nome,
    servico,
    valor_setup,
    valor_mensalidade,
    data_venda: data_venda || new Date().toISOString().slice(0, 10),
    data_primeira_mensalidade,
  })

  revalidatePath("/sistema/vendedor/vendas")
  revalidatePath("/sistema/vendedor")
  revalidatePath("/sistema/admin/vendas")
  revalidatePath("/sistema/admin/financeiro")
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
  const setupRaw = String(formData.get("valor_setup") || "").replace(",", ".")
  const mensalidadeRaw = String(formData.get("valor_mensalidade") || "").replace(",", ".")
  const valor_setup = setupRaw ? Number(setupRaw) : 0
  const valor_mensalidade = mensalidadeRaw ? Number(mensalidadeRaw) : 0
  const data_venda = String(formData.get("data_venda") || "") || undefined
  const data_primeira_mensalidade = String(formData.get("data_primeira_mensalidade") || "") || null
  const observacoes = String(formData.get("observacoes") || "").trim() || null
  const comprovante = formData.get("comprovante") as File | null
  const contrato = formData.get("contrato") as File | null

  if (!vendedor_id) {
    return { error: "Selecione o vendedor responsável pela venda." }
  }
  if (!cliente_nome || !servico) {
    return { error: "Preencha o cliente e o serviço vendido." }
  }
  if (!Number.isFinite(valor_setup) || !Number.isFinite(valor_mensalidade)) {
    return { error: "Informe valores válidos pra setup e/ou mensalidade." }
  }
  if (valor_setup <= 0 && valor_mensalidade <= 0) {
    return { error: "Informe o valor de setup e/ou de mensalidade." }
  }
  if (valor_mensalidade > 0 && !data_primeira_mensalidade) {
    return { error: "Informe a data da primeira mensalidade." }
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

  const valor_venda = valor_setup + valor_mensalidade

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
    valor_setup: valor_setup > 0 ? valor_setup : null,
    valor_mensalidade: valor_mensalidade > 0 ? valor_mensalidade : null,
    comissao_percentual: vendedor.comissao_percentual,
    comprovante_path,
    contrato_path,
    observacoes,
    ...(data_venda ? { data_venda } : {}),
  })

  if (error) return { error: error.message }

  await criarLancamentosFinanceiro({
    cliente_nome,
    servico,
    valor_setup,
    valor_mensalidade,
    data_venda: data_venda || new Date().toISOString().slice(0, 10),
    data_primeira_mensalidade,
  })

  revalidatePath("/sistema/admin/vendas")
  revalidatePath("/sistema/admin")
  revalidatePath("/sistema/vendedor/vendas")
  revalidatePath("/sistema/admin/financeiro")
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
