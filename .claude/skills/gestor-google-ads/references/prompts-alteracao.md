# Prompts de alteração para o Claude in Chrome

O agente pedirá confirmação do usuário em alterações. Isso é esperado.

Toda alteração deve ser precedida de uma leitura que confirme o estado atual.
Nunca gere um prompt de alteração baseado em suposição.

## Bloco REGRAS padrão

Inclua sempre, adaptando as exceções:

```
REGRAS
- Não aplique nenhuma recomendação sugerida pelo Google.
- Não altere estratégia de lances, orçamento, palavras-chave nem anúncios
  fora do que está descrito acima.
- Não exclua nenhuma ação de conversão, palavra-chave ou anúncio existente.
- Se alguma tela pedir algo fora do descrito, PARE e me pergunte.
- Me confirme cada item ao terminar.
```

---

## 1. Criar conversão de clique em WhatsApp

O caminho mais comum em negócio local. O site precisa ter a tag do Google
instalada e um botão com evento de clique.

```
Conta [ID]. Tarefa de ALTERAÇÃO.

1. Em Metas > Conversões > Ações de conversão, clique em
   "Nova ação de conversão" e escolha "Site".
2. Escolha configurar manualmente com código.
   NÃO use a varredura automática de URL.
3. Configure exatamente:
   - Nome: Clique WhatsApp - Site
   - Categoria da meta: Contato
   - Valor: "Usar o mesmo valor para todas as conversões", R$ 1,00 (BRL)
   - Contagem: Uma
   - Janela de conversão de clique: 30 dias
   - Otimização de ações: Principal
   - Modelo de atribuição: padrão
4. Salve.
5. Abra a instalação da tag, escolha a opção que indica que a tag do Google
   já está no site, e me devolva SOMENTE o valor completo do send_to,
   no formato AW-XXXXXXXXX/YYYYYYYYYYY, exatamente como aparece.

[REGRAS]
```

**Nota sobre o valor:** a opção literal "não usar valor" não existe nesse
assistente. Valor zero costuma ser rejeitado. R$ 1,00 fixo é o marcador
neutro correto. A opção de valores dinâmicos exigiria que o site enviasse
um valor por código, o que normalmente não acontece.

**Depois do agente:** o `send_to` precisa ser colado no site, substituindo
o placeholder. Isso é feito pelo desenvolvedor, não pelo agente.

---

## 2. Desmarcar conversão de carregamento de página

```
Conta [ID]. Tarefa de ALTERAÇÃO.

Em Metas > Conversões > Ações de conversão, abra a ação
"[NOME]" (categoria Visualização de página).
Altere "Otimização de ações" para Secundária, de modo que
"Incluída nas metas da conta" fique como Não.
NÃO exclua a ação, apenas mude a otimização. Salve.

Me confirme como o campo ficou.

[REGRAS]
```

---

## 3. Desligar rede

```
Conta [ID], campanha [NOME]. Tarefa de ALTERAÇÃO.

Em Configurações da campanha > Redes, desmarque [Rede de Display /
Parceiros de pesquisa]. Salve.

Me confirme quais redes ficaram marcadas depois de salvar.

[REGRAS]
```

---

## 4. Corrigir e ajustar palavras-chave

```
Conta [ID], campanha [NOME], [GRUPO DE ANÚNCIOS]. Tarefa de ALTERAÇÃO.

1. Pause a palavra-chave "[TERMO ERRADO]".
2. Adicione "[TERMO CORRETO]" em correspondência de FRASE (com aspas).
3. Altere as seguintes palavras de correspondência ampla para FRASE:
   [LISTA]

Observação: ao mudar o tipo, o Google recria a palavra-chave e ela fica
como "Em análise" por algum tempo. Isso é normal, não tente corrigir.

[REGRAS]
```

---

## 5. Adicionar palavras negativas

```
Conta [ID], campanha [NOME]. Tarefa de ALTERAÇÃO.

Adicione as seguintes palavras-chave NEGATIVAS no nível da campanha,
em correspondência ampla:
[LISTA]

Não remova nenhuma negativa existente.

[REGRAS]
```

Não negative nome de concorrente sem motivo forte. Quem busca a concorrência
quer comprar o produto.

---

## 6. Completar recursos do anúncio

```
Conta [ID], campanha [NOME], [GRUPO]. Tarefa de ALTERAÇÃO.

1. Em Recursos, configure o Nome da empresa como: [NOME]
2. Adicione os títulos ao anúncio responsivo: [LISTA, até 30 caracteres cada]
3. Adicione descrições aos sitelinks existentes: [LISTA]
4. Adicione novos sitelinks: [NOME > URL]
5. Adicione frases de destaque (callouts): [LISTA, até 25 caracteres cada]

[REGRAS]
```

Logotipo e imagens exigem upload de arquivo e não podem ser feitos pelo
agente. O usuário sobe manualmente.

---

## 7. Trocar estratégia de lances

Só use depois de confirmar o estado do rastreamento.

```
Conta [ID], campanha [NOME]. Tarefa de ALTERAÇÃO.

Altere a estratégia de lances de "[ATUAL]" para "[NOVA]",
com [limite de CPC máximo de R$ X,XX / CPA desejado de R$ X,XX].

[REGRAS]
```

**Critério:** sem conversão registrando, "Maximizar cliques" com limite de
CPC. Com conversão registrando mas menos de 15 a 30 por mês, manter
"Maximizar conversões" sem CPA desejado. Com volume maior, considerar CPA.
