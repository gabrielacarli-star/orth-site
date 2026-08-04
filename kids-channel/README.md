# Maria e Amigos — canal infantil feito por IA

Pipeline completo de um canal de YouTube infantil: música, animação,
legenda sincronizada e renderização. Tudo automatizado, tudo em código.

Esta pasta vive dentro do repositório do site da ORTH só pra ter um lugar
único de histórico — não faz parte do site institucional. É irmã da pasta
`../youtube-pipeline/` (canal "Negócios com IA"), com a mesma filosofia:
construir por fases, validar cada uma antes de automatizar, código comentado
em português, sem caixa-preta.

---

## Leia nesta ordem

| Fase | O que é | Status |
|---|---|---|
| [1 — Estratégia](./fase-1-estrategia.md) | de onde sai o dinheiro, e por que não é do anúncio do YouTube | ✅ |
| [2 — Bíblia do canal](./fase-2-biblia-do-canal.md) | personagens, mundo, cores, som, regras de segurança | ✅ proposta |
| [3 — Áudio](./fase-3-audio.md) | Eleven Music, efeitos, sincronia da legenda | ✅ validado com música real |
| [4 — Animação](./fase-4-animacao.md) | Remotion, arquitetura, decisões de desenho | ✅ episódio completo renderizado |
| 5 — Publicação | upload via API do YouTube, `madeForKids`, agendamento | pendente |
| [6 — Streaming](./fase-6-streaming.md) | distribuição das músicas (DistroKid) | ✅ documentado, falta catálogo |
| 7 — Compilações | montar 45–60 min a partir dos episódios | pendente |
| 8 — Multi-idioma | dublagem ElevenLabs, um canal por idioma | pendente |

**Se for ler só uma coisa, leia a Fase 1.** Ela explica por que a economia de
canal infantil no YouTube é ruim (RPM de R$ 1–3 por mil visualizações) e onde
o dinheiro realmente está (streaming de música, compilações longas e
multi-idioma).

---

## Como rodar

### Uma vez

```bash
cp .env.example .env          # e preencha ELEVENLABS_API_KEY
pip install -r scripts/requirements.txt
cd video && npm install
```

### Produzir um episódio

```bash
# 0. escreva a letra em scripts/roteiros.py e gere o episodio.json
python3 scripts/criar_episodio.py

# 1. música — gera 2 variantes em WAV, ~R$ 4 no total
python3 scripts/gerar_musica.py 001

# 2. sincroniza. Com --auto ele escolhe a variante de melhor alinhamento;
#    sem --auto você indica qual (--audio musica-v2.wav).
#    Também ajusta a duração do episódio e copia o áudio pra video/public/.
python3 scripts/sincronizar_legenda.py 001 --auto

# 3. confere tudo antes de gastar 16 minutos de render
python3 scripts/conferir_episodios.py

# 4. efeitos sonoros — uma vez só, valem pra todos os episódios
python3 scripts/gerar_sfx.py

# 5. vídeo
cd video
npm run previa     # 30s pra revisar
npm run render     # episódio inteiro
npm run capa       # thumbnail
```

Custo por episódio: **menos de R$ 10.**

---

## Estrutura

```
kids-channel/
  fase-*.md                    documentação por fase
  .env.example                 chaves da ElevenLabs

  scripts/
    comum.py                   .env, caminhos, leitura do episodio.json
    roteiros.py                letra e ritmo de cada episódio (arquivo criativo)
    criar_episodio.py          roteiro -> episodio.json + índice do Remotion
    conferir_episodios.py      valida tudo antes de renderizar
    gerar_musica.py            Eleven Music (a música já vem cantada)
    gerar_sfx.py               efeitos sonoros do canal
    sincronizar_legenda.py     forced alignment: encaixa legenda na música
    embutir_fonte.py           gera o módulo da fonte em base64

  episodios/
    001-as-cores-da-ilha/
      episodio.json            a receita: cenas, tempos, letra, personagens
      audio/                   variantes geradas da música

  video/                       projeto Remotion (npm separado)
    src/marca/                 paleta, fonte, tipos
    src/personagens/           Maria, Pipo, Nina, Bolha
    src/cenarios/              praia, coqueiral, casa da árvore, céu noturno
    src/componentes/           vinheta, legenda
    src/Episodio.tsx           monta o vídeo a partir do JSON
```

---

## As três decisões que sustentam o projeto

**1. A música é o produto; o vídeo é o marketing.**
1 milhão de visualizações num canal kids em português rende R$ 1.000–3.000.
As mesmas músicas com 1 milhão de streams no Spotify rendem R$ 16.000–27.000,
sem restrição de COPPA. Toda produção já sai pronta pra distribuição em
streaming. (Fase 1, seção 2.1)

**2. O vídeo não é gerado por IA — é desenhado em código.**
Personagem gerado por modelo de vídeo muda de episódio pra episódio, e canal
infantil vive de reconhecimento. Aqui a Maria do episódio 200 é literalmente o
mesmo componente React do episódio 1. De quebra, isso é o oposto do perfil
que a política de conteúdo inautêntico do YouTube persegue. (Fase 4)

**3. `episodio.json` é a única fonte de verdade.**
Música, sincronia e animação leem o mesmo arquivo. Trocar o idioma é trocar a
faixa de áudio, não refazer o vídeo — é o que torna a escala multi-idioma
quase de graça. (Fase 4)

---

## O que ainda não existe

Registrado pra não parecer que está pronto:

- Publicação no YouTube ainda é manual (Fase 5).
- Vovó Jaci e o pilar Noite estão só na bíblia — o cenário existe, a
  personagem não.
- Compilações (Fase 7) e distribuição em streaming (Fase 6) ainda não
  existem — são as duas peças que mais rendem, segundo a Fase 1.
- Nada foi publicado ainda: o formato não foi validado com audiência.
- O áudio do episódio 001 é MP3 (foi gerado antes de o pipeline passar a
  usar WAV). Serve pro YouTube; antes de mandar pro streaming, regerar.
