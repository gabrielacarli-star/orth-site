import { requireVendedor } from "@/lib/dal"
import { Shell, type NavItem } from "@/components/sistema/Shell"

const NAV: NavItem[] = [
  { href: "/sistema/vendedor", label: "Painel", exact: true },
  { href: "/sistema/vendedor/agenda", label: "Agenda" },
  { href: "/sistema/vendedor/vendas", label: "Minhas Vendas" },
  { href: "/sistema/vendedor/precos", label: "Tabela de Preços" },
  { href: "/sistema/vendedor/empresa", label: "Sobre a ORTH" },
]

export default async function VendedorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const perfil = await requireVendedor()

  return (
    <Shell nome={perfil.nome} roleLabel="Vendedor(a)" nav={NAV}>
      {children}
    </Shell>
  )
}
