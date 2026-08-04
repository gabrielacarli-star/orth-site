# Fase 3 — Áudio (música, efeitos, sincronia)

Toda a trilha do canal sai da ElevenLabs, que você já paga. São três APIs
diferentes, cada uma resolvendo um problema.

---

## 1. A música: Eleven Music

`scripts/gerar_musica.py`

```bash
python3 scripts/gerar_musica.py 001               # 2 variantes
python3 scripts/gerar_musica.py 001 --variantes 3
python3 scripts/gerar_musica.py 001 --instrumental  # base sem voz
```

A Eleven Music gera a música **já cantada**, com a letra que está no
`episodio.json`. Não é TTS cantando por cima de uma base — é uma música só.

**Custo real medido** (episódio 001, duas variantes): **US$ 0,80 pelas
duas**, ~R$ 4,30. Bate com a conta de US$ 0,15 por minuto gerado.

**Duração**: a Eleven Music não devolve exatamente a duração pedida. Pedimos
160s e vieram 150s (v1) e 160s (v2). Por isso o `sincronizar_legenda.py` lê
a duração real do arquivo e ajusta o `duracaoSegundos` do episódio — sem
isso sobra vídeo mudo no fim.

**Direitos comerciais:** liberados. A ElevenLabs licenciou as bases com
gravadoras e editoras, e o áudio gerado pode ser monetizado. O que os termos
**proíbem** é citar no prompt nome de artista, título de música ou letra de
terceiros. Por isso os prompts do script descrevem só ritmo, instrumento e
clima — nunca "no estilo de fulano". Isso não é só conformidade: prompt
descritivo dá resultado mais original do que prompt imitativo.

### As duas variantes prestaram — e as duas têm uso

No primeiro teste real as duas variantes ficaram boas. Isso resolve o maior
desconhecido do projeto (se a Eleven Music entregaria vocal infantil
convincente em português) e abre uma decisão útil:

| Variante | Onde vai |
|---|---|
| A de melhor alinhamento | o **episódio** — é a que a legenda acompanha |
| A outra | a **compilação** (Fase 1, seção 2.2) |

Usar arranjos diferentes no episódio e na compilação não é capricho: a
compilação deixa de ser áudio byte-a-byte idêntico ao que já está no canal,
o que é materialmente melhor diante da política de conteúdo inautêntico, e
dá algo levemente novo pra quem já assistiu o episódio solto. Custo zero,
porque a segunda variante já foi paga.

Guarde sempre as duas em `episodios/<id>/audio/`.

**Onde mora a identidade sonora:** no dicionário `ESTILOS` dentro do script.
É lá que está o baião a 104 BPM com triângulo, zabumba, sanfona e cavaquinho
do pilar Dia, e a viola caipira a 62 BPM do pilar Noite. Mudar esse
dicionário muda o som do canal inteiro — é o arquivo mais importante do
pipeline de áudio.

---

## 2. Os efeitos: Text to Sound Effects

`scripts/gerar_sfx.py`

```bash
python3 scripts/gerar_sfx.py            # gera só o que falta
python3 scripts/gerar_sfx.py --refazer
```

Oito efeitos, gerados **uma vez só** e reaproveitados em todo episódio:
quique e pop do Bolha, jingle da vinheta, som de acerto, som de "tenta de
novo", passinhos e ondinha. Custo total: centavos.

Todos os prompts carregam restrição de segurança explícita (`no startle`,
`no bass thump`, `no sharpness`). Isso vem da regra da Fase 2: nada no canal
pode assustar uma criança de 2 anos. Som seco e alto é o erro mais comum em
conteúdo infantil automatizado.

---

## 3. A sincronia: Forced Alignment

`scripts/sincronizar_legenda.py`

```bash
python3 scripts/sincronizar_legenda.py 001
```

**Este é o script que separa "vídeo de IA" de vídeo que parece feito por
gente**, e é a peça que quase todo canal automatizado erra.

No episódio 001 ele provou o valor na primeira execução: o refrão que eu
tinha escrito à mão como começando aos 21s começa de fato aos **27,6s**.
Seis segundos de legenda fora do lugar já na primeira linha.

O problema: os tempos das cenas no `episodio.json` são escritos à mão, no
chute ("o refrão começa aos 21 segundos"). A música gerada tem o timing dela,
que nunca bate com o chute. Resultado: a legenda entra antes ou depois da
linha ser cantada, e a boca do personagem abre fora da hora. É um defeito
sutil que ninguém sabe nomear mas todo mundo sente.

A solução: a API de *forced alignment* da ElevenLabs recebe o áudio e o
texto e devolve o instante exato de cada caractere. O script usa isso pra
reescrever os tempos de cada cena, encaixando a legenda no ponto em que a
linha é de fato cantada. Faz backup do JSON anterior antes de gravar.

**Ordem de execução importa:**

```
gerar_musica.py  ->  escolher a variante  ->  sincronizar_legenda.py  ->  renderizar
```

Sincronizar antes de escolher a variante é trabalho jogado fora, porque cada
variante tem um timing diferente.

---

## 4. O que ainda não está automatizado

Falas soltas fora da música (o "Tchau, tchau!" do encerramento, as reações
do Pipo) usariam `text_to_speech` com as vozes de `VOZ_PIPO` / `VOZ_NINA` /
`VOZ_JACI` do `.env`. Ainda não escrevi esse script porque o primeiro
episódio é cantado do começo ao fim — é melhor ver se a fórmula "só música"
funciona antes de adicionar peça nova ao pipeline.

Escolher as vozes: elevenlabs.io → Voice Library → filtrar idioma
*Portuguese*, sotaque *Brazilian*. Pipo precisa de voz aguda e rápida; fuja
das marcadas como "calm" ou "narration", que é o oposto do personagem.

---

## 5. Multi-idioma (Fase 1, seção 2.3)

A ElevenLabs tem API de **dubbing**, e é por ali que o canal vira cinco
canais. A animação não muda: só a faixa de áudio e as legendas. Ainda não
implementei porque só faz sentido depois que o formato estiver validado em
português — dublar um episódio que ninguém assistiu é multiplicar zero.

Quando chegar a hora, o fluxo é: dubla o áudio → roda o
`sincronizar_legenda.py` de novo com a letra traduzida → renderiza. A pasta
do episódio ganha `audio/pt.mp3`, `audio/es.mp3`, `audio/en.mp3`, e o
`episodio.json` ganha uma variante de legenda por idioma.
