# Fase 2 — Bíblia do canal

A "bíblia" é o documento que trava a identidade: quem são os personagens,
como o mundo funciona, que cores e sons existem, o que nunca pode aparecer.
Tudo que o pipeline gera depois — música, cena, roteiro, thumbnail — obedece
a este arquivo. É ele que faz 200 episódios parecerem uma marca só e não uma
esteira de conteúdo genérico.

**Isto é uma proposta.** A identidade criativa é sua — se algum personagem,
nome ou cor não te agradar, troca. O pipeline técnico das fases seguintes não
depende de nenhuma escolha específica daqui.

---

## 1. Marca

**Canal:** `Maria e Amigos`
**Mundo:** Ilha Pipoca
**Internacional:** `Maria & Friends` · `María y Amigos` (o nome próprio não se traduz)

Por que nomear pelo personagem e não pelo mundo: licenciamento (boneco,
livro, app) sempre gira em torno de um personagem. Bluey, Peppa, Blippi —
todos são o nome do protagonista. "Maria" tem o mesmo formato que funciona
pra criança de 1 a 2 anos (sílabas abertas, fácil de repetir) e é um dos
poucos nomes que existe praticamente igual em português, espanhol, inglês,
italiano e árabe — não precisa de adaptação em nenhum mercado do plano
multi-idioma.

O trocadilho "Pipo → Pipoca" dá o nome do mundo em português de graça, e as
nuvens da ilha são desenhadas em formato de pipoca — vira assinatura visual
reconhecível em miniatura de 120px.

---

## 2. Elenco

Cinco personagens. Poucos, de propósito: criança pequena precisa de
repetição e reconhecimento, não de elenco grande. Personagens novos entram
como visitantes, nunca como fixos.

### Maria — menininha loira
Protagonista, ~3 anos. É o "eu" da criança que assiste: curiosa, se empolga
fácil, erra, fica frustrada por 2 segundos, tenta de novo e consegue.
**Nunca é a mais esperta da cena** — a criança precisa poder saber a
resposta antes dela.

Protagonista humana de propósito: criança pequena se identifica com criança,
não com bichinho. É por isso que o protagonista do CoComelon é o JJ e não os
animais — os bichos são os amigos, e é o menino que carrega a marca.

Silhueta: cabeça grande (~45% da altura), marias-chiquinhas com laço,
vestido coral.
Voz: aguda, rápida, ofegante de empolgação.

**A Maria é uma personagem original, desenhada do zero.** O nome vem da
filha da Gabriela; a aparência não vem de ninguém. Ver a seção 8.

### Pipo — passarinho amarelo
Melhor amigo da Maria e alívio de cena. Bobo, entusiasmado, sempre erra
primeiro pra ela poder corrigir — é o mecanismo que faz a criança se sentir
esperta.
Silhueta: círculo com bico triangular e um tufo de três penas na cabeça.
Voz: aguda e esganiçada, mais rápida que a da Maria.

### Nina — anta roxa
Irmã mais velha / cuidadora da turma. Calma, paciente, explica sem corrigir com
dureza. É quem canta a parte "ensino" das músicas.
A anta é uma escolha deliberada: é um bicho brasileiro com silhueta única
(a tromba curta) e praticamente ninguém usa em desenho infantil — o
contrário de mais um cachorro ou gatinho. Ótimo pra registro de marca.
Voz: média, morna, ritmo mais lento que a do Pipo.

### Bolha — peixinho azul
Vive dentro de uma bolha d'água que quica em terra firme. **Não fala** — só
faz sons (blup, pop, assobio). É o alívio cômico e o gancho de repetição:
o momento "Bolha" é o que a criança espera e pede de novo. Esse é o papel
que o Baby Shark cumpre — um elemento sonoro-visual bobo e previsível.
Custo de animação: baixíssimo, é um círculo que quica.

### Vovó Jaci — jabuti
Velha, lenta, contadora de histórias. Só aparece no **pilar Noite**. Jaci é
lua em tupi-guarani — ancora o mundo culturalmente e dá coerência ao papel.
Voz: grave, muito devagar, quase sussurrada.

---

## 3. Mundo

Ilha Pipoca é uma ilha tropical pequena. Cenários fixos, reaproveitados
sempre (cada cenário é um asset caro de fazer uma vez e barato de usar
duzentas):

| Cenário | Uso |
|---|---|
| Praia | músicas de movimento, água, contagem |
| Coqueiral | frutas, cores, tamanhos |
| Casa da árvore | rotina — comer, escovar dente, arrumar |
| Poça d'água | Bolha, sons, bagunça |
| Céu noturno na praia | pilar Noite, Vovó Jaci |

Regra: **nunca sai da ilha.** Mundo fechado = reconhecimento imediato +
custo de produção que cai a cada episódio.

---

## 4. Identidade visual

Vetor plano, formas grandes e arredondadas, contorno grosso. Sem textura,
sem realismo, sem sombra dura. Tudo desenhado pra ser legível numa
miniatura de 120px na TV da sala.

| Cor | Hex | Uso |
|---|---|---|
| Pele Maria | `#FFD9BC` | protagonista |
| Cabelo Maria | `#FFD772` | protagonista |
| Vestido Maria | `#FF6B6B` | protagonista, laços, acentos |
| Amarelo Pipo | `#FFC93C` | Pipo, destaque, sol |
| Roxo Nina | `#9B5DE5` | Nina, elementos de apoio |
| Azul Bolha | `#4EA8DE` | água, Bolha |
| Verde ilha | `#43BF6D` | vegetação, chão |
| Areia | `#FFE8B6` | praia, fundos claros |
| Coral | `#FF6B6B` | frutas, acentos |
| Noite | `#1B2A6B` | fundo do pilar Noite |
| Contorno | `#2D2A32` | traço de tudo |

