# Materiais para a Hotmart: SOS Pet

PDFs prontos para cadastrar como conteúdo de entrega do produto "SOS Pet" na
Hotmart:

- `SOS-Pet-Bonus-Guia-de-Transporte-Seguro.pdf`
- `SOS-Pet-Bonus-Alimentos-que-Intoxicam.pdf`
- `SOS-Pet-Bonus-Carteira-de-Vacinacao.pdf` (modelo em branco para imprimir)
- `SOS-Pet-Como-Acessar-o-App.pdf` (instruções de acesso; sobe como o
  material de boas-vindas do produto)

O conteúdo dos dois primeiros bônus vem direto do guia real do Dr. Eduardo
Sebastião (CRMV-MT 6412), sem invenção. O SOS completo em si (as 8
emergências) fica dentro do app, travado por compra, não é um PDF separado.

## Editar e gerar de novo

As fontes (HTML) ficam em `fontes/`. Para editar o texto, mexa nos arquivos
`.html`; o visual (cores, fontes, layout) fica em `fontes/_shared.css`.

Para gerar os PDFs de novo depois de editar (precisa de Node.js e do
Playwright instalado):

```bash
cd materiais-hotmart/fontes
node render.mjs
```

Os PDFs saem na própria pasta `fontes/`; mova-os para `materiais-hotmart/`
depois.
