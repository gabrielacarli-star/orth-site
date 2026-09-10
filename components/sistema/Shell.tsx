import { logout } from "@/lib/actions/auth"
import { Logo } from "@/components/Logo"
import { NavLink } from "@/components/sistema/NavLink"

export interface NavItem {
  href: string
  label: string
  exact?: boolean
}

export function Shell({
  nome,
  roleLabel,
  nav,
  children,
}: {
  nome: string
  roleLabel: string
  nav: NavItem[]
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-orth-dark flex">
      <aside className="w-64 shrink-0 border-r border-orth-line/10 px-4 py-6 hidden md:flex md:flex-col">
        <div className="px-2 mb-8">
          <Logo size={28} />
        </div>

        <nav className="space-y-1 flex-1">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} exact={item.exact}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-orth-line/10 pt-4 px-2">
          <p className="text-sm text-white font-medium truncate">{nome}</p>
          <p className="text-xs text-orth-muted mb-3">{roleLabel}</p>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-orth-muted hover:text-white transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-orth-line/10 px-4 py-3">
          <Logo size={22} />
          <form action={logout}>
            <button type="submit" className="text-xs text-orth-muted">
              Sair
            </button>
          </form>
        </header>

        <nav className="md:hidden flex gap-1 overflow-x-auto px-4 py-2 border-b border-orth-line/10">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} exact={item.exact}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="p-4 md:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  )
}
