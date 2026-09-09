#!/usr/bin/env python3
"""Monta o vídeo de fotos da Kaiser com o jingle e legenda sincronizada.

    python3 montar_video.py

Lê as fotos de video/fotos/ (na ORDEM definida em ORDEM, não a ordem
alfabética do arquivo), corta cada uma pro formato vertical 1080x1920,
troca de foto num ritmo constante batendo com a duração da música, queima
a letra em cima sincronizada palavra por palavra (video/palavras.json,
gerado por forced alignment na faixa final) e mixa com o áudio.

## Por que corte central, não a foto inteira

A maioria das fotos já é vertical, mas em proporções diferentes umas das
outras (900x1600, 1170x1428, 1170x1571...). Deixar cada uma no seu
tamanho faria o vídeo "pular" de proporção a cada corte — mais visível
ainda num slideshow rápido. Cortar todas pro mesmo 1080x1920 (cobrindo o
quadro, sem barra preta) é o que dá o efeito de vídeo contínuo, não de
carrossel de fotos de tamanhos diferentes.

## Por que corte seco, sem crossfade

O jingle é rápido (122 BPM, andamento "animado" de propósito). Crossfade
suaviza e combina com música calma; corte seco acompanha o pulso — é
o mesmo motivo por trás de videoclipe e comercial de produto cortarem no
tempo da batida.
"""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
FOTOS = RAIZ / "fotos"
FONTES = RAIZ / "fontes"
AUDIO = RAIZ.parent / "kaiser-B2.mp3"
SAIDA = RAIZ / "kaiser-video.mp4"

LARGURA, ALTURA, FPS = 1080, 1920, 30

# Ordem de exibição — não é a ordem alfabética do arquivo. Abre com as
# peças mais coloridas (chama mais atenção nos primeiros segundos, que é
# o que decide se alguém para de rolar o feed), intercala brinquedo,
# chaveiro e presente personalizado, e fecha no busto do cachorro com a
# placa gravada — é a peça que melhor mostra acabamento e personalização,
# os dois diferenciais que o site mais destaca.
ORDEM = [
    "01.jpg",  # hortinha sensorial — colorida, abre bem
    "05.jpg",  # chaveiros de anjo, várias cores
    "09.jpg",  # chaveiro pomba dourada
    "06.jpg",  # chaveiro Torre Eiffel
    "11.jpg",  # milho na mão — mostra escala/detalhe
    "04.jpg",  # moldes de milho e cenoura
    "02.jpg",  # fidget toy (polvo)
    "03.jpg",  # elefante degradê
    "07.jpg",  # casal com balão de coração
    "08.jpg",  # cegonha com ultrassom — presente personalizado
    "10.jpg",  # caixinhas de borboleta, casamento
    "13.jpg",  # caixa "I love you"
    "12.jpg",  # anjo cachorro alado
    "14.jpg",  # busto de cachorro com placa gravada — fecha
]

# Letra na mesma ordem cantada — usada só pra agrupar as palavras de
# video/palavras.json em linhas de legenda. Trocar o texto aqui sem
# regerar palavras.json (rodando o forced alignment de novo) deixa a
# legenda incoerente com o que é cantado.
LINHAS = [
    "Brinde, troféu, brinquedo, presente,",
    "a Kaiser imprime o que você tem na mente.",
    "Quebrou uma peça? A gente repõe,",
    "sua ideia em 3D, é a Kaiser que compõe.",
    "Kaiser, Kaiser, impressão 3D,",
    "do desenho ao objeto, sob encomenda, é!",
    "Kaiser, Kaiser, impressão 3D,",
    "do desenho ao objeto, sob encomenda, é!",
]

# Cartão final, depois que a música acaba. Fica em cima da mesma última
# foto (o busto do cachorro), congelada mais alguns segundos — não é uma
# foto nova, só um tempo a mais nela.
CTA_SEGUNDOS = 2.2
CTA_TITULO = "SIGA PRA MAIS"
CTA_ARROBA = "@kaiserimpressoes3d"


def dimensoes(caminho: Path) -> tuple[int, int]:
    saida = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height", "-of", "csv=p=0", str(caminho)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    w, h = saida.split(",")
    return int(w), int(h)


def duracao_audio() -> float:
    saida = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(AUDIO)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(saida)


def gerar_ass(duracao_total: float) -> Path:
    """Agrupa video/palavras.json nas LINHAS e escreve a legenda em .ass."""
    palavras = json.loads((RAIZ / "palavras.json").read_text())

    cursor = 0
    eventos = []
    for linha in LINHAS:
        quantas = len(linha.split())
        do_grupo = palavras[cursor:cursor + quantas]
        if not do_grupo:
            continue
        inicio, fim = do_grupo[0]["inicio"], do_grupo[-1]["fim"]
        eventos.append((inicio, fim, linha))
        cursor += quantas

    def t(segundos: float) -> str:
        cs = round(segundos * 100)
        h, resto = divmod(cs, 360000)
        m, resto = divmod(resto, 6000)
        s, cs = divmod(resto, 100)
        return f"{h:d}:{m:02d}:{s:02d}.{cs:02d}"

    cabecalho = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {LARGURA}
