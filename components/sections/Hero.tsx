"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, Star } from "lucide-react"
import { WA_BR } from "@/lib/constants"
import { BrowserFrame } from "./Showcase"

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
})

export function Hero() {
  return (
    <section className="relative min-h-screen bg-orth-dark overflow-hidden flex items-center">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orth-electric/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orth-blue/15 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#7CB3FF 1px, transparent 1px), linear-gradient(90deg, #7CB3FF 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left: Copy ── */}
          <div>
            {/* Badge */}
            <motion.div
              {...anim(0)}
              className="inline-flex items-center gap-2 bg-orth-blue/30 border border-orth-electric/30 text-orth-sky text-xs font-semibold px-4 py-2 rounded-full mb-6"
            >
              <Clock size={13} />
              Entrega em até 72 horas · Brasil e Portugal
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...anim(0.12)}
              className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[1.08] tracking-tight text-white mb-2"
            >
              Sites que vendem.
            </motion.h1>
            <motion.p
              {...anim(0.24)}
              className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[1.08] tracking-tight gradient-text mb-6"
            >
              Entregues em 72 horas.
            </motion.p>

            {/* Subheadline */}
            <motion.p
              {...anim(0.36)}
              className="text-orth-muted text-lg leading-relaxed max-w-lg mb-10"
            >
              Criamos sites profissionais, responsivos e focados em conversão para
              empresas no Brasil e em Portugal — com velocidade sem abrir mão da qualidade.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...anim(0.48)}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={WA_BR}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-orth-electric hover:bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 hover:shadow-[0_0_32px_rgba(37,99,235,0.5)] cursor-pointer"
              >
                Solicitar orçamento grátis
                <ArrowRight size={18} />
              </a>
              <a
                href="#showcase"
                className="inline-flex items-center justify-center gap-2 border border-orth-blue/50 hover:border-orth-electric text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200 cursor-pointer"
              >
                Ver nossos trabalhos
              </a>
            </motion.div>

            {/* Social proof micro */}
            <motion.div
              {...anim(0.6)}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" className="text-amber-400" />
                ))}
                <span className="ml-2 text-sm text-orth-muted">5.0 · +100 clientes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orth-muted">
                <span className="text-base">🇧🇷</span> Brasil
                <span className="w-px h-4 bg-orth-line/30" />
                <span className="text-base">🇵🇹</span> Portugal
              </div>
            </motion.div>
          </div>

          {/* ── Right: Floating browser frames ── */}
          <div className="relative hidden lg:flex items-center justify-center h-[520px]">
            {/* Frame 3 — behind, left */}
            <motion.div
              className="absolute left-0 top-20 float-c"
              initial={{ opacity: 0, x: -30, rotate: -6 }}
              animate={{ opacity: 0.55, x: 0, rotate: -6 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{ rotate: "-6deg" }}
            >
              <BrowserFrame url="orthdigital.com.br/academia" scale={0.52}>
                <MiniGym />
              </BrowserFrame>
            </motion.div>

            {/* Frame 2 — middle-back */}
            <motion.div
              className="absolute right-4 top-8 float-b"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.75, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ rotate: "4deg" }}
            >
              <BrowserFrame url="orthdigital.com.br/restaurante" scale={0.6}>
                <MiniRestaurant />
              </BrowserFrame>
            </motion.div>

            {/* Frame 1 — front, main */}
            <motion.div
              className="absolute left-10 bottom-0 float-a z-10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{ rotate: "-2deg" }}
            >
              <BrowserFrame url="orthdigital.com.br/clinica" scale={0.72}>
                <MiniClinic />
              </BrowserFrame>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-orth-muted/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs uppercase tracking-widest">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-orth-muted/40 to-transparent" />
      </motion.div>
    </section>
  )
}

/* ── Mini-sites used in hero ── */

