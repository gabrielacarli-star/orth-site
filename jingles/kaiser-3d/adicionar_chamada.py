#!/usr/bin/env python3
"""Acrescenta uma chamada FALADA (não cantada) no fim de um jingle.

    python3 adicionar_chamada.py kaiser-B2.mp3

Gera "Chama no WhatsApp: <número>" como narração da ElevenLabs, ajusta o
volume pra bater com o volume médio do jingle, e concatena os dois com um
fade curto entre eles.

## Por que a chamada é falada, não cantada

O jingle já cantou o nome da marca no refrão; o número de telefone é outra
categoria de informação — alguém precisa conseguir ANOTAR ou DISCAR
enquanto ouve, o que exige ritmo constante e pausas previsíveis entre
dígitos. Uma melodia não garante isso: ela pode acelerar, segurar nota ou
comprimir sílabas bem no meio do número.

Também não cabia dentro do jingle original: sobravam só ~2,3s de
instrumental depois da última palavra cantada, curto demais pra falar um
telefone com clareza. Por isso a chamada vem DEPOIS que a música termina,
não por cima dela.

## Por que os dígitos são falados um por um

"Seis, cinco, nove, nove, três, cinco, um, um, três, zero, oito" em vez de
"sessenta e cinco, noventa e nove mil...". Números por extenso viram fala
corrida rápido — dígito por dígito, cada um pausado, é o padrão de rádio e
TV, e é o que dá pra realmente anotar de ouvido.

## Por que o volume é corrigido

A narração da ElevenLabs sai bem mais baixa que uma faixa de música
mixada (medido: -24 dB contra -15 dB do jingle, quase 10 dB de
diferença). Sem corrigir, a chamada final soa como se alguém tivesse
esquecido o microfone ligado baixo — quem ouve no celular, no volume que
já estava, pode nem notar que ela existe.

Aplica-se +9 dB e um limitador (`alimiter`) pra não estourar: o pico da
narração já estava a -4,6 dB, e boost de +9 dB sem limitador cortaria o
topo do áudio (clipping).
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent

VOZ = "FGY2WhTYpPnrIDTdsKH5"  # Laura — a mesma voz usada nos jingles falados
TELEFONE_PADRAO = "65993511308"


def cliente():
    from dotenv import load_dotenv

    load_dotenv(RAIZ / ".env")
    chave = os.getenv("ELEVENLABS_API_KEY")
    if not chave:
        sys.exit("Falta ELEVENLABS_API_KEY num .env nesta pasta.")

    from elevenlabs.client import ElevenLabs

    return ElevenLabs(api_key=chave)


def falar_digitos(telefone: str) -> str:
    """'65993511308' -> 'seis, cinco, nove, nove, três, cinco, um, um, três, zero, oito'."""
    nomes = "zero um dois três quatro cinco seis sete oito nove".split()
    apenas_digitos = re.sub(r"\D", "", telefone)
    return ", ".join(nomes[int(d)] for d in apenas_digitos)


def volume_medio_db(caminho: Path) -> float:
    saida = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(caminho),
         "-af", "volumedetect", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    m = re.search(r"mean_volume:\s*(-?\d+\.?\d*)\s*dB", saida)
    if not m:
        sys.exit(f"Não consegui medir o volume de {caminho}")
    return float(m.group(1))


def duracao(caminho: Path) -> float:
    saida = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(caminho)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(saida)


def main() -> None:
    ap = argparse.ArgumentParser(description="Acrescenta a chamada com telefone no fim do jingle")
    ap.add_argument("jingle", help="arquivo do jingle já pronto, ex: kaiser-B2.mp3")
    ap.add_argument("--telefone", default=TELEFONE_PADRAO)
    ap.add_argument("--rede", default="WhatsApp", help="nome da rede na chamada")
    ap.add_argument("--saida", default=None, help="padrão: <jingle>-chamada.mp3")
    args = ap.parse_args()

    jingle = Path(args.jingle)
    if not jingle.exists():
        sys.exit(f"Não achei {jingle}")

    saida = Path(args.saida) if args.saida else jingle.with_stem(jingle.stem + "-chamada")
    bruto = RAIZ / "bruto"
    bruto.mkdir(exist_ok=True)

    texto = f"Chama no {args.rede}! {falar_digitos(args.telefone)}."
    print(f"Narração: {texto}")

    el = cliente()
    audio = el.text_to_speech.convert(
        voice_id=VOZ, text=texto, model_id="eleven_multilingual_v2",
        language_code="pt", output_format="mp3_44100_128",
    )
    tag_bruta = bruto / "tag-chamada.mp3"
    tag_bruta.write_bytes(b"".join(audio))

    # Confere os dígitos por transcrição — é barato e é a única forma de
    # saber se a chamada saiu com o número certo antes de montar o final.
    with open(tag_bruta, "rb") as f:
        r = el.speech_to_text.convert(file=f, model_id="scribe_v1", language_code="por")
    print(f"Transcrição de conferência: {r.text.strip()}")
    apenas_digitos_ditos = re.sub(r"\D", "", r.text)
    apenas_digitos_pedidos = re.sub(r"\D", "", args.telefone)
    if apenas_digitos_pedidos not in apenas_digitos_ditos:
        print(
            "  ATENÇÃO: a transcrição não bate com o telefone pedido.\n"
            "  Ouça o arquivo antes de usar — pode ter saído um dígito errado."
        )

    # Iguala o volume da chamada ao do jingle. Narração sai bem mais baixa
    # que música mixada; sem isso a chamada final soa baixinha demais.
    alvo = volume_medio_db(jingle)
    atual = volume_medio_db(tag_bruta)
    ganho = min(alvo - atual, 9.0)  # nunca mais que +9 dB, pra não estourar
    print(f"Volume do jingle: {alvo:.1f} dB · da chamada: {atual:.1f} dB · "
          f"ganho aplicado: +{ganho:.1f} dB")

    fim_util = duracao(jingle) - 0.7  # onde começa o fade de saída do jingle
    silencio = bruto / "silencio.mp3"
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-f", "lavfi",
         "-i", "anullsrc=r=44100:cl=stereo", "-t", "0.4", str(silencio)],
        check=True,
    )

    subprocess.run(
        ["ffmpeg", "-y", "-v", "error",
         "-i", str(jingle), "-i", str(silencio), "-i", str(tag_bruta),
         "-filter_complex",
         f"[0:a]afade=t=out:st={fim_util:.2f}:d=0.7[a0];"
         f"[2:a]volume={ganho:.1f}dB,alimiter=limit=0.95,afade=t=in:st=0:d=0.15[a2];"
         "[a0][1:a][a2]concat=n=3:v=0:a=1[out]",
         "-map", "[out]", str(saida)],
        check=True,
    )

    print(f"\nGravado em {saida} ({duracao(saida):.1f}s).")


if __name__ == "__main__":
    main()
