# As 15 falhas mais comuns em contas de Google Ads

Falhas presentes na conta, não erros de interpretação do analista. Para erros
de leitura e diagnóstico, consulte `armadilhas.md` na skill.

A maioria destas falhas aparece em contas montadas pelo assistente de criação
do Google, que otimiza para facilidade de configuração e alcance, não para
orçamento pequeno.

## Como usar esta lista

Audite na ordem dos blocos. Não pule para o bloco 3 com problema aberto no
bloco 1: ajustar lance numa conta sem medição é desperdício de trabalho.

Gravidade significa o seguinte:

- **Crítica**: invalida os dados ou queima orçamento em volume. Corrigir antes de qualquer outra coisa.
- **Alta**: desperdício relevante ou decisão sendo tomada com sinal errado.
- **Média**: perda de eficiência. Corrigir quando o básico já estiver de pé.

---

# Bloco 1: Medição

Enquanto houver falha aberta aqui, nenhum número da conta é confiável e
nenhuma otimização automática funciona.

## 1. Rastreamento de conversão nunca instalado

**Gravidade:** Crítica

**Sinal nos dados:** coluna de conversões zerada desde o início, com cliques
acumulando normalmente. A conta parece "não converter" quando na verdade ela
não mede.

**Como confirmar:** baixe o HTML e o JS do site e procure por `send_to`,
`gtag`, `AW-`, `G-`, `GTM-`. O caso clássico é o `send_to` com o texto de
exemplo que nunca foi substituído:

```
'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
```

**O que fazer:** substituir pelo ID e pelo rótulo reais da ação de conversão,
que ficam em Metas > Conversões > Ações de conversão > a ação > Configurar tag.

**Cuidado:** tag instalada não é conversão configurada. A tag identifica o
visitante e permite remarketing. A ação de conversão é o evento específico. O
site pode ter a tag funcionando perfeitamente e nenhuma conversão registrada.

## 2. Conversão de carregamento de página marcada como Principal

**Gravidade:** Crítica

**Sinal nos dados:** número de conversões muito próximo do número de cliques,
taxa de conversão irreal (acima de 40 por cento), custo por conversão baixo
demais para o nicho.

**Como confirmar:** Metas > Conversões. Procure ação do tipo "Visualização de
página" ou "Carregamento de página" com origem de meta marcada como Principal.

**O que fazer:** mudar para Secundária. Toda visita vira conversão nesse
cenário, e o "Maximizar conversões" passa a caçar clique barato em vez de
contato.

**Cuidado:** ao mover a única ação de uma categoria para Secundária, aquela
categoria fica sem ação Principal. Veja a falha 4.

## 3. Conversões duplicadas contando o mesmo contato duas vezes

**Gravidade:** Alta

**Sinal nos dados:** conversões em número par e redondo, ou o cliente relata
metade dos contatos que o painel mostra.

**Como confirmar:** Metas > Conversões. Procure duas ações medindo o mesmo
evento, por exemplo um clique em WhatsApp registrado pelo gtag e também pelo
Google Tag Manager. Confira também a coluna "Contagem": para geração de
contato, o correto costuma ser "Uma" e não "Todas".

**O que fazer:** manter uma ação por evento como Principal e as demais como
Secundárias. Ajustar a contagem para "Uma".

## 4. Categoria de meta sem nenhuma ação Principal

**Gravidade:** Alta

**Sinal nos dados:** a campanha para de otimizar depois de um ajuste em
conversões, sem que nada mais tenha mudado.

**Como confirmar:** Configurações da campanha > Metas de conversão. Verifique
quais categorias estão listadas e se a ação desejada aparece entre elas.

**O que fazer:** apontar a campanha para a categoria que contém a ação
Principal correta, ou promover a ação certa dentro da categoria em uso.

**Cuidado:** status "Inativo" ou "Não verificado" em conversão recém criada é
normal. Muda sozinho quando chega o primeiro disparo e não gera registro no
histórico de alterações, porque o histórico só registra edições feitas por
pessoas. Não confunda com falha.

---

# Bloco 2: Vazamento de orçamento

Dinheiro saindo por lugar que ninguém escolheu conscientemente.

## 5. Rede de Display ativada em campanha de Pesquisa

**Gravidade:** Crítica

**Sinal nos dados:** volume de impressões desproporcional, CPC médio muito
baixo, CTR despencando, cliques que não aparecem no relatório de palavras
chave.

**Como confirmar:** Configurações da campanha > Redes. Ou segmente a tabela da
campanha por "Rede (com parceiros de pesquisa)".

**O que fazer:** desligar. Em conta pequena isso quase sempre está certo. A
Display serve para alcance, e alcance não é o objetivo de quem tem R$ 30 por
dia para gerar contato.

## 6. Parceiros de pesquisa ativados

**Gravidade:** Alta

**Sinal nos dados:** cliques que não aparecem no relatório de termos de
pesquisa, CTR abaixo do restante da campanha.

**Como confirmar:** Configurações da campanha > Redes > "Incluir parceiros de
pesquisa do Google".

**O que fazer:** desligar em orçamento pequeno e observar por 7 dias. Os
parceiros podem trazer volume barato, mas a intenção é mais fraca e o
inventário não é auditável termo a termo.

## 7. Anúncios Dinâmicos de Pesquisa ligados sem controle

**Gravidade:** Alta

**Sinal nos dados:** tráfego consumindo o orçamento sem palavra chave
correspondente. Nos casos piores, mais de 80 por cento do gasto.

**Como confirmar:** Configurações da campanha, procure segmentação dinâmica ou
grupo de anúncios do tipo dinâmico. Em campanhas novas, verifique também
"Segmentação expandida" ou recursos criados automaticamente.

**O que fazer:** desligar, ou restringir a páginas específicas do site e
acompanhar os termos semana a semana.

