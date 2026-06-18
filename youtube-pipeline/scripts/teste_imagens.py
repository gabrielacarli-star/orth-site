"""
Fase 4 - teste isolado de geração de imagens (gpt-image-1 via OpenAI).

O que este script faz, passo a passo:
  1. Lê a chave de API da OpenAI a partir de variável de ambiente
     (arquivo .env na pasta youtube-pipeline/).
  2. Para cada uma das 7 cenas do roteiro "01-5-erros-ia" (extraídas das
     marcações [Imagem: ...] de fase-2-roteiro.md), manda o prompt
     correspondente pro gpt-image-1.
  3. Decodifica e salva cada imagem em imagens/01-5-erros-ia/cena-N.png.
  4. Mostra o custo estimado total no final.

Como rodar:
  cd youtube-pipeline
  pip install -r requirements.txt
  cp .env.example .env   # depois preencher o .env com sua chave da OpenAI
  python scripts/teste_imagens.py
"""

import base64
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

PASTA_PIPELINE = Path(__file__).resolve().parent.parent
PASTA_SAIDA = PASTA_PIPELINE / "imagens" / "01-5-erros-ia"

MODELO_IMAGEM = "gpt-image-1"
TAMANHO_IMAGEM = "1536x1024"  # paisagem, mais próximo de 16:9
QUALIDADE_IMAGEM = "medium"
# Estimativa pra qualidade "medium" em 1536x1024 (ver platform.openai.com/docs/pricing)
PRECO_USD_POR_IMAGEM = 0.07
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
    """Lê a chave de API da OpenAI do .env e avisa claramente se faltar."""
    load_dotenv(PASTA_PIPELINE / ".env")

    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        sys.exit(
            "ERRO: variável OPENAI_API_KEY não encontrada.\n"
            "-> Copie youtube-pipeline/.env.example para youtube-pipeline/.env "
            "e preencha OPENAI_API_KEY com a chave da sua conta OpenAI."
        )
    return openai_key


def gerar_imagem(cliente, prompt: str) -> bytes:
    """Chama a API da OpenAI e devolve os bytes da imagem gerada."""
    try:
        resultado = cliente.images.generate(
            model=MODELO_IMAGEM,
            prompt=prompt,
            size=TAMANHO_IMAGEM,
            quality=QUALIDADE_IMAGEM,
        )
        return base64.b64decode(resultado.data[0].b64_json)
    except Exception as erro:
        sys.exit(f"ERRO ao chamar a API da OpenAI: {erro}")


def main():
    from openai import OpenAI

    cliente = OpenAI(api_key=carregar_chave())

    PASTA_SAIDA.mkdir(parents=True, exist_ok=True)

    for nome, prompt in CENAS:
        print(f"Gerando {nome}...")
        imagem_bytes = gerar_imagem(cliente, prompt)
        destino = PASTA_SAIDA / f"{nome}.png"
        destino.write_bytes(imagem_bytes)
        print(f"  salva em: {destino}")

    custo_usd = len(CENAS) * PRECO_USD_POR_IMAGEM
    custo_brl = custo_usd * COTACAO_USD_PARA_BRL
    print(
        f"\nCusto estimado deste vídeo ({len(CENAS)} imagens): "
        f"US$ {custo_usd:.2f} (≈ R$ {custo_brl:.2f})."
    )


if __name__ == "__main__":
    main()
