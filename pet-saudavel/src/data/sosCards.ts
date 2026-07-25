// =========================================================================
// Fichas de emergência (SOS): metadados públicos
// -------------------------------------------------------------------------
// Só título, resumo e ícone ficam aqui (dentro do pacote do app). O passo
// a passo real (sinais, passos, nunca faça, leve ao veterinário) mora no
// banco, protegido por RLS, e só é entregue pela Edge Function
// "sos-conteudo" depois de conferir que o usuário tem compra ativa.
// Ver supabase/migrations/0003_travar_sos.sql e
// supabase/functions/sos-conteudo/index.ts.
//
// Fonte do conteúdo: "Primeiros Socorros para Cães e Gatos", guia escrito
// pelo Dr. Eduardo Sebastião (CRMV-MT 6412).
// =========================================================================

export interface SosCardMeta {
  slug: string
  titulo: string
  resumo: string
  icone: string // emoji, leve e universal
}

export const SOS_CARDS: SosCardMeta[] = [
  {
    slug: "engasgo",
    titulo: "Engasgo e obstrução das vias aéreas",
    resumo:
      "Objeto, comida ou brinquedo bloqueia a passagem de ar. É a emergência mais rápida de todas: poucos minutos definem tudo.",
    icone: "🫁",
  },
  {
    slug: "hemorragia",
    titulo: "Hemorragia e ferimentos",
    resumo:
      "Cortes, brigas e quedas podem causar sangramentos superficiais ou graves. Estancar corretamente nos primeiros minutos faz toda a diferença.",
    icone: "🩸",
  },
  {
    slug: "intoxicacao",
    titulo: "Intoxicação por alimentos e substâncias",
    resumo:
      "Suspeita de ingestão de veneno, planta tóxica, alimento perigoso ou remédio humano. Costuma ser silenciosa nas primeiras horas: agir antes dos sintomas é o que salva.",
    icone: "☠️",
  },
  {
    slug: "convulsao",
    titulo: "Convulsão",
    resumo:
      "O pet perde a consciência, treme e faz movimentos involuntários. Na maioria das vezes a crise dura pouco: o papel do tutor é proteger o animal, não contê-lo.",
    icone: "⚡",
  },
  {
    slug: "afogamento",
    titulo: "Afogamento e quase afogamento",
    resumo:
      "Piscinas, baldes e até a banheira são riscos reais, principalmente para filhotes e animais pequenos. Os primeiros segundos fora da água são decisivos.",
    icone: "🌊",
  },
  {
    slug: "picada",
    titulo: "Picada de inseto e de cobra",
    resumo:
      "Picadas de abelha, aranha, escorpião ou cobra têm gravidade variável. O perigo está na reação alérgica grave e na picada de cobra peçonhenta.",
    icone: "🐝",
  },
  {
    slug: "queimaduras",
    titulo: "Queimaduras",
    resumo:
      "Contato com superfícies quentes, líquidos fervendo, eletricidade ou produtos químicos. O pelo do animal pode esconder a real gravidade da lesão.",
    icone: "🔥",
  },
  {
    slug: "fraturas",
    titulo: "Fraturas e trauma",
    resumo:
      "Quedas, atropelamentos e brigas podem fraturar ossos ou machucar a coluna. Movimentar o animal do jeito certo evita piorar a lesão.",
    icone: "🦴",
  },
]

export function findSosMeta(slug: string): SosCardMeta | undefined {
  return SOS_CARDS.find((c) => c.slug === slug)
}
