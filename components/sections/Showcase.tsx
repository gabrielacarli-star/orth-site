"use client"

import { motion } from "framer-motion"

/* ─────────────────────────────────────────
   BrowserFrame — reutilizado no Hero também
   scale: multiplier em relação ao inner (760×440)
   ───────────────────────────────────────── */
export function BrowserFrame({
  url,
  children,
  scale = 0.5,
}: {
  url: string
  children: React.ReactNode
  scale?: number
}) {
  const innerW = 760
  const innerH = 440
  const outerW = innerW * scale
  const outerH = innerH * scale
  const chromeH = 34

  return (
    <div
      style={{
        width: outerW,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3)",
        background: "#181c2e",
        flexShrink: 0,
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Chrome bar */}
      <div
        style={{
          height: chromeH,
          background: "#252a3d",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 5,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#28ca41" }} />
        <div
          style={{
            flex: 1,
            height: 17,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
            marginLeft: 8,
            padding: "0 8px",
            display: "flex",
            alignItems: "center",
            fontSize: 9,
            color: "rgba(255,255,255,0.3)",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {url}
        </div>
      </div>

      {/* Content (scaled) */}
      <div
        style={{
          width: outerW,
          height: outerH,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: innerW,
            height: innerH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   6 Mini-Sites
   ───────────────────────────────────────── */

function MiniClinic() {
  return (
    <div style={{ width: 760, height: 440, background: "linear-gradient(135deg,#fdf2f8,#fff5f9 60%,#fff)", fontFamily: "Georgia,serif" }}>
      <div style={{ height: 56, background: "#fff", borderBottom: "1px solid #fce7f3", display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#be185d", letterSpacing: -0.5 }}>✦ BeautyClinic</span>
        <div style={{ display: "flex", gap: 24, fontSize: 14, color: "#9ca3af" }}><span>Serviços</span><span>Sobre</span><span>Contato</span></div>
        <button style={{ background: "#be185d", color: "#fff", padding: "8px 20px", borderRadius: 24, border: "none", fontSize: 14, fontWeight: 600 }}>Agendar</button>
      </div>
      <div style={{ display: "flex", padding: "40px", gap: 40, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <span style={{ background: "#fce7f3", color: "#9d174d", padding: "6px 16px", borderRadius: 24, fontSize: 13, fontWeight: 600 }}>✦ Cuidado especializado</span>
          <h1 style={{ fontSize: 52, fontWeight: 700, color: "#111", lineHeight: 1.1, margin: "16px 0 14px" }}>Sua beleza<br/>em boas mãos</h1>
          <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 24, lineHeight: 1.5 }}>Tratamentos estéticos avançados com resultados comprovados.</p>
          <button style={{ background: "#be185d", color: "#fff", padding: "14px 32px", borderRadius: 32, border: "none", fontSize: 16, fontWeight: 600 }}>Agendar consulta →</button>
          <div style={{ marginTop: 22, display: "flex", gap: 24, fontSize: 13, color: "#9d174d" }}>
            <span>✓ 500+ clientes</span><span>✓ 5 estrelas</span><span>✓ 10 anos</span>
          </div>
        </div>
        <div style={{ width: 260, height: 260, background: "linear-gradient(135deg,#fbcfe8,#ec4899)", borderRadius: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>
    </div>
  )
}

function MiniRestaurant() {
  return (
    <div style={{ width: 760, height: 440, background: "#0d0805", fontFamily: "Georgia,serif" }}>
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#d97706", letterSpacing: 2 }}>LA CUCINA</span>
        <div style={{ display: "flex", gap: 24, fontSize: 14, color: "rgba(255,255,255,0.45)" }}><span>Cardápio</span><span>Reservas</span><span>Sobre</span></div>
      </div>
      <div style={{ display: "flex", padding: "40px", gap: 40, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <span style={{ background: "rgba(217,119,6,0.2)", color: "#d97706", padding: "6px 16px", borderRadius: 24, fontSize: 13, fontWeight: 600 }}>Desde 1998 · Reservas abertas</span>
          <h1 style={{ fontSize: 50, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "16px 0 14px" }}>Uma experiência<br/>gastronômica única</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.5 }}>Culinária italiana autêntica no coração da cidade.</p>
          <div style={{ display: "flex", gap: 14 }}>
            <button style={{ background: "#d97706", color: "#fff", padding: "13px 28px", borderRadius: 32, border: "none", fontSize: 15, fontWeight: 600 }}>Reservar mesa</button>
            <button style={{ background: "transparent", color: "#d97706", padding: "13px 28px", borderRadius: 32, border: "1px solid #d97706", fontSize: 15 }}>Ver cardápio</button>
          </div>
        </div>
        <div style={{ width: 240, height: 260, background: "linear-gradient(135deg,#92400e,#d97706)", borderRadius: 24, flexShrink: 0, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(13,8,5,0.6))" }} />
          <div style={{ position: "absolute", bottom: 16, left: 16, color: "#fff", fontSize: 14, fontWeight: 600 }}>Prato do dia</div>
        </div>
      </div>
    </div>
  )
}

function MiniLaw() {
  return (
    <div style={{ width: 760, height: 440, background: "#0c1220", fontFamily: "Georgia,serif" }}>
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#d4af37", letterSpacing: 1.5 }}>OLIVEIRA &amp; ASSOCIADOS</span>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.4)" }}><span>Áreas</span><span>Equipe</span><span>Contato</span></div>
        <button style={{ background: "transparent", color: "#d4af37", padding: "7px 18px", borderRadius: 4, border: "1px solid #d4af37", fontSize: 13 }}>Consulta gratuita</button>
      </div>
      <div style={{ display: "flex", padding: "40px", gap: 40, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <span style={{ color: "rgba(212,175,55,0.7)", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" }}>Escritório boutique · Desde 1995</span>
          <h1 style={{ fontSize: 46, fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "14px 0 14px" }}>Soluções jurídicas<br/>para empresas<br/>e pessoas</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginBottom: 28, lineHeight: 1.6 }}>Advocacia especializada com foco em resultados concretos para nossos clientes.</p>
          <button style={{ background: "#d4af37", color: "#0c1220", padding: "13px 28px", borderRadius: 4, border: "none", fontSize: 14, fontWeight: 700 }}>Consulta gratuita →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
          {["Direito Empresarial","Direito Trabalhista","Direito Imobiliário","Planejamento Tributário"].map(a => (
            <div key={a} style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 8, padding: "12px 20px", fontSize: 14, color: "rgba(255,255,255,0.7)", minWidth: 220 }}>
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniEcommerce() {
  const products = [
    { name: "Tênis Urban", price: "R$ 249", color: "#6d28d9" },
    { name: "Mochila Pro",  price: "R$ 189", color: "#0891b2" },
    { name: "Relógio Slim", price: "R$ 399", color: "#059669" },
  ]
  return (
    <div style={{ width: 760, height: 440, background: "#fff", fontFamily: "Arial,sans-serif" }}>
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#7c3aed", letterSpacing: -0.5 }}>BOUTIQ</span>
        <div style={{ display: "flex", gap: 24, fontSize: 14, color: "#6b7280" }}><span>Feminino</span><span>Masculino</span><span>Sale</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="18" height="18" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <div style={{ position: "relative" }}>
            <svg width="18" height="18" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            <div style={{ position: "absolute", top: -6, right: -6, width: 14, height: 14, background: "#7c3aed", borderRadius: "50%", fontSize: 8, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>2</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "24px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>Novidades da Semana</h2>
          <a style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600 }}>Ver tudo →</a>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {products.map(p => (
            <div key={p.name} style={{ flex: 1, borderRadius: 16, overflow: "hidden", border: "1px solid #f3f4f6", background: "#fafafa" }}>
              <div style={{ height: 160, background: `linear-gradient(135deg,${p.color}22,${p.color}55)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: p.color, opacity: 0.7 }} />
              </div>
              <div style={{ padding: "12px 14px" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 4 }}>{p.name}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: p.color }}>{p.price}</p>
                <button style={{ marginTop: 10, width: "100%", background: p.color, color: "#fff", padding: "8px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600 }}>Adicionar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniGym() {
  return (
    <div style={{ width: 760, height: 440, background: "#080808", fontFamily: "'Arial Black',sans-serif" }}>
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between" }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#f97316", letterSpacing: 3 }}>IRON GYM</span>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.4)" }}><span>Planos</span><span>Modalidades</span><span>Personal</span></div>
        <button style={{ background: "#f97316", color: "#fff", padding: "8px 20px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>MATRICULAR</button>
      </div>
      <div style={{ padding: "24px 40px 0" }}>
        <span style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", padding: "5px 14px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 3 }}>MATRICULE-SE HOJE</span>
        <h1 style={{ fontSize: 64, fontWeight: 900, color: "#fff", lineHeight: 1, margin: "12px 0 6px", textTransform: "uppercase", letterSpacing: -1 }}>TRANS<span style={{ color: "#f97316" }}>FORME</span><br/>SEU CORPO</h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 22 }}>+3.000 alunos transformados. Comece hoje mesmo.</p>
        <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
          <button style={{ background: "#f97316", color: "#fff", padding: "13px 32px", borderRadius: 6, border: "none", fontSize: 15, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>Começar agora</button>
          <button style={{ background: "transparent", color: "#fff", padding: "13px 24px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", fontSize: 15 }}>Ver planos</button>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[["3K+","Alunos"],["5","Anos"],["12","Modalidades"],["100%","Satisfação"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#f97316" }}>{n}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniConstrutora() {
  return (
    <div style={{ width: 760, height: 440, background: "#0f1e2e", fontFamily: "Arial,sans-serif" }}>
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 2 }}>CONSTRUTEK</span>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.4)" }}><span>Projetos</span><span>Serviços</span><span>Contato</span></div>
        <button style={{ background: "#2563eb", color: "#fff", padding: "7px 18px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600 }}>Solicitar orçamento</button>
      </div>
      <div style={{ display: "flex", padding: "32px 40px", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <span style={{ color: "#2563eb", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>+25 anos de experiência</span>
          <h1 style={{ fontSize: 46, fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "12px 0 12px" }}>Construindo<br/>o seu futuro<br/><span style={{ color: "#2563eb" }}>com solidez</span></h1>
          <button style={{ background: "#2563eb", color: "#fff", padding: "13px 28px", borderRadius: 6, border: "none", fontSize: 14, fontWeight: 700 }}>Ver portfólio →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
          {["Construção Residencial","Reformas Comerciais","Arquitetura & Design"].map((p,i) => (
            <div key={p} style={{ width: 240, height: 80, borderRadius: 12, overflow: "hidden", position: "relative", background: `linear-gradient(135deg, hsl(${210+i*20},60%,${20+i*5}%), hsl(${200+i*20},50%,${30+i*5}%))` }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.3))" }} />
              <div style={{ position: "absolute", bottom: 10, left: 14, color: "#fff", fontSize: 13, fontWeight: 600 }}>{p}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Dados do showcase
   ───────────────────────────────────────── */
const sites = [
  { url: "clinica.orthdigital.com.br",     label: "Clínica Estética",       Component: MiniClinic },
  { url: "restaurante.orthdigital.com.br", label: "Restaurante",            Component: MiniRestaurant },
  { url: "advocacia.orthdigital.com.br",   label: "Advocacia",              Component: MiniLaw },
  { url: "loja.orthdigital.com.br",        label: "E-commerce",             Component: MiniEcommerce },
  { url: "academia.orthdigital.com.br",    label: "Academia / Personal",   Component: MiniGym },
  { url: "construtora.orthdigital.com.br", label: "Construtora / Imóveis", Component: MiniConstrutora },
]

/* ─────────────────────────────────────────
   Showcase section
   ───────────────────────────────────────── */
export function Showcase() {
  const doubled = [...sites, ...sites] // duplicar para marquee seamless

  return (
    <section id="showcase" className="py-24 bg-orth-navy overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="text-center px-5 mb-16"
      >
        <span className="inline-block text-orth-electric text-sm font-semibold tracking-widest uppercase mb-4">
          Portfólio
        </span>
        <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] text-white leading-tight mb-4">
          Sites que já entregamos
        </h2>
        <p className="text-orth-muted text-lg max-w-2xl mx-auto">
          Cada projeto é desenvolvido com a identidade única do cliente.
          Veja como adaptamos o design para diferentes segmentos.
        </p>
      </motion.div>

      {/* Marquee row */}
      <div className="marquee-wrapper relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-orth-navy to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-orth-navy to-transparent z-10 pointer-events-none" />

        <div
          className="marquee-track flex gap-6"
          style={{ animation: "marquee 44s linear infinite", width: "max-content" }}
        >
          {doubled.map((site, i) => (
            <div key={i} className="group relative">
              {/* Label badge */}
              <div className="absolute -top-9 left-0 right-0 flex justify-center pointer-events-none z-20">
                <span className="bg-orth-blue/80 text-orth-sky text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {site.label}
                </span>
              </div>
              {/* Frame */}
              <div className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
                <BrowserFrame url={site.url} scale={0.5}>
                  <site.Component />
                </BrowserFrame>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA below */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mt-16 px-5"
      >
        <p className="text-orth-muted mb-6">
          O seu segmento não está na lista? Sem problema — atendemos qualquer nicho.
        </p>
        <a
          href="#contato"
          className="inline-flex items-center gap-2 bg-orth-electric hover:bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 hover:shadow-[0_0_32px_rgba(37,99,235,0.5)] cursor-pointer"
        >
          Quero um site para o meu negócio
        </a>
      </motion.div>
    </section>
  )
}
