# Pet Saudável — App (PWA)

App de cuidados com o pet da marca **Dr. Eduardo Sebastião**. Organiza vacinas,
antiparasitários, peso e emergências, e entrega os e-books comprados na Hotmart.

> **PWA** = um site que o tutor "adiciona à tela de início" e passa a usar como
> app, com ícone próprio e tela cheia. Sem App Store, sem Google Play. Todo o
> backend vive no **Supabase** (grátis). O front é estático — sobe em qualquer
> hospedagem (Hostinger, Vercel, Netlify).

## 👉 Para publicar, siga [`PUBLICAR.md`](./PUBLICAR.md)

É o guia passo a passo (criar Supabase, subir o app, ligar Hotmart e lembretes).

---

## Stack

| Camada | Ferramenta | Custo |
|---|---|---|
| Interface | React + Vite + TypeScript | €0 |
| Estilo | Tailwind CSS v4 | €0 |
| Offline / instalação | vite-plugin-pwa (service worker) | €0 |
| Login, banco, arquivos | Supabase | €0 até ~50k usuários/mês |
| Liberação de compra | Webhook Hotmart → Edge Function | €0 |
| Lembretes por e-mail | Resend | €0 até 3.000 e-mails/mês |

## Rodar localmente

```bash
cp .env.example .env    # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm install
npm run dev             # http://localhost:5173
npm run build           # gera dist/ (o que vai para produção)
```

## Estrutura

```
pet-saudavel/
├── PUBLICAR.md              ← guia de publicação (comece por aqui)
├── STATUS.md               ← o que está pronto e o que fica para a v2
├── .env.example            ← variáveis do front
├── src/
│   ├── main.tsx / App.tsx  ← entrada e rotas (com rotas protegidas)
│   ├── context/AuthContext ← sessão do usuário (Supabase Auth)
│   ├── lib/
│   │   ├── supabase.ts     ← cliente do banco
│   │   ├── types.ts        ← tipos do domínio
│   │   └── dates.ts        ← cálculo de próximas doses, idade, prazos
│   ├── components/         ← UI (design system), Layout, gráfico de peso, install
│   ├── data/sosCards.ts    ← fichas de emergência (offline)
│   └── pages/              ← Login, Home, Pets, PetForm, PetDetail, SOS,
│                              Library, Account, Privacy
├── public/                 ← ícones, favicon, manifest, .htaccess (SPA)
└── supabase/
    ├── migrations/0001_init.sql   ← banco + segurança (RLS) + gatilho
    ├── seed_produtos.sql          ← catálogo de e-books (exemplo)
    ├── cron_lembretes.sql         ← agendamento diário dos lembretes
    ├── config.toml                ← config das Edge Functions
    └── functions/
        ├── hotmart-webhook/       ← compra aprovada / reembolso
        ├── claim-purchase/        ← "já comprei e não apareceu"
        ├── ebook-url/             ← link temporário do PDF (só para quem comprou)
        ├── delete-account/        ← excluir conta e dados (LGPD)
        └── send-reminders/        ← e-mail 7 dias antes e no dia
```

## Funcionalidades da v1

Cadastro/login · perfil de vários pets (com foto) · carteira de vacinação ·
vermífugo/pulga/carrapato com cálculo automático da próxima dose · controle de
peso com gráfico · SOS de emergências (2 gratuitas, offline) · biblioteca de
e-books liberada pela compra na Hotmart · lembretes por e-mail · instalação na
tela de início · política de privacidade e exclusão de conta.

## Compliance (a trava da marca)

O app **organiza e educa — nunca diagnostica nem prescreve**. Não sugere
dosagem, produto ou conduta clínica. O intervalo do antiparasitário é
preenchido pelo tutor conforme orientação do veterinário dele. As fichas SOS
orientam "até chegar à clínica". CRMV-MT aparece como autoridade.
```
Marca Dr. Eduardo Sebastião · Estratégia: Gabriela Carli
```
