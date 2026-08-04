#!/usr/bin/env python3
"""Gera os efeitos sonoros do canal com a ElevenLabs.

    python3 scripts/gerar_sfx.py            # gera os que faltam
    python3 scripts/gerar_sfx.py --refazer  # gera tudo de novo

Efeito sonoro é o item mais barato do pipeline e o que mais muda a percepção
de qualidade: é o que faz o Bolha ser engraçado e a vinheta ter graça. Como
são poucos e reaproveitados em TODO episódio, geram-se uma vez só.

Regra de segurança da Fase 2: nada de som que assuste. Sem impacto seco, sem
grave pesado, sem pico de volume. Todos os prompts aqui pedem som macio e
curto de propósito.
"""

from __future__ import annotations

import argparse

from comum import PASTA_PUBLIC, cliente, gravar, tamanho_legivel

# Biblioteca de efeitos do canal. Nome do arquivo -> (prompt, duração).
EFEITOS: dict[str, tuple[str, float]] = {
    "bolha-quica": (
        "A soft, cute water bubble bouncing once on sand. Gentle wet 'bloop', "
        "playful, cartoon-like, no impact, no bass thump.",
        1.0,
    ),
    "bolha-pop": (
        "A small, soft cartoon bubble popping. Light and round, friendly, "
        "no sharpness, no startle.",
        0.8,
    ),
    "bolha-assobio": (
        "A short, playful cartoon whistle going up, like a tiny cheerful fish. "
        "Soft attack, warm tone, no shrill high frequencies.",
        1.2,
    ),
    "vinheta-jingle": (
        "A short, bright four-note ukulele and xylophone jingle for a children's "
        "cartoon logo. Major key, warm, acoustic, ending on a soft triangle chime.",
        3.0,
    ),
    "acerto": (
        "A gentle, happy cartoon 'correct answer' chime. Two soft xylophone notes "
        "going up, warm and encouraging, no fanfare, no loud peak.",
        1.2,
    ),
    "tenta-de-novo": (
        "A soft, kind cartoon 'try again' sound. Two gentle notes going down on a "
        "wooden marimba. Warm and reassuring, never sad or harsh.",
        1.2,
    ),
    "passinhos": (
        "Tiny light bird footsteps on soft warm sand, four quick soft steps, "
        "very gentle, no crunch.",
        1.5,
    ),
    "ondinha": (
        "A very soft, small tropical wave washing onto sand and receding. "
        "Calm and continuous, no crash, no splash peak.",
        3.0,
    ),
}


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera os efeitos sonoros do canal")
    ap.add_argument("--refazer", action="store_true", help="regera até os que já existem")
    ap.add_argument("--so", help="gera só um efeito, pelo nome (ex: bolha-quica)")
    args = ap.parse_args()

    pasta = PASTA_PUBLIC / "sfx"
    alvos = {args.so: EFEITOS[args.so]} if args.so else EFEITOS
    if args.so and args.so not in EFEITOS:
        raise SystemExit(f"Efeito '{args.so}' não existe. Opções: {', '.join(EFEITOS)}")

    pendentes = {
        nome: dados
        for nome, dados in alvos.items()
        if args.refazer or not (pasta / f"{nome}.mp3").exists()
    }

    if not pendentes:
        print("Todos os efeitos já existem. Use --refazer pra gerar de novo.")
        return

    el = cliente()
    for nome, (prompt, segundos) in pendentes.items():
        print(f"Gerando {nome} ({segundos}s)...")
        audio = el.text_to_sound_effects.convert(
            text=prompt,
            duration_seconds=segundos,
            # prompt_influence alto mantém o som fiel à descrição — importante
            # aqui, porque metade da descrição é uma restrição de segurança
            # ("no startle", "no bass thump").
            prompt_influence=0.6,
            output_format="mp3_44100_128",
        )
        destino = gravar(pasta / f"{nome}.mp3", audio)
        print(f"  {destino.name} ({tamanho_legivel(destino)})")

    print(f"\n{len(pendentes)} efeito(s) em {pasta}")


if __name__ == "__main__":
    main()
