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

from comum import cliente, ler_episodio, letra_do_episodio, pasta_do_episodio


def instantes_das_linhas(alinhamento, linhas: list[str], deslocamento: float):
    """Mapeia cada linha da letra pro instante em que a primeira palavra dela
    é cantada.

    O alinhamento vem em nível de caractere. Como a gente mandou as linhas
    concatenadas na mesma ordem, dá pra caminhar pelo texto contando
    caracteres e ler o instante do caractere onde cada linha começa.
    """
    caracteres = alinhamento.characters
    inicios: list[float] = []
    posicao = 0

    for i, linha in enumerate(linhas):
        indice = min(posicao, len(caracteres) - 1)
        inicios.append(round(caracteres[indice].start_time + deslocamento, 2))
        # +1 pelo "\n" que separa as linhas no texto enviado
        posicao += len(linha) + 1

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

    print(f"Alinhando {len(linhas)} linhas com {caminho_audio.name}...")

    el = cliente()
    with open(caminho_audio, "rb") as arquivo:
        alinhamento = el.forced_alignment.create(file=arquivo, text="\n".join(linhas))

    inicios = instantes_das_linhas(alinhamento, linhas, args.vinheta)

    # Reescreve os tempos: cada cena com legenda começa quando a linha dela
    # é cantada, e termina quando a próxima começa.
    por_linha = dict(zip(linhas, inicios))
    cenas = episodio["cenas"]
    mudancas = 0

    for i, cena in enumerate(cenas):
        legenda = (cena.get("legenda") or "").strip()
        if legenda not in por_linha:
            continue
        novo_de = por_linha[legenda]
        if abs(novo_de - cena["de"]) > 0.05:
            mudancas += 1
        cena["de"] = novo_de
        if i > 0:
            cenas[i - 1]["ate"] = novo_de

    # A última cena vai até o fim do episódio.
    cenas[-1]["ate"] = episodio["duracaoSegundos"]

    destino = pasta / "episodio.json"
    shutil.copy(destino, pasta / "episodio.json.bak")
    destino.write_text(json.dumps(episodio, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"{mudancas} cena(s) tiveram o tempo corrigido.")
    print(f"Gravado em {destino.name} (cópia do anterior em episodio.json.bak).")
    print("Agora é só renderizar: cd video && npm run render")


if __name__ == "__main__":
    main()