PlayResY: {ALTURA}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Baloo 2,84,&H00FFFFFF,&H00FFFFFF,&H00181818,&H00000000,-1,0,0,0,100,100,0,0,1,10,0,2,60,60,170,1
Style: Encerramento,Baloo 2,88,&H00FFFFFF,&H00FFFFFF,&H00000000,&H99000000,-1,0,0,0,100,100,0,0,3,0,0,5,80,80,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    linhas_evento = "\n".join(
        f"Dialogue: 0,{t(ini)},{t(fim)},Default,,0,0,0,,{texto.upper()}"
        for ini, fim, texto in eventos
    )

    # Cartão final: estilo à parte (caixa opaca, centralizado na tela) pra
    # ler como um encerramento, não como mais uma linha de letra.
    inicio_cta, fim_cta = duracao_total, duracao_total + CTA_SEGUNDOS
    linha_cta = (
        f"Dialogue: 1,{t(inicio_cta)},{t(fim_cta)},Encerramento,,0,0,0,,"
        f"{CTA_TITULO}\\N{{\\fs60}}{CTA_ARROBA}"
    )

    destino = RAIZ / "legenda.ass"
    destino.write_text(
        cabecalho + linhas_evento + "\n" + linha_cta + "\n", encoding="utf-8"
    )
    return destino


def main() -> None:
    duracao_total = duracao_audio()
    por_foto = duracao_total / len(ORDEM)
    print(f"Áudio: {duracao_total:.2f}s · {len(ORDEM)} fotos · "
          f"{por_foto:.2f}s cada · cartão final +{CTA_SEGUNDOS:.1f}s")

    legenda = gerar_ass(duracao_total)
    print(f"Legenda gravada em {legenda.name}")

    # Um slide por foto, na duração do ritmo, mais um último slide extra:
    # a MESMA foto de fechamento (não uma nova), só que congelada pelos
    # segundos do cartão final — dá o efeito de "a imagem para e aparece
    # o convite pra seguir", sem cortar pra uma tela em branco.
    slides = [(nome, por_foto) for nome in ORDEM]
    slides.append((ORDEM[-1], CTA_SEGUNDOS))

    entradas, filtros, rotulos = [], [], []
    for i, (nome, duracao_slide) in enumerate(slides):
        caminho = FOTOS / nome
        if not caminho.exists():
            raise SystemExit(f"Não achei {caminho}")
        entradas += ["-loop", "1", "-t", f"{duracao_slide:.3f}", "-i", str(caminho)]

        largura_foto, altura_foto = dimensoes(caminho)
        if largura_foto > altura_foto:
            # Paisagem: cortar pro quadro vertical perderia as pontas (foi
            # o caso da hortinha — o corte central deixava só 2 dos 4
            # brinquedos visíveis). Em vez disso, a foto inteira fica
            # centralizada por cima de uma cópia dela mesma, ampliada e
            # desfocada, preenchendo o quadro sem cortar nada nem deixar
            # tarja preta.
            filtros.append(
                f"[{i}:v]split=2[bg{i}][fg{i}];"
                f"[bg{i}]scale={LARGURA}:{ALTURA}:force_original_aspect_ratio=increase,"
                f"crop={LARGURA}:{ALTURA},gblur=sigma=30,eq=brightness=-0.08[bgf{i}];"
                f"[fg{i}]scale={LARGURA}:-2:force_original_aspect_ratio=decrease[fgf{i}];"
                f"[bgf{i}][fgf{i}]overlay=(W-w)/2:(H-h)/2,setsar=1,fps={FPS}[v{i}]"
            )
        else:
            filtros.append(
                f"[{i}:v]scale={LARGURA}:{ALTURA}:force_original_aspect_ratio=increase,"
                f"crop={LARGURA}:{ALTURA},setsar=1,fps={FPS}[v{i}]"
            )
        rotulos.append(f"[v{i}]")

    concat = "".join(rotulos) + f"concat=n={len(slides)}:v=1:a=0[semlegenda]"
    # libass lê o arquivo relativo ao cwd do processo ffmpeg, então
    # rodamos com cwd=RAIZ e passamos só o nome do arquivo.
    legendado = f"[semlegenda]subtitles={legenda.name}:fontsdir={FONTES}[video]"

    # A música não toca durante o cartão final — ela já termina sozinha
    # (o jingle tem fade próprio). `apad` só completa com silêncio até o
    # vídeo (foto + cartão) acabar, pra as duas trilhas baterem em
    # duração sem precisar de -shortest cortando o último frame.
    indice_audio = len(slides)
    audio_esticado = f"[{indice_audio}:a]apad=pad_dur={CTA_SEGUNDOS}[audio]"

    filtro_completo = ";".join(filtros) + ";" + concat + ";" + legendado + ";" + audio_esticado

    comando = [
        "ffmpeg", "-y", "-v", "error", "-stats",
        *entradas,
        "-i", str(AUDIO),
        "-filter_complex", filtro_completo,
        "-map", "[video]", "-map", "[audio]",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        str(SAIDA),
    ]
    subprocess.run(comando, cwd=RAIZ, check=True)
    print(f"\nGravado em {SAIDA} ({duracao_total + CTA_SEGUNDOS:.1f}s no total)")


if __name__ == "__main__":
    main()
