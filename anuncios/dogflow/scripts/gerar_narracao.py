#!/usr/bin/env python3
"""Gera a narração em espanhol do anúncio do DogFlow.

    python3 scripts/gerar_narracao.py

Faz duas coisas, nesta ordem:

1. manda cada uma das sete falas pra ElevenLabs e grava `audio/fala-N.mp3`;
2. acelera as cinco primeiras em 1,30x com `atempo` do ffmpeg e grava
   `audio/ok-N.mp3` — que são os arquivos que o `src/Anuncio.tsx` toca.

Por que acelerar: a voz da ElevenLabs fala mais devagar que a locutora do
vídeo original. As sete falas somam ~25,3s de fala num vídeo de 25s, e cada
uma precisa entrar num instante específico (a imagem já está lá). Comprimir
cada frase no seu próprio fator faria a mais apertada ir a 1,46x, que soa
acelerado no meio de frases em velocidade normal. Velocidade uniforme soa
natural — e com 1,30x toda fala cai dentro de 0,15s da marca original.

As duas últimas falas não são aceleradas: elas caem no fim do vídeo, onde
sobra espaço.

`atempo` muda a velocidade sem mexer no tom, que é o ponto — `asetrate`
deixaria a voz aguda.
"""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "audio"

# Laura: feminina, jovem, tom de redes sociais. O sotaque é americano —
# funciona em espanhol, mas uma voz nativa da Voice Library ficaria melhor.
VOZ = "FGY2WhTYpPnrIDTdsKH5"

# Fator único pra todas as falas aceleradas. Ver o docstring.
VELOCIDADE = 1.30

# (instante em que a fala entra no vídeo, texto, acelerar?)
#
# Os instantes não foram inventados: o vídeo original foi transcrito com
# timestamps por palavra (speech-to-text da ElevenLabs), e cada fala nova
# entra onde a equivalente entrava no original. É isso que faz a narração
# casar com a imagem sem reeditar o vídeo.
#
# Quem toca o áudio é o src/Anuncio.tsx — os instantes aqui são cópia dos
# de lá, só pra este script conseguir imprimir o mapa. Se mudar um tempo,
# mude no Anuncio.tsx; aqui é informativo.
FALAS = [
    (0.10, "Así conseguí que mi cachorro se quedara tranquilo en su jaula y "
           "dejara de gemir sin recurrir a un adiestrador.", True),
    (5.45, "Encontré una aplicación que te enseña a adiestrar a tu perro "
           "desde casa.", True),
    (8.86, "No necesitas un adiestrador.", True),
    (10.50, "Te guía paso a paso con vídeos cortos que puedes seguir a tu "
            "ritmo.", True),
    (13.73, "También te da consejos personalizados para cualquier problema "
            "de comportamiento que tengas con tu perro.", True),
    (18.30, "Se llama DogFlow.", False),
    (20.30, "Toca abajo para probarla.", False),
]

# O ffmpeg que vem junto com o Remotion, pra não depender de instalação
# do sistema.
FFMPEG = next(
    (p for p in RAIZ.glob("node_modules/@remotion/compositor-linux-*/ffmpeg")),
    Path("ffmpeg"),
)


def cliente():
    """Cliente da ElevenLabs, ou explica o que falta e encerra."""
    from dotenv import load_dotenv

    # A chave mora no .env do kids-channel, que é o projeto irmão. Um .env
    # local aqui também funciona e tem prioridade.
    load_dotenv(RAIZ / ".env")
    load_dotenv(RAIZ.parent.parent / "kids-channel" / ".env")

    chave = os.getenv("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit("Falta ELEVENLABS_API_KEY (num .env aqui ou no kids-channel/).")

    from elevenlabs.client import ElevenLabs

    return ElevenLabs(api_key=chave)


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    el = cliente()

    for i, (instante, texto, acelerar) in enumerate(FALAS, 1):
        bruto = SAIDA / f"fala-{i}.mp3"

        # mp3_44100_192 e pcm_44100 são bloqueados pro text-to-speech no
        # plano atual; 128 kbps passa e é mais que suficiente pra narração
        # que ainda vai ser mixada com trilha e comprimida pelo Instagram.
        audio = el.text_to_speech.convert(
            voice_id=VOZ,
            text=texto,
            model_id="eleven_multilingual_v2",
            language_code="es",
            output_format="mp3_44100_128",
        )
        bruto.write_bytes(b"".join(audio))

        pronto = SAIDA / f"ok-{i}.mp3"
        if acelerar:
            subprocess.run(
                [str(FFMPEG), "-y", "-v", "error", "-i", str(bruto),
                 "-filter:a", f"atempo={VELOCIDADE}", str(pronto)],
                check=True,
            )
        else:
            pronto.write_bytes(bruto.read_bytes())

        marca = f"{VELOCIDADE}x" if acelerar else "1.0x"
        print(f"  {i}  entra em {instante:5.2f}s  {marca:5}  {texto[:46]}")

    print("\nPronto. Os tempos de entrada estão em src/Anuncio.tsx (NARRACAO).")


if __name__ == "__main__":
    main()
