#!/usr/bin/env python3
"""Gera a música do anúncio com a Eleven Music — instrumental ou cantada.

    python3 scripts/musica.py dogflow-2 --trilha     # base, pra ficar sob a narração
    python3 scripts/musica.py dogflow-2 --jingle     # cantada, no lugar da narração

Os dois modos leem o mesmo `anuncio.json` e gravam variantes em
`anuncios/<nome>/bruto/`. Cada modo escolhe a melhor por um critério
diferente, e os dois critérios existem porque a IA erra de um jeito
específico em cada caso.

## --trilha (instrumental, por baixo da narração)

Escolhe pela **queda máxima de volume no miolo**. O defeito mais comum de
trilha gerada é a variante que faz uma pausa dramática no meio. Numa música
solta isso é bonito; num anúncio de 27 segundos é um buraco que cai onde
bem entender, normalmente em cima de uma fala. Menor queda = trilha mais
parelha.

## --jingle (cantada, substitui a narração)

Escolhe pela **loss do forced alignment**, que mede o quanto o que foi
CANTADO bate com a letra escrita. Num jingle o que decide tudo é se dá pra
entender o nome da marca; a loss é a melhor proxy automática disso.

**A letra do jingle não deve repetir o texto queimado na tela.** Numa
narração você posiciona cada frase no segundo exato. Numa música quem manda
no andamento é a melodia, e a letra cai onde ela quiser — se a letra
repetisse o texto da tela, meio segundo de descompasso já viraria a voz
cantando uma coisa enquanto a tela mostra outra. Cantando a mensagem da
marca em vez do texto da tela, os dois se somam sem precisar bater palavra
por palavra.

Nenhum dos dois critérios substitui escutar. Eles escolhem melhor que
moeda, que é o objetivo quando são seis arquivos.
"""

from __future__ import annotations

import argparse
import sys

from comum import cliente, ler_anuncio, niveis_por_segundo, pasta_do_anuncio


def montar_prompt_jingle(cfg: dict) -> str:
    letra = "\n".join(cfg["letra"])
    return (
        f"{cfg['estilo']}\n\n"
        f"Song title: {cfg.get('titulo', 'jingle')}.\n"
        "Structure: sing the verse lines once, then the chorus, then repeat "
        "the chorus to the end. The brand name has to land clearly every "
        "time.\n\n"
        f"Lyrics (sing exactly these lines):\n{letra}"
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera a música do anúncio")
    ap.add_argument("anuncio")
    modo = ap.add_mutually_exclusive_group(required=True)
    modo.add_argument("--trilha", action="store_true", help="instrumental")
    modo.add_argument("--jingle", action="store_true", help="cantada")
    ap.add_argument("--variantes", type=int, default=3)
    args = ap.parse_args()

    dados = ler_anuncio(args.anuncio)
    pasta = pasta_do_anuncio(args.anuncio) / "bruto"
    pasta.mkdir(parents=True, exist_ok=True)

    chave = "jingle" if args.jingle else "trilha"
    cfg = dados.get(chave)
    if not cfg:
        sys.exit(f"O anuncio.json não tem a seção `{chave}`.")

    # Pede a duração do vídeo arredondada pra cima: sobrar um segundo de
    # música é inofensivo, faltar deixa o fim do anúncio mudo.
    duracao_ms = int(cfg.get("duracaoSegundos", dados["duracaoSegundos"]) * 1000) + 1000
    prompt = montar_prompt_jingle(cfg) if args.jingle else cfg["prompt"]

    custo = (duracao_ms / 60_000) * 0.15 * args.variantes
    print(f"{args.variantes} variante(s) de {duracao_ms/1000:.0f}s "
          f"— custo estimado US$ {custo:.2f}\n")

    el = cliente()
    placar = []

    for n in range(1, args.variantes + 1):
        print(f"gerando {chave} v{n}/{args.variantes}...")
        audio = el.music.compose(
            prompt=prompt,
            music_length_ms=duracao_ms,
            model_id="music_v2",
            force_instrumental=args.trilha,
            output_format="mp3_44100_192",
        )
        destino = pasta / f"{chave}-v{n}.mp3"
        destino.write_bytes(b"".join(audio))

        if args.jingle:
            with open(destino, "rb") as f:
                al = el.forced_alignment.create(file=f, text="\n".join(cfg["letra"]))
            placar.append((al.loss, destino, al))
            print(f"  {destino.name}  alinhamento {al.loss:.3f} (menor é melhor)")
        else:
            niveis = niveis_por_segundo(destino)
            # Ignora os dois últimos segundos: quase toda trilha termina em
            # fade, e isso não é uma quebra no meio.
            miolo = niveis[:-2] or niveis
            queda = max(miolo) - min(miolo)
            placar.append((queda, destino, niveis))
            print(f"  {destino.name}  queda no miolo {queda:.1f} dB (menor é melhor)")
            print("   ", " ".join(f"{x:.0f}" for x in niveis))

    placar.sort(key=lambda x: x[0])
    nota, melhor, extra = placar[0]
    print(f"\n-> melhor: {melhor.name} ({nota:.3f})")

    if args.jingle:
        # Onde cada linha cai. Não dá pra mudar esses instantes — servem
        # pra saber o que está sendo cantado em cada ponto do vídeo, e pra
        # conferir se a marca aparece cedo.
        palavras = [p for p in getattr(extra, "words", []) if (p.text or "").strip()]
        cursor = 0
        print("\nonde cada linha cai:")
        for linha in cfg["letra"]:
            if cursor < len(palavras):
                print(f"  {palavras[cursor].start:5.2f}s  {linha}")
            cursor += len(linha.split())

    arquivo = cfg.get("arquivo", f"{args.anuncio}-{chave}.mp3")
    print(f"\nEscute as variantes em {pasta}.")
    print(f"Depois copie a escolhida pra video/public/{arquivo}")


if __name__ == "__main__":
    main()
