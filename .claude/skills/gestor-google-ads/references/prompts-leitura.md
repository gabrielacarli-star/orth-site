# Prompts de leitura para o Claude in Chrome

Todos são somente leitura. Adapte o ID da conta e o nome da campanha.

---

## 1. Auditoria completa da conta

Use no primeiro contato com uma conta, ou quando algo não fizer sentido.

```
Preciso levantar informações da conta [ID]. Tarefa de LEITURA apenas.
Não altere, crie, pause nem aplique nada.

1. IDENTIFICAÇÃO
   - Nome da conta e ID de cliente no topo da tela.
   - Se está dentro de uma conta administradora (MCC).
   - Nome do pagador em Faturamento.

2. TAG DO GOOGLE
   Ferramentas > Gerenciador de dados (ou Tags do Google).
   - Liste todos os IDs de tag e o status de cada um.

3. AÇÕES DE CONVERSÃO
   Metas > Conversões > Ações de conversão, filtro "Status: Todos".
   - Liste TODAS, incluindo pausadas.
   - Para cada uma: nome, categoria, fonte, status de acompanhamento,
     otimização (Principal ou Secundária), contagem, janela e se está
     incluída nas metas da conta.
   - Se a lista estiver vazia, diga isso claramente.

4. DIAGNÓSTICO DE MEDIÇÃO
   Metas > Diagnóstico. Copie qualquer aviso ou erro exibido.

5. CAMPANHA [NOME]
   Configurações da campanha:
   - Data de início e status.
   - Estratégia de lances exata.
   - Redes marcadas (Pesquisa, Parceiros de pesquisa, Display).
   - Se há Anúncios Dinâmicos de Pesquisa (DSA) configurados.
   - Orçamento diário e se aparece aviso de "limitado por orçamento".
   - Metas de conversão: padrão da conta ou específicas, e quais.

6. PALAVRAS-CHAVE
   Liste TODAS as do grupo de anúncios, com tipo de correspondência
   (ampla, frase ou exata) e status de cada uma.

7. FATURAMENTO
   Faturamento > Resumo: saldo, forma de pagamento (manual ou automático),
   avisos pendentes.

8. RECOMENDAÇÕES
   Recomendações > Aplicação automática: quais estão LIGADAS.

Devolva organizado por número, copiando os valores exatos da tela.
Se algum menu tiver nome diferente, procure o equivalente e me diga onde
encontrou. Não clique em nada que altere configuração.
```

---

## 2. Confirmação de identidade da conta

Use antes de qualquer alteração, quando houver dúvida se é a conta certa.

```
Antes de seguir, confirme duas coisas na conta [ID]. LEITURA apenas.

A) Abra a campanha [NOME] > Anúncios e me diga a URL final do anúncio ativo.
   Ela precisa ser [DOMÍNIO]. Se for outro domínio, PARE e me avise.

B) Em Ferramentas > Gerenciador de dados, confirme se o ID [AW-XXXXXXXXX]
   aparece nesta conta. Se não aparecer, PARE e me avise.

Se A e B baterem, me diga isso e aguarde novas instruções.
```

---

## 3. Termos de pesquisa

```
Campanha [NOME], conta [ID]. Tarefa de LEITURA apenas.

Abra o relatório de Termos de pesquisa, período [DATA] até hoje, sem filtro.

Me liste TODOS os termos com: termo, impressões, cliques e custo.

Me informe também a linha de total do relatório e o total geral da campanha
no mesmo período, para eu comparar quanto do tráfego não está identificado.

Não adicione palavras negativas nem altere nada.
```

---

## 4. Segmentação por rede

Use para descobrir para onde vai o tráfego não identificado.

```
Campanha [NOME], conta [ID]. Tarefa de LEITURA apenas.

Na tabela da campanha, use o botão "Segmentar" e escolha
"Rede (com parceiros de pesquisa)". Período: [DATA] até hoje.

Para cada linha de rede, me traga: impressões, cliques, CTR, CPC médio
e custo.

Não altere nada.
```

---

## 5. Segmentação por ação de conversão

Use para descobrir qual ação gerou as conversões.

```
Campanha [NOME], conta [ID]. Tarefa de LEITURA apenas.

1. Na tabela da campanha, use "Segmentar" > "Ação de conversão".
   Período: [DATA] a [DATA].
   Me diga exatamente quais ações geraram conversões e quantas cada uma.

2. Em Metas > Conversões, me diga o status de acompanhamento atual da
   ação [NOME DA AÇÃO].

Não altere nada.
```

---

## 6. Horário e dia da semana

Use para cortar veiculação fora do horário de atendimento.

```
Campanha [NOME], conta [ID]. Tarefa de LEITURA apenas.

Vá em Relatórios > Predefinidos > Tempo > Hora do dia, e depois
Dia da semana. Período: [DATA] até hoje.

Me traga impressões, cliques, CTR, custo e conversões por faixa de horário
e por dia da semana.

Não altere nada.
```

---

## 7. Recursos do anúncio

```
Campanha [NOME], conta [ID]. Tarefa de LEITURA apenas.

1. Abra o anúncio responsivo do grupo de anúncios e me liste TODOS os
   títulos e descrições, com impressões e cliques de cada um se disponível.
2. Em Recursos (Assets), me diga quais tipos estão configurados e quais
   estão vazios: sitelinks, frases de destaque, snippets, chamada,
   formulário de lead, imagem, logotipo, nome da empresa.
3. Me informe se algum recurso está reprovado e qual o motivo exibido.

Não altere nada.
```
