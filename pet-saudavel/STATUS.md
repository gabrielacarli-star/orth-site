# Status da construção — Pet Saudável v1

Referência rápida do que foi feito na preparação e o que depende de você amanhã.

## ✅ Pronto (código + estrutura, testado com `npm run build`)

| Etapa (do plano) | O que ficou pronto |
|---|---|
| 0 · Preparar | Projeto React/Vite no ar, selo ES, ícones, PWA/manifest, service worker |
| 1 · Banco | `0001_init.sql` — 6 tabelas + RLS + gatilho de compras + índices |
| 2 · Login + pet | Cadastro, login, aceite de privacidade, CRUD de pet com foto |
| 3 · Vacinas e antiparasitários | Registro, cálculo automático da próxima dose, home "Próximos cuidados" |
| 4 · Peso | Registro + gráfico de linha (SVG, sem dependências) |
| 5 · Biblioteca | Catálogo, e-books liberados por compra, link temporário via Edge Function |
| 6 · Hotmart | Webhook (aprovação/reembolso) + botão "já comprei" |
| 7 · SOS + instalação | Fichas offline (2 grátis), convite de instalação (Android e iPhone) |
| 8 · Lembretes | Função de e-mail (7 dias antes e no dia) + agendamento por cron |
| Compliance | Textos "organiza e educa", sem dosagem; política de privacidade + excluir conta |

## ✅ Backend já PROVISIONADO no Supabase (projeto `pet-saudavel`, São Paulo)

- Projeto criado — ref `iqbrncszbkrmlgkmcixp`, URL
  `https://iqbrncszbkrmlgkmcixp.supabase.co`
- Banco (6 tabelas + RLS + gatilho) aplicado
- Buckets `pet-fotos` (público) e `ebooks` (privado) criados com políticas
- As 5 Edge Functions publicadas e ativas
- Verificação de segurança do Supabase: **sem alertas**

## 🔧 Depende de você (contas e chaves) — ver `PUBLICAR.md`

- Publicar o app (Vercel ou Hostinger) com as 2 variáveis de ambiente
- Cadastrar os segredos das funções (Hotmart hottok, Resend key, cron secret)
- Ligar o **webhook da Hotmart** e cadastrar os e-books (subir PDFs + seed)
- Verificar o domínio no **Resend** e agendar o cron
- Preencher e-mail/data na política de privacidade
- Revisar as fichas SOS com o Dr. Eduardo
- Definir Site URL e confirmação de e-mail em Authentication

## 🔜 Fica para a v2 (conforme o plano)

Upload de exames · encontre um veterinário · cursos/mentoria/área de membros ·
diário de saúde · consultas · comunidade · assinatura · B2B · notificação push
nativa. Todos dependem de uma base de usuários que ainda vai se formar.

## Decisões já adotadas (recomendações da seção 08 do plano)

- **App grátis; e-books só para compradores** → cadastro livre, utilitários
  liberados, biblioteca condicionada à compra.
- **SOS: 2 fichas grátis** (engasgo e hemorragia); o resto no e-book.
- **Espécie aberta** no banco; a interface mostra Cão/Gato/Outro desde já.

Se quiser mudar qualquer uma dessas, é ajuste pequeno — me avise.
