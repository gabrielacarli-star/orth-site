"use client"

import { motion } from "framer-motion"
import { EyeOff, TrendingDown, UserX } from "lucide-react"

const pains = [
  {
    icon: EyeOff,
    title: "Invisível no Google",
    body: "Sem site profissional, sua empresa simplesmente não aparece quando um cliente pesquisa. Você perde vendas todos os dias para concorrentes que estão online.",
  },
  {
    icon: UserX,
    title: "Credibilidade comprometida",
    body: "Hoje, o site é o cartão de visita digital. Um site desatualizado, lento ou com design pobre transmite falta de profissionalismo — e o cliente vai embora sem avisar.",
  },
  {
    icon: TrendingDown,
    title: "Crescimento limitado",
    body: "Depender só de indicações e redes sociais tem teto. Um site bem construído trabalha por você 24h, captura leads e converte visitantes em clientes — mesmo enquanto você dorme.",
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
}

export function Problem() {
  return (
    <section className="py-24 bg-orth-cream">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-orth-electric text-sm font-semibold tracking-widest uppercase mb-4">
            O problema
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] text-orth-dark leading-tight mb-4">
            Sem um site profissional,<br className="hidden sm:block" /> a sua empresa está perdendo dinheiro
          </h2>
          <p className="text-orth-muted text-lg max-w-2xl mx-auto">
            Não estamos a ser dramáticos. Estes são os efeitos reais de não ter uma presença digital de qualidade.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {pains.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={item}
              className="group bg-white rounded-2xl p-8 border border-orth-line shadow-sm hover:shadow-md hover:border-orth-electric/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                <Icon size={24} className="text-red-500" />
              </div>
              <h3 className="text-orth-dark font-bold text-xl mb-3">{title}</h3>
              <p className="text-orth-muted leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bridge to solution */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 text-orth-dark/70 text-lg"
        >
          A boa notícia? A ORTH resolve tudo isso —{" "}
          <span className="font-semibold text-orth-electric">em até 72 horas.</span>
        </motion.p>
      </div>
    </section>
  )
}
