"""
Fase 4 - teste isolado de geração de imagens (Flux Pro via fal.ai).

O que este script faz, passo a passo:
  1. Lê a chave de API a partir de variável de ambiente
     (arquivo .env na pasta youtube-pipeline/).
  2. Lê os prompts de imagem de
     roteiros/01-5-erros-ia-prompts.txt (um prompt por linha).
  3. Manda cada prompt pra API do fal.ai gerar uma imagem (Flux 1.1 Pro).
  4. Salva cada imagem gerada em imagens/01-5-erros-ia-XX.png.
  5. Mostra quantas imagens foram geradas e o custo total estimado, pra
     comparar com o que está documentado em fase-4-imagens.md.

Como rodar:
  cd youtube-pipeline
  pip install -r requirements.txt
  cp .env.example .env   # depois preencher o .env com sua chave do fal.ai
  python scripts/teste_imagens.py
"""

import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

# Pastas usadas pelo script, relativas a este arquivo (não ao diretório
# de onde o comando é chamado) para funcionar de qualquer lugar.
PASTA_PIPELINE = Path(__file__).resolve().parent.parent
ARQUIVO_PROMPTS = PASTA_PIPELINE / "roteiros" / "01-5-erros-ia-prompts.txt"
PASTA_IMAGENS_SAIDA = PASTA_PIPELINE / "imagens"

MODELO_IMAGEM = "fal-ai/flux-pro/v1.1"
FORMATO_IMAGEM = "landscape_16_9"

# Preço aproximado por imagem no fal.ai, só para a estimativa de custo
# impressa no final. Ajuste se o preço do modelo mudar.
PRECO_USD_POR_IMAGEM = 0.04
COTACAO_USD_PARA_BRL = 5.10  # aproximada, ajuste se quiser mais precisão


def carregar_credencial():
    """Lê a chave de API do .env e avisa claramente se faltar algo."""
    load_dotenv(PASTA_PIPELINE / ".env")

    api_key = os.getenv("FAL_KEY")

    if not api_key:
        sys.exit(
            "ERRO: variável FAL_KEY não encontrada.\n"
            "-> Copie youtube-pipeline/.env.example para youtube-pipeline/.env "
            "e preencha FAL_KEY com a chave da sua conta fal.ai."
        )

    return api_key


def ler_prompts() -> list[str]:
    """Lê os prompts de imagem, um por linha do arquivo de prompts."""
    if not ARQUIVO_PROMPTS.exists():
        sys.exit(f"ERRO: não encontrei os prompts em {ARQUIVO_PROMPTS}")
    linhas = ARQUIVO_PROMPTS.read_text(encoding="utf-8").splitlines()
    return [linha.strip() for linha in linhas if linha.strip()]


def gerar_imagem(api_key: str, prompt: str) -> bytes:
    """Chama a API do fal.ai e devolve os bytes da imagem gerada (PNG)."""
    import fal_client

    os.environ["FAL_KEY"] = api_key

    try:
        resultado = fal_client.run(
            MODELO_IMAGEM,
            arguments={
                "prompt": prompt,
                "image_size": FORMATO_IMAGEM,
                "num_images": 1,
            },
        )
        url_imagem = resultado["images"][0]["url"]
        resposta = requests.get(url_imagem, timeout=60)
        resposta.raise_for_status()
        return resposta.content
    except Exception as erro:
        # Mensagem de erro clara em vez de deixar o traceback genérico subir
        # sem explicação - é mais fácil debugar sabendo que a falha foi na
        # chamada à API (chave errada, sem créditos, prompt rejeitado etc).
        sys.exit(f"ERRO ao chamar a API do fal.ai: {erro}")


def main():
    api_key = carregar_credencial()
    prompts = ler_prompts()

    print(f"{len(prompts)} prompts lidos.")
    PASTA_IMAGENS_SAIDA.mkdir(parents=True, exist_ok=True)

    for indice, prompt in enumerate(prompts, start=1):
        print(f"Gerando imagem {indice}/{len(prompts)}...")
        imagem = gerar_imagem(api_key, prompt)
        arquivo_saida = PASTA_IMAGENS_SAIDA / f"01-5-erros-ia-{indice:02d}.png"
        arquivo_saida.write_bytes(imagem)
        print(f"  -> salva em {arquivo_saida}")

    custo_usd = len(prompts) * PRECO_USD_POR_IMAGEM
    custo_brl = custo_usd * COTACAO_USD_PARA_BRL

    print(
        f"Custo estimado deste vídeo: "
        f"US$ {custo_usd:.3f} (≈ R$ {custo_brl:.2f}), "
        f"para {len(prompts)} imagens."
    )


if __name__ == "__main__":
    main()
