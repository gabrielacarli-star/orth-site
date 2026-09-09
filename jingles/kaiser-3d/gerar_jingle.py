#!/usr/bin/env python3
"""Gera o jingle cantado da Kaiser Impressões 3D com a Eleven Music.

    python3 gerar_jingle.py A          # só a opção A
    python3 gerar_jingle.py B          # opção B, andamento médio
    python3 gerar_jingle.py B2         # opção B, mesma letra, mais animada
    python3 gerar_jingle.py B2 --variantes 4

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

# Estilo padrão: mid-tempo, pop acústico. Foi o que gerou a opção B
# original — a letra agradou, mas o andamento saiu devagar demais pro
# gosto do cliente.
ESTILO_PADRAO = (
    "Warm, upbeat Brazilian pop jingle for a small creative business ad. "
    "One friendly female voice singing lead, acoustic guitar, light "
    "percussion, claps, a small brass stab on the chorus. Confident and "
    "craft-like, not corporate — the sound of a maker who does quality "
    "work. Clear diction in Brazilian Portuguese, every word "
    "understandable on a phone speaker. Straight into the first line, "
    "no long intro."
)

# Estilo animado: mesmo tom (marca artesanal, não corporativo), mas com
# andamento e instrumentação que empurram pra frente. Descrever o BPM
# explicitamente e nomear o groove ("four-on-the-floor", "driving") é o
# que faz a Eleven Music realmente acelerar — só pedir "upbeat" de novo
# tende a devolver a mesma sensação de antes.
#
# A primeira tentativa foi a 132 BPM com "no held notes: keep the
# syllables moving" — nas três variantes a PRIMEIRA palavra ("Brinde")
# saiu engolida ou trocada ("Tem de", "Vinte, trinta, real", "Pinge").
# O pedido de cantar rápido sem segurar nota nenhuma competiu com a
# dicção logo na entrada, antes da voz "aquecer". 122 BPM e pedir dicção
# nítida explicitamente resolve — ainda é bem mais rápido que o estilo
# padrão, mas dá espaço pra primeira palavra sair inteira.
ESTILO_ANIMADO = (
    "Upbeat, energetic Brazilian pop jingle for a small creative business "
    "ad. Tempo around 122 BPM, driving four-on-the-floor beat, punchy "
    "rhythm guitar, bright synth stabs, claps and shaker running "
    "throughout, quick horn hits on the chorus. One confident, excited "
    "female voice singing lead — feels like a fun, danceable ad hook, not "
    "a ballad and not rushed. Diction has to stay crisp and unhurried on "
    "every single word, especially the very first word of the song — "
    "articulate it fully before the beat pulls the tempo forward. Clear "
    "Brazilian Portuguese throughout, understandable on a phone speaker. "
    "Full energy from the first beat to the last, but never at the cost "
    "of clarity."
)

OPCOES = {
    "A": {
        "titulo": "Kaiser Impressões 3D — opção A",
        "estilo": ESTILO_PADRAO,
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
        "estilo": ESTILO_PADRAO,
        "letra": [
            "Brinde, troféu, brinquedo, presente,",
            "a Kaiser imprime o que você tem na mente.",
            "Quebrou uma peça? A gente repõe,",
            "sua ideia em 3D, é a Kaiser que compõe.",
            "Kaiser, Kaiser, impressão 3D,",
            "do desenho ao objeto, sob encomenda, é!",
        ],
    },
    # Mesma letra da B — só o andamento muda. É a variação pedida depois
    # de ouvir a B e achar o ritmo devagar demais.
    #
    # "brinquedo" entrou na lista da primeira linha depois: a galeria do
    # site é praticamente só brinquedo (hortinha sensorial, polvo
    # articulado, fidget toy), e a letra original não mencionava nenhum.
    # Entrou no lugar de "protótipo", e não como quinto item ou linha
    # nova: uma tentativa anterior colocou os dois na mesma linha (cinco
    # itens) e quebrou a primeira palavra ("Brinde" saiu como "Imprime",
    # "Binde", "Print"); outra deu ao protótipo uma linha própria e
    # quebrou a rima AABB que a versão aprovada tinha (presente/mente).
    # Manter a MESMA estrutura da versão que já soou bem — só trocar uma
    # palavra por outra no mesmo lugar — é o que preserva o ritmo.
    "B2": {
        "titulo": "Kaiser Impressões 3D — opção B (mais animada)",
        "estilo": ESTILO_ANIMADO,
        "letra": [
            "Brinde, troféu, brinquedo, presente,",
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
        f"{cfg['estilo']}\n\n"
        f"Song title: {cfg['titulo']}.\n"
        "Structure: sing the four verse lines once, then the two chorus "
        "lines, then repeat the chorus once more to close. The brand name "
        '"Kaiser" has to land clearly every time it appears.\n\n'
        f"Lyrics (Brazilian Portuguese, sing exactly these lines):\n{letra}"
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera o jingle da Kaiser")
    ap.add_argument(
        "opcao", nargs="?", default="AB",
        help="A, B, B2, ou uma combinação tipo AB / BB2 (padrão AB)",
    )
    ap.add_argument("--variantes", type=int, default=3)
    args = ap.parse_args()

    # "AB" continua sendo o atalho pras duas opções originais. Fora isso,
    # é uma lista separada por vírgula de chaves exatas de OPCOES — assim
    # "B2" não é confundido com "B" + "2".
    if args.opcao.upper() == "AB":
        quais = ["A", "B"]
    else:
        quais = [p.strip().upper() for p in args.opcao.split(",") if p.strip()]
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
