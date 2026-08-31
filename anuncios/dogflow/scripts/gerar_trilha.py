#!/usr/bin/env python3
"""Gera a trilha instrumental dos anúncios com a Eleven Music.

    python3 scripts/gerar_trilha.py 2            # duas variantes
    python3 scripts/gerar_trilha.py 2 --variantes 3

Gera em `audioN/trilha-vN.mp3` e imprime o nível de cada variante segundo a
segundo. Escolher pelo número não substitui escutar, mas pega o problema
mais comum de trilha gerada: a variante que tem uma queda no meio.

Uma queda de 6 dB no meio de um vídeo de 27 segundos é uma quebra que a
música fez pra ela mesma, não pro anúncio — e ela cai onde bem entender,
normalmente em cima de uma fala. Foi assim que a variante 1 do anúncio 2 foi
descartada: -21 dB aos 15s contra -15 dB no resto.

Depois de escolher, copie pra `public/` com o nome que o Anuncio*.tsx usa
(`trilha.mp3` no anúncio 1, `trilha-2.mp3` no 2).
"""

from __future__ import annotations

import argparse
import math
import os
import subprocess
import sys
import wave
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

FFMPEG = next(
    (p for p in RAIZ.glob("node_modules/@remotion/compositor-linux-*/ffmpeg")),
    Path("ffmpeg"),
)

TRILHAS = {
    # Anúncio 1: a narração é quase contínua, então a trilha é só um leito.
    "1": {
        "pasta": RAIZ / "audio",
        "duracao_ms": 25_000,
        "prompt": (
            "Warm, gentle acoustic pop instrumental for a short vertical ad "
            "about a dog training app. Soft ukulele and light percussion, "
            "friendly and reassuring, steady and low-key. Plenty of space in "
            "the midrange for a female voiceover on top. No vocals."
        ),
    },
    # Anúncio 2: cinco ganchos em corte rápido, com trechos longos sem
    # narração entre um e outro. A trilha aqui trabalha mais — precisa de
    # pulso constante e nenhuma quebra.
    "2": {
        "pasta": RAIZ / "audio2",
        "duracao_ms": 28_000,
        "prompt": (
            "Upbeat modern pop instrumental for a short vertical social ad "
            "about dog training. Bright plucked synth arpeggio, warm sub "
            "bass, crisp claps and shaker, steady four-on-the-floor at 112 "
            "BPM. Friendly and confident, a little curious, never dramatic. "
            "Consistent energy the whole way, no long intro and no big drop. "
            "Clean space in the midrange so a female voiceover sits clearly "
            "on top."
        ),
    },
}


def cliente():
    from dotenv import load_dotenv

    load_dotenv(RAIZ / ".env")
    load_dotenv(RAIZ.parent.parent / "kids-channel" / ".env")

    chave = os.getenv("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit("Falta ELEVENLABS_API_KEY (num .env aqui ou no kids-channel/).")

    from elevenlabs.client import ElevenLabs

    return ElevenLabs(api_key=chave)


def perfil(caminho: Path) -> list[float]:
    """Nível em dB de cada segundo do arquivo."""
    temporario = caminho.with_suffix(".analise.wav")
    subprocess.run(
        [str(FFMPEG), "-y", "-v", "error", "-i", str(caminho),
         "-ac", "1", "-ar", "16000", str(temporario)],
        check=True,
    )
    try:
        with wave.open(str(temporario), "rb") as w:
            taxa, total = w.getframerate(), w.getnframes()
            import array

            dados = array.array("h")
            dados.frombytes(w.readframes(total))
    finally:
        temporario.unlink(missing_ok=True)

    niveis = []
    for segundo in range(total // taxa):
        trecho = dados[segundo * taxa : (segundo + 1) * taxa]
        rms = math.sqrt(sum(x * x for x in trecho) / len(trecho))
        niveis.append(20 * math.log10(rms / 32768) if rms else -99.0)
    return niveis


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera a trilha de um anúncio")
    ap.add_argument("anuncio", nargs="?", default="1", choices=sorted(TRILHAS))
    ap.add_argument("--variantes", type=int, default=2)
    args = ap.parse_args()

    cfg = TRILHAS[args.anuncio]
    cfg["pasta"].mkdir(parents=True, exist_ok=True)
    el = cliente()

    for n in range(1, args.variantes + 1):
        print(f"gerando variante {n}/{args.variantes}...")
        audio = el.music.compose(
            prompt=cfg["prompt"],
            music_length_ms=cfg["duracao_ms"],
            model_id="music_v2",
            force_instrumental=True,
            output_format="mp3_44100_192",
        )
        destino = cfg["pasta"] / f"trilha-v{n}.mp3"
        destino.write_bytes(b"".join(audio))

        niveis = perfil(destino)
        # Ignora os dois últimos segundos: quase toda trilha termina em
        # fade, e isso não é uma quebra no meio.
        miolo = niveis[:-2] or niveis
        queda = max(miolo) - min(miolo)
        print(f"  {destino.name}  queda máxima no miolo: {queda:.1f} dB")
        print("   ", " ".join(f"{x:.0f}" for x in niveis))

    print("\nEscute as variantes. Menor queda = trilha mais parelha.")
    print("Depois copie a escolhida pra public/ com o nome que o "
          "Anuncio*.tsx espera.")


if __name__ == "__main__":
    main()
