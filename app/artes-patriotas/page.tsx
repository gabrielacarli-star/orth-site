import type { Metadata } from "next"
import {
  Check,
  Smartphone,
  Download,
  Pencil,
  Send,
  Gift,
  ShieldCheck,
  Clock,
  Image as ImageIcon,
  Flag,
} from "lucide-react"
import { Countdown } from "./Countdown"

/* ════════════════════════════════════════════════════════════
   CONFIGURAÇÃO DA OFERTA — troque aqui preço, link e textos.
   Itens marcados com TODO ainda dependem das artes de divulgação.
   ════════════════════════════════════════════════════════════ */
const OFERTA = {
  nome: "Pack Brasil 2º Turno",
  precoDe: "TODO", // ex.: "97,00"
  precoPor: "TODO", // ex.: "27,90"
  parcelas: "", // ex.: "ou 3x de R$ 9,90"
  checkoutUrl: "#comprar", // TODO: link da Kiwify / Hotmart / Mercado Pago
  qtdArtes: "TODO", // ex.: "+150"
  // 2º turno: último domingo de outubro, urnas abrem às 8h (Brasília)
  dataSegundoTurno: "2026-10-25T08:00:00-03:00",
}

export const metadata: Metadata = {
  title: `${OFERTA.nome} — Artes Patrióticas Editáveis`,
  description:
    "Pack de artes patrióticas editáveis no Canva para posts, stories e status. Edite pelo celular e poste em minutos durante o segundo turno.",
  openGraph: {
    title: `${OFERTA.nome} — Artes Patrióticas Editáveis`,
    description: "Edite no celular, pelo Canva, e poste em minutos. Acesso imediato.",
    locale: "pt_BR",
    type: "website",
  },
}

const VERDE = "#009C3B"
const AMARELO = "#FFDF00"
const AZUL = "#002776"

const CONTEUDO = [
  { titulo: "Posts para o feed", desc: "Formato 1080×1350, prontos para Instagram e Facebook." },
  { titulo: "Stories e status", desc: "1080×1920 para Instagram, WhatsApp e TikTok." },
  { titulo: "Contagem regressiva", desc: "“Faltam X dias” para postar todo dia até a votação." },
  { titulo: "Dia da votação", desc: "“Hoje é dia de votar”, “Eu já votei” e convocação." },
  { titulo: "Frases e citações", desc: "Layouts para frases sobre Deus, pátria e família." },
  { titulo: "Capas e banners", desc: "Capa de Facebook, banner de YouTube e destaque do Instagram." },
]

const BONUS = [
  { titulo: "Molduras para foto de perfil", desc: "Coloque a sua foto dentro da moldura verde e amarela." },
  { titulo: "Figurinhas para WhatsApp", desc: "Pacote de figurinhas patrióticas para os grupos." },
  { titulo: "Banco de legendas prontas", desc: "Textos para copiar e colar junto com cada arte." },
  { titulo: "Artes de pós-eleição", desc: "Agradecimento e mensagens para depois do resultado." },
]

const PASSOS = [
  { icon: Download, titulo: "Compre", desc: "Pagamento por Pix ou cartão. O acesso chega na hora no seu e-mail." },
  { icon: Pencil, titulo: "Edite", desc: "Abra no Canva (gratuito), troque texto, foto e cores pelo celular." },
  { icon: Send, titulo: "Poste", desc: "Baixe em alta qualidade e publique nas redes e nos grupos." },
]

const FAQ = [
  {
    p: "Preciso pagar o Canva?",
    r: "Não. Todas as artes funcionam na versão gratuita do Canva, no celular ou no computador.",
  },
  {
    p: "Como recebo o acesso?",
    r: "Assim que o pagamento é aprovado você recebe um e-mail com o link de acesso a todas as artes. No Pix, a aprovação é imediata.",
  },
  {
    p: "Sei pouco de tecnologia. Vou conseguir editar?",
    r: "Sim. É só tocar no texto para trocar a frase e tocar na foto para substituir. Junto com o pack vai um vídeo curto mostrando o passo a passo.",
  },
  {
    p: "Posso usar no meu comércio, grupo ou movimento?",
    r: "Pode. As artes são para uso nas suas redes, grupos e páginas. Só não é permitido revender o pack.",
  },
  {
    p: "E se eu não gostar?",
    r: "Você tem 7 dias de garantia. Se não gostar, devolvemos 100% do valor, sem perguntas.",
  },
]

