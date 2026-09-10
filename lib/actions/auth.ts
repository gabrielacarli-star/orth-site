"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export interface LoginState {
  error?: string
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim()
  const senha = String(formData.get("senha") || "")

  if (!email || !senha) {
    return { error: "Preencha e-mail e senha." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  })

  if (error || !data.user) {
    return { error: "E-mail ou senha inválidos." }
  }

  const { data: perfil } = await supabase
    .from("perfis")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (!perfil) {
    await supabase.auth.signOut()
    return { error: "Usuário sem perfil cadastrado. Fale com a administração." }
  }

  redirect(perfil.role === "admin" ? "/sistema/admin" : "/sistema/vendedor")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/sistema/login")
}
