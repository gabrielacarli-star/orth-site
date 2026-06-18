# Fase 4 — Imagens (gpt-image-1 via OpenAI)

## Por que OpenAI (gpt-image-1)

- A ideia original era usar Flux Pro via fal.ai, mas migramos pro
  `gpt-image-1` da OpenAI pra usar a mesma chave de API já configurada
  no projeto, sem precisar de uma segunda conta/chave (fal.ai) só pras
  imagens.
- gpt-image-1 também gera imagens fotorrealistas/ilustrativas de boa
  qualidade pro estilo "cena do dia a dia de pequeno negócio" que o
  roteiro pede.
- Preço: qualidade `medium` em 1536x1024 (paisagem, próximo de 16:9)
  custa **≈ US$ 0,07 por imagem**. Para os 7 prompts deste roteiro,
  custo total estimado: **≈ US$ 0,49 (≈ R$ 2,50)**.

## De onde vêm os prompts

O roteiro da Fase 2 (`fase-2-roteiro.md`) tem as cenas marcadas em
`[Imagem: ...]` — um por bloco (gancho, 5 erros, CTA final), total de 7
imagens para este vídeo. O `roteiros/01-5-erros-ia.txt` usado na Fase 3 só
tem a narração (sem direção de cena, porque é isso que vai pro TTS), então
as marcações de imagem vivem só no markdown do roteiro mesmo.

## O que falta para gerar as imagens de teste

Preparei o script (`scripts/teste_imagens.py`) que:

1. Tem os 7 prompts de cena (extraídos das marcações `[Imagem: ...]` do
   roteiro da Fase 2, traduzidos/expandidos em inglês — gpt-image-1
   responde melhor a prompts em inglês).
2. Envia cada um pro `gpt-image-1` via API da OpenAI.
3. Baixa e salva cada imagem em `imagens/01-5-erros-ia/cena-N.png`.
4. Mostra o custo estimado total no final.

Falta só:

1. Confirmar que a chave de API da OpenAI (já no `.env`) tem créditos.
2. Rodar o script e validar visualmente se o estilo das imagens bate com
   o tom do canal (direto, prático, sem cara de "stock photo" genérica).

## Próximo passo

Rodar `scripts/teste_imagens.py` e mostrar as 7 imagens geradas pra
validação. Se o estilo aprovar, Fase 4 fica concluída e seguimos para a
Fase 5 (montagem do vídeo juntando áudio + imagens).
