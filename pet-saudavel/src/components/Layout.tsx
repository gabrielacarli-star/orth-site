import { NavLink, useNavigate } from "react-router-dom"
import { useState, type ReactNode } from "react"
import { Seal } from "./ui"
import { InstallPrompt } from "./InstallPrompt"
import { NIVEIS_TEXTO, iniciarTamanhoTexto, proximoNivelTexto } from "../lib/fontScale"

const NAV = [
  { to: "/", label: "Início", icon: "🏠", end: true },
  { to: "/pets", label: "Pets", icon: "🐾", end: false },
  { to: "/sos", label: "SOS", icon: "🚨", end: false },
  { to: "/biblioteca", label: "E-books", icon: "📖", end: false },
  { to: "/conta", label: "Conta", icon: "👤", end: false },
]

export function Layout({ children, title }: { children: ReactNode; title?: string }) {
  const navigate = useNavigate()
  const [nivelTexto, setNivelTexto] = useState(() => iniciarTamanhoTexto())
  const rotuloAtual = NIVEIS_TEXTO.find((n) => n.id === nivelTexto)?.rotulo ?? "A"
  return (
    <div className="mx-auto flex min-h-full max-w-[560px] flex-col bg-parchment shadow-xl">
      {/* Top bar */}
      <header className="safe-top sticky top-0 z-10 border-b border-gold bg-parchment/95 backdrop-blur print:hidden">
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
          <button
            onClick={() => setNivelTexto(proximoNivelTexto(nivelTexto))}
            aria-label="Aumentar tamanho do texto"
            title="Tamanho do texto"
            className="ml-auto shrink-0 rounded-lg border border-gold px-2.5 py-1.5 font-display text-xs font-bold text-ink"
          >
            {rotuloAtual}
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 px-4 pb-28 pt-4 print:pb-4">{children}</main>

      <div className="print:hidden">
        <InstallPrompt />
      </div>

      {/* Bottom nav */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[560px] border-t border-gold bg-dark print:hidden">
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
