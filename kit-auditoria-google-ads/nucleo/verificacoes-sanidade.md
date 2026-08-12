# Verificações de sanidade

Rodar sempre, antes de concluir qualquer coisa a partir de dados colados. Estas
conferências existem porque relatório de Google Ads engana com frequência, e
diagnóstico errado custa mais caro que diagnóstico nenhum.

Se duas informações se contradizem, aponte a contradição em vez de escolher uma
e seguir.

## 1. A janela do relatório contém a data de início?

O erro mais comum de todos. Filtro de "últimos 30 dias" numa campanha que
começou há 5 dias mostra 5 dias de dados com cara de 30.

**Como conferir:** peça a data real de início da campanha. Janela de filtro não
é tempo de veiculação.

**Confirmação independente:** divida o custo total pelo orçamento diário. O
resultado aproximado é o número real de dias veiculados.

```
custo total / orçamento diário = dias reais de veiculação
```

Se a conta gastou R$ 150 com orçamento de R$ 30 por dia, ela rodou cerca de 5
dias, não 30, independentemente do que o filtro diz.

## 2. Os totais fecham?

Some os cliques de todas as palavras chave e compare com o total de cliques da
campanha.

**Sobra pequena:** normal. O Google oculta termos de baixíssimo volume por
privacidade.

**Sobra grande, acima de 20 por cento:** há tráfego vindo de outro lugar.
Investigue nesta ordem: rede de Display ligada, parceiros de pesquisa, anúncios
dinâmicos de pesquisa. Segmentar a tabela por "Rede (com parceiros de pesquisa)"
separa as três origens.

Faça a mesma conferência com o custo, não só com os cliques. É comum a sobra de
cliques parecer aceitável e a sobra de custo ser enorme.

## 3. O gasto bate com o orçamento?

```
custo total / dias de veiculação = gasto médio diário
```

Compare com o orçamento diário configurado.

**Muito abaixo:** campanha pausada em algum momento, saldo zerado em conta pré
paga, limitação por baixo volume de busca, ou lance abaixo do necessário para
entrar no leilão.

**Acima do orçamento diário:** normal dentro do mês. O Google pode gastar até o
dobro em um dia e compensa nos demais, respeitando a média mensal.

## 4. O que mudou desde a última extração?

Compare sempre com a ficha da conta do período anterior. Sem comparação, você
está descrevendo um retrato, não acompanhando uma evolução.

**Cuidado com o intervalo.** Duas extrações feitas com poucas horas de
diferença mostram gasto quase igual. Isso é intervalo curto, não campanha
parada. Antes de concluir que a veiculação parou, confirme o saldo em
Faturamento e pergunte quando cada extração foi feita.

## 5. Existe conversão configurada e ativa, não apenas criada?

Criada e ativa são estados diferentes. Uma ação de conversão criada mas que
nunca recebeu disparo fica "Inativa" ou "Não verificada", e isso é normal em
ação nova.

O que importa: existe registro de conversão no período? Se não existe e a
campanha usa lance automático baseado em conversão, esse é o único problema que
importa até ser resolvido.

## 6. Quantas conversões existem no período?

Com 1 a 5 conversões, o custo por conversão não tem significado estatístico e
vai oscilar muito de uma semana para a outra.

Registre isso no relatório antes que o número suba e pareça uma piora que não
existe. Dizer "ainda é cedo para ler este número com segurança" é mais honesto
e evita conversa difícil no mês seguinte.

## 7. Alguma alteração foi feita nos últimos 5 a 7 dias?

Toda mudança estrutural reinicia parte do aprendizado. Se houve alteração
recente, os números do período estão misturando dois cenários diferentes e a
comparação fica comprometida.

Verifique em Ferramentas > Histórico de alterações. Lembre que o histórico só
registra edições feitas por pessoas, então mudanças automáticas do Google não
aparecem ali. Para essas, veja Recomendações > Aplicação automática.
