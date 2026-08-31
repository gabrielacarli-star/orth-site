#!/usr/bin/env python3
"""Gera o jingle CANTADO dos anúncios com a Eleven Music.

    python3 scripts/gerar_jingle.py 2
    python3 scripts/gerar_jingle.py 2 --variantes 4

É a mesma técnica do canal infantil: a Eleven Music já devolve a música
com a voz cantando a letra, não é uma base com voz colada em cima depois.

Diferença importante em relação à narração falada: aqui **não dá pra
escolher onde cada linha cai**. Na narração a gente gera frase por frase e
posiciona cada uma no instante que quiser. Numa música a Eleven decide o
andamento, e a letra cai onde a melodia mandar.

Por isso a letra não repete as perguntas que estão queimadas na tela — ela
diz a mensagem da marca. Se a letra repetisse o texto da tela, qualquer
descompasso viraria a voz cantando "muerde" enquanto a tela diz "orine".
Falando de outra coisa (o problema em geral, o app, a chamada), os dois se
reforçam sem precisar bater palavra por palavra.

O script gera N variantes e pontua cada uma com o *forced alignment*: a
`loss` mede o quanto o que foi CANTADO bate com a letra que escrevemos.
Menor loss = a voz pronunciou a letra do jeito que está escrita, que num
jingle de 27 segundos é o que decide se dá pra entender o nome do app.
Não substitui escutar; escolhe melhor que moeda.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

JINGLES = {
    "2": {
        "pasta": RAIZ / "audio2",
        "duracao_ms": 27_000,
        "estilo": (
            "Upbeat, catchy Latin pop advertising jingle in Spanish. One "
            "warm female voice singing lead, bright acoustic guitar, claps, "
            "shaker and a light four-on-the-floor beat around 112 BPM. "
            "Friendly and confident, the sound of a happy commercial. Clear "
            "diction — every word has to be understandable on a phone "
            "speaker. Straight into the first line, no long intro."
        ),
        "titulo": "DogFlow",
        # A letra cobre o que o anúncio mostra (ladrar, morder, puxar a
        # coleira) sem repetir as perguntas da tela, e fecha com o nome e a
        # chamada — que é justamente o que faltava nos dois vídeos.
        "letra": [
            "¿Tu perro ladra y no te escucha?",
            "¿Muerde, tira de la correa?",
            "No hace falta gritar que no,",
            "no hace falta un adiestrador.",
            "DogFlow, DogFlow,",
            "paso a paso, desde casa.",
            "DogFlow, DogFlow,",
            "tu perro aprende hoy.",
        ],
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


def montar_prompt(cfg: dict) -> str:
    letra = "\n".join(cfg["letra"])
    return (
        f"{cfg['estilo']}\n\n"
        f"Song title: {cfg['titulo']}.\n"
        "Structure: sing the four verse lines once, then the four chorus "
        "lines, then repeat the chorus to the end. The brand name has to "
        "land clearly every time.\n\n"
        f"Lyrics (Spanish, sing exactly these lines):\n{letra}"
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera o jingle cantado de um anúncio")
    ap.add_argument("anuncio", nargs="?", default="2", choices=sorted(JINGLES))
    ap.add_argument("--variantes", type=int, default=3)
    args = ap.parse_args()

    cfg = JINGLES[args.anuncio]
    cfg["pasta"].mkdir(parents=True, exist_ok=True)
    el = cliente()
    prompt = montar_prompt(cfg)
    letra = "\n".join(cfg["letra"])

    custo = (cfg["duracao_ms"] / 60_000) * 0.15 * args.variantes
    print(f"{args.variantes} variante(s) de {cfg['duracao_ms']/1000:.0f}s "
          f"— custo estimado US$ {custo:.2f}\n")

    placar = []
    for n in range(1, args.variantes + 1):
        print(f"gerando variante {n}/{args.variantes}...")
        audio = el.music.compose(
            prompt=prompt,
            music_length_ms=cfg["duracao_ms"],
            model_id="music_v2",
            output_format="mp3_44100_192",
        )
        destino = cfg["pasta"] / f"jingle-v{n}.mp3"
        destino.write_bytes(b"".join(audio))

        with open(destino, "rb") as f:
            al = el.forced_alignment.create(file=f, text=letra)
        placar.append((al.loss, destino, al))
        print(f"  {destino.name}  alinhamento {al.loss:.3f}")

    placar.sort(key=lambda x: x[0])
    melhor_loss, melhor, al = placar[0]
    print(f"\n-> melhor: {melhor.name} (loss {melhor_loss:.3f})")

    # Onde cada linha cai na variante escolhida. Não dá pra mudar esses
    # instantes — servem pra saber o que está acontecendo em cada ponto do
    # vídeo, e pra conferir se o nome da marca aparece cedo.
    palavras = [p for p in getattr(al, "words", []) if (p.text or "").strip()]
    cursor = 0
    print("\nonde cada linha cai:")
    for linha in cfg["letra"]:
        quantas = len(linha.split())
        if cursor < len(palavras):
            print(f"  {palavras[cursor].start:5.2f}s  {linha}")
        cursor += quantas

    print(f"\nEscute as variantes em {cfg['pasta'].name}/. "
          f"Depois copie a escolhida pra public/jingle-{args.anuncio}.mp3.")


if __name__ == "__main__":
    main()
