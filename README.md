# ORTH Digital — Site Institucional

Site profissional da ORTH Digital. Next.js 16 · Tailwind CSS v4 · Framer Motion · TypeScript.

---

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
```

---

## Onde trocar os dados

| O que | Arquivo |
|---|---|
| WhatsApp, e-mail, Instagram | `lib/constants.ts` |
| Depoimentos (SUBSTITUIR pelos reais) | `components/sections/Testimonials.tsx` → array `testimonials` |
| Perguntas do FAQ | `components/sections/FAQ.tsx` → array `faqs` |
| Textos de cada seção | `components/sections/<Secao>.tsx` |
| Logo SVG | `components/Logo.tsx` |

---

## Meta Pixel (Facebook)

Abra `app/layout.tsx`, localize o bloco `META PIXEL`, descomente e substitua `SEU_PIXEL_ID_AQUI`.

## Google Tag Manager

Abra `app/layout.tsx`, localize `GOOGLE TAG MANAGER`, descomente **ambos** os trechos e substitua `GTM-XXXXXXX`.

---

## Sistema de Vendedores (`/sistema`)

Área interna onde cada vendedor(a) tem login próprio, agenda de compromissos,
consulta a tabela de preços, registra vendas (com upload de comprovante +
contrato) e acompanha a comissão calculada automaticamente. A administração
cadastra vendedores, acompanha todas as vendas, marca comissões como pagas e
edita a tabela de preços — tudo em `/sistema/admin`.

Banco de dados: Supabase (projeto `orth-vendedores`, organização **Orth**).

### Variáveis de ambiente necessárias

Configure estas 3 variáveis tanto em `.env.local` (local) quanto no painel da
Vercel (Project Settings → Environment Variables) antes do deploy:

| Variável | Onde pegar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → projeto `orth-vendedores` → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | mesma tela, chave `anon` / `publishable` |
| `SUPABASE_SERVICE_ROLE_KEY` | mesma tela, chave `service_role` — **secreta**, nunca commitar, nunca prefixar com `NEXT_PUBLIC_` |

### Primeiro acesso (bootstrap do admin)

Depois do deploy, acesse `https://SEU-DOMINIO/sistema/setup` **uma única vez**
para criar a conta de administrador(a) (nome, e-mail e senha). Essa tela para
de funcionar automaticamente assim que o primeiro admin existir. A partir daí,
o próprio admin cadastra os vendedores em `/sistema/admin/vendedores`
(informando nome, e-mail, senha, CPF/CNPJ, telefone e % de comissão).

### Estrutura do sistema

```
proxy.ts                         Protege as rotas /sistema/* (exige login)
lib/supabase/                    Clientes Supabase (browser, server, admin)
lib/dal.ts                       Verificação de sessão e papel (admin/vendedor)
lib/actions/                     Server Actions (auth, vendedores, vendas, agendamentos, preços)
app/sistema/
  login/  setup/                Login e criação do 1º admin
  admin/                        Painel, Vendedores, Vendas & Comissões, Preços
  vendedor/                     Painel, Agenda, Minhas Vendas, Tabela de Preços, Sobre a ORTH
app/api/sistema/relatorio/       Exportação de relatório em Excel (.xlsx)
```

---

## Deploy (Vercel — recomendado)

1. Push para GitHub
2. [vercel.com](https://vercel.com) → New Project → Importar repo
3. Adicione as 3 variáveis de ambiente do Supabase (seção acima) antes de fazer o deploy
4. Deploy — Next.js detectado automaticamente, HTTPS incluído
5. Acesse `/sistema/setup` para criar o primeiro login de administrador(a)

---

## Estrutura

```
app/
  globals.css        Tailwind v4: cores, fontes, animações
  layout.tsx         SEO metadata, fonts, Schema.org, Pixel/GTM placeholders
  page.tsx           Monta todas as seções

components/
  Logo.tsx           SVG logo (O = pin de localização com gradiente)
  Navbar.tsx         Navbar fixa com glassmorphism
  WhatsAppButton.tsx Botão flutuante (desktop) + sticky bar (mobile)
  sections/
    Hero.tsx         Hero com mini-browsers flutuantes
    Showcase.tsx     Marquee infinito com 6 mini-sites + BrowserFrame
    Stats.tsx        Contadores animados
    Problem.tsx      Seção de dor / problema
    Services.tsx     O que entregamos (6 cards)
    HowItWorks.tsx   Processo em 4 passos
    Testimonials.tsx Depoimentos — SUBSTITUIR pelos reais
    FAQ.tsx          Accordion de perguntas frequentes
    FinalCTA.tsx     CTA final com dois WhatsApps (BR + PT)
    Footer.tsx       Rodapé com contatos

lib/
  constants.ts       Links WhatsApp, email, Instagram, telefones
  utils.ts           cn() utility
```

---

## Cores da marca (Tailwind v4)

| Classe | Hex | Uso |
|---|---|---|
| `bg-orth-dark` | `#060F30` | Fundo escuro principal |
| `bg-orth-navy` | `#0A1C4E` | Fundo escuro secundário |
| `bg-orth-blue` | `#1B3A8A` | Cards, bordas sutis |
| `bg-orth-electric` | `#2563EB` | CTAs, links, destaque |
| `text-orth-sky` | `#7CB3FF` | Gradiente do pin, highlights |
| `bg-orth-cream` | `#F7F8FC` | Seções claras (alternadas) |
| `text-orth-muted` | `#8A97B4` | Textos secundários |
