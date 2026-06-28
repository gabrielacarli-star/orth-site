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

## Deploy (Vercel — recomendado)

1. Push para GitHub
2. [vercel.com](https://vercel.com) → New Project → Importar repo
3. Deploy — Next.js detectado automaticamente, HTTPS incluído

---

## video-use (ferramenta externa, fora deste repo)

[`video-use`](https://github.com/browser-use/video-use) é um agente de automação de navegador (browser-use) usado para gerar vídeo a partir de ações no navegador. Não é uma dependência deste site — instale na sua máquina local, fora deste projeto:

```bash
pip install video-use
```

Depois siga as instruções de configuração e uso no próprio repositório do projeto. Sessões remotas/efêmeras (como esta) não persistem instalações globais entre execuções — a instalação deve ser feita no ambiente onde você de fato vai usar a ferramenta.

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
