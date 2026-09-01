#!/usr/bin/env python3
"""Lê um vídeo e devolve tudo que você precisa saber antes de editar.

    python3 scripts/analisar.py caminho/do/video.mp4
    python3 scripts/analisar.py video.mp4 --idioma spa --frames 0,6,12,18

Este é o PRIMEIRO script a rodar, sempre. Ele responde:

1. formato, duração, fps — pra composição do Remotion bater com o original;
2. **o instante exato em que cada frase começa**, por speech-to-text com
   timestamp por palavra. É a informação mais importante do processo
   inteiro: é ela que deixa a narração nova cair no mesmo lugar da antiga,
   sem reeditar imagem nenhuma;
3. o volume segundo a segundo, que mostra se há trilha por baixo e onde
   estão os silêncios;
4. frames avulsos em PNG, pra você olhar o que está queimado na tela.

Olhe os frames antes de escrever qualquer linha. Todo texto queimado no
vídeo continua lá depois que você troca o áudio — se ele diz o nome de
outra marca, tem que ser tapado ou cortado.
"""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

from comum import FFMPEG, FFPROBE, cliente, desenhar_niveis, niveis_por_segundo


def formato(caminho: Path) -> None:
    campos = "format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate"
    saida = subprocess.run(
        [str(FFPROBE), "-v", "error", "-show_entries", campos,
         "-of", "default=noprint_wrappers=1", str(caminho)],
        capture_output=True, text=True, check=True,
    ).stdout
    print(saida.strip())


def transcrever(caminho: Path, idioma: str) -> None:
    el = cliente()
    with open(caminho, "rb") as f:
        r = el.speech_to_text.convert(file=f, model_id="scribe_v1", language_code=idioma)

    print(f"\n{r.text}\n")
    print("frases e onde cada uma começa:")

    palavras = [w for w in (getattr(r, "words", []) or []) if (w.text or "").strip()]
    frase, inicio = [], None
    for w in palavras:
        if inicio is None:
            inicio = w.start
        frase.append(w.text)
        if (w.text or "").strip()[-1:] in ".!?":
            print(f"  {inicio:6.2f}s -> {w.end:6.2f}s   {' '.join(frase)}")
            frase, inicio = [], None
    if frase:
        print(f"  {inicio:6.2f}s -> {palavras[-1].end:6.2f}s   {' '.join(frase)}")

    print(
        "\nCopie esses instantes pro campo `falas[].em` do anuncio.json.\n"
        "Eles são o esqueleto do anúncio: a imagem já está lá, e a fala\n"
        "nova precisa entrar onde a antiga entrava."
    )


def extrair_frames(caminho: Path, momentos: list[float], destino: Path) -> None:
    destino.mkdir(parents=True, exist_ok=True)
    for t in momentos:
        saida = destino / f"t{t:g}s.png"
        subprocess.run(
            [str(FFMPEG), "-y", "-v", "error", "-ss", str(t), "-i", str(caminho),
             "-frames:v", "1", str(saida)],
            check=True,
        )
    print(f"\n{len(momentos)} frame(s) em {destino}/ — abra e leia o que está queimado.")


def main() -> None:
    ap = argparse.ArgumentParser(description="Analisa um vídeo antes da edição")
    ap.add_argument("video")
    ap.add_argument("--idioma", default="spa", help="código ISO-639-3 (spa, por, eng)")
    ap.add_argument("--frames", default="", help="segundos separados por vírgula")
    ap.add_argument("--sem-transcricao", action="store_true")
    args = ap.parse_args()

    caminho = Path(args.video).resolve()
    if not caminho.exists():
        raise SystemExit(f"Não achei {caminho}")

    print(f"== {caminho.name}")
    formato(caminho)

    print("\n== volume por segundo")
    desenhar_niveis(niveis_por_segundo(caminho))

    if not args.sem_transcricao:
        print("\n== transcrição")
        transcrever(caminho, args.idioma)

    if args.frames:
        momentos = [float(x) for x in args.frames.split(",") if x.strip()]
        extrair_frames(caminho, momentos, caminho.parent / "frames")


if __name__ == "__main__":
    main()
