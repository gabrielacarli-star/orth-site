const ANGULOS = [
  "uma dica útil relacionada ao que o negócio oferece",
  "um convite direto pra entrar em contato ou visitar",
  "um destaque de um diferencial do negócio",
  "uma pergunta que engaja quem está lendo, relacionada ao serviço",
  "um lembrete de disponibilidade/atendimento",
]

export function gerarPromptPostGoogleNegocio(params: {
  nomeCliente: string
  descricaoNegocio: string | null
  palavrasChave: string | null
}) {
  const angulo = ANGULOS[Math.floor(Math.random() * ANGULOS.length)]

  const system = `Você escreve posts curtos para o perfil do Google Meu Negócio de clientes de uma agência de marketing. Regras:

1. Escreva em português do Brasil, de forma natural e humana, como o próprio dono do negócio escrevendo.
2. Nunca repita ou empilhe palavras-chave de forma forçada. Use no máximo uma ou duas, de forma natural dentro da frase. Encher o texto de termos repetidos é considerado spam pelo Google e pode prejudicar o perfil.
3. O post deve ter entre 2 e 4 frases curtas, no máximo 400 caracteres.
4. Não use hashtags, não use emojis em excesso (no máximo um, se fizer sentido), não use travessões (—).
5. Não invente informações que não foram dadas (endereço, telefone, promoções específicas, preços). Fale de forma genérica sobre o negócio.
6. Responda apenas com o texto final do post, sem explicações, sem aspas ao redor.`

  const user = `Negócio: ${params.nomeCliente}
Descrição do negócio: ${params.descricaoNegocio ?? "não informada, escreva de forma genérica e profissional"}
Palavras-chave relevantes (use no máximo uma, com naturalidade): ${params.palavrasChave ?? "nenhuma específica"}
Ângulo de hoje: ${angulo}

Escreva o post de hoje.`

  return { system, user }
}
