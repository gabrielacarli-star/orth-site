"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const stats = [
  { value: 100, suffix: "+", label: "Sites entregues",      sub: "e crescendo todo mês" },
  { value: 72,  suffix: "h", label: "Prazo de entrega",     sub: "sem abrir mão da qualidade" },
  { value: 100, suffix: "%", label: "Satisfação garantida", sub: "ou refazemos sem custo" },
  { value: 5,   suffix: "★", label: "Avaliação média",      sub: "em todas as plataformas" },
]

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const start = performance.now()
          const step = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            setCount(Math.round(ease * to))
            if (t < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export function Stats() {
  return (
    <section className="py-20 bg-orth-dark border-y border-orth-blue/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Brasil + Portugal badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-4 mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-orth-navy border border-orth-blue/30 px-5 py-2.5 rounded-full text-sm font-medium text-white">
            <span className="text-lg">🇧🇷</span> Atendemos no Brasil
          </span>
          <span className="inline-flex items-center gap-2 bg-orth-navy border border-orth-blue/30 px-5 py-2.5 rounded-full text-sm font-medium text-white">
            <span className="text-lg">🇵🇹</span> Atendemos em Portugal
          </span>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.12 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              className="relative group bg-orth-navy/60 border border-orth-blue/20 rounded-2xl px-6 py-8 text-center hover:border-orth-electric/40 transition-all duration-300 hover:bg-orth-navy/80"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: "inset 0 0 40px rgba(37,99,235,0.08)" }} />

              <div className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none text-orth-electric font-bold mb-2">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="text-white font-semibold text-base mb-1">{s.label}</p>
              <p className="text-orth-muted text-sm">{s.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
