"""Coisas que todos os scripts do pipeline usam.

Nada de mágico aqui: carrega o .env, acha as pastas do projeto e lê o
episodio.json. Ficou num arquivo só pra não repetir o mesmo bloco em cada
script.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Pastas do projeto, calculadas a partir de onde ESTE arquivo está — assim os
# scripts funcionam de qualquer diretório, não só da raiz.
RAIZ = Path(__file__).resolve().parent.parent
PASTA_EPISODIOS = RAIZ / "episodios"
PASTA_PUBLIC = RAIZ / "video" / "public"

load_dotenv(RAIZ / ".env")


def cliente():
    """Devolve o cliente da ElevenLabs, ou explica o que falta e encerra."""
    chave = os.getenv("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit(
            "Falta a chave da ElevenLabs.\n"
            f"  1. copie {RAIZ / '.env.example'} para {RAIZ / '.env'}\n"
            "  2. preencha ELEVENLABS_API_KEY (elevenlabs.io -> Settings -> API Keys)"
        )

    try:
        from elevenlabs.client import ElevenLabs
    except ImportError:
        sys.exit("Falta instalar as dependências: pip install -r scripts/requirements.txt")

    return ElevenLabs(api_key=chave)


def pasta_do_episodio(episodio_id: str) -> Path:
    """Acha a pasta do episódio pelo id ('001' -> episodios/001-as-cores-da-ilha/)."""
    candidatas = sorted(PASTA_EPISODIOS.glob(f"{episodio_id}-*"))
    if not candidatas:
        disponiveis = ", ".join(p.name for p in sorted(PASTA_EPISODIOS.iterdir()) if p.is_dir())
        sys.exit(f"Não achei episódio com id '{episodio_id}'. Existem: {disponiveis or '(nenhum)'}")
    return candidatas[0]


def ler_episodio(episodio_id: str) -> dict:
    pasta = pasta_do_episodio(episodio_id)
    return json.loads((pasta / "episodio.json").read_text(encoding="utf-8"))


def letra_do_episodio(episodio: dict) -> list[str]:
    """Todas as linhas de legenda, na ordem, sem repetir linha seguida."""
    linhas: list[str] = []
    for cena in episodio["cenas"]:
        texto = (cena.get("legenda") or "").strip()
        if texto and (not linhas or linhas[-1] != texto):
            linhas.append(texto)
    return linhas


def gravar(caminho: Path, pedacos) -> Path:
    """Grava um iterador de bytes (o formato que a API da ElevenLabs devolve)."""
    caminho.parent.mkdir(parents=True, exist_ok=True)
    with open(caminho, "wb") as arquivo:
        for pedaco in pedacos:
            arquivo.write(pedaco)
    return caminho


def tamanho_legivel(caminho: Path) -> str:
    kb = caminho.stat().st_size / 1024
    return f"{kb/1024:.1f} MB" if kb > 1024 else f"{kb:.0f} KB"
