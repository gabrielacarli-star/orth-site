#!/usr/bin/env python3
"""Monta o episodio.json de cada roteiro, seguindo a estrutura da Fase 2.

    python3 scripts/criar_episodio.py           # cria os que faltam
    python3 scripts/criar_episodio.py --refazer # reescreve todos

O arquivo criativo é o `roteiros.py` — letra, ritmo e cenários. Este script
só transforma isso em cenas, tempos e coreografia de personagem, aplicando
sempre o mesmo arco de episódio:

    vinheta · gancho · refrão 1 · verso 1 · momento Bolha ·
    verso 2 · refrão final · despedida

Os tempos que ele escreve são CHUTE. Quem corrige é o
`sincronizar_legenda.py`, depois que a música existir — os tempos daqui só
precisam estar na ordem certa e mais ou menos espalhados.
"""

from __future__ import annotations

import argparse
import json

from comum import PASTA_EPISODIOS, RAIZ
from roteiros import ROTEIROS

VINHETA = 8.0
FPS = 30

# Posições fixas de cada personagem em cena, pra eles nunca se atropelarem.
# São as mesmas usadas no episódio 001, que já foi conferido no render.
SOZINHA = {"quem": "maria", "x": 0.5, "y": 0.82}
DUPLA = [
    {"quem": "maria", "x": 0.34, "y": 0.82},
    {"quem": "nina", "x": 0.68, "y": 0.83, "espelhado": True},
]
GRUPO = [
    {"quem": "maria", "x": 0.19, "y": 0.82},
    {"quem": "pipo", "x": 0.37, "y": 0.82, "escala": 0.8},
    {"quem": "bolha", "x": 0.55, "y": 0.76},
    {"quem": "nina", "x": 0.8, "y": 0.83, "espelhado": True},
]


def com(personagens, cantam):
    """Copia o elenco marcando quem canta esta linha."""
    return [{**p, **({"cantando": True} if p["quem"] in cantam else {})} for p in personagens]


def montar_cenas(roteiro: dict) -> list[dict]:
    letra = roteiro["letra"]
    a, b = roteiro["cenario_a"], roteiro["cenario_b"]
    n = len(letra)

    # Fatias do arco, em proporção do número de linhas. Assim o gerador
    # funciona com roteiro de 18 ou de 24 linhas sem precisar de ajuste.
    fim_gancho = 2
    fim_refrao1 = fim_gancho + 4
    fim_verso1 = fim_refrao1 + 4
    fim_verso2 = fim_verso1 + 4

    cenas = []
    t = VINHETA
    for i, linha in enumerate(letra):
        ultima = i == n - 1

        if i < fim_gancho:
            cenario, elenco, cantam = a, DUPLA, ("maria",)
        elif i < fim_refrao1:
            cenario, elenco, cantam = a, DUPLA, ("maria", "nina")
        elif i < fim_verso1:
            # Verso 1 é a Nina ensinando, em outro cenário.
            cenario, elenco, cantam = b, DUPLA, ("nina",)
        elif i < fim_verso2:
            # Verso 2 é a Maria tentando.
            cenario, elenco, cantam = b, DUPLA, ("maria",)
        else:
            cenario, elenco, cantam = a, GRUPO, ("maria", "nina")

        # A primeira linha do episódio tem a Maria sozinha em cena.
        personagens = [SOZINHA] if i == 0 else com(elenco, cantam)
        # Na despedida ninguém canta, todo mundo acena.
        if ultima:
            personagens = com(GRUPO, ())

        dur = 5.0 if i < fim_refrao1 else 7.0
        cenas.append(
            {
                "de": round(t, 2),
                "ate": round(t + dur, 2),
                "cenario": cenario,
                "legenda": linha,
                "personagens": personagens,
            }
        )
        t += dur

        # Momento Bolha: interrupção cômica sem letra, logo depois do verso 1.
        if i == fim_verso1 - 1:
            cenas.append(
                {
                    "de": round(t, 2),
                    "ate": round(t + 12.0, 2),
                    "cenario": a,
                    "personagens": [
                        {"quem": "bolha", "x": 0.55, "y": 0.74, "escala": 1.3},
                        {"quem": "pipo", "x": 0.37, "y": 0.82, "escala": 0.8},
                        {"quem": "maria", "x": 0.19, "y": 0.82, "escala": 0.85},
                    ],
                }
            )
            t += 12.0

    return cenas


def escrever_indice() -> int:
    """Regera video/src/episodios.ts com todos os episódios que existem.

    Manter a lista de imports à mão com 10+ episódios é fonte de erro
    silencioso: esquecer um import faz o episódio simplesmente não aparecer
    no Remotion, sem nenhuma mensagem.
    """
    pastas = sorted(
        p for p in PASTA_EPISODIOS.iterdir() if p.is_dir() and (p / "episodio.json").exists()
    )
    linhas = [
        "// ARQUIVO GERADO — não edite à mão.",
        "// Regerado por scripts/criar_episodio.py.",
        "",
        'import type { Episodio } from "./marca/tipos";',
        "",
    ]
    nomes = []
    for pasta in pastas:
        var = "ep" + pasta.name.split("-")[0]
        nomes.append(var)
        linhas.append(f'import {var} from "../../episodios/{pasta.name}/episodio.json";')
    linhas += ["", "export const EPISODIOS = ["]
    linhas += [f"  {n}," for n in nomes]
    linhas += ["] as unknown as Episodio[];", ""]

    (RAIZ / "video" / "src" / "episodios.ts").write_text("\n".join(linhas), encoding="utf-8")
    return len(nomes)


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera o episodio.json de cada roteiro")
    ap.add_argument("--refazer", action="store_true", help="reescreve mesmo se já existir")
    args = ap.parse_args()

    criados = 0
    for roteiro in ROTEIROS:
        pasta = PASTA_EPISODIOS / roteiro["pasta"]
        destino = pasta / "episodio.json"
        if destino.exists() and not args.refazer:
            print(f"  já existe  {roteiro['id']}  {roteiro['titulo']}")
            continue

        cenas = montar_cenas(roteiro)
        episodio = {
            "id": roteiro["id"],
            "titulo": roteiro["titulo"],
            "pilar": roteiro["pilar"],
            "ritmo": roteiro["ritmo"],
            "fps": FPS,
            "duracaoSegundos": cenas[-1]["ate"],
            "cenas": cenas,
        }
        pasta.mkdir(parents=True, exist_ok=True)
        destino.write_text(json.dumps(episodio, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"  criado     {roteiro['id']}  {roteiro['titulo']:22s} "
              f"{len(cenas)} cenas · {episodio['duracaoSegundos']:.0f}s · {roteiro['ritmo']}")
        criados += 1

    total = escrever_indice()
    print(f"\nÍndice regerado: video/src/episodios.ts com {total} episódio(s).")
    if criados:
        print(f"{criados} episódio(s) criado(s). Próximo passo, um de cada vez:")
        print("  python3 scripts/gerar_musica.py <id>")
        print("  python3 scripts/sincronizar_legenda.py <id>")


if __name__ == "__main__":
    main()
