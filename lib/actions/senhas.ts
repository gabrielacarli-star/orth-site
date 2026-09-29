"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"
import { criptografar, descriptografar, vaultConfigurado } from "@/lib/crypto/vault"

export interface SenhaFormState {
  error?: string
  success?: boolean
}

export async function criarSenha(
  _prevState: SenhaFormState,
  formData: FormData
): Promise<SenhaFormState> {
  const perfil = await requireAdmin()

  if (!vaultConfigurado()) {
    return { error: "O cofre de senhas ainda não foi configurado (falta VAULT_ENCRYPTION_KEY)." }
  }

  const titulo = String(formData.get("titulo") || "").trim()
  const usuario = String(formData.get("usuario") || "").trim() || null
  const senha = String(formData.get("senha") || "")
  const url = String(formData.get("url") || "").trim() || null
  const notas = String(formData.get("notas") || "").trim() || null

  if (!titulo || !senha) {
    return { error: "Preencha pelo menos o título e a senha." }
  }

  const admin = createAdminClient()
  const { error } = await admin.from("senhas_acesso").insert({
    titulo,
    usuario,
    senha_cifrada: criptografar(senha),
    url,
    notas,
    criado_por: perfil.id,
  })

  if (error) return { error: error.message }

  revalidatePath("/sistema/admin/senhas")
  return { success: true }
}

export async function atualizarSenha(
  id: string,
  _prevState: SenhaFormState,
  formData: FormData
): Promise<SenhaFormState> {
  await requireAdmin()

  const titulo = String(formData.get("titulo") || "").trim()
  const usuario = String(formData.get("usuario") || "").trim() || null
  const senha = String(formData.get("senha") || "")
  const url = String(formData.get("url") || "").trim() || null
  const notas = String(formData.get("notas") || "").trim() || null

  if (!titulo) return { error: "Preencha o título." }

  const dados: Record<string, unknown> = { titulo, usuario, url, notas }
  if (senha) dados.senha_cifrada = criptografar(senha)

  const admin = createAdminClient()
  const { error } = await admin.from("senhas_acesso").update(dados).eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/sistema/admin/senhas")
  return { success: true }
}

export async function removerSenha(id: string) {
  await requireAdmin()
  const admin = createAdminClient()
  const { error } = await admin.from("senhas_acesso").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/sistema/admin/senhas")
}

export async function revelarSenha(id: string): Promise<string> {
  await requireAdmin()
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("senhas_acesso")
    .select("senha_cifrada")
    .eq("id", id)
    .single()
  if (error || !data) throw new Error(error?.message || "Senha não encontrada.")
  return descriptografar(data.senha_cifrada)
}
