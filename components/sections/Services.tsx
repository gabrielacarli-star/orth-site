"use client"

import { motion } from "framer-motion"
import { Zap, Smartphone, Search, TrendingUp, Headphones, Shield } from "lucide-react"

const services = [
  {
    icon: Zap,
    title: "Entrega em 72h",
    body: "Do briefing ao site no ar em até 72 horas. Sem enrolação, sem meses de espera. Para ontem é amanhã.",
    accent: "#2563EB",
  },
  {
    icon: Smartphone,
    title: "100% Responsivo",
    body: "Perfeito em qualquer ecrã: celular, tablet ou desktop. Nenhum cliente seu vai ver uma versão quebrada.",
    accent: "#0891b2",
  },
  {
    icon: Search,
    title: "SEO Otimizado",
    body: "Código semântico, velocidade de carregamento e estrutura que o Google adora — para a sua empresa aparecer nas buscas.",
    accent: "#059669",
  },
  {
    icon: TrendingUp,
    title: "Foco em Conversão",
    body: "Design estratégico com CTAs bem posicionados, copywriting persuasivo e layout que transforma visitantes em clientes.",
    accent: "#d97706",
  },
  {
    icon: Headphones,
    title: "Suporte Incluído",
    body: "Não entregamos e desaparecemos. Ficamos ao seu lado com suporte rápido para ajustes e dúvidas após a entrega.",
    accent: "#7c3aed",
  },
  {
    icon: Shield,
    title: "Segurança & Performance",
    body: "HTTPS, hosting rápido, Lighthouse 90+. O seu site carrega rápido e transmite confiança ao visitante.",
    accent: "#be185d",
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export function Services() {
  return (
    <section id="servicos" className="py-24 bg-orth-dark">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-orth-electric text-sm font-semibold tracking-widest uppercase mb-4">
            O que entregamos
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] text-white leading-tight mb-4">
            Tudo o que o seu site precisa,<br className="hidden sm:block" /> em um único pacote
          </h2>
          <p className="text-orth-muted text-lg max-w-2xl mx-auto">
            Não vendemos templates. Criamos sites sob medida, com cada detalhe pensado
            para representar a sua marca e converter visitantes.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map(({ icon: Icon, title, body, accent }) => (
            <motion.div
              key={title}
              variants={item}
              className="group relative bg-orth-navy/50 border border-orth-blue/20 rounded-2xl p-7 hover:border-orth-electric/40 hover:bg-orth-navy/70 transition-all duration-300 cursor-default"
            >
              {/* Top accent line on hover */}
              <div
                className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
              >
                <Icon size={22} style={{ color: accent }} />
              </div>

              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-orth-muted leading-relaxed text-sm">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
