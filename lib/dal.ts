import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Perfil } from "@/lib/types"

export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getPerfil = cache(async (): Promise<Perfil | null> => {
  const user = await getUser()
  if (!user) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from("perfis")
    .select("*")
    .eq("id", user.id)
    .single()
  return data
})

export async function requireAdmin() {
  const perfil = await getPerfil()
  if (!perfil) redirect("/sistema/login")
  if (perfil.role !== "admin") redirect("/sistema/vendedor")
  return perfil
}

/**
 * Qualquer conta logada tem um registro em `vendedores` (admins também vendem),
 * então tanto admin quanto vendedor(a) podem acessar a área de vendedor.
 */
export async function requireVendedor() {
  const perfil = await getPerfil()
  if (!perfil) redirect("/sistema/login")
  return perfil
}
