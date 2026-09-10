import { redirect } from "next/navigation"
import { getPerfil } from "@/lib/dal"

export default async function SistemaIndexPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect("/sistema/login")
  redirect(perfil.role === "admin" ? "/sistema/admin" : "/sistema/vendedor")
}
