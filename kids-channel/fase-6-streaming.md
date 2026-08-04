# Fase 6 — Streaming (Spotify, Apple Music, Deezer)

Esta é a fase que a Fase 1 aponta como a **principal fonte de receita** do
projeto, e não é o YouTube.

| | Receita por 1 milhão |
|---|---|
| YouTube, made for kids, público BR | R$ 1.000 – 3.000 |
| Streaming de música | **R$ 16.000 – 27.000** |

Streaming não tem restrição de COPPA — música é só música. E música
infantil é o caso de uso mais repetido que existe: criança não escuta uma
vez, escuta quarenta.

---

## 1. Você não sobe direto pro Spotify

O Spotify não aceita upload de artista independente. Todo mundo entra por
uma **distribuidora**, que manda a mesma faixa pra Spotify, Apple Music,
YouTube Music, Deezer, Amazon Music, Tidal e mais uns 100 serviços de uma
vez só.

### Qual distribuidora

| Distribuidora | Preço | Serve aqui? |
|---|---|---|
| **DistroKid** | ~US$ 23/ano, **lançamentos ilimitados**, você fica com 100% | ✅ **é esta** |
| TuneCore | cobra por lançamento/ano | ❌ inviável com 3 músicas por semana |
| CD Baby | taxa única por lançamento (~US$ 10) | ❌ vira R$ 8.000/ano nesse volume |
| ONErpm | sem taxa, mas fica com % pra sempre | ❌ desconto eterno em cima do ativo |
| Amuse | tem plano grátis | ❌ lento e com fila |

**DistroKid**, sem dúvida. O modelo dela é taxa fixa anual com lançamentos
ilimitados, que é exatamente o formato deste canal: muitas faixas, cada uma
rendendo pouco no começo. Nas outras, o custo cresce junto com o número de
músicas — que é o oposto do que a gente quer.

Custo: ~R$ 125/ano. Uma música que passe de ~8 mil streams já pagou o ano
inteiro.

---

## 2. O que a distribuidora vai pedir

| Item | O que usar | De onde sai |
|---|---|---|
| Áudio | **WAV 44.1 kHz / 16 bits** | `gerar_musica.py` já entrega WAV |
| Capa | **3000×3000 px**, quadrada exata | `npm run capa-album` |
| Nome do artista | `Maria e Amigos` | igual ao canal, pra ser achável |
| Nome do álbum | `Ilha Pipoca` | o mundo, não o personagem |
| Nome da faixa | igual ao episódio ("As Cores da Ilha") | `episodio.json` |
| Gênero | Children's Music | — |
| Idioma | Português | — |
| ISRC | deixa a DistroKid gerar | é grátis |

### Por que o áudio agora é WAV e não MP3

Foi uma correção feita nesta fase. O `gerar_musica.py` gerava MP3 192 kbps —
que é compressão **com perda**. Distribuidora pede WAV justamente porque o
que se perde num MP3 não volta, e o Spotify vai recomprimir de novo em cima:
comprimir duas vezes soa pior.

Agora o script pede `pcm_44100` à Eleven Music e grava um WAV de verdade.
Como o Remotion toca WAV direto, **o mesmo arquivo serve pro vídeo e pra
distribuição** — sem conversão no meio, sem perder nada. Custa ~26 MB por
música em vez de ~3,5 MB, o que é irrelevante (o áudio nem vai pro repo).

### Regras da capa que reprovam lançamento

Spotify e Apple **rejeitam** capa com: endereço de site, "@", preço, logo de
loja, nome de rede social, ou qualquer coisa que pareça propaganda. A capa
gerada aqui só tem personagem e nome, de propósito.

E ela tem que funcionar a **55×55 px**, que é o tamanho real dela no celular
de quem ouve. Mesma lógica da miniatura do YouTube, só que mais extrema.

---

## 3. Estratégia de lançamento

**Não lance música solta.** Junte 8 a 12 faixas e lance como **álbum**. Três
motivos:

1. Álbum entra em mais playlists editoriais que single avulso.
2. Quem gosta de uma faixa escuta o álbum inteiro — o que multiplica os
   streams por ouvinte.
3. Uma página só pra divulgar, em vez de doze.

**Ordem que funciona:** publique os episódios no YouTube primeiro, veja
quais pegam, e só então monte o álbum com as que funcionaram. O YouTube vira
o teste de audiência gratuito do que vai pro streaming.

**Prazo:** a DistroKid leva 2 a 5 dias pra aparecer nas lojas. Peça a data
de lançamento com pelo menos **4 semanas** de antecedência — é o que dá
direito de submeter pra playlist editorial do Spotify pelo Spotify for
Artists. Lançar às pressas joga fora a única chance de playlist editorial.

---

## 4. Passo a passo

```bash
# 1. gerar a capa quadrada (3000x3000)
cd video && npm run capa-album

# 2. o WAV master já está em episodios/<id>/audio/musica-vN.wav
```

Depois, no site da DistroKid:

1. Criar conta (~US$ 23/ano)
2. *Upload* → escolher **Album** quando tiver 8+ faixas
3. Nome do artista: `Maria e Amigos` — atenção, é este nome que cria o
   perfil de artista. Errar aqui e corrigir depois é dor de cabeça
4. Subir os WAV, um por faixa, na ordem do álbum
5. Subir a capa
6. Marcar *Store the songs on Spotify, Apple Music...* (todos)
7. Data de lançamento: **4 semanas à frente**
8. Depois de aprovado: reivindicar o perfil no **Spotify for Artists** e
   submeter a faixa mais forte pra playlist editorial

---

## 5. O que falta

- Nenhum álbum montado ainda — precisa de 8 a 12 episódios publicados
  primeiro, e só existe um.
- Versão instrumental de cada faixa (`gerar_musica.py --instrumental`) rende
  como faixa extra em playlist de sono e de fundo. Ainda não gerada.
- Registro de obra no ECAD, pra direito de execução pública no Brasil. Vale
  investigar quando houver catálogo; não faz diferença com uma faixa.
