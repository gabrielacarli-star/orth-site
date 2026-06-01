import { Logo } from "@/components/Logo"
import { WA_BR, WA_PT, EMAIL, INSTAGRAM, PHONE_BR, PHONE_PT } from "@/lib/constants"
import { Mail } from "lucide-react"

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Serviços",      href: "#servicos" },
  { label: "Depoimentos",   href: "#depoimentos" },
  { label: "FAQ",           href: "#faq" },
  { label: "Contacto",      href: "#contato" },
]

export function Footer() {
  return (
    <footer className="bg-orth-dark border-t border-orth-blue/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <a href="#" className="inline-block mb-5">
              <Logo size={34} light />
            </a>
            <p className="text-orth-muted text-sm leading-relaxed max-w-xs">
              Agência especializada em sites profissionais de alto impacto,
              com entrega em até 72 horas. Brasil e Portugal.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Navegação
            </h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-orth-muted hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              Contactos
            </h3>
            <div className="flex flex-col gap-4">

              {/* WhatsApp Brasil */}
              <a
                href={WA_BR}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/15 border border-[#25D366]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/25 transition-colors">
                  <WAIcon />
                </div>
                <div>
                  <p className="text-xs text-orth-muted">WhatsApp Brasil 🇧🇷</p>
                  <p className="text-white text-sm font-medium group-hover:text-orth-sky transition-colors">{PHONE_BR}</p>
                </div>
              </a>

              {/* WhatsApp Portugal */}
              <a
                href={WA_PT}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/15 border border-[#25D366]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/25 transition-colors">
                  <WAIcon />
                </div>
                <div>
                  <p className="text-xs text-orth-muted">WhatsApp Portugal 🇵🇹</p>
                  <p className="text-white text-sm font-medium group-hover:text-orth-sky transition-colors">{PHONE_PT}</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={EMAIL}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-orth-electric/15 border border-orth-electric/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orth-electric/25 transition-colors">
                  <Mail size={16} className="text-orth-electric" />
                </div>
                <div>
                  <p className="text-xs text-orth-muted">E-mail</p>
                  <p className="text-white text-sm font-medium group-hover:text-orth-sky transition-colors">orthdigital@gmail.com</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-pink-500/15 border border-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/25 transition-colors">
                  <IGIcon />
                </div>
                <div>
                  <p className="text-xs text-orth-muted">Instagram</p>
                  <p className="text-white text-sm font-medium group-hover:text-orth-sky transition-colors">@orthdigital</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-orth-blue/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-orth-muted text-xs">
            © {new Date().getFullYear()} ORTH Digital. Todos os direitos reservados.
          </p>
          <p className="text-orth-muted/50 text-xs">
            Sites que vendem · Entregues em 72 horas
          </p>
        </div>
      </div>
    </footer>
  )
}

function WAIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.77 9.77 0 01-5.031-1.392l-.361-.214-3.753.979.999-3.648-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  )
}

function IGIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="#f472b6" stroke="none"/>
    </svg>
  )
}
