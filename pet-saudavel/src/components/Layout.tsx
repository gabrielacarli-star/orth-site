import { NavLink, useNavigate } from "react-router-dom"
import type { ReactNode } from "react"
import { Seal } from "./ui"
import { InstallPrompt } from "./InstallPrompt"

const NAV = [
  { to: "/", label: "Início", icon: "🏠", end: true },
  { to: "/pets", label: "Pets", icon: "🐾", end: false },
  { to: "/sos", label: "SOS", icon: "🚨", end: false },
  { to: "/biblioteca", label: "E-books", icon: "📖", end: false },
  { to: "/conta", label: "Conta", icon: "👤", end: false },
]

export function Layout({ children, title }: { children: ReactNode; title?: string }) {
  const navigate = useNavigate()
  return (
    <div className="mx-auto flex min-h-full max-w-[560px] flex-col bg-parchment shadow-xl">
      {/* Top bar */}
      <header className="safe-top sticky top-0 z-10 border-b border-gold bg-parchment/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button onClick={() => navigate("/")} aria-label="Início" className="shrink-0">
            <Seal size={38} />
          </button>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold text-ink">
              {title ?? "Pet Saudável"}
            </p>
            <p className="text-[11px] text-muted">Dr. Eduardo Sebastião · CRMV-MT</p>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <InstallPrompt />

      {/* Bottom nav */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[560px] border-t border-gold bg-dark">
        <ul className="flex">
          {NAV.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium tracking-wide transition ${
                    isActive ? "text-gold" : "text-parchment/70"
                  }`
                }
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="font-display uppercase">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
