# Instruções para o Claude

Você recebeu esta pasta pra editar um anúncio em vídeo: trocar o áudio por
uma narração ou jingle novo (ElevenLabs), trocar textos queimados na
imagem, e renderizar.

Leia este arquivo inteiro antes de escrever código. Ele é curto, e cada
seção existe porque uma tentativa anterior falhou daquele jeito.

---

## O que este projeto faz

Pega um criativo vertical pronto e **troca o áudio inteiro**, mantendo a
narração nova encaixada nos mesmos instantes da antiga. Opcionalmente
apaga e reescreve textos queimados na imagem, e corta o fim.

A montagem é feita em **Remotion** (React que renderiza vídeo), dirigida
por um `anuncio.json` por anúncio. Áudio pela **ElevenLabs**: text to
speech, Eleven Music, forced alignment e speech-to-text.

Não é um editor de vídeo com timeline. É código: o `anuncio.json` é a
receita e o render é determinístico.

---

## A ideia central, que explica todo o resto

**Numa dublagem a imagem já está pronta.** Você não pode escolher quando a
fala nova entra — ela tem que entrar onde a antiga entrava, senão descola
do corte, do texto na tela e do gesto de quem aparece.

Por isso o processo é sempre:

1. transcrever o vídeo original com **timestamp por palavra**, pra
   descobrir o instante exato de cada frase;
2. gerar a fala nova, frase por frase;
3. **comprimir a velocidade** até cada fala caber no espaço que tem;
4. posicionar cada uma no instante da original.

O passo 3 é necessário porque a voz sintetizada quase sempre fala mais
devagar que a locutora original.

---

## As regras que não são óbvias

### 1. Uma velocidade só para o anúncio inteiro

A tentação é comprimir cada frase no fator que ela precisa. **Não faça
isso.** Uma frase a 1,46x no meio de frases a 1,0x soa acelerada — o
ouvido não percebe velocidade absoluta, percebe *mudança* de velocidade.
Velocidade constante soa natural mesmo quando é bem rápida.

O `scripts/narracao.py --velocidade auto` já calcula assim: mede todas,
acha a mais apertada e aplica o fator dela em todas.

Acima de ~1,35x fica audível. Nesse ponto, encurte o texto da fala mais
longa em vez de espremer o anúncio inteiro.

Use `atempo` do ffmpeg, nunca `asetrate`: o asetrate acelera reamostrando,
o que sobe o tom junto e deixa a voz de desenho animado.

### 2. Texto queimado na tela manda no roteiro

O texto do vídeo original continua lá depois que você troca o áudio. Se a
tela diz "CÓMO EVITAR QUE UN CACHORRO MUERDA", a narração tem que dizer
isso. Voz falando uma coisa enquanto o espectador lê outra é pior que
sotaque ruim.

**Sempre extraia frames e olhe** antes de escrever a narração. O
`analisar.py --frames` faz isso.

### 3. Jingle cantado é outro contrato

Se o áudio for um jingle da Eleven Music em vez de narração, você **perde
o controle do tempo**: quem decide o andamento é a melodia, e a letra cai
onde ela quiser.

Consequência prática: **a letra do jingle não deve repetir o texto da
tela.** Meio segundo de descompasso já vira a voz cantando "muerde"
enquanto a tela diz "orine". Escreva a letra sobre a mensagem da marca —
aí os dois se somam sem precisar bater palavra por palavra.

Em compensação, o jingle é onde cabe o nome da marca repetido, que é o que
um anúncio precisa e uma narração descritiva não entrega.

### 4. Apagar texto queimado precisa de desfoque, não de retângulo

Quando o texto novo é mais curto que o antigo, escrever por cima deixa
letras do original sobrando nas pontas.

Use `backdrop-filter: blur()`, que borra o que **já está pintado atrás**.
Num fundo texturizado o resultado lê como profundidade de campo.

**Não desenhe uma segunda cópia do vídeo desfocada por cima.** Duas
instâncias de `OffthreadVideo` do mesmo arquivo no mesmo frame não
decodificam as duas: a de cima sai preta. Isso custou quatro tentativas
antes de ser diagnosticado medindo o brilho da faixa com o desfoque
desligado — 51 contra 142 em volta.

### 5. Cartão final de outra marca não dá pra localizar

Muitos criativos terminam com logo, nome e botões de loja da marca
original. Isso não é texto sobre imagem, é a marca inteira ocupando a
tela — não tem como cobrir de forma convincente.

Corte. Ache o último frame limpo (extraia frames de 0,05 em 0,05s na
transição) e encurte a composição até ali. Depois avise a pessoa que o
anúncio ficou sem fecho, porque anúncio de instalação precisa de um.

### 6. Verifique medindo, não confiando

