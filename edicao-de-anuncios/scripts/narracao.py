#!/usr/bin/env python3
"""Gera a narração nova e faz ela caber nos instantes do vídeo.

    python3 scripts/narracao.py dogflow-2
    python3 scripts/narracao.py dogflow-2 --velocidade 1.30

Lê `anuncios/<nome>/anuncio.json`, manda cada fala pra ElevenLabs e grava
o resultado em `video/public/<nome>-N.mp3`, que é de onde o Remotion lê.

## O problema que este script resolve

Numa dublagem a imagem já está pronta. A fala nova não pode entrar quando
quiser: ela tem que entrar onde a antiga entrava, senão descola do corte e
do texto queimado na tela. E ela não pode ser mais longa que o espaço até a
próxima, senão atropela.

A voz sintetizada quase sempre fala mais devagar que a locutora original.
Então alguma coisa precisa ser comprimida.

## A regra: uma velocidade só pro anúncio inteiro

A tentação é comprimir cada frase no fator que ela precisa. **Não faça
isso.** Uma frase a 1,46x no meio de frases a 1,0x soa acelerada — o
ouvido não percebe velocidade absoluta, percebe mudança de velocidade.
Velocidade constante soa natural mesmo quando é bem rápida.

Por padrão o script calcula sozinho: gera tudo, mede, descobre qual é a
fala mais apertada e aplica o fator dela em todas.

Se o fator calculado passar de ~1,35 o script avisa. Acima disso é melhor
encurtar o texto da fala mais longa do que espremer o anúncio inteiro.
"""

from __future__ import annotations

import argparse
import math
import sys

from comum import (
    PASTA_PUBLIC, acelerar, cliente, duracao, gravar_anuncio, ler_anuncio,
    pasta_do_anuncio,
)

# Acima disso a voz começa a soar mecânica. Não é um limite técnico, é o
# ponto em que fica audível.
LIMITE_CONFORTAVEL = 1.35


def main() -> None:
    ap = argparse.ArgumentParser(description="Gera e encaixa a narração")
    ap.add_argument("anuncio", help="nome da pasta em anuncios/")
    ap.add_argument(
        "--velocidade", default="auto",
        help="fator do atempo, ou 'auto' pra calcular (padrão auto)",
    )
    args = ap.parse_args()

    dados = ler_anuncio(args.anuncio)
    pasta = pasta_do_anuncio(args.anuncio)
    bruto = pasta / "bruto"
    bruto.mkdir(exist_ok=True)
    PASTA_PUBLIC.mkdir(parents=True, exist_ok=True)

    falas = dados.get("falas") or []
    if not falas:
        sys.exit("Esse anuncio.json não tem `falas`.")

    voz = dados["voz"]
    idioma = dados.get("idioma", "es")
    fim = dados["duracaoSegundos"]

    el = cliente()

    # 1. Gera tudo primeiro, sem acelerar nada. Só dá pra escolher a
    #    velocidade depois de saber quanto cada fala dura de verdade.
    print(f"Gerando {len(falas)} fala(s) com a voz {voz}...")
    for i, fala in enumerate(falas, 1):
        # mp3_44100_192 e pcm_44100 são bloqueados pro text-to-speech em
        # alguns planos; 128 kbps passa em todos e é mais que suficiente
        # pra narração que ainda vai ser mixada e recomprimida pela rede.
        audio = el.text_to_speech.convert(
            voice_id=voz,
            text=fala["texto"],
            model_id=dados.get("modelo", "eleven_multilingual_v2"),
            language_code=idioma,
            output_format="mp3_44100_128",
        )
        (bruto / f"fala-{i}.mp3").write_bytes(b"".join(audio))
        print(f"  {i}/{len(falas)}")

    # 2. Quanto espaço cada fala tem: do instante dela até o da próxima
    #    (a última vai até o fim do vídeo).
    espacos = []
    for i, fala in enumerate(falas):
        proxima = falas[i + 1]["em"] if i + 1 < len(falas) else fim
        espacos.append(proxima - fala["em"])

    duracoes = [duracao(bruto / f"fala-{i}.mp3") for i in range(1, len(falas) + 1)]

    # 3. A velocidade. Uma só, a da fala mais apertada.
    if args.velocidade == "auto":
        necessarios = [d / e for d, e in zip(duracoes, espacos)]
        # Arredonda pra cima em passos de 0,01, com uma folguinha, pra não
        # ficar exatamente no limite.
        velocidade = max(1.0, math.ceil(max(necessarios) * 100 + 1) / 100)
        apertada = necessarios.index(max(necessarios)) + 1
        print(f"\nVelocidade calculada: {velocidade:.2f}x "
              f"(quem manda é a fala {apertada})")
    else:
        velocidade = float(args.velocidade)
        print(f"\nVelocidade fixada em {velocidade:.2f}x")

    if velocidade > LIMITE_CONFORTAVEL:
        print(
            f"  ATENÇÃO: acima de {LIMITE_CONFORTAVEL}x a voz começa a soar\n"
            f"  mecânica. Prefira encurtar o texto da fala mais longa a\n"
            f"  espremer o anúncio inteiro."
        )

    # 4. Acelera e joga em public/, conferindo se cabe.
    prefixo = dados.get("prefixo", args.anuncio)
    print()
    estourou = False
    for i, fala in enumerate(falas, 1):
        destino = PASTA_PUBLIC / f"{prefixo}-{i}.mp3"
        acelerar(bruto / f"fala-{i}.mp3", destino, velocidade)

        dura = duracao(destino)
        folga = espacos[i - 1] - dura
        if folga < 0:
            estourou = True
        print(f"  {i}  entra {fala['em']:6.2f}s  dura {dura:4.2f}s  "
              f"folga {folga:+5.2f}s  {fala['texto'][:38]}")

    print(f"\nGravado em video/public/{prefixo}-*.mp3")
    if estourou:
        print("Folga negativa: essa fala atropela a próxima. Encurte o texto.")
    else:
        print("Todas as falas cabem.")

    # Guarda a velocidade usada no anuncio.json, pra ficar registrado o que
    # foi feito com a voz (e pra reproduzir depois sem recalcular).
    dados["velocidade"] = round(velocidade, 2)
    gravar_anuncio(args.anuncio, dados)


if __name__ == "__main__":
    main()
