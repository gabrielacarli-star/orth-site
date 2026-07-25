// =========================================================================
// Guias de prevenção (bônus do SOS Pet): metadados públicos.
// -------------------------------------------------------------------------
// Só título, resumo, ícone e os rótulos das seções ficam aqui (no pacote do
// app). O conteúdo real mora na tabela protegida sos_conteudo e só é
// entregue pela Edge Function "sos-conteudo" depois de conferir a compra,
// exatamente como as fichas de emergência.
//
// Fonte: "Primeiros Socorros para Cães e Gatos", guia do Dr. Eduardo
// Sebastião (CRMV-MT 6412).
// =========================================================================

export interface GuiaMeta {
  slug: string
  titulo: string
  resumo: string
  icone: string
  // Rótulos das seções (o conteúdo reaproveita as colunas de sos_conteudo).
  labelSinais?: string
  labelPassos: string
  passosNumerados: boolean
  labelLevar: string
}

export const GUIAS: GuiaMeta[] = [
  {
    slug: "alimentos-perigosos",
    titulo: "Alimentos que podem intoxicar seu pet",
    resumo:
      "Os alimentos mais perigosos da sua cozinha e por que cada um faz mal. Evite a emergência antes mesmo dela começar.",
    icone: "🥑",
    labelSinais: "Sinais de intoxicação",
    labelPassos: "Os alimentos mais perigosos",
    passosNumerados: false,
    labelLevar: "Leve ao veterinário",
  },
  {
    slug: "transporte-seguro",
    titulo: "Como transportar um pet ferido",
    resumo:
      "Um transporte malfeito pode transformar uma lesão simples em algo grave. Os princípios para levar seu pet com segurança até a clínica.",
    icone: "🚗",
    labelPassos: "Princípios do transporte seguro",
    passosNumerados: false,
    labelLevar: "Antes de sair de casa",
  },
]

export function findGuiaMeta(slug: string): GuiaMeta | undefined {
  return GUIAS.find((g) => g.slug === slug)
}
