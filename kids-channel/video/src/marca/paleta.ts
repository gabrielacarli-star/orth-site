// Paleta oficial do canal — vem da Fase 2 (bíblia do canal).
// NUNCA escreva uma cor solta no meio de um componente: use daqui. É isso
// que faz 200 episódios parecerem a mesma marca.

export const CORES = {
  pipo: "#FFC93C",
  pipoEscuro: "#F0A81E",
  pipoClaro: "#FFE08A",

  nina: "#9B5DE5",
  ninaEscuro: "#7B3FC4",
  ninaClaro: "#C9A3F2",

  bolha: "#4EA8DE",
  bolhaEscuro: "#2E7FB5",
  bolhaClaro: "#A8D9F5",

  // Maria — a protagonista. "pele" e "cabelo" são as duas cores que você
  // pode querer trocar; é literalmente uma linha cada, e o desenho inteiro
  // acompanha.
  pele: "#FFE2CB",
  peleMeia: "#FBC9A8",
  peleSombra: "#E9A882",
  peleTraco: "#C98259",

  cabelo: "#FFDE90",
  cabeloMeio: "#F2C45E",
  cabeloEscuro: "#D19A33",
  cabeloTraco: "#A9761F",
  cabeloBrilho: "#FFF3CB",

  vestido: "#FFA8BE",
  vestidoMeio: "#F98BA6",
  vestidoEscuro: "#E06584",
  vestidoTraco: "#B84463",

  olhos: "#5FAE74",
  olhosEscuro: "#2E6B43",
  olhosClaro: "#9BD5A6",
  lingua: "#E8768A",
  boca: "#8E3A4A",

  verde: "#43BF6D",
  verdeEscuro: "#2E9954",
  verdeClaro: "#7BD99A",

  areia: "#FFE8B6",
  areiaEscuro: "#F0CE86",

  coral: "#FF6B6B",
  bico: "#FF9F45",

  noite: "#1B2A6B",
  noiteClaro: "#33459B",

  ceu: "#8ED8F8",
  ceuClaro: "#C4EDFF",

  branco: "#FFFFFF",
  traco: "#2D2A32",
} as const;

// Espessura padrão do contorno. Todo desenho do canal usa contorno grosso e
// arredondado — é o que dá legibilidade em miniatura de 120px na TV.
export const TRACO = 8;

// Traço fino, pros detalhes DENTRO do personagem: fio de cabelo, dobra de
// roupa, narizinho, pálpebra.
//
// Essa distinção é a coisa que mais separa desenho profissional de forma
// chapada: a silhueta leva traço grosso (é ela que precisa ler em miniatura
// de 120px) e o detalhe interno leva traço fino. Contorno de espessura
// única no desenho inteiro é o que faz parecer clipart.
export const TRACO_FINO = 4;

// Contorno da silhueta — aplicado nas formas externas do personagem.
export const CONTORNO = {
  stroke: CORES.traco,
  strokeWidth: TRACO,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Contorno de detalhe interno.
export const CONTORNO_FINO = {
  stroke: CORES.traco,
  strokeWidth: TRACO_FINO,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
