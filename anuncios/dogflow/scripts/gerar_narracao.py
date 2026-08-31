#!/usr/bin/env python3
"""Gera a narração em espanhol dos anúncios do DogFlow.

    python3 scripts/gerar_narracao.py 1     # anúncio 1 (o do app, 22s)
    python3 scripts/gerar_narracao.py 2     # anúncio 2 (a montagem, 27s)

Faz duas coisas, nesta ordem:

1. manda cada fala pra ElevenLabs e grava o bruto em `fala-N.mp3`;
2. acelera com `atempo` do ffmpeg e copia pra `public/`, que é de onde o
   Remotion lê.

Por que acelerar: a voz da ElevenLabs fala mais devagar que as locutoras
dos vídeos originais, e cada fala precisa entrar num instante específico —
a imagem já está lá, e o texto queimado na tela também. Não dá pra empurrar
a fala pra frente; ou ela cabe no espaço que tem, ou atropela a próxima.

A regra é usar UMA velocidade pra todas as falas do anúncio, nunca uma por
frase. No anúncio 1 a fala mais apertada precisaria de 1,46x sozinha, e
1,46x no meio de frases em velocidade normal soa acelerado; 1,30x uniforme
soa natural e ainda assim cabe. No anúncio 2 sobra espaço em quase tudo, e
1,05x resolve a única fala apertada sem ninguém perceber.

`atempo` muda a velocidade sem mexer no tom, que é o ponto — `asetrate`
deixaria a voz aguda.

Os instantes aqui são cópia dos que estão no `src/Anuncio*.tsx`, só pra
este script conseguir imprimir o mapa e conferir se cabe. Quem toca o áudio
é o Remotion: se for mudar um tempo, mude lá.
"""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# Laura: feminina, jovem, tom de redes sociais. O sotaque é americano —
# funciona em espanhol, mas uma voz nativa da Voice Library ficaria melhor.
# É a mesma voz nos dois anúncios de propósito: é a voz da marca.
VOZ = "FGY2WhTYpPnrIDTdsKH5"

ANUNCIOS = {
    # Anúncio 1 — depoimento sobre o app, 22,1s.
    #
    # As duas últimas falas não são aceleradas: caem no fim do vídeo, onde
    # sobra espaço.
    "1": {
        "pasta": RAIZ / "audio",
        "prefixo": "ok",          # vira public/ok-N.mp3
        "velocidade": 1.30,
        "falas": [
            (0.10, "Así conseguí que mi cachorro se quedara tranquilo en su "
                   "jaula y dejara de gemir sin recurrir a un adiestrador.", True),
            (5.45, "Encontré una aplicación que te enseña a adiestrar a tu "
                   "perro desde casa.", True),
            (8.86, "No necesitas un adiestrador.", True),
            (10.50, "Te guía paso a paso con vídeos cortos que puedes seguir "
                    "a tu ritmo.", True),
            (13.73, "También te da consejos personalizados para cualquier "
                    "problema de comportamiento que tengas con tu perro.", True),
            (18.30, "Se llama DogFlow.", False),
            (20.30, "Toca abajo para probarla.", False),
        ],
    },
    # Anúncio 2 — montagem de cinco ganchos, 27,18s.
    #
    # O texto de cada fala é o mesmo que está queimado na tela. Não é
    # liberdade criativa: mudar a fala aqui faria a voz contradizer o texto
    # que o espectador está lendo.
    "2": {
        "pasta": RAIZ / "audio2",
        "prefixo": "n2",          # vira public/n2-N.mp3
        "velocidade": 1.05,
        "falas": [
            (0.10, 'Gritar "no" nunca hará que tu perro reactivo sea '
                   "obediente.", True),
            (3.56, "¿Cómo entrenar para la jaula a un cachorro?", True),
            (8.96, "¿Cómo evitar que un cachorro orine en sólo un día?", True),
            (16.46, "¿Cómo evitar que un cachorro tire de la correa?", True),
            (21.26, "¿Cómo evitar que un cachorro muerda en sólo un día?", True),
        ],
    },
}

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
    qual = sys.argv[1] if len(sys.argv) > 1 else "1"
    if qual not in ANUNCIOS:
        sys.exit(f"Anúncio '{qual}' não existe. Use: {', '.join(ANUNCIOS)}")

    cfg = ANUNCIOS[qual]
    pasta, prefixo, velocidade = cfg["pasta"], cfg["prefixo"], cfg["velocidade"]
    publico = RAIZ / "public"
    pasta.mkdir(parents=True, exist_ok=True)
    publico.mkdir(parents=True, exist_ok=True)

    el = cliente()

    for i, (instante, texto, acelerar) in enumerate(cfg["falas"], 1):
        bruto = pasta / f"fala-{i}.mp3"

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

        pronto = publico / f"{prefixo}-{i}.mp3"
        if acelerar:
            subprocess.run(
                [str(FFMPEG), "-y", "-v", "error", "-i", str(bruto),
                 "-filter:a", f"atempo={velocidade}", str(pronto)],
                check=True,
            )
        else:
            pronto.write_bytes(bruto.read_bytes())

        # Confere se a fala cabe até a próxima. É a única verificação que
        # importa: se estourar, ela atropela a seguinte e ninguém entende
        # nem uma nem outra.
        dura = _duracao(pronto)
        proxima = cfg["falas"][i][0] if i < len(cfg["falas"]) else None
        folga = f"{proxima - (instante + dura):+5.2f}s" if proxima else "  fim"
        marca = f"{velocidade}x" if acelerar else "1.0x"
        print(f"  {i}  {instante:5.2f}s  {marca:5}  dura {dura:4.2f}s  "
              f"folga {folga}  {texto[:40]}")

    print(f"\nPronto em public/{prefixo}-*.mp3. "
          f"Folga negativa = a fala atropela a próxima.")


def _duracao(caminho: Path) -> float:
    ffprobe = FFMPEG.with_name("ffprobe")
    saida = subprocess.run(
        [str(ffprobe), "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(caminho)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(saida)


if __name__ == "__main__":
    main()
