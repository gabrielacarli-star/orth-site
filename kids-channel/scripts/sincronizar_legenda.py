#!/usr/bin/env python3
"""Ajusta os tempos das cenas no episodio.json pra bater com a música gerada.

    python3 scripts/sincronizar_legenda.py 001

Este é o script que faz a diferença entre "vídeo de IA" e vídeo que parece
feito por gente.

O problema: quando a gente escreve o episodio.json à mão, os tempos de cada
cena são chute ("o refrão começa aos 21 segundos"). A Eleven Music gera a
música com o timing dela, que nunca é igual ao chute. Resultado: a legenda
aparece antes ou depois da linha ser cantada, e a boca do personagem abre na
hora errada — o defeito que mais entrega conteúdo automatizado.

A solução: a ElevenLabs tem uma API de *forced alignment* que recebe o áudio
e o texto e devolve o instante exato de cada palavra. Com isso a gente
reescreve os tempos do episodio.json pra bater com a música de verdade.

Rode DEPOIS de escolher a variante da música e ANTES de renderizar o vídeo.
"""

from __future__ import annotations

import argparse
import json
import shutil

from pathlib import Path

from comum import PASTA_PUBLIC, cliente, ler_episodio, letra_do_episodio, pasta_do_episodio

# Taxas de bit e amostragem do MPEG-1 Layer III, na ordem em que o cabeçalho
# do quadro as indexa. Só precisamos disso pra saber a duração do arquivo.
_BITRATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
_AMOSTRAGENS = [44100, 48000, 32000, 0]


def duracao_do_mp3(caminho: Path) -> float:
    """Duração em segundos, lendo o primeiro cabeçalho de quadro do MP3.

    A Eleven Music devolve MP3 de taxa constante, então tamanho ÷ taxa de bit
    dá a duração exata. Fazer isso à mão evita puxar mutagen/ffmpeg só pra
    responder uma pergunta de uma linha.
    """
    dados = caminho.read_bytes()
    for i in range(len(dados) - 4):
        if dados[i] == 0xFF and (dados[i + 1] & 0xE0) == 0xE0:
            bitrate = _BITRATES[(dados[i + 2] >> 4) & 0x0F]
            amostragem = _AMOSTRAGENS[(dados[i + 2] >> 2) & 0x03]
            if bitrate and amostragem:
                return round((len(dados) - i) * 8 / (bitrate * 1000), 2)
    raise SystemExit(f"Não consegui ler a duração de {caminho.name}")


def instantes_das_linhas(alinhamento, linhas: list[str], deslocamento: float):
    """Mapeia cada linha da letra pro instante em que ela começa a ser cantada.

    A API devolve `words`, uma lista de palavras com `start` e `end` em
    segundos. Como mandamos as linhas concatenadas na mesma ordem, dá pra
    caminhar por essa lista consumindo tantas palavras quantas a linha tem, e
    ler o `start` da primeira palavra de cada uma.

    Usar palavras em vez de caracteres é de propósito: contagem de caractere
    quebra com acento e pontuação, e um deslocamento de um caractere joga a
    legenda inteira fora do lugar.
    """
    palavras = [p for p in getattr(alinhamento, "words", []) if (p.text or "").strip()]
    inicios: list[float] = []
    cursor = 0

    for linha in linhas:
        quantas = len(linha.split())
        if cursor >= len(palavras):
            # A música acabou antes da letra: repete o último instante
            # conhecido em vez de estourar.
            inicios.append(inicios[-1] if inicios else deslocamento)
            continue
        inicios.append(round(palavras[cursor].start + deslocamento, 2))
        cursor += quantas

    return inicios