Regras rígidas (segurança, não estética):

- **Sem flashes.** Nada pisca mais de 3× por segundo — risco de convulsão fotossensível.
- **Sem contraste extremo** e sem transição brusca de cena. Corte sempre com transição de pelo menos 8 frames.
- **Sem sustos.** Nenhum personagem aparece de repente, nenhum som entra sem aviso, nenhum vilão.
- **Sem alto-baixo de volume.** Áudio normalizado, faixa dinâmica estreita.

---

## 5. Som

### Pilar Dia
Ritmos brasileiros em arranjo infantil — é o diferencial sonoro do canal e
o que separa ele do pop de teclado genérico que todo canal kids de IA usa.

Baião, xote, samba leve, frevo, maracatu suave.
Instrumentos: triângulo, zabumba, cavaquinho, pandeiro, sanfona, ukulele,
xilofone, palmas.
BPM 95–120. Tom maior. Sem distorção, sem grave pesado.

### Pilar Noite
Viola caipira dedilhada, caixinha de música, cordas suaves, chuva leve ao fundo.
BPM 55–70. Sem percussão marcada. Volume médio 6 dB abaixo do pilar Dia.

### Letra
- Vocabulário de criança de 1 a 4 anos. Palavras concretas: comer, água, azul, dois, mão.
- Refrão repetido no mínimo 4 vezes. Repetição é o mecanismo, não preguiça.
- Uma ideia por música. "As cores" é uma música; "as cores e os números" são duas.
- Sem ironia, sem duplo sentido, sem piada pra adulto.

---

## 6. Estrutura de episódio (pilar Dia)

Duração alvo 2:30 a 3:30. Sempre a mesma espinha — previsibilidade é o que
a criança pequena procura — com variação real de conteúdo, cenário e
personagem por episódio.

| Trecho | Tempo | O que acontece |
|---|---|---|
| Vinheta | 0:00–0:08 | logo + jingle de 4 notas, idêntico sempre |
| Gancho | 0:08–0:25 | Maria encontra o "problema" do episódio |
| Refrão 1 | 0:25–0:50 | a música entra, o refrão apresenta a ideia |
| Verso 1 | 0:50–1:20 | Nina explica cantando |
| Momento Bolha | 1:20–1:35 | interrupção cômica, sem letra |
| Verso 2 | 1:35–2:05 | Maria tenta, erra, tenta de novo |
| Refrão final | 2:05–2:45 | todo mundo junto, versão mais cheia |
| Encerramento | 2:45–3:00 | tchau + próximo episódio |

O pilar Noite não tem estrutura de episódio: é uma sequência de 12–15
músicas em arranjo lento, com câmera parada e movimento mínimo, montada
em 45–60 minutos.

---

## 7. Os 10 primeiros episódios

Escolhidos por volume de busca em conteúdo infantil e por serem os temas que
sustentam repetição. Ordem sugerida de produção:

| # | Título | Tema | Ritmo |
|---|---|---|---|
| 1 | As Cores da Ilha | cores | baião |
| 2 | Um, Dois, Coco | contar até 5 | samba leve |
| 3 | Hora do Banho | rotina | xote |
| 4 | Que Bicho é Esse? | animais e sons | frevo |
| 5 | A Fruta Caiu | frutas | baião |
| 6 | Escova, Escova | escovar os dentes | samba leve |
| 7 | Grande e Pequeno | tamanhos | xote |
| 8 | A Chuva Chegou | clima | maracatu suave |
| 9 | Como Eu Me Sinto | emoções básicas | xote |
| 10 | Boa Noite, Ilha | dormir | viola (ponte pro pilar Noite) |

Os episódios 1–10 são também as 10 primeiras faixas do álbum que vai pro
Spotify. Um trabalho, dois produtos.

---

## 8. O que nunca entra

- Nenhum personagem, música ou elemento visual de marca existente. Nada de CoComelon, Galinha Pintadinha, Disney, Baby Shark. Nem "inspirado em".
- Melodias de domínio público podem ser usadas, mas **arranjo e letra sempre originais** — e nunca prompt de IA citando artista, música ou letra de terceiros (violaria os termos da ElevenLabs Music e criaria risco de direito autoral).
- Nada de comida-chatarra, marcas, telas dentro do desenho, ou qualquer coisa que pareça publicidade.
- Nenhum conteúdo de "desafio", "surpresa" ou unboxing — categorias marcadas pelo YouTube.
- **Nenhuma criança real, voz de criança real, ou imagem de pessoa real.**
  Isso vale principalmente pra Maria. Batizar a personagem com o nome de uma
  filha é ótimo e é o que metade das IPs infantis faz — Bluey, Peppa e o JJ
  do CoComelon vieram todos de filho de alguém. Desenhar o **rosto** de uma
  criança real é outra coisa: é um canal público e monetizado, o vídeo fica
  na internet pra sempre, potencialmente com milhões de visualizações, e
  associado ao nome verdadeiro dela. A Maria do canal é original e continua
  original. Pra mudar a aparência dela, mexa em `pele`, `cabelo` e `vestido`
  em `video/src/marca/paleta.ts` — não em uma foto.

---

## 9. Checagem antes de publicar

Toda thumbnail e todo título passam por: *isso poderia ser confundido com
canal de outra marca?* Se sim, refaz. O canal só vale alguma coisa no longo
prazo se a IP for inequivocamente sua.
