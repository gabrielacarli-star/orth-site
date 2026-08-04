#!/usr/bin/env python3
"""Confere todos os episódios antes de renderizar.

    python3 scripts/conferir_episodios.py

Render de um episódio leva ~16 minutos. Nove episódios são duas horas e
meia. Descobrir no fim da fila que um deles estava com o áudio faltando é
tempo jogado fora — por isso esta conferência existe, e por isso ela roda
em segundos.

O que ela verifica:
  - o episódio aponta pra um arquivo de áudio, e o arquivo existe
  - a duração do episódio bate com a duração real da música
  - as cenas estão em ordem, sem buraco e sem se sobrepor
  - a última cena fecha exatamente no fim do episódio
"""

from __future__ import annotations

import json
import sys
import wave
from pathlib import Path

from comum import PASTA_EPISODIOS, PASTA_PUBLIC

# Cabeçalho de quadro MPEG-1 Layer III, pra ler duração de MP3 sem dependência.
_BITRATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
_AMOSTRAGENS = [44100, 48000, 32000, 0]


def duracao(caminho: Path) -> float:
    if caminho.suffix.lower() == ".wav":
        with wave.open(str(caminho), "rb") as w:
            return w.getnframes() / w.getframerate()
    dados = caminho.read_bytes()
    for i in range(len(dados) - 4):
        if dados[i] == 0xFF and (dados[i + 1] & 0xE0) == 0xE0:
            b = _BITRATES[(dados[i + 2] >> 4) & 0x0F]
            a = _AMOSTRAGENS[(dados[i + 2] >> 2) & 0x03]
            if b and a:
                return (len(dados) - i) * 8 / (b * 1000)
    return 0.0


def conferir(dados: dict) -> tuple[list[str], list[str]]:
    """Devolve (erros que impedem render, avisos que não impedem)."""
    erros: list[str] = []
    avisos: list[str] = []
    cenas = dados["cenas"]
    audio = dados.get("audio", "")

    if not audio:
        erros.append("sem áudio — rode o sincronizar_legenda.py")
    else:
        arquivo = PASTA_PUBLIC / audio
        if not arquivo.exists():
            erros.append(f"{audio} não existe em video/public/")
        else:
            real = duracao(arquivo)
            if abs((dados["duracaoSegundos"] - 8) - real) > 0.6:
                erros.append(f"duração não bate: episódio pede {dados['duracaoSegundos']-8:.0f}s, música tem {real:.0f}s")
            if arquivo.suffix.lower() == ".mp3":
                avisos.append("áudio em MP3 (com perda) — regerar em WAV antes de mandar pro streaming")

    for i in range(len(cenas) - 1):
        if cenas[i]["de"] >= cenas[i]["ate"]:
            erros.append(f"cena {i} começa depois de terminar")
        if abs(cenas[i]["ate"] - cenas[i + 1]["de"]) > 0.01:
            erros.append(f"buraco ou sobreposição entre as cenas {i} e {i+1}")
            break
    if abs(cenas[-1]["ate"] - dados["duracaoSegundos"]) > 0.1:
        erros.append("a última cena não fecha no fim do episódio")
    if not dados.get("ritmo"):
        avisos.append("sem ritmo definido — vai usar o padrão do pilar")

    return erros, avisos


def main() -> None:
    total_erros = 0
    for pasta in sorted(p for p in PASTA_EPISODIOS.iterdir() if p.is_dir()):
        arquivo = pasta / "episodio.json"
        if not arquivo.exists():
            continue
        dados = json.loads(arquivo.read_text(encoding="utf-8"))
        erros, avisos = conferir(dados)
        total_erros += len(erros)

        estado = "OK" if not erros else "ERRO"
        print(f"{estado:4} {dados['id']}  {dados['titulo'][:26]:28} "
              f"{dados.get('ritmo', '-'):15} {dados['duracaoSegundos']:5.0f}s  {len(dados['cenas'])} cenas")
        for e in erros:
            print(f"       ✗ {e}")
        for a in avisos:
            print(f"       ~ {a}")

    print()
    if total_erros:
        print(f"{total_erros} problema(s) — corrija antes de renderizar.")
        sys.exit(1)
    print("Todos os episódios prontos pra renderizar.")


if __name__ == "__main__":
    main()
