import { requireAdmin } from "@/lib/dal"
import { Shell, type NavItem } from "@/components/sistema/Shell"

const NAV: NavItem[] = [
  { href: "/sistema/admin", label: "Painel", exact: true },
  { href: "/sistema/admin/vendedores", label: "Vendedores" },
  { href: "/sistema/admin/clientes", label: "Clientes" },
  { href: "/sistema/admin/vendas", label: "Vendas & Comissões" },
  { href: "/sistema/vendedor/agenda", label: "Minha Agenda" },
  { href: "/sistema/admin/precos", label: "Preços & Comissão" },
]

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const perfil = await requireAdmin()

  return (
    <Shell nome={perfil.nome} roleLabel="Administração" nav={NAV}>
      {children}
    </Shell>
  )
}
