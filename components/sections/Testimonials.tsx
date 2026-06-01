"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

/*
  ⚠️  SUBSTITUIR pelos depoimentos reais dos clientes.
      Cada entrada deve ter: nome, cargo/empresa, texto, resultado mensurável.
*/
const testimonials = [
  {
    name: "Fernanda Oliveira",
    role: "Proprietária · Clínica Renovare",
    avatar: "FO",
    avatarBg: "#be185d",
    text: "Estava há meses tentando montar um site e sempre adiava por achar complicado. A ORTH entregou algo que eu não esperava em 48 horas. Minha clínica dobrou os agendamentos online no primeiro mês.",
    result: "+112% em agendamentos online",
    stars: 5,
  },
  {
    name: "Ricardo Mendes",
    role: "Sócio-diretor · Mendes & Advogados",
    avatar: "RM",
    avatarBg: "#1B3A8A",
    text: "Como advogado, credibilidade é tudo. O site que a ORTH criou transmite exatamente a seriedade que precisávamos. Já tivemos clientes que chegaram diretamente pelo site dizendo que 'parecia o escritório mais profissional da cidade'.",
    result: "3 novos clientes no 1.º mês via site",
    stars: 5,
  },
  {
    name: "Tiago Costa",
    role: "Fundador · TechFit Academia",
    avatar: "TC",
    avatarBg: "#f97316",
    text: "Rapidez impressionante. Em menos de 3 dias tínhamos um site que parecia feito por uma agência grande. O formulário de matrícula online já trouxe 27 novos alunos nas primeiras duas semanas.",
    result: "27 novas matrículas em 2 semanas",
    stars: 5,
  },
]

const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
}

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-orth-dark">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-orth-electric text-sm font-semibold tracking-widest uppercase mb-4">
            Depoimentos
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] text-white leading-tight mb-4">
            Quem já confiou na ORTH
          </h2>
          <p className="text-orth-muted text-lg max-w-xl mx-auto">
            Resultados reais de clientes reais. Estes são alguns que aceitaram compartilhar.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.14 }}
          className="grid md:grid-cols-3 gap-7"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="relative bg-orth-navy/60 border border-orth-blue/20 rounded-2xl p-8 flex flex-col hover:border-orth-electric/30 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote size={28} className="text-orth-electric/40 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" className="text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-white/85 leading-relaxed text-sm flex-1 mb-6">
                "{t.text}"
              </p>

              {/* Result badge */}
              <div className="bg-orth-electric/10 border border-orth-electric/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-orth-electric text-xs font-bold tracking-wide">
                  Resultado: {t.result}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: t.avatarBg }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-orth-muted text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
