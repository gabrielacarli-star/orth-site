#!/usr/bin/env python3
"""Regenera video/src/anuncios.ts a partir das pastas em anuncios/.

    python3 scripts/indexar.py

Rode depois de criar ou editar um anuncio.json. O Remotion precisa dos
dados em tempo de bundle, e ler o disco de dentro de um componente não
funciona — então o índice é um módulo TypeScript gerado.

O anuncio.json continua sendo a fonte de verdade; este arquivo é derivado
e pode ser apagado a qualquer momento.
"""

from __future__ import annotations

import json

from comum import PASTA_ANUNCIOS, RAIZ

DESTINO = RAIZ / "video" / "src" / "anuncios.ts"


def main() -> None:
    pastas = sorted(p for p in PASTA_ANUNCIOS.glob("*") if (p / "anuncio.json").exists())

    corpo = []
    for pasta in pastas:
        dados = json.loads((pasta / "anuncio.json").read_text(encoding="utf-8"))
        corpo.append(json.dumps(dados, indent=2, ensure_ascii=False))

    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(
        "// GERADO por scripts/indexar.py — não edite à mão.\n"
        "// A fonte de verdade é anuncios/<nome>/anuncio.json.\n\n"
        'import type { Anuncio } from "./tipos";\n\n'
        "export const ANUNCIOS: Anuncio[] = [\n"
        + ",\n".join(corpo)
        + "\n];\n",
        encoding="utf-8",
    )

    print(f"{len(pastas)} anúncio(s) em {DESTINO.relative_to(RAIZ)}:")
    for pasta in pastas:
        print(f"  {pasta.name}")


if __name__ == "__main__":
    main()
