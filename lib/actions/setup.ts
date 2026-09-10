"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export interface SetupState {
  error?: string
}

export async function adminJaExiste() {
  const supabase = await createClient()
  const { count } = await supabase
    .from("perfis")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin")
  return (count ?? 0) > 0
}

export async function criarPrimeiroAdmin(
  _prevState: SetupState,
  formData: FormData
): Promise<SetupState> {
  if (await adminJaExiste()) {
    return { error: "Já existe um administrador cadastrado." }
  }

  const nome = String(formData.get("nome") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const senha = String(formData.get("senha") || "")

  if (!nome || !email || senha.length < 8) {
    return { error: "Preencha nome, e-mail e uma senha com pelo menos 8 caracteres." }
  }

  const admin = createAdminClient()

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  })

  if (createError || !created.user) {
    return { error: createError?.message ?? "Não foi possível criar o usuário." }
  }

  const { error: perfilError } = await admin.from("perfis").insert({
    id: created.user.id,
    role: "admin",
    nome,
  })

  if (perfilError) {
    await admin.auth.admin.deleteUser(created.user.id)
    return { error: perfilError.message }
  }

  redirect("/sistema/login")
}
