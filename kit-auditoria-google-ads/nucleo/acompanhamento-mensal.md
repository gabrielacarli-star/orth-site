# Acompanhamento mensal

Auditoria é um retrato. Acompanhamento é um filme. O valor de uma conta bem
gerida não está no diagnóstico inicial, está em saber o que mudou, por que
mudou, e o que fazer em seguida.

Este documento descreve o ciclo recorrente. Ele depende da ficha da conta,
descrita em `ficha-da-conta.md`.

## Por que a ficha existe

Uma conversa de análise não tem memória do mês passado. Sem um registro do
estado anterior, toda sessão recomeça do zero e você entrega o mesmo
diagnóstico inicial todo mês, o que não tem valor nenhum para o cliente.

A ficha resolve isso sem depender de API, de token de desenvolvedor ou de
aprovação do Google. É um bloco de texto que o gestor guarda e cola de volta na
sessão seguinte. Ao final de cada análise, uma ficha atualizada é gerada para
substituir a anterior.

O ciclo completo é este:

```
1. Colar a ficha do mês anterior
2. Colar os dados novos extraídos da conta
3. Rodar as verificações de sanidade
4. Comparar estado anterior com estado atual
5. Avaliar o efeito de cada mudança aplicada no período
6. Decidir no máximo 2 ou 3 ações para o próximo ciclo
7. Gerar o relatório do cliente
8. Gerar a ficha atualizada e guardar
```

## Os quatro estágios da conta

O erro mais comum de acompanhamento é cobrar de uma conta um resultado que ela
ainda não tem condição de dar. Cada estágio tem uma pergunta própria, e usar a
métrica do estágio errado gera relatório injusto e cliente irritado.

### Estágio 0: sem medição

A conta gasta e ninguém sabe o que acontece depois do clique.

**Pergunta do estágio:** existe rastreamento funcionando?

**O que medir:** nada além de cliques e CTR. Custo por conversão aqui é ficção.

**Como sair:** instalar e validar o rastreamento. Enquanto isso não acontece,
nenhum outro trabalho na conta tem retorno garantido.

### Estágio 1: medindo e cortando desperdício

O rastreamento funciona. Agora aparece o que estava escondido.

**Pergunta do estágio:** quanto do orçamento vai para tráfego sem intenção?

**O que medir:** proporção do gasto em termos irrelevantes, cliques fora da
área de atendimento, gasto em redes não escolhidas. A meta é ver esse número
cair.

**Sinal de progresso:** custo por clique pode até subir, e isso é bom. Tráfego
mais qualificado custa mais caro. Explique isso no relatório antes que o
cliente veja e se assuste.

### Estágio 2: primeiras conversões

Conversões começam a aparecer, ainda em volume baixo.

**Pergunta do estágio:** de onde vieram as conversões que aconteceram?

**O que medir:** quais termos e quais horários geraram contato. Com 1 a 5
conversões, o custo por conversão não tem significado estatístico e vai
oscilar muito. Diga isso no relatório.

**Sinal de progresso:** repetição. Duas conversões do mesmo termo valem mais
como informação do que dez conversões espalhadas.

### Estágio 3: otimização

Volume estável, o suficiente para comparar decisões.

**Pergunta do estágio:** dá para conseguir o mesmo resultado por menos, ou mais
resultado pelo mesmo?

**O que medir:** custo por conversão, e agora ele significa alguma coisa.

**Sinal de progresso:** tendência ao longo de três períodos, não a variação de
um mês.

## O que comparar entre um período e outro

Comparar números soltos não diz nada. Compare nesta ordem:

**1. Estágio.** A conta mudou de estágio desde o período anterior? Sair do
estágio 0 é a maior vitória possível e precisa aparecer no relatório com esse
peso, mesmo que os números de conversão ainda sejam pequenos.

**2. Falhas.** Quantas estavam abertas, quantas foram fechadas, quantas
apareceram. Falha nova em conta já auditada geralmente significa aplicação
automática de recomendações ligada, ou alguém mexeu na conta.

**3. Efeito das mudanças aplicadas.** Para cada alteração feita no período,
registre o que se esperava e o que aconteceu. Esta é a parte que ninguém faz e
é a que constrói confiança do cliente ao longo do tempo.

**4. Números, com ressalva de comparabilidade.** Só compare períodos de mesma
duração. Se o período anterior teve 12 dias de veiculação e este teve 30, os
totais não são comparáveis, apenas as médias diárias.

## Regras de comparação honesta

**Períodos de duração diferente comparam médias, nunca totais.**

**Mudança aplicada há menos de 5 dias ainda não tem leitura.** Registre que foi
aplicada e que o efeito será avaliado no próximo ciclo.

**Sazonalidade existe.** Dezembro não se compara com janeiro na maioria dos
negócios locais. Quando houver suspeita, diga em vez de atribuir a variação ao
seu trabalho.

**Se o resultado piorou, diga que piorou.** E separe o que estava sob seu
controle do que não estava. Relatório que só mostra melhora perde credibilidade
no primeiro mês ruim, e todo mês ruim chega.

## Quando o mês foi ruim

Estrutura para essa conversa, que acontece com toda conta em algum momento:

1. **Diga o que piorou e em quanto.** Antes que o cliente pergunte.
2. **Separe causa provável de causa confirmada.** Não invente certeza.
3. **Aponte o que estava sob controle e o que não estava.** Aumento de CPC no leilão não é falha de gestão. Não ter negativado um termo caro é.
4. **Diga o que será feito e quando o efeito poderá ser lido.**
5. **Não compense com métrica de vaidade.** Não troque conversão que caiu por impressão que subiu.

## O que entra no relatório do cliente

O cliente não quer auditoria, quer saber se o dinheiro dele está funcionando.
Três blocos:

**O que aconteceu no período.** Números traduzidos para linguagem de dono de
negócio, comparados com o período anterior.

**O que foi feito e por quê.** Cada mudança em uma frase, com o motivo.

**O que vem agora.** No máximo 3 itens, com prazo de leitura de cada um.

O diagnóstico técnico completo fica no seu registro interno, não no relatório
do cliente. Ele não precisa saber o que é DSA, precisa saber que havia dinheiro
saindo por um caminho que ninguém escolheu e que isso foi fechado.