def main() -> None:
    ap = argparse.ArgumentParser(description="Sincroniza os tempos das cenas com a música")
    ap.add_argument("episodio", help="id do episódio, ex: 001")
    ap.add_argument(
        "--audio",
        default="musica-v1.mp3",
        help="qual variante usar (padrão musica-v1.mp3)",
    )
    ap.add_argument(
        "--vinheta",
        type=float,
        default=8.0,
        help="segundos de vinheta antes da música começar (padrão 8)",
    )
    args = ap.parse_args()

    pasta = pasta_do_episodio(args.episodio)
    caminho_audio = pasta / "audio" / args.audio
    if not caminho_audio.exists():
        raise SystemExit(
            f"Não achei {caminho_audio}.\n"
            f"Gere a música primeiro: python3 scripts/gerar_musica.py {args.episodio}"
        )

    episodio = ler_episodio(args.episodio)
    linhas = letra_do_episodio(episodio)
    if not linhas:
        raise SystemExit("Esse episódio não tem legenda nenhuma pra sincronizar.")

    # A duração do episódio passa a ser a da música escolhida + a vinheta.
    # Sem isso o vídeo termina antes ou depois da música e sobra silêncio.
    duracao_musica = duracao_do_mp3(caminho_audio)
    episodio["duracaoSegundos"] = round(args.vinheta + duracao_musica, 2)

    # O Remotion lê o áudio de video/public/, então copiamos pra lá com um
    # nome estável por episódio.
    nome_publico = f"musica-{episodio['id']}.mp3"
    (PASTA_PUBLIC).mkdir(parents=True, exist_ok=True)
    shutil.copy(caminho_audio, PASTA_PUBLIC / nome_publico)
    episodio["audio"] = nome_publico

    print(f"Música: {caminho_audio.name} ({duracao_musica:.1f}s)")
    print(f"Episódio passa a ter {episodio['duracaoSegundos']:.1f}s (vinheta + música)")
    print(f"Alinhando {len(linhas)} linhas com {caminho_audio.name}...")

    el = cliente()
    with open(caminho_audio, "rb") as arquivo:
        alinhamento = el.forced_alignment.create(file=arquivo, text="\n".join(linhas))

    inicios = instantes_das_linhas(alinhamento, linhas, args.vinheta)

    # Casa cena com linha POR POSIÇÃO, não por texto.
    #
    # Isto aqui era um bug de verdade: a versão anterior montava um
    # dicionário {texto da legenda -> instante}. Como o refrão repete
    # ("Olha a cor, olha a cor" aparece 4 vezes no episódio), as 4 cenas
    # recebiam o instante da PRIMEIRA ocorrência e o refrão do fim entrava
    # no tempo do refrão do começo. Andar em paralelo pelas cenas e pelas
    # linhas, na ordem, resolve — que é exatamente a ordem em que
    # letra_do_episodio() montou a lista.
    cenas = episodio["cenas"]
    indices_com_legenda = [i for i, c in enumerate(cenas) if (c.get("legenda") or "").strip()]
    if len(indices_com_legenda) != len(linhas):
        raise SystemExit(
            f"Descasou: {len(indices_com_legenda)} cenas com legenda contra "
            f"{len(linhas)} linhas de letra. Verifique se há legendas repetidas "
            "em cenas seguidas no episodio.json."
        )

    mudancas = 0
    for pos, i in enumerate(indices_com_legenda):
        novo_de = inicios[pos]
        if abs(novo_de - cenas[i]["de"]) > 0.05:
            mudancas += 1
        cenas[i]["de"] = novo_de

    # Cenas sem legenda (o momento Bolha) ficam entre as duas cenas âncora
    # mais próximas, mantendo a proporção que tinham antes.
    for i, cena in enumerate(cenas):
        if i in indices_com_legenda or i == 0:
            continue
        anterior = cenas[i - 1]["de"]
        seguinte = cenas[i + 1]["de"] if i + 1 < len(cenas) else episodio["duracaoSegundos"]
        cena["de"] = round(anterior + (seguinte - anterior) * 0.5, 2)

    # Cada cena termina onde a próxima começa; a última vai até o fim.
    for i in range(len(cenas) - 1):
        cenas[i]["ate"] = cenas[i + 1]["de"]
    cenas[-1]["ate"] = episodio["duracaoSegundos"]

    destino = pasta / "episodio.json"
    shutil.copy(destino, pasta / "episodio.json.bak")
    destino.write_text(json.dumps(episodio, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"{mudancas} cena(s) tiveram o tempo corrigido.")
    print(f"Gravado em {destino.name} (cópia do anterior em episodio.json.bak).")
    print("Agora é só renderizar: cd video && npm run render")


if __name__ == "__main__":
    main()
