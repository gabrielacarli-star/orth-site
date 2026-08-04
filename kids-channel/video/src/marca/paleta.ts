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
  pele: "#FFD9BC",
  peleSombra: "#F0BC98",
  cabelo: "#FFD772",
  cabeloEscuro: "#E3AE38",
  vestido: "#FF6B6B",
  vestidoEscuro: "#E24E4E",

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

// Propriedades de contorno aplicadas em todo path/shape do canal.
export const CONTORNO = {
  stroke: CORES.traco,
  strokeWidth: TRACO,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
