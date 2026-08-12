# Kit Auditoria Google Ads

Núcleo de conhecimento para auditar, corrigir e acompanhar contas de Google Ads
de pequeno orçamento (R$ 20 a R$ 100 por dia) de negócios locais.

## Como este material se organiza

Existe um núcleo, escrito uma vez, e destinos que consomem esse núcleo.

```
nucleo/          a fonte da verdade. Todo o resto deriva daqui.
agente-hotmart/  o núcleo adaptado para treinar o Agente de IA da Hotmart
uso-proprio/     prompts e relatórios para atender clientes
isca/            o checklist de uma página, material da aula
negocio/         posicionamento, preço e página de vendas
```

Regra: quando o método mudar, muda em `nucleo/` e os destinos são regerados.
Nunca corrija um destino sem corrigir o núcleo, senão eles divergem.

## Arquivos do núcleo

| Arquivo | Para que serve |
|---|---|
| `metodo-auditoria.md` | As 15 falhas mais comuns e o sinal de cada uma nos dados |
| `verificacoes-sanidade.md` | Conferências obrigatórias antes de concluir qualquer coisa |
| `regras-orcamento-pequeno.md` | O que decidir quando o orçamento é curto |
| `acompanhamento-mensal.md` | O ciclo recorrente, mês a mês |
| `ficha-da-conta.md` | O formato de estado que permite comparar um mês com o outro |

## Duas regras que valem para tudo

**Nenhum documento gerado contém travessão.** Nem o longo nem o curto. Use
vírgula, ponto, dois pontos ou conectivo. Confira antes de entregar qualquer
arquivo ao cliente.

**Nunca afirmar algo falso para agradar.** Omitir detalhe técnico interno é
aceitável. Dizer que existe medição quando não existe, ou inventar resultado,
não é. Quando pedirem para esconder um problema, ofereça a versão que omite
sem mentir e explique a diferença.

## Relação com a skill `gestor-google-ads`

A skill em `.claude/skills/gestor-google-ads/` continua sendo a ferramenta de
trabalho. Este núcleo não a substitui, ele organiza o método em documentos que
podem virar produto. As armadilhas descritas na skill tratam de erros de
interpretação do analista. As falhas descritas aqui tratam de erros presentes
na conta. São coisas diferentes e ambas são necessárias.
