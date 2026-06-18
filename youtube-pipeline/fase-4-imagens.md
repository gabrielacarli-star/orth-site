# Fase 4 — Imagens (Flux Pro)

## Base de cálculo

O roteiro da Fase 2 tem **7 marcações de cena** (`[Imagem: ...]`), uma para
cada bloco do vídeo: gancho, 5 erros e CTA final. É essa contagem que uso
abaixo pra estimar custo por vídeo.

Cotação usada: USD → BRL ≈ R$ 5,10 (mesma da Fase 3, pra manter consistência).

## Comparação dos serviços

| Serviço | Modelo | Preço / imagem | Custo estimado / vídeo (7 imagens) | Complexidade de configurar |
|---|---|---|---|---|
| **fal.ai** | `flux-pro/v1.1` | US$ 0,04 | ≈ R$ 1,43 | Baixa — 1 chave de API, SDK em Python simples (`fal-client`) |
| **Replicate** | `black-forest-labs/flux-1.1-pro` | US$ 0,04 | ≈ R$ 1,43 | Baixa — 1 chave de API, SDK em Python simples (`replicate`) |

Os dois serviços hospedam o mesmo modelo (Flux 1.1 Pro, da Black Forest
Labs) e cobram o mesmo preço por imagem — a diferença está só na API e no
fluxo de cadastro.

## Recomendação: fal.ai

Diferença de custo é zero entre os dois, então a escolha é por
simplicidade de configurar e debugar:

- **fal.ai**: cadastro direto, chave de API na primeira tela, SDK
  (`fal-client`) já devolve a URL da imagem pronta sem precisar dar polling
  manual no status do job.
- **Replicate**: também simples, mas o fluxo de "criar predição → checar
  status → buscar resultado" costuma exigir mais código (ou usar o helper
  `replicate.run`, que esconde isso mas é menos transparente pra quem está
  aprendendo a debugar sozinha).

Fica fal.ai por agora. Se mais pra frente precisar de outro modelo que só
exista no Replicate, dá pra trocar sem reescrever o pipeline inteiro — só
troca a função que chama a API de imagem (mesmo princípio da Fase 3 com TTS).

**Modelo:** `flux-pro/v1.1` (qualidade alta, bom para imagens realistas de
pessoas/cenas do dia a dia, que é o que o roteiro pede).

**Formato:** 16:9 (`landscape_16_9`), pra já sair no formato de vídeo do
YouTube sem precisar cortar/redimensionar depois.

## O que falta para gerar as imagens de teste

Preparei o script (`scripts/teste_imagens.py`) que lê os 7 prompts de
imagem extraídos do roteiro (`roteiros/01-5-erros-ia-prompts.txt`) e gera
uma imagem por prompt via API do fal.ai. Falta só:

1. Uma conta no fal.ai (fal.ai) com créditos (pré-pago, sem plano fixo).
2. A chave de API (em **Dashboard → Keys** depois de logada).

## Próximo passo

Me passe a chave de API do fal.ai (de preferência como variável de
ambiente, não direto na mensagem — ver instruções no script) para eu rodar
o teste e te mostrar as 7 imagens + custo real gerado.
