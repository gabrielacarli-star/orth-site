# Ficha da conta

O registro de estado que permite comparar um período com o outro sem depender
de API, de integração ou de memória entre conversas.

## Como funciona

A ficha é um bloco de texto curto. O gestor guarda em qualquer lugar: bloco de
notas, documento, e-mail para si mesmo.

No início de cada análise, ele cola a ficha do período anterior junto com os
dados novos. Ao final, recebe a ficha atualizada e substitui a anterior.

Duas exigências que se contradizem e precisam ser equilibradas: a ficha tem que
ser pequena o bastante para ser colada sem esforço, e completa o bastante para
permitir comparação real. O modelo abaixo é o limite razoável entre as duas.

## Modelo

```
=== FICHA DA CONTA ===
Cliente: [nome]
Conta: [ID ou apelido]
Ficha gerada em: [data]
Período analisado: [data inicial a data final]
Dias reais de veiculação no período: [número]

ESTÁGIO: [0 sem medição | 1 cortando desperdício | 2 primeiras conversões | 3 otimização]

CONFIGURAÇÃO ATUAL
Orçamento diário: R$ [valor]
Estratégia de lance: [nome]
Redes ativas: [Pesquisa | Parceiros | Display]
DSA: [ligado | desligado]
Locais: [cidades] / Opção: [Presença | Presença ou interesse]
Programação: [horários ou "24h"]
Campanhas ativas: [número]

MEDIÇÃO
Rastreamento: [funcionando | instalado sem validar | ausente]
Ação principal: [nome da ação]
Contagem: [Uma | Todas]
Conversões registradas no período: [número]

NÚMEROS DO PERÍODO
Impressões: [número]
Cliques: [número]
CTR: [percentual]
Custo: R$ [valor]
CPC médio: R$ [valor]
Conversões: [número]
Custo por conversão: R$ [valor ou "sem leitura confiável"]
Média diária de gasto: R$ [valor]

FALHAS
Abertas: [número da falha e nome, uma por linha]
Fechadas neste período: [número da falha e nome, com a data]

MUDANÇAS APLICADAS NESTE PERÍODO
[data] [o que foi feito] | esperado: [o que se esperava] | resultado: [o que aconteceu ou "sem leitura ainda"]

PRÓXIMAS AÇÕES DECIDIDAS
1. [ação] | leitura possível a partir de [data]
2. [ação] | leitura possível a partir de [data]

OBSERVAÇÕES
[sazonalidade, mudança de oferta do cliente, evento externo, qualquer coisa que afete a comparação futura]
=== FIM DA FICHA ===
```

## Regras de preenchimento

**Nunca preencher campo por estimativa.** Se o dado não veio na extração,
escreva "não informado". Ficha com número inventado contamina todas as
comparações seguintes, e o erro só aparece meses depois.

**Custo por conversão com menos de 6 conversões:** escreva "sem leitura
confiável" em vez do número. O valor existe, mas não significa nada, e uma vez
escrito ele vira referência para o mês seguinte.

**Toda mudança aplicada precisa de data.** É a data que permite saber se já
passaram os 5 a 7 dias necessários para ler o efeito.

**O campo "esperado" é preenchido no momento da decisão**, não depois. Escrever
a expectativa antes do resultado é o que separa acompanhamento de justificativa
retroativa.

**Observações são o que a próxima análise não vai adivinhar.** O cliente mudou
de telefone, entrou em férias, subiu o preço, abriu uma segunda unidade. Nada
disso aparece nos dados do Google Ads e tudo isso explica variação.

## Primeira ficha

Na primeira análise não existe ficha anterior. Preencha o que a auditoria
inicial revelar, marque o estágio, liste todas as falhas como abertas e deixe
"mudanças aplicadas" vazio.

A partir do segundo ciclo, a comparação começa a existir. É no terceiro ciclo
que o acompanhamento passa a mostrar tendência, e é nesse ponto que o cliente
percebe o valor de ter alguém acompanhando em vez de alguém auditando.
