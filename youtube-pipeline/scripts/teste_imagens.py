"""
Fase 4 - teste isolado de geração de imagens (Flux Pro via fal.ai).

O que este script faz, passo a passo:
  1. Lê a chave de API do fal.ai a partir de variável de ambiente
     (arquivo .env na pasta youtube-pipeline/).
  2. Para cada uma das 7 cenas do roteiro "01-5-erros-ia" (extraídas das
     marcações [Imagem: ...] de fase-2-roteiro.md), manda o prompt
     correspondente pro Flux Pro.
  3. Baixa e salva cada imagem em imagens/01-5-erros-ia/cena-N.png.
  4. Mostra o custo total real no final.

Como rodar:
  cd youtube-pipeline
  pip install -r requirements.txt
  cp .env.example .env   # depois preencher o .env com sua chave do fal.ai
  python scripts/teste_imagens.py
"""

import os
import sys
import urllib.request
from pathlib import Path

from dotenv import load_dotenv

PASTA_PIPELINE = Path(__file__).resolve().parent.parent
PASTA_SAIDA = PASTA_PIPELINE / "imagens" / "01-5-erros-ia"

# Modelo Flux Pro mais recente e barato pra esse tipo de imagem realista
MODELO_FLUX = "fal-ai/flux-pro/v1.1"
PRECO_USD_POR_IMAGEM = 0.04
COTACAO_USD_PARA_BRL = 5.10

# Prompts traduzidos/expandidos a partir das marcações [Imagem: ...] do
# roteiro da Fase 2 (fase-2-roteiro.md) - Flux Pro responde melhor em inglês.
# Sufixo de estilo comum a todas as cenas, pra manter consistência visual
# no vídeo final.
ESTILO = (
    ", realistic photo style, natural lighting, small business setting in "
    "Brazil, candid and relatable, no text or logos in the image"
)

CENAS = [
    ("cena-1-gancho", "A frustrated small business owner looking at their "
     "phone with a frozen, unhelpful chat app screen" + ESTILO),
    ("cena-2-erro1", "A generic AI badge or sticker awkwardly pasted onto an "
     "Instagram post mockup, looking out of place" + ESTILO),
    ("cena-3-erro2", "A small business owner looking shocked and worried "
     "while staring at an expensive software invoice on a laptop" + ESTILO),
    ("cena-4-erro3", "A stressed person surrounded by multiple phone and "
     "computer apps open at once, overwhelmed" + ESTILO),
    ("cena-5-erro4", "A screenshot-like image of a generic AI prompt copied "
     "from the internet, clearly not customized for any specific business"
     + ESTILO),
    ("cena-6-erro5", "An empty, flat analytics chart on a screen, with a "
     "person looking confused about whether something worked" + ESTILO),
    ("cena-7-cta", "A friendly small business owner smiling while answering "
     "a WhatsApp message on their phone" + ESTILO),
]


def carregar_chave() -> str:
    """Lê a chave de API do fal.ai do .env e avisa claramente se faltar."""
    load_dotenv(PASTA_PIPELINE / ".env")

    fal_key = os.getenv("FAL_KEY")
    if not fal_key:
        sys.exit(
            "ERRO: variável FAL_KEY não encontrada.\n"
            "-> Copie youtube-pipeline/.env.example para youtube-pipeline/.env "
            "e preencha FAL_KEY com a chave da sua conta fal.ai (formato "
            "id:secret)."
        )
    return fal_key


def gerar_imagem(prompt: str) -> str:
    """Chama a API do fal.ai e devolve a URL da imagem gerada."""
    import fal_client

    try:
        resultado = fal_client.subscribe(
            MODELO_FLUX,
            arguments={"prompt": prompt, "aspect_ratio": "16:9"},
        )
        return resultado["images"][0]["url"]
    except Exception as erro:
        sys.exit(f"ERRO ao chamar a API do fal.ai: {erro}")


def main():
    os.environ["FAL_KEY"] = carregar_chave()

    PASTA_SAIDA.mkdir(parents=True, exist_ok=True)

    for nome, prompt in CENAS:
        print(f"Gerando {nome}...")
        url = gerar_imagem(prompt)
        destino = PASTA_SAIDA / f"{nome}.png"
        urllib.request.urlretrieve(url, destino)
        print(f"  salva em: {destino}")

    custo_usd = len(CENAS) * PRECO_USD_POR_IMAGEM
    custo_brl = custo_usd * COTACAO_USD_PARA_BRL
    print(
        f"\nCusto estimado deste vídeo ({len(CENAS)} imagens): "
        f"US$ {custo_usd:.2f} (≈ R$ {custo_brl:.2f})."
    )


if __name__ == "__main__":
    main()
