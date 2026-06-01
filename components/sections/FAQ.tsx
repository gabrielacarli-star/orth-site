"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    q: "As 72 horas são mesmo reais?",
    a: "Sim. O prazo de 72 horas é a nossa promessa central. Para isso, precisamos que você preencha o briefing de forma completa — quanto mais informação nos der, mais rápidos somos. Em casos muito simples, entregamos ainda antes.",
  },
  {
    q: "E se eu não gostar do resultado?",
    a: "Incluímos revisões no processo. Se após as revisões ainda não estiver satisfeito, trabalhamos até que fique. A nossa reputação vale mais do que qualquer projeto, por isso não descansamos enquanto você não aprovar.",
  },
  {
    q: "Preciso de domínio e hospedagem? Isso está incluído?",
    a: "Se já tiver domínio e hospedagem, usamos os seus. Se precisar, ajudamos a contratar e configurar tudo — ou podemos incluir no pacote dependendo da opção escolhida. Cuidamos de toda a parte técnica para que não precise se preocupar.",
  },
  {
    q: "Como funciona o processo de orçamento?",
    a: "É simples: clica no botão de WhatsApp, envia-nos informações básicas sobre o seu negócio, e devolvemos uma proposta personalizada em poucas horas — sem compromisso e sem custo. Não há formulários complicados nem reuniões obrigatórias.",
  },
  {
    q: "Posso editar o site depois que estiver pronto?",
    a: "Sim. Entregamos o site com acesso para que possa fazer edições básicas (textos, imagens, telefones) de forma simples. Para alterações maiores de design ou estrutura, a nossa equipa está disponível com planos de manutenção.",
  },
  {
    q: "Atendem empresas em Portugal da mesma forma que no Brasil?",
    a: "Exatamente igual. Trabalhamos 100% de forma remota e temos experiência com clientes nos dois países. O processo é o mesmo, os prazos são os mesmos, e a qualidade também.",
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="border-b border-orth-line last:border-none"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="text-orth-dark font-semibold text-base group-hover:text-orth-electric transition-colors">
          {q}
        </span>
        <span className="mt-0.5 flex-shrink-0 text-orth-electric">
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" as const }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-orth-muted leading-relaxed text-sm pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-orth-cream">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-orth-electric text-sm font-semibold tracking-widest uppercase mb-4">
            Dúvidas frequentes
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] text-orth-dark leading-tight mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-orth-muted text-lg">
            Respostas directas para as dúvidas que toda gente tem antes de contratar.
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl border border-orth-line shadow-sm px-6 sm:px-10 py-2">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-orth-muted text-sm mt-8"
        >
          Ainda tem dúvidas?{" "}
          <a
            href="https://wa.me/5511933414950"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orth-electric hover:underline font-semibold cursor-pointer"
          >
            Fale connosco pelo WhatsApp
          </a>{" "}
          — respondemos em minutos.
        </motion.p>
      </div>
    </section>
  )
}
