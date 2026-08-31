# Anúncio DogFlow (22s, vertical)

Localização de um criativo de 25s para o app **DogFlow**: narração nova em
espanhol pela ElevenLabs, tela do app recriada e nome da marca trocado na
imagem.

## O que foi trocado

| Trecho | O que era | O que virou |
|---|---|---|
| áudio inteiro | narração + trilha originais | narração nova (voz Laura, ElevenLabs) + trilha nova (Eleven Music) |
| 11,7s – 17,3s | gravação de tela de outro app | tela do DogFlow, recriada em código e rolando |
| 18,1s – 20,3s | "¡SE LLAMA EVERYDOGGY!" queimado | "¡SE LLAMA DOGFLOW!" |
| 22,1s – 25,1s | cartão final da EveryDoggy | cortado — o vídeo acaba em 22,1s |

## Por que o vídeo acaba em 22,1s

Os últimos 3 segundos do original são o cartão final da outra marca: logo,
nome e botões de App Store e Google Play. É a única parte do vídeo que não
dá pra localizar por cima — não é texto sobre imagem, é a marca inteira
ocupando a tela. Então sai.

22,10s é o último frame limpo; a partir de 22,15s o cartão já entra em
fade. A última fala ("Toca abajo para probarla") vai de 20,30s a 21,92s,
então cabe inteira. O corte fica em `FIM`, no `src/Root.tsx`.

**O anúncio hoje termina sem cartão final.** Um anúncio de instalação
costuma fechar com logo e botão de loja. Fazer um cartão do DogFlow é
rápido — falta só saber o que vai nele (o app está publicado nas lojas?
qual o destino do clique?).

## Como a narração ficou no tempo certo

O vídeo original foi transcrito com timestamps por palavra (speech-to-text
da ElevenLabs). Isso deu o instante exato em que cada frase entrava. A
narração nova foi gerada frase a frase e reposicionada nesses mesmos
instantes.

A voz da ElevenLabs fala mais devagar que a locutora original — as sete
falas somavam 25,3s de fala num vídeo de 25s. Em vez de comprimir cada
frase no seu próprio fator (a mais apertada precisaria de 1,46×, que soa
acelerado), foi aplicada uma velocidade **uniforme de 1,30×** em todas.
Velocidade constante soa natural; velocidade que muda a cada frase soa
estranho. O resultado cai dentro de 0,15s de cada marca original.

## Detalhes que custaram tempo

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

## Rodar

```bash
npm install

# narração: gera audio/fala-*.mp3 (bruto) e audio/ok-*.mp3 (acelerado),
# que são os que o vídeo toca. Precisa de ELEVENLABS_API_KEY num .env.
python3 scripts/gerar_narracao.py

npm run studio                    # editor visual
REMOTION_CHROME=/caminho/chrome npm run render
```

Pra trocar a voz ou o roteiro, mexa em `VOZ` e `FALAS` no
`scripts/gerar_narracao.py`. Os instantes em que cada fala entra ficam em
`src/Anuncio.tsx` — é lá que eles valem.

O áudio não está no repositório (custa centavos pra refazer e é grande);
o script é que está.

## Pendente

- **As imagens do cachorro vieram do criativo original de outra marca.**
  Trocar voz e nome não muda a origem do vídeo. Antes de veicular, ou
  confirmar que há licença dessas imagens, ou substituir por material
  próprio/licenciado. A estrutura do anúncio não é de ninguém; as imagens
  são.
- A voz Laura tem sotaque americano — funciona em espanhol, mas uma voz
  nativa da Voice Library ficaria melhor.
