# Status da construção - Pet Saudável v1

Referência rápida do que foi feito na preparação e o que depende de você.

## ✅ Pronto (código + estrutura, testado com `npm run build`)

| Etapa (do plano) | O que ficou pronto |
|---|---|
| 0 · Preparar | Projeto React/Vite no ar, selo ES, ícones, PWA/manifest, service worker |
| 1 · Banco | `0001_init.sql` - 6 tabelas + RLS + gatilho de compras + índices |
| 2 · Login + pet | Cadastro, login, aceite de privacidade, CRUD de pet com foto |
| 3 · Vacinas e antiparasitários | Registro, cálculo automático da próxima dose, home "Próximos cuidados" |
| 4 · Peso | Registro + gráfico de linha (SVG, sem dependências) |
| 5 · Biblioteca | Catálogo, e-books liberados por compra, link temporário via Edge Function, link para a loja |
| 6 · Hotmart | Webhook (aprovação/reembolso) + botão "já comprei" |
| 7 · SOS + instalação | Fichas com conteúdo real do Dr. Eduardo, 100% travadas por compra (ver abaixo), convite de instalação |
| 8 · Lembretes | Função de e-mail (7 dias antes e no dia) + agendamento por cron |
| Cartão de emergência | Tela por pet, autopreenchida com nome/espécie/peso/idade/alergias, imprimível |
| Compliance | Textos "organiza e educa", sem dosagem; política de privacidade + excluir conta |

## ✅ Backend PROVISIONADO no Supabase (projeto `pet-saudavel`, São Paulo)

- Projeto criado, ref `iqbrncszbkrmlgkmcixp`, URL
  `https://iqbrncszbkrmlgkmcixp.supabase.co`
- Banco inicial (6 tabelas + RLS + gatilho) aplicado
- Buckets `pet-fotos` (público) e `ebooks` (privado) criados com políticas
- 5 Edge Functions publicadas e ativas: `hotmart-webhook`, `claim-purchase`,
  `ebook-url`, `delete-account`, `send-reminders`
- Verificação de segurança do Supabase: **sem alertas**

## ⚠️ Pendente por causa de uma aprovação travada nesta sessão

As duas ações abaixo estão prontas no código mas **não consegui aplicar**
porque os pedidos de aprovação pararam de passar (tentei várias vezes).
Enviei os arquivos prontos para você aplicar manualmente:

- [ ] **SQL do Cartão de Emergência + trava do SOS** (`migracoes-pendentes.sql`
      que te mandei): cole no Supabase → SQL Editor → Run. Corresponde aos
      arquivos `supabase/migrations/0002_cartao_emergencia.sql` e
      `0003_travar_sos.sql`.
- [ ] **Função `sos-conteudo`** (`sos-conteudo-index.ts` que te mandei):
      Supabase → Edge Functions → Deploy a new function → nome
      `sos-conteudo` → cole o código → ligue "Verify JWT" → Deploy.

Sem isso, o Cartão de Emergência e as fichas SOS não vão funcionar (vão dar
erro ao carregar), porque dependem dessas duas peças. É rápido de aplicar,
uns 3 minutos no total.

## 🔒 SOS agora 100% travado por compra (mudança desta rodada)

Antes, 2 fichas (Engasgo e Hemorragia) eram uma amostra grátis com o texto
dentro do pacote do app. Isso foi trocado: agora **nenhuma ficha mostra o
passo a passo sem compra ativa**. O texto sensível não fica mais no código
do app, ele mora numa tabela protegida (`sos_conteudo`, RLS sem nenhuma
política, ou seja, acesso negado por padrão) e só é entregue pela Edge
Function `sos-conteudo`, que confere a compra antes de responder. Mesmo
abrindo o código do navegador, não dá para ver o conteúdo sem estar logado
com uma compra ativa.

Isso exige um passo a mais na configuração: no `seed_produtos.sql`, marque
`desbloqueia_sos = true` no produto que corresponde ao guia de primeiros
socorros. Só quem comprar esse produto específico desbloqueia o SOS
completo.

## 🔧 Depende de você (contas e chaves) - ver `PUBLICAR.md`

- Publicar o app (Vercel ou Hostinger) com as 2 variáveis de ambiente
- Aplicar a migração e a função pendentes (ver acima)
- Cadastrar os segredos das funções (Hotmart hottok, Resend key, cron secret)
- Ligar o **webhook da conta Hotmart que vende o produto** e cadastrar os
  e-books (subir PDFs + seed, marcando `desbloqueia_sos` no produto certo)
- (Opcional) preencher `VITE_LOJA_URL` com o link da loja/página de vendas
  na Hotmart, para aparecer um botão na Biblioteca
- Verificar o domínio no **Resend** e agendar o cron
- Preencher e-mail/data na política de privacidade
- Revisar o conteúdo do SOS com o Dr. Eduardo (já é o material real dele,
  mas vale uma conferida antes de publicar)
- Definir Site URL e confirmação de e-mail em Authentication

## 🔜 Fica para a v2 (conforme o plano)

Upload de exames · encontre um veterinário · cursos/mentoria/área de membros ·
diário de saúde · consultas · comunidade · assinatura · B2B · notificação push
nativa · RCP completa, kit de primeiros socorros e lista de alimentos
perigosos (o guia do Dr. Eduardo tem esse conteúdo, ainda não está no app).
Todos dependem de uma base de usuários que ainda vai se formar (ou de tempo).

## Decisões já adotadas

- **App grátis; e-books e SOS completo só para compradores.** Cadastro
  livre, utilitários (vacina, peso) liberados, SOS e biblioteca condicionados
  à compra ativa.
- **Espécie aberta** no banco; a interface mostra Cão/Gato/Outro desde já.

Se quiser mudar qualquer uma dessas, é ajuste pequeno, me avise.
