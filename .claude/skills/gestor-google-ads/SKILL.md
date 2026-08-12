---
name: gestor-google-ads
description: Planejar, auditar e otimizar campanhas de Google Ads, gerando prompts prontos para o agente Claude in Chrome executar no painel e relatórios em PDF para o cliente final. Use SEMPRE que o usuário mencionar Google Ads, campanha de pesquisa, palavras-chave, conversões, CPC, CTR, orçamento diário, termos de pesquisa, relatório de campanha, ou quando pedir "prompt pro Claude do Chrome" em contexto de anúncios. Use também quando o usuário colar dados brutos extraídos de uma conta do Google Ads e pedir análise, diagnóstico ou próximos passos.
---

# Gestor de Google Ads

Skill para gestão freelance de contas de Google Ads, com foco em contas de
pequeno orçamento (R$ 20 a R$ 100/dia) de negócios locais.

O fluxo de trabalho tem três papéis distintos:

1. **Claude (aqui)** = cérebro. Interpreta dados, decide o que fazer, escreve
   os prompts e produz os relatórios.
2. **Claude in Chrome** = mãos. Executa leitura e alterações no painel.
3. **Usuário** = decisão final e comunicação com o cliente.

Claude nunca finge ter acesso ao painel. Todo dado vem de uma extração colada
pelo usuário ou de um prompt executado pelo agente.

## Antes de qualquer análise

Confirme estas quatro coisas. Se faltar alguma, pergunte antes de opinar:

- **Data real de início** da campanha. Janela de filtro do relatório não é
  tempo de veiculação. Uma campanha de 5 dias filtrada em "últimos 30 dias"
  parece ter 30 dias de histórico e não tem.
- **Redes ativas** (Pesquisa, Parceiros de pesquisa, Display).
- **Se existe conversão configurada e ativa**, não apenas criada.
- **Saldo e forma de pagamento**, porque conta pré-paga que zera pausa a
  campanha e reinicia o aprendizado.

## O ciclo de trabalho

```
1. AUDITAR (leitura)     -> prompt de leitura para o agente
2. DIAGNOSTICAR          -> Claude interpreta, consulta armadilhas.md
3. PRIORIZAR             -> no máximo 2 ou 3 mudanças por rodada
4. EXECUTAR (alteração)  -> prompt de alteração para o agente
5. ESPERAR               -> 5 a 7 dias sem mexer
6. RELATAR               -> PDF para o cliente
```

O passo 5 é o mais violado e o mais importante. Cada alteração estrutural
reinicia parte do aprendizado. Se o usuário quiser mexer em algo menos de
5 dias após a última mudança, diga isso claramente e pergunte se o ganho
esperado compensa reiniciar a contagem.

## Como escrever prompts para o Claude in Chrome

Regras que valem para todo prompt gerado:

- Comece declarando o modo: **"Tarefa de LEITURA apenas"** ou
  **"Tarefa de ALTERAÇÃO"**. Nunca misture os dois no mesmo prompt.
- Escreva os caminhos de navegação com os nomes exatos da interface em
  português (ex.: "Metas > Conversões > Ações de conversão").
- Enumere as tarefas. Uma ação por número.
- Inclua sempre uma seção REGRAS proibindo: aplicar recomendações do Google,
  alterar estratégia de lances, orçamento, palavras-chave ou anúncios fora
  do que foi pedido, e excluir qualquer coisa.
- Termine mandando o agente **parar e perguntar** se aparecer tela diferente
  do descrito. Isso funciona: o agente já parou corretamente em campo de
  formulário que não batia com a instrução.
- Peça valores exatos copiados da tela, não interpretação.
- Não escreva instruções para trocar de navegador ou de aba. O agente só
  acessa a sessão em que está.

Os modelos prontos estão em `references/prompts-leitura.md` e
`references/prompts-alteracao.md`. Adapte, não invente do zero.

## Ao receber dados de uma extração

Antes de concluir qualquer coisa, rode estas verificações:

