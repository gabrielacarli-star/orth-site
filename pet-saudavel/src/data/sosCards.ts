// =========================================================================
// Fichas de emergência (SOS)
// -------------------------------------------------------------------------
// COMPLIANCE (trava da marca): estas fichas ORIENTAM os primeiros socorros
// "até chegar à clínica veterinária". NUNCA diagnosticam, NUNCA prescrevem
// dosagem, produto ou conduta clínica. Toda ficha termina levando o tutor
// ao veterinário. Conteúdo educativo — revisado pelo Dr. Eduardo antes de
// publicar. O texto vive dentro do app (bundle) e por isso abre SEM internet.
//
// Regra de negócio (plano v1, seção 08): 2 fichas são amostra grátis;
// as demais aparecem "bloqueadas" e o protocolo completo fica no e-book.
// =========================================================================

export interface SosCard {
  slug: string
  titulo: string
  resumo: string
  icone: string // emoji — leve e universal
  gratis: boolean
  passos: string[]
  atencao?: string
}

export const SOS_CARDS: SosCard[] = [
  {
    slug: "engasgo",
    titulo: "Engasgo / obstrução",
    resumo: "O pet tosse, se debate, leva a pata à boca ou fica com a gengiva arroxeada.",
    icone: "🫁",
    gratis: true,
    passos: [
      "Mantenha a calma — um animal em pânico morde. Contenha com firmeza e delicadeza.",
      "Abra a boca com cuidado e olhe se há um objeto visível. Só retire se conseguir enxergar e alcançar com segurança — nunca empurre às cegas com o dedo, pois pode encravar mais fundo.",
      "Cães pequenos e gatos: segure de cabeça para baixo por poucos segundos e dê tapinhas firmes entre as escápulas (nas costas, na altura dos ombros).",
      "Cães grandes: com o animal em pé, faça pressão firme e para dentro/para cima logo atrás das costelas, algumas vezes seguidas.",
      "Assim que o objeto sair — ou mesmo se sair — vá imediatamente ao veterinário. A garganta pode ficar inflamada e o risco continua.",
    ],
    atencao:
      "Se a gengiva ou a língua ficarem azuladas, o oxigênio está faltando: isto é emergência máxima. Vá para a clínica AGORA, mesmo em trânsito.",
  },
  {
    slug: "hemorragia",
    titulo: "Hemorragia / corte profundo",
    resumo: "Sangramento que não para sozinho, corte fundo ou ferida por atropelamento/briga.",
    icone: "🩸",
    gratis: true,
    passos: [
      "Proteja-se: mesmo o pet mais dócil pode morder com dor. Se necessário, improvise uma focinheira com atadura (nunca em animal que vomita ou tem dificuldade para respirar).",
      "Pressione o ferimento com um pano limpo, gaze ou toalha, com firmeza e de forma contínua.",
      "Não fique levantando o pano para “ver se parou” — isso desfaz o coágulo. Se encharcar, coloque outro por cima sem tirar o primeiro.",
      "Se for em uma pata e o sangramento for intenso, mantenha o membro elevado enquanto pressiona.",
      "Mantenha a pressão a caminho da clínica. Vá ao veterinário imediatamente — cortes profundos precisam de avaliação e podem exigir sutura.",
    ],
    atencao:
      "Não use torniquete apertado por conta própria e não aplique nenhum produto, pó ou pomada na ferida. Leve o pet ao veterinário.",
  },

  // --- Fichas com protocolo completo no e-book (bloqueadas na v1) ---
  {
    slug: "intoxicacao",
    titulo: "Intoxicação / envenenamento",
    resumo: "Suspeita de ingestão de veneno, planta tóxica, chocolate, remédio humano ou produto de limpeza.",
    icone: "☠️",
    gratis: false,
    passos: [],
    atencao:
      "Nunca provoque vômito por conta própria — em alguns venenos isso agrava a lesão. Guarde a embalagem do que foi ingerido e leve ao veterinário na mesma hora.",
  },
  {
    slug: "convulsao",
    titulo: "Convulsão",
    resumo: "O pet cai, treme, faz movimentos involuntários e perde consciência.",
    icone: "⚡",
    gratis: false,
    passos: [],
  },
  {
    slug: "atropelamento",
    titulo: "Atropelamento / queda",
    resumo: "Trauma por impacto — pode haver fratura ou lesão interna mesmo sem sangue visível.",
    icone: "🚑",
    gratis: false,
    passos: [],
  },
  {
    slug: "insolacao",
    titulo: "Insolação / calor extremo",
    resumo: "Ofegância intensa, fraqueza e prostração após exposição ao calor ou carro fechado.",
    icone: "🌡️",
    gratis: false,
    passos: [],
  },
  {
    slug: "picada",
    titulo: "Picada de inseto / cobra",
    resumo: "Inchaço súbito, dor localizada ou reação alérgica após picada.",
    icone: "🐝",
    gratis: false,
    passos: [],
  },
]

export function findSos(slug: string): SosCard | undefined {
  return SOS_CARDS.find((c) => c.slug === slug)
}
