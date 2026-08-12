# Relatórios em PDF para o cliente final

O leitor é o dono do negócio, não um profissional de marketing. Ele quer
saber se está valendo a pena e o que foi feito pelo dinheiro dele.

## Regras de linguagem

**Nunca use travessão** (- ou -). Use vírgula, ponto ou conectivo.
Confira antes de gerar: `grep -c "-\|-" arquivo.html` deve retornar 0.

**Traduza todo jargão:**

| Termo técnico | Como escrever |
|---|---|
| impressões | vezes que o anúncio apareceu |
| cliques | pessoas que entraram no site |
| CTR | taxa de cliques, com explicação |
| conversões | contatos, pedidos de orçamento |
| CPC | custo por visita |
| correspondência ampla / frase | formato aberto / formato mais preciso |
| Rede de Display | banners dentro de sites e aplicativos |
| fase de aprendizado | calibragem, período de testes do sistema |

**Enquadre correções como otimizações.** "Identificamos que parte do
orçamento ia para tráfego de baixa qualidade e corrigimos" é verdade e é
melhor que "estava configurado errado desde o início".

**Explique o porquê de cada ajuste**, não só o quê. O cliente paga pelo
critério, não pelo clique no painel.

## Limite ético

Omitir detalhe técnico interno é aceitável. Afirmar o que não é verdade não é.

Nunca escreva que existe medição funcionando quando não existe, nem invente
ou infle resultado. Quando o usuário pedir para esconder um problema,
entregue a versão que omite sem mentir e explique a diferença entre as duas
coisas. Se o relatório constrói expectativa que os dados não sustentam,
diga isso ao usuário fora do documento.

## Estrutura que funciona

1. Título e período
2. Resumo em uma frase, dentro de caixa destacada
3. Cartões com 4 métricas principais
4. Resultado, quando houver, em caixa verde no topo
5. O que as pessoas pesquisaram (a seção que mais engaja o cliente)
6. Desempenho por dispositivo ou por termo
7. O que foi ajustado e por quê, um bloco por item
8. Fase de calibragem, para justificar oscilação futura
9. Próximos passos
10. Um pedido ao cliente (fotos, logo, aviso de contatos)

O item 10 é importante: transforma o relatório em via de mão dupla e
costuma render o insumo que falta.

## Geração do PDF

HTML e depois wkhtmltopdf:

```bash
wkhtmltopdf --encoding utf-8 --enable-local-file-access --page-size A4 \
  relatorio.html /mnt/user-data/outputs/nome.pdf
```

## Padrão visual

```css
@page { size: A4; margin: 16mm 15mm 14mm 15mm; }
body { font-family: "DejaVu Sans", Helvetica, Arial, sans-serif;
       color: #2b2b2b; font-size: 10.5pt; line-height: 1.55; }
h1 { font-size: 19pt; color: #1c2a35; }
.rule { height: 3px; background: #b08d57; width: 70px; }
h2 { font-size: 12.5pt; color: #1c2a35;
     border-bottom: 1px solid #e2e5e8; padding-bottom: 5px; }
th { background: #1c2a35; color: #fff; }
.box { background: #f6f7f8; border-left: 3px solid #b08d57; padding: 12px 14px; }
.destaque { background: #eef4ef; border-left: 3px solid #2e7d4f; }
```

Cartões de métrica usam tabela com espaçamento separado, porque
wkhtmltopdf não renderiza flex ou grid de forma confiável:

```css
.cards { border-collapse: separate; border-spacing: 8px 0; }
.cards td { background: #f6f7f8; border-top: 3px solid #1c2a35;
            text-align: center; padding: 12px 6px; width: 25%; }
```

Termos de pesquisa como etiquetas:

```css
.terms span { background: #f0ece4; border: 1px solid #e3dbcb;
              padding: 2px 7px; border-radius: 3px; white-space: nowrap; }
```

## Consistência entre relatórios

Antes de gerar, compare com o relatório anterior. Se os números não forem
compatíveis, descubra o motivo antes de enviar. Cliente que recebe dois
documentos com dados conflitantes passa a discutir a inconsistência em vez
do trabalho.
