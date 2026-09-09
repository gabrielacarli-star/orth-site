#!/usr/bin/env python3
"""Gera o jingle cantado da Kaiser Impressões 3D com a Eleven Music.

    python3 gerar_jingle.py           # gera as duas opções de letra
    python3 gerar_jingle.py A         # só a opção A
    python3 gerar_jingle.py B --variantes 4

A música já vem com a voz cantando a letra — não é uma base instrumental
com voz colada depois.

Gera N variantes por opção e pontua cada uma pela loss do forced
alignment: mede o quanto o que foi CANTADO bate com a letra escrita.
Num jingle de marca, isso decide se dá pra entender o nome "Kaiser" e o
que a empresa faz. Não substitui escutar; escolhe melhor que moeda.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
DURACAO_MS = 24_000

ESTILO = (
    "Warm, upbeat Brazilian pop jingle for a small creative business ad. "
    "One friendly female voice singing lead, acoustic guitar, light "
    "percussion, claps, a small brass stab on the chorus. Confident and "
    "craft-like, not corporate — the sound of a maker who does quality "
    "work. Clear diction in Brazilian Portuguese, every word "
    "understandable on a phone speaker. Straight into the first line, "
    "no long intro."
)

OPCOES = {
    "A": {
        "titulo": "Kaiser Impressões 3D — opção A",
        "letra": [
            "Tem uma ideia? Manda pra cá,",
            "a Kaiser faz ela ganhar forma de verdade.",
            "Camada por camada, com cor e precisão,",
            "do desenho ao objeto, na palma da sua mão.",
            "Kaiser, Kaiser, impressão 3D,",
            "peça única ou lote, do seu jeito, sob medida!",
        ],
    },
    "B": {
        "titulo": "Kaiser Impressões 3D — opção B",
        "letra": [
            "Brinde, troféu, protótipo, presente,",
            "a Kaiser imprime o que você tem na mente.",
            "Quebrou uma peça? A gente repõe,",
            "sua ideia em 3D, é a Kaiser que compõe.",
            "Kaiser, Kaiser, impressão 3D,",
            "do desenho ao objeto, sob encomenda, é!",
        ],
    },
}


def cliente():
    from dotenv import load_dotenv

    load_dotenv(RAIZ / ".env")
    chave = os.getenv("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit("Falta ELEVENLABS_API_KEY num .env nesta pasta.")

    from elevenlabs.client import ElevenLabs

    return ElevenLabs(api_key=chave)


def montar_prompt(cfg: dict) -> str:
    letra = "\n".join(cfg["letra"])
    return (
        f"{ESTILO}\n\n"
        f"Song title: {cfg['titulo']}.\n"
        "Structure: sing the four verse lines once, then the two chorus "
        "lines, then repeat the chorus once more to close. The brand name "
        '"Kaiser" has to land clearly every time it appears.\n\n'
        f"Lyrics (Brazilian Portuguese, sing exactly these lines):\n{letra}"
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera o jingle da Kaiser")
    ap.add_argument("opcao", nargs="?", default="AB", help="A, B, ou AB pras duas (padrão)")
    ap.add_argument("--variantes", type=int, default=3)
    args = ap.parse_args()

    quais = ["A", "B"] if args.opcao.upper() == "AB" else [args.opcao.upper()]
    for q in quais:
        if q not in OPCOES:
            sys.exit(f"Opção '{q}' não existe. Use A, B ou AB.")

    bruto = RAIZ / "bruto"
    bruto.mkdir(exist_ok=True)
    el = cliente()

    custo = (DURACAO_MS / 60_000) * 0.15 * args.variantes * len(quais)
    print(f"{len(quais)} opção(ões) x {args.variantes} variante(s) de "
          f"{DURACAO_MS/1000:.0f}s — custo estimado US$ {custo:.2f}\n")

    for q in quais:
        cfg = OPCOES[q]
        prompt = montar_prompt(cfg)
        letra = "\n".join(cfg["letra"])

        print(f"== opção {q}")
        placar = []
        for n in range(1, args.variantes + 1):
            print(f"  gerando variante {n}/{args.variantes}...")
            audio = el.music.compose(
                prompt=prompt,
                music_length_ms=DURACAO_MS,
                model_id="music_v2",
                output_format="mp3_44100_192",
            )
            destino = bruto / f"kaiser-{q}-v{n}.mp3"
            destino.write_bytes(b"".join(audio))

            with open(destino, "rb") as f:
                al = el.forced_alignment.create(file=f, text=letra)
            placar.append((al.loss, destino))
            print(f"    {destino.name}  alinhamento {al.loss:.3f}")

        placar.sort(key=lambda x: x[0])
        melhor_loss, melhor = placar[0]
        escolhida = RAIZ / f"kaiser-{q}.mp3"
        escolhida.write_bytes(melhor.read_bytes())
        print(f"  -> melhor: {melhor.name} (loss {melhor_loss:.3f})")
        print(f"  copiado pra {escolhida.name}\n")

    print("Pronto. Escute os kaiser-A.mp3 / kaiser-B.mp3 na raiz da pasta.")


if __name__ == "__main__":
    main()
