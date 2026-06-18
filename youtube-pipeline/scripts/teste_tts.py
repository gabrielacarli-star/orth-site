"""
Fase 3 - teste isolado de narração (TTS).

O que este script faz, passo a passo:
  1. Lê a chave de API e o ID da voz a partir de variáveis de ambiente
     (arquivo .env na pasta youtube-pipeline/).
  2. Lê o texto do roteiro de roteiros/01-5-erros-ia.txt.
  3. Manda esse texto pra API da ElevenLabs gerar o áudio.
  4. Salva o áudio gerado em audio/01-5-erros-ia.mp3.
  5. Mostra quantos caracteres foram cobrados e uma estimativa de custo,
     pra comparar com o que está documentado em fase-3-tts.md.

Como rodar:
  cd youtube-pipeline
  pip install -r requirements.txt
  cp .env.example .env   # depois preencher o .env com sua chave e voice_id
  python scripts/teste_tts.py
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Pastas usadas pelo script, relativas a este arquivo (não ao diretório
# de onde o comando é chamado) para funcionar de qualquer lugar.
PASTA_PIPELINE = Path(__file__).resolve().parent.parent
ARQUIVO_ROTEIRO = PASTA_PIPELINE / "roteiros" / "01-5-erros-ia.txt"
ARQUIVO_AUDIO_SAIDA = PASTA_PIPELINE / "audio" / "01-5-erros-ia.mp3"

# Modelo multilíngue da ElevenLabs - o mais estável para narração comum
# em português (o eleven_v3 é mais novo, mas pensado para diálogo dramático
# com marcações de emoção, não para esse tipo de narração direta).
MODELO_TTS = "eleven_multilingual_v2"

# Preço aproximado por caractere no plano Starter (US$5 / 30.000 caracteres),
# só para a estimativa de custo impressa no final. Ajuste se trocar de plano.
PRECO_USD_POR_CARACTERE = 5 / 30_000
COTACAO_USD_PARA_BRL = 5.10  # aproximada, ajuste se quiser mais precisão


def carregar_credenciais():
    """Lê a chave de API e o voice_id do .env e avisa claramente se faltar algo."""
    load_dotenv(PASTA_PIPELINE / ".env")

    api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID")

    if not api_key:
        sys.exit(
            "ERRO: variável ELEVENLABS_API_KEY não encontrada.\n"
            "-> Copie youtube-pipeline/.env.example para youtube-pipeline/.env "
            "e preencha ELEVENLABS_API_KEY com a chave da sua conta ElevenLabs."
        )

    if not voice_id:
        sys.exit(
            "ERRO: variável ELEVENLABS_VOICE_ID não encontrada.\n"
            "-> Escolha uma voz em portugues do Brasil na Voice Library da "
            "ElevenLabs e cole o voice_id dela em youtube-pipeline/.env."
        )

    return api_key, voice_id


def ler_roteiro() -> str:
    """Lê o texto do roteiro que vai ser narrado."""
    if not ARQUIVO_ROTEIRO.exists():
        sys.exit(f"ERRO: não encontrei o roteiro em {ARQUIVO_ROTEIRO}")
    return ARQUIVO_ROTEIRO.read_text(encoding="utf-8").strip()


def gerar_audio(api_key: str, voice_id: str, texto: str) -> bytes:
    """Chama a API da ElevenLabs e devolve o áudio gerado (bytes de mp3)."""
    from elevenlabs.client import ElevenLabs

    cliente = ElevenLabs(api_key=api_key)

    try:
        audio_em_pedacos = cliente.text_to_speech.convert(
            text=texto,
            voice_id=voice_id,
            model_id=MODELO_TTS,
            output_format="mp3_44100_128",
        )
    except Exception as erro:
        # Mensagem de erro clara em vez de deixar o traceback genérico subir
        # sem explicação - é mais fácil debugar sabendo que a falha foi
        # na chamada à API (chave errada, sem créditos, voice_id inválido etc).
        sys.exit(f"ERRO ao chamar a API da ElevenLabs: {erro}")

    # A API devolve o áudio em pedaços (streaming); aqui juntamos tudo.
    return b"".join(audio_em_pedacos)


def main():
    api_key, voice_id = carregar_credenciais()
    texto = ler_roteiro()

    print(f"Roteiro lido: {len(texto)} caracteres.")
    print("Gerando áudio na ElevenLabs... (pode levar alguns segundos)")

    audio = gerar_audio(api_key, voice_id, texto)

    ARQUIVO_AUDIO_SAIDA.parent.mkdir(parents=True, exist_ok=True)
    ARQUIVO_AUDIO_SAIDA.write_bytes(audio)

    custo_usd = len(texto) * PRECO_USD_POR_CARACTERE
    custo_brl = custo_usd * COTACAO_USD_PARA_BRL

    print(f"Áudio salvo em: {ARQUIVO_AUDIO_SAIDA}")
    print(
        f"Custo estimado deste vídeo: "
        f"US$ {custo_usd:.3f} (≈ R$ {custo_brl:.2f}), "
        f"considerando o plano Starter."
    )


if __name__ == "__main__":
    main()
