import { requireVendedor } from "@/lib/dal"
import { Shell, type NavItem } from "@/components/sistema/Shell"

function nav(isAdmin: boolean): NavItem[] {
  const base: NavItem[] = [
    { href: "/sistema/vendedor", label: "Painel", exact: true },
    { href: "/sistema/vendedor/agenda", label: "Agenda" },
    { href: "/sistema/vendedor/clientes", label: "Meus Clientes" },
    { href: "/sistema/vendedor/vendas", label: "Minhas Vendas" },
    { href: "/sistema/vendedor/precos", label: "Tabela de Preços" },
    { href: "/sistema/vendedor/empresa", label: "Sobre a ORTH" },
  ]
  if (isAdmin) {
    base.unshift({ href: "/sistema/admin", label: "← Painel Admin" })
  }
  return base
}

export default async function VendedorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const perfil = await requireVendedor()
  const isAdmin = perfil.role === "admin"

  return (
    <Shell
      nome={perfil.nome}
      roleLabel={isAdmin ? "Administração (como vendedora)" : "Vendedor(a)"}
      nav={nav(isAdmin)}
    >
      {children}
    </Shell>
  )
}
