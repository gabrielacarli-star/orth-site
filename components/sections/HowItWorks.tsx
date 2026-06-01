"use client"

import { motion } from "framer-motion"
import { MessageSquare, Palette, CheckCircle, Rocket } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Briefing",
    body: "Você preenche um formulário rápido com informações sobre a sua empresa, referências e objetivos. Sem reuniões longas.",
    detail: "≈ 15 minutos da sua parte",
  },
  {
    icon: Palette,
    number: "02",
    title: "Criação",
    body: "A nossa equipa entra em ação: design, desenvolvimento, textos e SEO. Você descansa enquanto trabalhamos.",
    detail: "24–48 horas de trabalho",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Aprovação",
    body: "Apresentamos o site finalizado para você revisar. Ajustes incluídos — só publicamos quando estiver 100% satisfeito.",
    detail: "Revisões ilimitadas",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Site no ar",
    body: "Publicamos o seu site com domínio, hospedagem configurada e HTTPS ativo. Do briefing ao ar em até 72 horas.",
    detail: "Prazo máximo: 72 horas",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-orth-cream">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-orth-electric text-sm font-semibold tracking-widest uppercase mb-4">
            Como funciona
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] text-orth-dark leading-tight mb-4">
            Do zero ao site no ar<br className="hidden sm:block" /> em 4 passos simples
          </h2>
          <p className="text-orth-muted text-lg max-w-2xl mx-auto">
            Criamos um processo enxuto para que você perca o mínimo de tempo
            e receba o máximo de resultado.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-orth-line" aria-hidden="true" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map(({ icon: Icon, number, title, body, detail }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" as const }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Circle icon */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-white border-2 border-orth-electric/30 flex items-center justify-center shadow-sm">
                    <Icon size={32} className="text-orth-electric" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-orth-electric text-white text-xs font-bold flex items-center justify-center shadow">
                    {number}
                  </span>
                </div>

                <h3 className="text-orth-dark font-bold text-xl mb-2">{title}</h3>
                <p className="text-orth-muted text-sm leading-relaxed mb-3">{body}</p>
                <span className="inline-block bg-orth-electric/10 text-orth-electric text-xs font-semibold px-3 py-1.5 rounded-full">
                  {detail}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
