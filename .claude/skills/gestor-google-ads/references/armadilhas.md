# Armadilhas de interpretação

Erros reais já cometidos ao analisar contas. Consulte antes de diagnosticar.

## Janela de filtro não é tempo de veiculação

Um relatório filtrado em "30/06 a 29/07" numa campanha iniciada em 27/07
contém apenas 3 dias de dados. Comparar duas janelas diferentes gera a
falsa impressão de que a campanha tem histórico antigo.

**Como confirmar:** divida o custo total pelo orçamento diário. O resultado
aproximado é o número real de dias veiculados.

## Diferença pequena entre extrações não significa campanha parada

Duas extrações com poucas horas de intervalo mostram gasto baixo entre elas.
Isso é intervalo curto, não pausa. Antes de concluir que a campanha parou,
confirme o saldo em Faturamento e pergunte quando cada extração foi feita.

## Cliques que não aparecem no relatório de palavras-chave

Se a soma dos cliques por palavra-chave for muito menor que o total da
campanha, a diferença vem de uma destas fontes:

| Fonte | Sinal característico |
|---|---|
| Rede de Display | volume alto, CPC muito baixo, CTR despenca |
| Parceiros de pesquisa | não aparece em termos de pesquisa, CTR baixo |
| Anúncios Dinâmicos de Pesquisa (DSA) | segmentação automática ligada nas configurações |

O Google realmente oculta termos de baixo volume por privacidade, mas isso
explica uma fatia pequena. Quando 80% ou mais do tráfego some, a causa é
uma das três acima.

**Como confirmar:** segmentar a tabela da campanha por "Rede (com parceiros
de pesquisa)" e verificar nas configurações se há DSA ativo.

## Display ligada em campanha de Pesquisa

Configuração comum em campanhas criadas pelo assistente do Google. Consome
orçamento com cliques de baixa intenção em apps e sites. Verificar em
Configurações > Redes. Em conta pequena, desligar quase sempre é correto.

## Tag instalada não é conversão configurada

São coisas diferentes. A tag (AW-XXXXXXXXX) identifica o visitante e permite
remarketing. A ação de conversão é o destino específico do evento. Um site
pode ter a tag funcionando perfeitamente e nenhuma conversão registrada
porque o `send_to` do evento está com placeholder não substituído.

**Placeholder típico:** `'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'`

**Como verificar:** baixar o HTML e o JS do site e procurar por `send_to`,
`gtag`, `AW-`, `G-`, `GTM-` e `fbq`.

## Status "Inativo" ou "Não verificado" em conversão nova

É o estado normal de qualquer ação de conversão que ainda não recebeu o
primeiro disparo. Muda sozinha para "Ativa" quando chega o primeiro evento.
Não gera registro no histórico de alterações, porque o histórico só loga
edições feitas por pessoas. Não é sinal de erro.

## Conversão de carregamento de página incluída nas metas

Ação do tipo "Visualização de página" marcada como Principal transforma
qualquer visita em conversão. Isso destrói a otimização, porque o
"Maximizar conversões" passa a buscar cliques baratos em vez de contatos.
Verificar em Metas > Conversões e mudar para Secundária.

## Categoria de meta vazia

Ao mover a única ação de uma categoria para Secundária, aquela categoria
fica sem ação Principal. Se a campanha aponta para ela, fica sem sinal.
Confirmar em Configurações da campanha > Metas de conversão quais
categorias estão listadas e se a ação desejada aparece entre elas.

## Palavras-chave que aparecem sozinhas

Podem vir de aplicação automática de recomendações, mas nem sempre.
Verificar em Recomendações > Aplicação automática antes de acusar.
Se estiver tudo com "0 de N selecionados", as palavras já estavam lá.

## Erro de digitação em palavra-chave

Termo com letra faltando fica "Não qualificada, baixo volume de pesquisas"
e nunca roda. Ler a lista completa de palavras-chave com atenção, não
confiar no que se acredita ter cadastrado.

## O elemento "Stop Claude" na tela

É o botão de parada da própria extensão Claude in Chrome, não é injeção
maliciosa nem elemento estranho da página. Se o agente reportar isso como
suspeita de segurança, tranquilize o usuário.

## Custo por conversão com poucas conversões

Com 1 a 5 conversões, o custo por conversão não tem significado estatístico
e vai oscilar muito. Registrar isso no relatório antes que o número suba e
pareça regressão.

## Métrica que muda de importância quando entra rastreamento

Antes de haver conversão, CTR é o melhor indicador disponível. Depois que a
conversão passa a registrar, decisões devem usar conversão, não CTR. Tráfego
com CTR baixo que gera contato vale mais que tráfego com CTR alto que não
gera. Reavaliar recomendações anteriores baseadas só em CTR.
