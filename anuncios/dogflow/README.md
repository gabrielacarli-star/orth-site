# Anúncios DogFlow

Dois criativos verticais localizados para o app **DogFlow**: narração nova
em espanhol pela ElevenLabs, trilha nova, e — no primeiro — a tela do app
recriada e o nome da marca trocado na imagem.

| | Composição | Duração | Original | O trabalho |
|---|---|---|---|---|
| **Anúncio 1** | `anuncio` | 22,1s, 25 fps | depoimento sobre o app | áudio inteiro + tela do app + nome da marca + corte do cartão final |
| **Anúncio 2** | `anuncio-2` | 27,2s, 30 fps | montagem de 5 ganchos | só o áudio: narração e trilha |

```bash
REMOTION_CHROME=/caminho/chrome npx remotion render src/index.ts anuncio   out/dogflow.mp4
REMOTION_CHROME=/caminho/chrome npx remotion render src/index.ts anuncio-2 out/dogflow-2.mp4
```

---

## Anúncio 1 — o do app

### O que foi trocado

| Trecho | O que era | O que virou |
|---|---|---|
| áudio inteiro | narração + trilha originais | narração nova (voz Laura, ElevenLabs) + trilha nova (Eleven Music) |
| 11,7s – 17,3s | gravação de tela de outro app | tela do DogFlow, recriada em código e rolando |
| 18,1s – 20,3s | "¡SE LLAMA EVERYDOGGY!" queimado | "¡SE LLAMA DOGFLOW!" |
| 22,1s – 25,1s | cartão final da EveryDoggy | cortado — o vídeo acaba em 22,1s |

### Por que o vídeo acaba em 22,1s

Os últimos 3 segundos do original são o cartão final da outra marca: logo,
nome e botões de App Store e Google Play. É a única parte do vídeo que não
dá pra localizar por cima — não é texto sobre imagem, é a marca inteira
ocupando a tela. Então sai.

22,10s é o último frame limpo; a partir de 22,15s o cartão já entra em
fade. A última fala ("Toca abajo para probarla") vai de 20,30s a 21,92s,
então cabe inteira. O corte fica em `FIM`, no `src/Root.tsx`.

### Detalhes que custaram tempo

**A tela do app é recriada, não é o print.** Recriar permite animar a
rolagem — o trecho original é uma gravação de tela rolando, e um print
parado quebraria o ritmo — e fica nítido em qualquer resolução.

**Trocar o nome na imagem precisa tapar o texto antigo.** "¡SE LLAMA
DOGFLOW!" é mais curto que "¡SE LLAMA EVERYDOGGY!", então escrever por cima
deixaria letras do original sobrando nas pontas. A faixa é desfocada com
`backdrop-filter`, que borra o que já está pintado atrás.

A primeira tentativa foi desenhar uma segunda cópia do vídeo desfocada por
cima — **não funciona**. Duas instâncias de `OffthreadVideo` do mesmo
arquivo no mesmo frame não decodificam as duas, e a de cima sai preta. Deu
pra confirmar medindo o brilho da faixa com o desfoque desligado: 51 contra
142 em volta.

---

## Anúncio 2 — a montagem de ganchos

Cinco perguntas em corte rápido ("cómo evitar que un cachorro muerda...").
Aqui **não havia nada de outra marca na imagem** — nem gravação de tela,
nem nome queimado, nem cartão final. O texto na tela é genérico e continua
valendo. Então o trabalho foi só o áudio: narração nova e trilha nova.

O texto de cada fala é o mesmo que está queimado na tela. Não é liberdade
criativa: mudar a fala faria a voz contradizer o que o espectador está
lendo.

**O outro lado disso:** o vídeo não menciona o DogFlow em lugar nenhum, e
termina 3 segundos depois da última fala sem chamada pra ação. Como peça de
tráfego ele prende atenção, mas não manda ninguém a lugar nenhum. Falta
decidir o fecho (ver *Pendente*).

---

## Como a narração fica no tempo certo

Os dois vídeos foram transcritos com timestamps por palavra (speech-to-text
da ElevenLabs). Isso deu o instante exato em que cada frase entrava. A
narração nova é gerada frase a frase e colocada nesses mesmos instantes —
por isso ela casa com o corte e com o texto queimado sem reeditar imagem.

A voz da ElevenLabs fala mais devagar que as locutoras originais, e não dá
pra empurrar uma fala pra frente: ou ela cabe no espaço que tem, ou
atropela a próxima. A regra é usar **uma velocidade só por anúncio**, nunca
uma por frase — velocidade que muda a cada frase soa estranho.

- **Anúncio 1: 1,30×.** As sete falas somavam 25,3s num vídeo de 25s. A
  mais apertada precisaria de 1,46× sozinha, que soa acelerado no meio de
  frases normais. Com 1,30× uniforme toda fala cai dentro de 0,15s da marca
  original.
- **Anúncio 2: 1,05×.** Sobra espaço em quase tudo; só a primeira fala
  estourava. 1,05× resolve sem ninguém perceber.

`atempo` muda a velocidade sem mexer no tom — `asetrate` deixaria a voz
aguda.

## A trilha

Uma por anúncio, gerada pela Eleven Music, sempre instrumental. O
`scripts/gerar_trilha.py` gera duas variantes e imprime o nível de cada uma
segundo a segundo.

Olhar esse número pega o defeito mais comum de trilha gerada: a variante
que tem uma queda no meio. Uma queda de 6 dB é uma quebra que a música fez
pra ela mesma, não pro anúncio, e ela cai onde bem entender — normalmente
em cima de uma fala. Foi assim que a variante 1 do anúncio 2 foi
descartada: -21 dB aos 15s contra -15 dB no resto.

## Rodar

```bash
npm install

# narração: gera o bruto em audioN/fala-*.mp3 e o acelerado em public/,
# que é de onde o Remotion lê. Precisa de ELEVENLABS_API_KEY num .env.
python3 scripts/gerar_narracao.py 1
python3 scripts/gerar_narracao.py 2

# trilha: gera duas variantes e mostra o nível de cada uma
python3 scripts/gerar_trilha.py 2

npm run studio                    # editor visual
REMOTION_CHROME=/caminho/chrome npx remotion render src/index.ts anuncio-2 out/dogflow-2.mp4
```

Pra trocar a voz ou o roteiro, mexa em `VOZ` e `ANUNCIOS` no
`scripts/gerar_narracao.py`. Os instantes em que cada fala entra valem no
`src/Anuncio.tsx` e `src/Anuncio2.tsx` — a cópia que está no script é só
pra ele conseguir conferir se a fala cabe.

Áudio, vídeo original e render não estão no repositório (são grandes e
custam centavos pra refazer); os scripts é que estão.

## Pendente

- **As imagens dos dois vídeos vieram de criativos de outra marca.** Trocar
  voz e nome não muda a origem. Antes de veicular, ou confirmar que há
  licença dessas imagens, ou substituir por material próprio/licenciado. A
  estrutura do anúncio não é de ninguém; as imagens são.
- **Nenhum dos dois tem cartão final.** O do anúncio 1 foi cortado porque
  era de outra marca; o anúncio 2 nunca teve. Anúncio de instalação
  costuma fechar com logo e botão de loja. Fazer um do DogFlow é rápido —
  falta saber o que vai nele: o app está publicado nas lojas? qual o
  destino do clique?
- A voz Laura tem sotaque americano — funciona em espanhol, mas uma voz
  nativa da Voice Library ficaria melhor.