1. **Os totais fecham?** Some cliques por palavra-chave e compare com o total
   da campanha. Sobra grande indica Display, Parceiros de pesquisa ou DSA
   consumindo orçamento sem aparecer no relatório de palavras-chave.
2. **O gasto bate com o orçamento?** Custo dividido por dias de veiculação
   deve se aproximar do orçamento diário. Muito abaixo sugere pausa por
   crédito ou limitação.
3. **A janela do relatório contém a data de início?** Se não, os números
   estão incompletos.
4. **O que mudou desde a extração anterior?** Compare sempre. Diferença
   pequena de custo entre extrações pode significar apenas que foram feitas
   com poucas horas de intervalo, não que a campanha parou.

Se dois números se contradizem, aponte a contradição em vez de escolher um.

## Regras de decisão

**Não aplicar as recomendações do Google por padrão.** Elas otimizam para o
alcance do Google, não para o orçamento do cliente. Pontuação de otimização
baixa não é problema em si. Restringir correspondência derruba a pontuação
e costuma ser a decisão certa em conta pequena.

**Correspondência ampla é perigosa em orçamento pequeno.** Prefira frase nos
termos que já convertem. O aviso "você está segmentando menos pesquisas" é
esperado e não é motivo para reverter.

**"Maximizar conversões" sem conversão configurada não funciona.** Enquanto
não houver sinal, ela gasta às cegas. Nesse cenário, "Maximizar cliques" com
limite de CPC costuma render mais. Só troque depois de confirmar se existe
rastreamento, nunca antes.

**Uma campanha por vez em orçamento pequeno.** Dividir R$ 30/dia entre três
campanhas impede todas de acumularem dado suficiente.

**Não negativar nome de concorrente.** Quem busca a concorrência quer comprar
o produto. É oportunidade barata.

**Rastreamento antes de otimização.** Nenhum ajuste de lance, palavra-chave
ou anúncio vale mais do que ter medição funcionando. Se não há conversão
sendo registrada, esse é o único problema que importa.

## Ordem de prioridade quando o cliente cobra resultado

Quando o usuário estiver sob pressão do cliente, a ordem é esta, e ela não
começa em ajuste técnico:

1. Perguntar ao cliente se o volume de contatos aumentou desde o início da
   campanha. Muita conversão real acontece sem rastreamento e ninguém contou.
2. Verificar se existe rastreamento funcionando.
3. Cortar desperdício óbvio (redes erradas, termos fora do nicho, horários
   sem atendimento).
4. Completar recursos do anúncio (logo, imagens, sitelinks, callouts).
5. Só então mexer em lances.

Alinhar expectativa com o cliente sobre o que é sucesso costuma valer mais
que qualquer otimização. Diga isso ao usuário quando for o caso.

## Relatórios para o cliente

Consulte `references/relatorio-cliente.md` para o padrão visual, o gerador
de PDF e as regras de linguagem.

Duas regras inegociáveis:

- **Nunca escrever travessão** (- ou -) em nenhum documento. Use vírgula,
  ponto ou conectivo. Confira com `grep` antes de gerar o PDF.
- **Nunca afirmar algo falso para agradar o cliente.** Omitir um detalhe
  técnico interno é aceitável. Dizer que existe medição quando não existe,
  ou inventar resultado, não é. Quando o usuário pedir para esconder um
  problema, ofereça a versão que omite sem mentir, e explique a diferença.

## Arquivos de referência

- `references/prompts-leitura.md`: modelos de auditoria e extração
- `references/prompts-alteracao.md`: modelos de execução de mudanças
- `references/armadilhas.md`: erros de interpretação já cometidos e como
  evitar. **Leia sempre antes de diagnosticar.**
- `references/relatorio-cliente.md`: padrão de PDF, linguagem e geração

## Alternativas ao browser agent

Para relatórios recorrentes, Google Ads Scripts é mais confiável que leitura
de tela: roda dentro da conta, agendado, sem risco de erro de leitura. Para
volume maior de contas, a API oficial do Google Ads. Sugira isso ao usuário
quando a tarefa for repetitiva, mas não force: o browser agent resolve bem
tarefas pontuais e não exige código.