function BotaoComprar({ className = "" }: { className?: string }) {
  return (
    <a
      href={OFERTA.checkoutUrl}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-extrabold uppercase tracking-wide text-[#002776] shadow-[0_6px_0_#b89f00] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none ${className}`}
      style={{ backgroundColor: AMARELO }}
    >
      Quero meu pack agora
    </a>
  )
}

function Faixa() {
  return (
    <div className="flex h-2 w-full">
      <div className="flex-1" style={{ backgroundColor: VERDE }} />
      <div className="flex-1" style={{ backgroundColor: AMARELO }} />
      <div className="flex-1" style={{ backgroundColor: AZUL }} />
    </div>
  )
}

export default function ArtesPatriotasPage() {
  return (
    <div className="bg-white text-slate-900">
      {/* Barra de urgência */}
      <div className="px-4 py-2 text-center text-sm font-semibold text-white" style={{ backgroundColor: AZUL }}>
        <Clock className="mr-1 inline h-4 w-4 -translate-y-px" />
        Oferta especial de segundo turno — válida até a votação
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 text-white" style={{ backgroundColor: VERDE }}>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-12 opacity-20"
          style={{ background: `linear-gradient(135deg, transparent 35%, ${AMARELO} 35%, ${AMARELO} 65%, transparent 65%)` }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">
              <Flag className="h-4 w-4" /> Fomos para o segundo turno
            </span>
            <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Vista suas redes de <span style={{ color: AMARELO }}>verde e amarelo</span> até o dia da votação
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              {OFERTA.qtdArtes} artes patrióticas editáveis no Canva. Troque a frase, coloque sua foto e poste em
              minutos, direto do celular.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <BotaoComprar />
              <span className="flex items-center gap-2 text-sm text-white/85">
                <ShieldCheck className="h-5 w-5" /> Acesso imediato · 7 dias de garantia
              </span>
            </div>
          </div>

          {/* TODO: substituir pelos mockups das artes de divulgação (salvar em /public/artes-patriotas/) */}
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex aspect-[4/5] items-center justify-center rounded-xl border-2 border-white/40 bg-white/10 ${i % 2 ? "lg:translate-y-6" : ""}`}
              >
                <ImageIcon className="h-8 w-8 text-white/50" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Faixa />

      {/* CONTAGEM */}
      <section className="px-4 py-10 text-white" style={{ backgroundColor: AZUL }}>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold">Faltam para o segundo turno:</p>
          <Countdown alvoISO={OFERTA.dataSegundoTurno} />
          <p className="max-w-xl text-white/75">
            Cada dia sem postar é um dia a menos de presença nas redes. Comece hoje.
          </p>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl">Quer participar, mas não sabe criar arte?</h2>
          <p className="mt-5 text-lg text-slate-600">
            Montar uma arte bonita do zero leva tempo, e na reta final da eleição tempo é o que falta. Com o pack você
            pega um modelo pronto, muda o que quiser e publica. Sem designer, sem programa pago, sem complicação.
          </p>
        </div>
      </section>

      {/* O QUE VEM */}
      <section className="bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl sm:text-4xl">O que vem no pack</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CONTEUDO.map((c) => (
              <div key={c.titulo} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ backgroundColor: VERDE }}>
                    <Check className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold">{c.titulo}</h3>
                </div>
                <p className="mt-3 text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl sm:text-4xl">Simples assim</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PASSOS.map((p, i) => (
              <div key={p.titulo} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: AZUL }}>
                  <p.icon className="h-8 w-8" />
                </div>
                <p className="mt-4 text-sm font-bold uppercase tracking-wider" style={{ color: VERDE }}>
                  Passo {i + 1}
                </p>
                <h3 className="text-xl font-bold">{p.titulo}</h3>
                <p className="mt-2 text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 flex items-center justify-center gap-2 text-slate-500">
            <Smartphone className="h-5 w-5" /> Funciona 100% pelo celular
          </p>
        </div>
      </section>

      {/* BÔNUS */}
      <section className="px-4 py-16" style={{ backgroundColor: AMARELO }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl text-[#002776] sm:text-4xl">
            <Gift className="mr-2 inline h-8 w-8 -translate-y-1" />
            Bônus para quem comprar hoje
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {BONUS.map((b) => (
              <div key={b.titulo} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#002776]">{b.titulo}</h3>
                <p className="mt-2 text-slate-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section id="comprar" className="px-4 py-20" style={{ backgroundColor: AZUL }}>
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-wider" style={{ color: VERDE }}>
            {OFERTA.nome}
          </p>
          <ul className="mt-6 space-y-2 text-left">
            {[...CONTEUDO, ...BONUS].map((item) => (
              <li key={item.titulo} className="flex items-start gap-2">
                <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: VERDE }} />
                <span>{item.titulo}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <p className="text-slate-500 line-through">De R$ {OFERTA.precoDe}</p>
            <p className="font-display text-6xl text-[#002776]">
              <span className="align-top text-2xl">R$</span> {OFERTA.precoPor}
            </p>
            {OFERTA.parcelas && <p className="text-slate-600">{OFERTA.parcelas}</p>}
          </div>
          <BotaoComprar className="mt-8 w-full" />
          <p className="mt-4 text-sm text-slate-500">Pix ou cartão · Acesso imediato por e-mail</p>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="px-4 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-4 text-[#002776]" style={{ borderColor: VERDE }}>
            <span className="text-4xl font-extrabold leading-none">7</span>
            <span className="text-xs font-bold uppercase">dias</span>
          </div>
          <div>
            <h2 className="font-display text-3xl">Garantia incondicional</h2>
            <p className="mt-3 text-slate-600">
              Compre, abra, edite. Se em até 7 dias achar que não valeu a pena, devolvemos todo o seu dinheiro. O risco
              é todo nosso.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl sm:text-4xl">Perguntas frequentes</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <details key={f.p} className="group rounded-2xl border border-slate-200 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {f.p}
                  <span className="ml-4 text-2xl leading-none transition-transform group-open:rotate-45" style={{ color: VERDE }}>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-slate-600">{f.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 py-16 text-center text-white" style={{ backgroundColor: VERDE }}>
        <h2 className="mx-auto max-w-2xl font-display text-3xl sm:text-4xl">
          O segundo turno é agora. Suas redes já estão prontas?
        </h2>
        <BotaoComprar className="mt-8" />
      </section>
      <Faixa />

      <footer className="px-4 py-8 text-center text-xs text-slate-500">
        Produto digital de design gráfico. Não possui vínculo com partidos, candidatos ou com a Justiça Eleitoral.
      </footer>
    </div>
  )
}
