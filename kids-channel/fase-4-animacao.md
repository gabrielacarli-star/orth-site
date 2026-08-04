# Fase 4 — Animação

## Por que Remotion e não geração de vídeo por IA

A escolha mais importante do projeto técnico, e ela é contra-intuitiva:
**o vídeo não é gerado por IA.** É desenhado em código.

Modelo de texto-pra-vídeo (Veo, Kling e afins) não serve pra canal infantil
por três motivos que não têm contorno:

1. **Personagem não se mantém.** O Pipo do episódio 12 sai diferente do Pipo
   do episódio 3. Canal infantil vive de reconhecimento — se o personagem
   muda, não existe marca, e sem marca não existe licenciamento (Fase 1,
   seção 2.4).
2. **Custo por segundo é alto e recorrente.** Aqui, renderizar de novo custa
   R$ 0.
3. **É exatamente o perfil que a política de conteúdo inautêntico persegue.**

O [Remotion](https://remotion.dev) é o contrário disso: vídeo feito com
React. Cada personagem é um componente, cada cenário é um componente, e o
episódio é montado a partir de um arquivo de dados. O Pipo do episódio 200
vai ser rigorosamente o mesmo Pipo do episódio 1, porque é o mesmo código.

Licença: gratuito pra pessoa física e empresa de até 3 pessoas, uso
comercial liberado.

---

## A ideia central: `episodio.json`

O episódio inteiro é descrito num arquivo de dados. Nenhum código é escrito
por episódio.

```json
{
  "de": 21, "ate": 27,
  "cenario": "praia",
  "legenda": "Olha a cor, olha a cor",
  "personagens": [
    { "quem": "pipo", "x": 0.34, "y": 0.82, "cantando": true },
    { "quem": "nina", "x": 0.68, "y": 0.83, "espelhado": true, "cantando": true }
  ]
}
```

`x` e `y` vão de 0 a 1 (proporção da tela) e apontam pros **pés** do
personagem, não pro centro — `y: 0.82` quer dizer "os pés encostam a 82% da
altura". É bem mais intuitivo de posicionar do que coordenada de centro.

Quem lê esse arquivo:

- o `gerar_musica.py`, pra montar o prompt da música a partir das legendas;
- o `sincronizar_legenda.py`, pra reescrever os tempos;
- o Remotion, pra montar o vídeo.

Uma fonte de verdade só. É isso que permite trocar o idioma sem refazer
animação nenhuma.

---

## Estrutura

```
video/src/
  marca/
    paleta.ts          as cores da Fase 2 — nenhuma cor solta no resto do código
    fonte.ts           Baloo 2 embutida em base64
    tipos.ts           o formato do episodio.json
  personagens/
    Pipo.tsx           SVG do passarinho
    Nina.tsx           SVG da anta
    Bolha.tsx          SVG do peixinho
    Personagem.tsx     posiciona, faz pular, abre a boca, projeta sombra
  cenarios/
    elementos.tsx      nuvem-pipoca, coqueiro, sol, estrela
    Cenario.tsx        praia, coqueiral, casa da árvore, céu noturno
  componentes/
    Vinheta.tsx        os 8 segundos de abertura, iguais todo episódio
    Legenda.tsx        a letra na tela
  Episodio.tsx         monta tudo a partir do JSON
  Root.tsx             registra as composições
```

---

## O que faz a animação parecer viva

Quatro detalhes pequenos, todos em `Personagem.tsx`:

**Tudo se move no tempo da música.** O pulinho é calculado a partir do BPM,
não de um número fixo de frames. Personagem que quica fora do ritmo é a
coisa que mais denuncia animação automatizada.

**Cada personagem tem uma fase própria.** Se dois personagens quicam em
uníssono, a cena vira PowerPoint. A fase é derivada do nome e da posição —
determinística (renderiza igual toda vez) mas dessincronizada.

**Squash and stretch.** No impacto o personagem achata na vertical e estica
na horizontal. É o princípio mais antigo da animação e custa três linhas.

**Sombra que não sobe junto.** A sombra fica no chão e só encolhe conforme o
personagem se afasta dela. Sem isso, o personagem parece colado por cima do
cenário em vez de apoiado nele.

**Câmera nunca parada.** Cada cena tem um zoom lento de 4% mais um
deslocamento lateral de 14px, alternando a direção a cada cena. É quase
imperceptível de propósito — o objetivo não é ninguém notar a câmera, é a
imagem nunca congelar. Cena estática é literalmente o critério que a
política de conteúdo inautêntico do YouTube descreve ("pouca ou nenhuma
variação"). A legenda fica de fora do movimento: texto que escorrega junto
com a câmera é difícil de acompanhar, e quem lê é o pai cantando junto.

---

## Detalhes de desenho que importam

**Personagem é grande.** Ocupa quase metade da altura da tela. Criança de 2
anos assiste de longe, na TV da sala, e precisa enxergar a expressão. Cenário
bonito com personagem pequeno é erro de quem vem de design gráfico e não de
animação infantil.

**Contorno grosso e formas grandes.** Tudo tem que ser legível numa
miniatura de 120px.

**Duas camadas em vez de contorno.** Na Nina, a cabeça e a tromba são
desenhadas duas vezes: uma maior em cor de traço, uma menor em roxo por
cima. O que sobra da camada escura nas bordas vira o contorno. Se cada forma
tivesse seu próprio `stroke`, o contorno da cabeça cortaria a tromba ao meio
e a Nina viraria dois bichos colados — foi exatamente o que aconteceu na
primeira versão.

**A silhueta é o personagem.** A tromba da Nina não é um detalhe, é o motivo
de ela existir: sem tromba visível ela é mais um hipopótamo roxo. Asa do
Pipo acima da linha do olho lê como orelha, e ele deixa de ser passarinho.
Essas duas coisas foram consertadas depois de olhar o primeiro render — vale
sempre renderizar um frame e olhar antes de seguir.

---

## Fonte: por que embutida em base64

Custou dois renders quebrados, então está registrado.

O jeito recomendado é `delayRender()` esperando a fonte carregar. Só que o
Remotion recicla as abas do navegador durante um render longo, e a espera
acontece de novo a cada aba nova. Se pendurar **uma** vez, o render inteiro
morre no meio:

| Tentativa | Onde morreu |
|---|---|
| `.ttf` em `public/` via `staticFile()` | frame 159 de 900 |
| `data:` URI via `FontFace.load()` | frame 427 de 900 |

A versão que funciona não tem espera nenhuma: a fonte vai embutida no bundle
(`scripts/embutir_fonte.py` gera o módulo) e é injetada como `@font-face`
síncrono. Sem promise, sem `delayRender`, sem como travar. O bundle fica
~550 KB maior — troca ótima.

---

## Renderizar

```bash
cd video
npm install

npm run studio     # abre o editor visual, dá pra arrastar a linha do tempo
npm run previa     # 30 segundos, pra revisar rápido
npm run render     # episódio inteiro
npm run capa       # thumbnail 1280x720
npm run tipos      # confere os tipos do episodio.json
```

Na primeira vez o Remotion baixa o próprio Chrome sozinho. Em máquina sem
acesso a esse download (CI, container fechado), aponte pro Chrome que já
existe:

```bash
REMOTION_CHROME=/caminho/para/chrome npm run render
```

---

## O que falta nesta fase

- **Vovó Jaci** (o jabuti) e o cenário do pilar Noite estão só no papel — o
  `ceu-noturno` já existe, a personagem não.
- **Objetos em cena** (a fruta que cai, o coco, a bolha de sabão): hoje só
  dá pra colocar personagem, não objeto solto. Precisa de um tipo `objetos`
  no `episodio.json`.
- **Compilações** (Fase 1, seção 2.2): montar 45–60 min a partir de vários
  `episodio.json` seguidos. É a peça que mais rende no YouTube e é fácil,
  porque a estrutura já é orientada a dados.