function MiniClinic() {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#fdf2f8 0%,#fff5f9 60%,#fff 100%)", fontFamily: "Georgia,serif" }}>
      <div style={{ height: 52, background: "#fff", borderBottom: "1px solid #fce7f3", display: "flex", alignItems: "center", padding: "0 36px", justifyContent: "space-between" }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#be185d", letterSpacing: -0.5 }}>✦ BeautyClinic</span>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#9ca3af" }}>
          <span>Serviços</span><span>Sobre</span><span>Contato</span>
        </div>
        <button style={{ background: "#be185d", color: "#fff", padding: "7px 18px", borderRadius: 24, border: "none", fontSize: 13, fontWeight: 600 }}>Agendar</button>
      </div>
      <div style={{ display: "flex", padding: "36px", gap: 32, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <span style={{ background: "#fce7f3", color: "#9d174d", padding: "5px 14px", borderRadius: 24, fontSize: 12, fontWeight: 600 }}>✦ Especialistas em estética</span>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: "#111", lineHeight: 1.1, margin: "14px 0 12px" }}>Sua beleza<br/>em boas mãos</h1>
          <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 22, lineHeight: 1.5 }}>Tratamentos estéticos avançados com resultados comprovados e personalizados.</p>
          <button style={{ background: "#be185d", color: "#fff", padding: "13px 28px", borderRadius: 32, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Agendar consulta →</button>
          <div style={{ marginTop: 20, display: "flex", gap: 20, fontSize: 12, color: "#9d174d" }}>
            <span>✓ 500+ clientes</span><span>✓ 5 estrelas</span><span>✓ 10 anos</span>
          </div>
        </div>
        <div style={{ width: 220, height: 220, background: "linear-gradient(135deg,#fbcfe8 0%,#ec4899 100%)", borderRadius: 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>
    </div>
  )
}

function MiniRestaurant() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0d0805", fontFamily: "Georgia,serif" }}>
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 36px", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#d97706", letterSpacing: 1 }}>LA CUCINA</span>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          <span>Cardápio</span><span>Reservas</span><span>Sobre</span>
        </div>
      </div>
      <div style={{ display: "flex", padding: "36px", gap: 32, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <span style={{ background: "rgba(217,119,6,0.2)", color: "#d97706", padding: "5px 14px", borderRadius: 24, fontSize: 12, fontWeight: 600 }}>Desde 1998</span>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "14px 0 12px" }}>Uma experiência<br/>gastronômica única</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 22 }}>Culinária italiana autêntica no coração da cidade.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "#d97706", color: "#fff", padding: "12px 24px", borderRadius: 32, border: "none", fontSize: 14, fontWeight: 600 }}>Reservar mesa</button>
            <button style={{ background: "transparent", color: "#d97706", padding: "12px 24px", borderRadius: 32, border: "1px solid #d97706", fontSize: 14, fontWeight: 600 }}>Ver cardápio</button>
          </div>
        </div>
        <div style={{ width: 200, height: 200, background: "linear-gradient(135deg,#92400e,#d97706)", borderRadius: 20, flexShrink: 0 }} />
      </div>
    </div>
  )
}

function MiniGym() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#080808", fontFamily: "'Arial Black',sans-serif" }}>
      <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 36px", justifyContent: "space-between" }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#f97316", letterSpacing: 2 }}>IRON GYM</span>
        <div style={{ display: "flex", gap: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          <span>Planos</span><span>Modalidades</span><span>Contato</span>
        </div>
      </div>
      <div style={{ padding: "24px 36px" }}>
        <span style={{ background: "rgba(249,115,22,0.2)", color: "#f97316", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>MATRICULE-SE JÁ</span>
        <h1 style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1, margin: "12px 0 8px", textTransform: "uppercase", letterSpacing: -1 }}>TRANSFORME<br/><span style={{ color: "#f97316" }}>SEU CORPO</span></h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 22 }}>+3.000 alunos transformados. Comece hoje.</p>
        <button style={{ background: "#f97316", color: "#fff", padding: "13px 32px", borderRadius: 6, border: "none", fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>Começar agora →</button>
        <div style={{ marginTop: 24, display: "flex", gap: 24 }}>
          {["3K+ alunos","5 anos","12 modalidades"].map(s => (
            <div key={s} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#f97316" }}>{s.split(" ")[0]}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.split(" ").slice(1).join(" ")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