**Como diferenciar das falhas 5 e 6:** some os cliques por palavra chave e
compare com o total da campanha. A sobra vem de Display, de Parceiros ou de
DSA. Segmentar por rede separa as três. O Google realmente oculta termos de
baixo volume por privacidade, mas isso explica uma fatia pequena. Quando some
80 por cento, a causa é uma dessas três.

## 8. Segmentação de local em "Presença ou interesse"

**Gravidade:** Alta

**Sinal nos dados:** termos de pesquisa com nome de outras cidades, ligações e
mensagens de fora da área de atendimento.

**Como confirmar:** Configurações da campanha > Locais > Opções de local. O
padrão do Google é "Presença ou interesse", que exibe o anúncio para quem
apenas demonstrou interesse na região, mesmo estando longe.

**O que fazer:** mudar para "Presença", que restringe a quem está de fato na
área. Para negócio local que atende presencialmente, essa é quase sempre a
opção correta.

## 9. Nenhuma palavra chave negativa cadastrada

**Gravidade:** Alta

**Sinal nos dados:** relatório de termos de pesquisa com "grátis", "como
fazer", "salário", "curso", "vagas", "reclame aqui", nomes de cidade fora da
área.

**Como confirmar:** Palavras chave > Negativas. Lista vazia em conta com mais
de duas semanas de veiculação é falha.

**O que fazer:** revisar termos de pesquisa semanalmente e negativar o que
não tem intenção de compra. Comece pelos termos que já gastaram sem converter.

**Cuidado:** não negative nome de concorrente. Quem busca a concorrência quer
comprar o produto, e é oportunidade barata.

## 10. Correspondência ampla em orçamento pequeno

**Gravidade:** Alta

**Sinal nos dados:** termos de pesquisa muito distantes da palavra cadastrada,
gasto pulverizado em muitos termos com um clique cada.

**Como confirmar:** coluna "Tipo de correspondência" na aba de palavras chave.

**O que fazer:** migrar para correspondência de frase nos termos que já
converteram ou que têm intenção clara. Ampla exige volume de dados que uma
conta de R$ 30 por dia não gera.

**Cuidado:** o aviso "você está segmentando menos pesquisas" é esperado e não
é motivo para reverter. A pontuação de otimização vai cair, e tudo bem.

---

# Bloco 3: Estrutura e eficiência

Com medição de pé e vazamento fechado, é aqui que se ganha eficiência.

## 11. "Maximizar conversões" sem conversão configurada

**Gravidade:** Crítica

**Sinal nos dados:** estratégia de lance automática em conta com zero
conversões registradas no histórico.

**Como confirmar:** Configurações da campanha > Lances, cruzando com Metas >
Conversões.

**O que fazer:** enquanto não houver sinal, a estratégia gasta às cegas. Use
"Maximizar cliques" com limite de CPC até o rastreamento funcionar. Só troque
depois de confirmar que existe medição, nunca antes.

## 12. Orçamento dividido entre campanhas demais

**Gravidade:** Média

**Sinal nos dados:** três ou mais campanhas ativas somando menos de R$ 100 por
dia, todas com poucos cliques e nenhuma acumulando dado.

**O que fazer:** concentrar em uma campanha. Dividir R$ 30 por dia entre três
campanhas impede todas de saírem do aprendizado.

## 13. Palavra chave com erro de digitação

**Gravidade:** Média

**Sinal nos dados:** palavra com status "Não qualificada" ou "Baixo volume de
pesquisas" e zero impressões desde sempre.

**Como confirmar:** ler a lista completa de palavras chave com atenção. Não
confie no que você acredita ter cadastrado.

**O que fazer:** corrigir a grafia. Uma letra faltando faz a palavra nunca
rodar, e ela passa despercebida por meses.

## 14. Veiculação em horário sem atendimento

**Gravidade:** Média

**Sinal nos dados:** cliques concentrados de madrugada ou em domingo num
negócio que atende de segunda a sexta em horário comercial.

**Como confirmar:** relatório por hora do dia e por dia da semana.

**O que fazer:** restringir a programação de anúncios ao horário de
atendimento, ou reduzir o lance fora dele. Contato que chega e não é atendido
vira cliente do concorrente.

**Cuidado:** só corte horário com dado suficiente. Duas semanas é o mínimo.

## 15. Recursos do anúncio vazios

**Gravidade:** Média

**Sinal nos dados:** CTR abaixo da média do segmento, anúncio ocupando pouco
espaço na tela em relação ao concorrente.

**Como confirmar:** aba Recursos (antigas extensões). Verifique sitelinks,
frases de destaque, snippets estruturados, chamada, localização, logo e
imagem.

**O que fazer:** completar. É a melhoria de maior retorno por esforço na
conta, não custa nada e aumenta a área ocupada no resultado de busca.

---

## Outras verificações rápidas

Não entram na lista principal, mas valem o olhar em toda auditoria:

- **Saldo e forma de pagamento.** Conta pré paga que zera pausa a campanha e reinicia parte do aprendizado. Verifique em Faturamento antes de concluir que a campanha "parou de performar".
- **Página de destino genérica.** Anúncio de um serviço específico apontando para a página inicial perde conversão. Aponte para a página do serviço anunciado.
- **Aplicação automática de recomendações.** Recomendações > Aplicação automática. Se houver itens ligados, o Google altera a conta sozinho. Desligue antes de auditar, senão você corrige hoje e ele reverte amanhã.
- **Anúncio único no grupo.** Sem alternativa não há comparação possível. Dois anúncios responsivos por grupo é o mínimo razoável.
- **Idioma da campanha.** Configurações > Idiomas. Campanha configurada em inglês num negócio brasileiro restringe entrega sem que ninguém perceba.
