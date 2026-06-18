# Fase 3 — Narração (TTS)

## Base de cálculo

O roteiro da Fase 2 ("5 erros que pequenos negócios cometem ao tentar usar
IA") tem, só na parte falada (sem direção de cena), **~500 palavras / ~2.800
caracteres**. É essa contagem que uso abaixo pra estimar custo por vídeo —
a maioria dos serviços de TTS cobra por caractere processado.

Cotação usada: USD → BRL ≈ R$ 5,10 (varia; é só pra dar noção de grandeza).

## Comparação dos serviços

| Serviço | Preço (caracteres) | Custo estimado / vídeo (~2.800 car.) | Qualidade / tom | Complexidade de configurar |
|---|---|---|---|---|
| **ElevenLabs** (Multilingual v2) | Plano Starter US$5/mês = 30.000 car.; Creator US$22/mês = 121.000 car. | ≈ R$ 2,40-2,60 (dentro do plano) | A mais natural e expressiva das quatro; dá pra ajustar "estilo" da voz pra ficar mais direta/enérgica em vez de calma. Tem vozes nativas em português do Brasil. | Baixa — 1 chave de API, SDK em Python simples |
| **Google Cloud TTS** (Neural2) | US$16 / 1M caracteres | ≈ R$ 0,23 | Boa, mas mais "neutra/locutor de telejornal" — menos fácil de soar direta/enérgica | Média — exige projeto no Google Cloud + credenciais de conta de serviço |
| **Azure AI Speech** (Neural) | US$15 / 1M caracteres (HD: US$30/1M) | ≈ R$ 0,21 (HD: R$ 0,43) | Boa, parecida com o Google; a versão "Neural HD" promete mais emoção mas ainda não testei em português | Média — exige recurso no Azure + chave de assinatura |
| **Amazon Polly** (Neural) | US$16 / 1M caracteres (Generative: US$30/1M) | ≈ R$ 0,23 (Generative: R$ 0,43) | Voz "Camila"/"Vitória" em pt-BR, qualidade boa mas mais robótica que ElevenLabs; a voz Generative (mais natural) só está disponível em regiões fora do Brasil (Europa/Canadá) | Média/Alta — exige conta AWS + credenciais IAM |

## Recomendação: ElevenLabs

Mesmo sendo a opção "mais cara" das quatro, a diferença em reais é
irrelevante na escala deste canal (poucos vídeos por semana): estamos
falando de **~R$ 25 a R$ 115 por mês** (plano fixo) contra **R$ 1 a R$ 4 por
mês** nas alternativas. O que decide aqui não é o preço, é o que você pediu
no início: tom **direto e prático, não devocional/calmo**. As vozes da
ElevenLabs são as únicas das quatro com controle de "estilo" fino o
suficiente pra puxar pra esse lado sem ficar robótica, e o SDK em Python é o
mais simples de entender e debugar sozinha — só uma chave de API, sem
projeto de nuvem, sem conta de serviço.

Se mais pra frente o canal crescer muito (várias dezenas de vídeos/mês) e o
custo deixar de ser irrelevante, dá pra migrar pro Google ou Azure sem
reescrever o pipeline inteiro — só troca a função que chama a API de TTS.

**Modelo:** `eleven_multilingual_v2` (mais estável pra narração comum;
existe um modelo mais novo, `eleven_v3`, mais expressivo mas pensado pra
diálogo dramático com marcações de emoção — não é o caso aqui).

**Plano:** Starter (US$ 5/mês, ~30.000 caracteres) já é suficiente pra
~10 vídeos por mês nesse tamanho de roteiro, e já libera uso comercial
(o plano Free não permite uso comercial e exige creditar a ElevenLabs no
vídeo).

## Teste realizado

Rodei `scripts/teste_tts.py` com a chave de API e o `voice_id`
(`9pDzHy2OpOgeXM8SeL0t`) escolhidos. Resultado:

- Roteiro: 2.699 caracteres.
- Custo real cobrado: **US$ 0,45 (≈ R$ 2,29)** — em linha com a estimativa
  da tabela acima.
- Áudio salvo em `audio/01-5-erros-ia.mp3` (pasta fora do git — ver
  `.gitignore` da raiz, regra `.env*` cobre só os `.env`; o áudio fica local
  mesmo, não versionamos binário gerado).

## Próximo passo

Validar se a voz/tom do áudio gerado está direta/enérgica como o esperado.
Se sim, Fase 3 fica concluída e seguimos para a Fase 4 (geração de imagens
com Flux Pro via fal.ai).
