// =========================================================================
// Tamanho de texto ajustável. Como o Tailwind usa rem, mudar o font-size
// do <html> escala o app inteiro de forma proporcional, sem precisar
// mexer em cada tela. Persiste em localStorage entre acessos.
// =========================================================================

const CHAVE = "pet-saudavel:tamanho-texto"

export interface NivelTexto {
  id: string
  rotulo: string
  escala: number
}

export const NIVEIS_TEXTO: NivelTexto[] = [
  { id: "normal", rotulo: "A", escala: 1 },
  { id: "grande", rotulo: "A+", escala: 1.15 },
  { id: "extra", rotulo: "A++", escala: 1.3 },
]

function aplicar(escala: number) {
  document.documentElement.style.fontSize = `${16 * escala}px`
}

export function iniciarTamanhoTexto(): string {
  const salvo = localStorage.getItem(CHAVE)
  const nivel = NIVEIS_TEXTO.find((n) => n.id === salvo) ?? NIVEIS_TEXTO[0]
  aplicar(nivel.escala)
  return nivel.id
}

export function proximoNivelTexto(atualId: string): string {
  const i = NIVEIS_TEXTO.findIndex((n) => n.id === atualId)
  const proximo = NIVEIS_TEXTO[(i + 1) % NIVEIS_TEXTO.length]
  localStorage.setItem(CHAVE, proximo.id)
  aplicar(proximo.escala)
  return proximo.id
}
