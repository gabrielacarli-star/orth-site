"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { WA_BR, WA_PT } from "@/lib/constants"

export function FinalCTA() {
  return (
    <section id="contato" className="relative py-28 bg-orth-dark overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orth-electric/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orth-blue/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orth-blue/20 rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#7CB3FF 1px, transparent 1px), linear-gradient(90deg, #7CB3FF 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-orth-electric/15 border border-orth-electric/30 text-orth-sky text-sm font-semibold px-5 py-2 rounded-full mb-8">
            Vagas abertas para este mês
          </span>

          {/* Headline */}
          <h2 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] text-white leading-[1.05] mb-6">
            O seu site profissional<br />
            pode estar no ar<br />
            <span className="gradient-text">ainda esta semana.</span>
          </h2>

          <p className="text-orth-muted text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Solicite um orçamento gratuito agora. Sem compromisso, sem surpresas —
            só uma conversa rápida para percebermos como podemos ajudar o seu negócio.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href={WA_BR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-orth-electric hover:bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] cursor-pointer"
            >
              <WAIcon />
              🇧🇷 Solicitar orçamento — Brasil
              <ArrowRight size={18} />
            </a>
            <a
              href={WA_PT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 border-2 border-orth-electric/50 hover:border-orth-electric text-white hover:text-orth-sky font-bold text-base px-8 py-4 rounded-full transition-all duration-200 cursor-pointer"
            >
              <WAIcon />
              🇵🇹 Solicitar orçamento — Portugal
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-orth-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orth-electric inline-block" />
              Resposta em menos de 1 hora
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orth-electric inline-block" />
              Orçamento 100% gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orth-electric inline-block" />
              Entrega garantida em 72h
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function WAIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.77 9.77 0 01-5.031-1.392l-.361-.214-3.753.979.999-3.648-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  )
}
