# Pipeline "Negócios com IA" — Canal de YouTube

Documentação do pipeline de automação (via script Python, sem n8n) para o
canal de YouTube **Negócios com IA**. Esta pasta vive dentro do repositório
do site da ORTH só para ter um lugar único de histórico e contexto — não faz
parte do site institucional em si.

## Objetivo do canal

Topo de funil para gerar leads/clientes para a **Autonom.ia** (automação e IA
para microempreendedores no Brasil), representada comercialmente pela
**ORTH**. O canal atrai visualização com conteúdo sobre IA, automação, sites
e anúncios para pequenos negócios, constrói confiança e direciona para
contato via WhatsApp.

## Como este projeto é construído

Por etapas, validando cada uma manualmente antes de automatizar. Só
juntamos tudo em um script único (Fase 6) depois que cada peça (roteiro,
TTS, imagens, montagem) já tiver funcionado isolada pelo menos uma vez.

## Progresso por fase

| Fase | Descrição | Status | Arquivo |
|---|---|---|---|
| 1 | Estratégia de conteúdo | ✅ Concluída | [`fase-1-estrategia-conteudo.md`](./fase-1-estrategia-conteudo.md) |
| 2 | Roteiro | ⏳ Próxima | — |
| 3 | Narração (TTS) | Pendente | — |
| 4 | Imagens (Flux Pro) | Pendente | — |
| 5 | Montagem do vídeo | Pendente | — |
| 6 | Script único ponta a ponta | Pendente | — |
| 7 | Métricas e rastreamento de leads | Pendente | — |
| 8 | Agendamento e upload automático | Pendente | — |

## Decisões técnicas já tomadas

- Sem n8n — pipeline em Python puro, rodado primeiro manualmente e só depois
  por agendador (provável GitHub Actions).
- Geração de imagem: Flux Pro via fal.ai ou Replicate (não DALL-E / GPT Image).
- TTS: voz de IA neutra em português, tom direto e prático — serviço a
  definir na Fase 3 com comparação de custo/qualidade.
- Código comentado em português, sem caixa-preta — a ideia é a Gabriela
  conseguir debugar sozinha.