Todo bug sério deste projeto foi encontrado medindo, e nenhum foi
encontrado relendo o código:

- áudio adiantado 8 segundos → medindo o nível por segundo;
- faixa de desfoque preta → medindo o brilho da faixa;
- trilha com buraco no meio → medindo o nível segundo a segundo;
- legenda repetida no tempo errado → conferindo cena a cena.

O `comum.py` tem `niveis_por_segundo()` e `desenhar_niveis()` prontos.
Depois de renderizar, confira **sempre**: duração, presença das duas
faixas (vídeo e áudio), e o nível por segundo.

---

## Como rodar

```bash
# uma vez
cp .env.example .env          # e preencha ELEVENLABS_API_KEY
pip install -r scripts/requirements.txt
cd video && npm install && cd ..
```

```bash
# 1. ANTES DE TUDO: entender o vídeo
python3 scripts/analisar.py caminho/do/original.mp4 --idioma spa --frames 0,3,6,12,18,24
#    -> formato, fps, duração
#    -> instante de cada frase (vai pro campo `falas[].em`)
#    -> nível por segundo
#    -> frames PNG: OLHE ELES

# 2. criar o anúncio
mkdir -p anuncios/meu-anuncio
cp anuncios/dogflow-2/anuncio.json anuncios/meu-anuncio/anuncio.json   # e edite
cp caminho/do/original.mp4 video/public/meu-anuncio.mp4

# 3. áudio
python3 scripts/narracao.py meu-anuncio            # narração falada
python3 scripts/musica.py  meu-anuncio --trilha    # base instrumental
python3 scripts/musica.py  meu-anuncio --jingle    # OU jingle cantado
#    copie a variante escolhida pra video/public/ com o nome do anuncio.json

# 4. índice e render
python3 scripts/indexar.py
cd video
npm run studio                                     # revisar visualmente
REMOTION_CHROME=/caminho/do/chrome npx remotion render src/index.ts meu-anuncio out/meu-anuncio.mp4
```

`REMOTION_CHROME` só é necessário se a máquina não conseguir baixar o
Chrome do Remotion (container, CI, rede restrita). Aponte pra um Chromium
que já exista.

---

## Armadilhas de ambiente

**TypeScript tem que ser 5.9.x.** Com 7.x o `@remotion/bundler` quebra
(`Cannot read properties of undefined (reading 'readFile')`) porque o
esbuild-loader usa `ts.sys`. O `package.json` já pina `5.9.3`; não
"atualize".

**Fonte embutida em base64, nunca carregada de `public/`.** O Remotion
recicla as abas durante o render, e um download de fonte que pendura uma
vez mata o render inteiro num frame aleatório. O `src/fonte.ts` já vem com
a Baloo 2 embutida e injetada de forma síncrona, sem `delayRender`.

**Não canalize o render pra `tail` ou `head`.** EPIPE mata o processo no
meio. Redirecione pra um arquivo de log.

**Alguns planos da ElevenLabs bloqueiam `pcm_44100` e `mp3_44100_192` no
text-to-speech** (mas não no `music.compose`). Se der erro de tier, use
`mp3_44100_128`, que passa em todos e é suficiente pra narração que ainda
vai ser mixada e recomprimida pela rede social.

**Nomes de campo do forced alignment**: as palavras vêm em `.words` com
`.start` e `.end` — não `start_time`.

---

## O que o `anuncio.json` aceita

O tipo está em `video/src/tipos.ts`, comentado campo a campo. O exemplo
real e funcionando está em `anuncios/dogflow-2/anuncio.json`.

Resumo:

| campo | pra quê |
|---|---|
| `video`, `fps`, `duracaoSegundos` | o original e onde o anúncio termina |
| `audio` | `"narracao"` ou `"jingle"` — escolhe o caminho de áudio |
| `voz`, `idioma` | voz da ElevenLabs pra narração |
| `falas[]` | `{em, texto}` — o instante e o que a voz diz |
| `textos[]` | texto novo sobre a imagem, com faixa de desfoque opcional |
| `trilha` | base instrumental sob a narração |
| `jingle` | letra e estilo da música cantada |

---

## Duas coisas pra levantar com a pessoa, sempre

Não são detalhes técnicos; são as duas perguntas que decidem se o anúncio
pode ir pro ar.

**1. De quem são as imagens?** Localizar um criativo de outra marca troca
a voz e o nome, mas não muda a origem do vídeo. A estrutura de um anúncio
não é de ninguém; as imagens são. Pergunte se há licença antes de
entregar como pronto pra veicular.

**2. Onde está o fecho?** Anúncio de instalação de app precisa de logo e
botão de loja no fim. Se você cortou o cartão da marca original, ficou um
buraco — e pra montar o novo você precisa saber se o app está publicado
nas lojas e qual é o destino do clique.
