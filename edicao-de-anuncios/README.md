# Edição de anúncios

Kit pra pegar um criativo de vídeo pronto e trocar o áudio inteiro:
narração nova pela ElevenLabs, música nova (instrumental ou cantada),
textos queimados substituídos na imagem, corte no fim.

Não é um editor com timeline. O `anuncio.json` é a receita e o vídeo sai
do código — trocar o idioma é trocar a faixa de áudio, não refazer a
montagem.

> **Se você vai passar isso pra outro Claude, mande o
> [`COMECE-AQUI.md`](./COMECE-AQUI.md).** É lá que estão as regras que não
> são óbvias e as armadilhas que já custaram render perdido.

---

## Instalar

```bash
cp .env.example .env          # e preencha ELEVENLABS_API_KEY
pip install -r scripts/requirements.txt
cd video && npm install && cd ..
```

## Fazer um anúncio

```bash
# 1. entender o vídeo — sempre primeiro
python3 scripts/analisar.py original.mp4 --idioma spa --frames 0,3,6,12,18,24

# 2. montar a receita
mkdir -p anuncios/meu-anuncio
cp anuncios/dogflow-2/anuncio.json anuncios/meu-anuncio/anuncio.json   # e edite
cp original.mp4 video/public/meu-anuncio.mp4

# 3. áudio
python3 scripts/narracao.py meu-anuncio            # narração falada
python3 scripts/musica.py  meu-anuncio --trilha    # base instrumental
python3 scripts/musica.py  meu-anuncio --jingle    # ou jingle cantado

# 4. render
python3 scripts/indexar.py
cd video && npm run studio
```

Custo por anúncio: **menos de US$ 1** (narração + 3 variantes de música).

---

## O que cada script faz

| script | o que faz |
|---|---|
| `analisar.py` | transcreve com timestamp por palavra, mede o volume, extrai frames |
| `narracao.py` | gera as falas, calcula a velocidade e encaixa nos instantes |
| `musica.py` | trilha instrumental ou jingle cantado, escolhendo a melhor variante |
| `indexar.py` | regenera o catálogo que o Remotion lê |

---

## As três decisões que sustentam o kit

**1. A narração entra onde a original entrava.** O vídeo é transcrito com
timestamp por palavra, e cada fala nova é colocada na marca da antiga. É
isso que faz o áudio novo casar com o corte e com o texto na tela sem
reeditar imagem nenhuma.

**2. Uma velocidade só por anúncio.** A voz sintetizada fala mais devagar
que a original, então alguma coisa precisa comprimir. Comprimir cada frase
no fator dela soa estranho — o ouvido percebe *mudança* de velocidade, não
velocidade. O `narracao.py` acha a fala mais apertada e aplica o fator dela
em todas.

**3. Conferir medindo.** Todo bug sério deste pipeline foi encontrado
medindo o áudio ou o brilho da imagem, e nenhum foi encontrado relendo o
código. O `comum.py` tem as funções de medição prontas.

---

## Estrutura

```
edicao-de-anuncios/
  COMECE-AQUI.md            instruções pra outro Claude
  .env.example              chave da ElevenLabs

  scripts/
    comum.py                .env, ffmpeg do Remotion, medição de áudio
    analisar.py             o que rodar antes de tudo
    narracao.py             fala nova encaixada no tempo
    musica.py               trilha instrumental ou jingle cantado
    indexar.py              regenera video/src/anuncios.ts

  anuncios/
    dogflow-2/
      anuncio.json          a receita (exemplo real, funcionando)
      bruto/                áudio gerado, antes de acelerar

  video/                    projeto Remotion (npm separado)
    src/tipos.ts            o formato do anuncio.json, comentado
    src/Anuncio.tsx         monta o vídeo a partir do JSON
    src/fonte.ts            Baloo 2 embutida em base64
    public/                 vídeo original e áudio pronto
```

O áudio gerado, o vídeo original e o render **não** entram no
repositório: são grandes, custam centavos pra refazer, e o material de
origem normalmente não é nosso.

---

## Antes de veicular

Duas perguntas que não são técnicas e decidem se o anúncio pode ir pro ar:

- **De quem são as imagens?** Trocar voz e nome não muda a origem do
  vídeo. A estrutura de um anúncio não é de ninguém; as imagens são.
- **Onde está o fecho?** Anúncio de instalação precisa de logo e botão de
  loja no fim. Se o cartão final da marca original foi cortado, ficou um
  buraco.
