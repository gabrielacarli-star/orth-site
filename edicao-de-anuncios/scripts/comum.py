"""Coisas que todos os scripts usam: .env, ffmpeg, cliente da ElevenLabs.

Ficou num arquivo só pra não repetir o mesmo bloco em cada script.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

# Pastas calculadas a partir de onde ESTE arquivo está, e não do diretório
# de onde você rodou o comando — assim os scripts funcionam de qualquer
# lugar.
RAIZ = Path(__file__).resolve().parent.parent
PASTA_ANUNCIOS = RAIZ / "anuncios"
PASTA_PUBLIC = RAIZ / "video" / "public"

# O ffmpeg e o ffprobe que vêm junto com o Remotion. Usar os dele evita
# pedir pra você instalar ffmpeg no sistema — se o `npm install` do
# video/ rodou, eles existem.
def _binario(nome: str) -> Path:
    achado = next(RAIZ.glob(f"video/node_modules/@remotion/compositor-*/{nome}"), None)
    if achado:
        return achado
    do_sistema = shutil.which(nome)
    if do_sistema:
        return Path(do_sistema)
    # Falhar aqui, com o motivo, é melhor que um FileNotFoundError cru lá
    # na frente — o caso comum é simplesmente não ter rodado o npm install.
    sys.exit(
        f"Não achei o {nome}.\n"
        "  Rode `cd video && npm install` (o Remotion traz ffmpeg e ffprobe),\n"
        f"  ou instale o ffmpeg no sistema."
    )


FFMPEG = _binario("ffmpeg")
FFPROBE = _binario("ffprobe")


def cliente():
    """Cliente da ElevenLabs, ou explica o que falta e encerra."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        sys.exit("Falta instalar: pip install -r scripts/requirements.txt")

    load_dotenv(RAIZ / ".env")
    chave = os.getenv("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit(
            "Falta a chave da ElevenLabs.\n"
            f"  1. copie {RAIZ / '.env.example'} para {RAIZ / '.env'}\n"
            "  2. preencha ELEVENLABS_API_KEY "
            "(elevenlabs.io -> Settings -> API Keys)"
        )

    from elevenlabs.client import ElevenLabs

    return ElevenLabs(api_key=chave)


def pasta_do_anuncio(nome: str) -> Path:
    pasta = PASTA_ANUNCIOS / nome
    if not pasta.exists():
        existentes = [p.name for p in PASTA_ANUNCIOS.glob("*") if p.is_dir()]
        sys.exit(
            f"Não achei anuncios/{nome}/.\n"
            f"Existem: {', '.join(existentes) or '(nenhum)'}"
        )
    return pasta


def ler_anuncio(nome: str) -> dict:
    return json.loads(
        (pasta_do_anuncio(nome) / "anuncio.json").read_text(encoding="utf-8")
    )


def gravar_anuncio(nome: str, dados: dict) -> None:
    destino = pasta_do_anuncio(nome) / "anuncio.json"
    destino.write_text(
        json.dumps(dados, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def duracao(caminho: Path) -> float:
    """Duração em segundos de qualquer arquivo de áudio ou vídeo."""
    saida = subprocess.run(
        [str(FFPROBE), "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(caminho)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(saida)


def acelerar(origem: Path, destino: Path, fator: float) -> None:
    """Muda a velocidade da fala SEM mexer no tom.

    É `atempo`, e não `asetrate`: o asetrate acelera reamostrando, o que
    sobe o tom junto e deixa a voz de desenho animado.
    """
    if abs(fator - 1.0) < 0.001:
        destino.write_bytes(origem.read_bytes())
        return
    subprocess.run(
        [str(FFMPEG), "-y", "-v", "error", "-i", str(origem),
         "-filter:a", f"atempo={fator}", str(destino)],
        check=True,
    )


def niveis_por_segundo(caminho: Path) -> list[float]:
    """Volume em dB de cada segundo do arquivo.

    Serve pra responder por medição perguntas que normalmente a gente
    responde por fé: "a trilha tem um buraco no meio?", "esse vídeo tem
    áudio mesmo?", "a narração entrou?". Vale muito mais que confiar que
    a mudança no código funcionou.
    """
    import array
    import math
    import wave

    temporario = caminho.with_suffix(".analise.wav")
    subprocess.run(
        [str(FFMPEG), "-y", "-v", "error", "-i", str(caminho),
         "-ac", "1", "-ar", "16000", str(temporario)],
        check=True,
    )
    try:
        with wave.open(str(temporario), "rb") as w:
            taxa, total = w.getframerate(), w.getnframes()
            dados = array.array("h")
            dados.frombytes(w.readframes(total))
    finally:
        temporario.unlink(missing_ok=True)

    saida = []
    for segundo in range(total // taxa):
        trecho = dados[segundo * taxa : (segundo + 1) * taxa]
        if not trecho:
            break
        rms = math.sqrt(sum(x * x for x in trecho) / len(trecho))
        saida.append(20 * math.log10(rms / 32768) if rms else -99.0)
    return saida


def desenhar_niveis(niveis: list[float]) -> None:
    for segundo, db in enumerate(niveis):
        barra = "#" * int(max(0, db + 60) / 2)
        print(f"  {segundo:3d}s {db:6.1f} dB {barra}")
