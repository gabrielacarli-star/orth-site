# Fase 4 — Imagens (Flux Pro via fal.ai)

## Por que fal.ai + Flux Pro

- Flux Pro gera imagens fotorrealistas/ilustrativas de alta qualidade,
  melhor que DALL-E para o estilo "cena do dia a dia de pequeno negócio"
  que o roteiro pede (evita o ar de "imagem de IA genérica" do ChatGPT).
- fal.ai é o jeito mais simples de chamar Flux Pro: 1 chave de API, SDK
  Python (`fal-client`) com uma chamada só, sem infraestrutura própria
  (alternativa seria Replicate, equivalente em facilidade — fal.ai foi a
  escolha porque já temos a chave).
- Preço: modelo `fal-ai/flux-pro/v1.1` custa **US$ 0,04 por imagem**
  (1024x1024 ou proporção equivalente). Para os 7 prompts deste roteiro,
  custo total estimado: **US$ 0,28 (≈ R$ 1,43)**.

## De onde vêm os prompts

O roteiro da Fase 2 (`fase-2-roteiro.md`) tem as cenas marcadas em
`[Imagem: ...]` — um por bloco (gancho, 5 erros, CTA final), total de 7
imagens para este vídeo. O `roteiros/01-5-erros-ia.txt` usado na Fase 3 só
tem a narração (sem direção de cena, porque é isso que vai pro TTS), então
as marcações de imagem vivem só no markdown do roteiro mesmo.

## O que falta para gerar as imagens de teste

Preparei o script (`scripts/teste_imagens.py`) que:

1. Tem os 7 prompts de cena (extraídos das marcações `[Imagem: ...]` do
   roteiro da Fase 2, traduzidos/expandidos em inglês — Flux Pro responde
   melhor a prompts em inglês).
2. Envia cada um pro Flux Pro via fal.ai.
3. Baixa e salva cada imagem em `imagens/01-5-erros-ia/cena-N.png`.
4. Mostra o custo total real no final.

Falta só:

1. Confirmar que a chave de API do fal.ai (já recebida) tem créditos.
2. Rodar o script e validar visualmente se o estilo das imagens bate com
   o tom do canal (direto, prático, sem cara de "stock photo" genérica).

## Próximo passo

Rodar `scripts/teste_imagens.py` e mostrar as 7 imagens geradas pra
validação. Se o estilo aprovar, Fase 4 fica concluída e seguimos para a
Fase 5 (montagem do vídeo juntando áudio + imagens).
