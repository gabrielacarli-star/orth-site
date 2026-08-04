#!/usr/bin/env python3
"""Transforma o arquivo .ttf da fonte da marca num módulo TypeScript.

    python3 scripts/embutir_fonte.py

Por que embutir em vez de carregar o .ttf normalmente:

O Remotion renderiza cada frame numa aba de navegador, e ele recicla essas
abas durante um render longo. Toda vez que uma aba nova nasce, a fonte
precisa ser baixada de novo — e se esse download travar por 28 segundos, o
render inteiro morre no meio (foi exatamente o que aconteceu no frame 159 do
primeiro teste). Fonte embutida em base64 é síncrona: não tem download, não
tem espera, não tem como travar. O bundle fica ~560 KB maior e o render fica
determinístico.

Rode este script de novo se um dia trocar a fonte da marca.
"""

from __future__ import annotations

import base64
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "video" / "public" / "fontes" / "Baloo2-800.ttf"
DESTINO = RAIZ / "video" / "src" / "marca" / "fonte-embutida.ts"

CABECALHO = """// ARQUIVO GERADO — não edite à mão.
// Gerado por scripts/embutir_fonte.py a partir de video/public/fontes/.
//
// Fonte: Baloo 2 (SIL Open Font License 1.1 — uso comercial liberado,
// inclusive em vídeo monetizado).

export const FONTE_BASE64 =
  "%s";
"""


def main() -> None:
    if not ORIGEM.exists():
        raise SystemExit(f"Não achei a fonte em {ORIGEM}")

    b64 = base64.b64encode(ORIGEM.read_bytes()).decode("ascii")
    DESTINO.write_text(CABECALHO % b64, encoding="utf-8")

    print(f"{ORIGEM.name} ({ORIGEM.stat().st_size/1024:.0f} KB)")
    print(f"  -> {DESTINO.relative_to(RAIZ)} ({DESTINO.stat().st_size/1024:.0f} KB)")


if __name__ == "__main__":
    main()
