#!/usr/bin/env python3
"""Gera a música do episódio com a Eleven Music.

    python3 scripts/gerar_musica.py 001
    python3 scripts/gerar_musica.py 001 --variantes 3

Custo: US$ 0,15 por minuto gerado (~R$ 0,80). Uma música de 2:48 sai por
~R$ 2,30 por variante. Gerar 2 ou 3 variantes e escolher a melhor continua
sendo barato — e é o que evita o canal soar sempre igual, que é justamente o
que a política de conteúdo inautêntico do YouTube pune (ver Fase 1).

A música gerada pela Eleven Music vem com direitos comerciais liberados: a
ElevenLabs licenciou as bases com gravadoras e editoras. O que os termos
PROÍBEM é citar no prompt nome de artista, título de música ou letra de
terceiros — por isso os prompts daqui descrevem só ritmo, instrumento e
clima, nunca "no estilo de fulano".
"""

from __future__ import annotations

import argparse

from comum import (
    cliente,
    gravar,
    letra_do_episodio,
    ler_episodio,
    pasta_do_episodio,
    tamanho_legivel,
)

# Descrição musical por pilar do canal (Fase 2, seção 5). É aqui que mora a
# identidade sonora — ritmo brasileiro em vez do pop de teclado genérico que
# todo canal kids de IA usa.
ESTILOS = {
    "dia": (
        "Upbeat Brazilian baião for toddlers, 104 BPM, major key, warm and playful. "
        "Acoustic instruments only: triangle, zabumba drum, accordion, cavaquinho, "
        "ukulele, xylophone and hand claps. Two friendly vocals — a bright childlike "
        "voice and a warm gentle adult voice — singing simple call-and-response lines "
        "in Brazilian Portuguese. Clean mix, no distortion, no heavy bass, "
        "narrow dynamic range, nothing startling."
    ),
    "noite": (
        "Gentle Brazilian lullaby for toddlers, 62 BPM, major key, very soft and slow. "
        "Fingerpicked viola caipira, music box, soft strings and light rain ambience. "
        "One warm, low, almost-whispered adult voice singing in Brazilian Portuguese. "
        "No percussion, no dynamic jumps, consistent low volume throughout."
    ),
}


def montar_prompt(episodio: dict) -> str:
    """Junta estilo do pilar + letra + instruções de estrutura."""
    estilo = ESTILOS[episodio["pilar"]]
    letra = "\n".join(letra_do_episodio(episodio))
    return (
        f"{estilo}\n\n"
        f"Song title: {episodio['titulo']}.\n"
        "Structure: short intro, chorus, verse, short instrumental break, "
        "second verse, final chorus with everyone singing, gentle outro.\n"
        "Repeat the chorus at least four times — repetition is the point.\n\n"
        f"Lyrics (Brazilian Portuguese, sing exactly these lines):\n{letra}"
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera a música do episódio (Eleven Music)")
    ap.add_argument("episodio", help="id do episódio, ex: 001")
    ap.add_argument("--variantes", type=int, default=2, help="quantas versões gerar (padrão 2)")
    ap.add_argument("--modelo", default="music_v2")
    ap.add_argument(
        "--instrumental",
        action="store_true",
        help="gera só a base, sem voz (útil pra compilação e pra versão karaokê)",
    )
    args = ap.parse_args()

    episodio = ler_episodio(args.episodio)
    pasta = pasta_do_episodio(args.episodio) / "audio"
    prompt = montar_prompt(episodio)

    # A Eleven Music cobra pelo tempo gerado, então pedimos exatamente a
    # duração do episódio menos a vinheta de 8 segundos.
    duracao_ms = int((episodio["duracaoSegundos"] - 8) * 1000)
    custo_usd = (duracao_ms / 60000) * 0.15 * args.variantes

    print(f"Episódio {episodio['id']} — {episodio['titulo']} (pilar {episodio['pilar']})")
    print(f"Duração: {duracao_ms/1000:.0f}s · {args.variantes} variante(s)")
    print(f"Custo estimado: US$ {custo_usd:.2f} (~R$ {custo_usd*5.4:.2f})\n")

    el = cliente()
    for n in range(1, args.variantes + 1):
        print(f"Gerando variante {n}/{args.variantes}...")
        audio = el.music.compose(
            prompt=prompt,
            music_length_ms=duracao_ms,
            model_id=args.modelo,
            force_instrumental=args.instrumental,
            output_format="mp3_44100_192",
        )
        destino = pasta / f"musica-v{n}.mp3"
        gravar(destino, audio)
        print(f"  {destino.relative_to(pasta.parent.parent.parent)} ({tamanho_legivel(destino)})")

    print(
        "\nEscute as variantes e copie a melhor pra video/public/ com o nome do\n"
        "episódio, depois preencha o campo \"audio\" no episodio.json."
    )


if __name__ == "__main__":
    main()
