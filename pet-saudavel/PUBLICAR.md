# 🚀 Publicar o Pet Saudável - passo a passo

Guia para colocar o app no ar. O **backend já está construído e rodando** - o
que sobra são passos que dependem das suas contas (hospedagem, Hotmart, Resend).
Tempo estimado do que falta: **~1 hora**.

---

## ✅ O que JÁ ESTÁ PRONTO (feito na preparação)

- Todo o código do app (front) - testado rodando de ponta a ponta.
- **Projeto Supabase criado e configurado**: `pet-saudavel`, região São Paulo.
  - Banco com as 6 tabelas + segurança (RLS) + gatilho de compras.
  - Buckets de arquivos: `pet-fotos` (público) e `ebooks` (privado).
  - As 5 Edge Functions no ar: `hotmart-webhook`, `claim-purchase`,
    `ebook-url`, `delete-account`, `send-reminders`.
  - Verificação de segurança passou sem nenhum alerta.

### ⚠️ Passo obrigatório antes de tudo: 2 pendências manuais

Duas peças ficaram prontas no código mas não consegui aplicar automaticamente
(a aprovação travou nesta sessão). Sem isso, o **Cartão de Emergência** e o
**SOS** não funcionam. Leva uns 3 minutos:

1. **SQL pendente**: abra o Supabase → **SQL Editor** → cole o conteúdo do
   arquivo `migracoes-pendentes.sql` que te enviei (ou de
   `supabase/migrations/0002_cartao_emergencia.sql` +
   `0003_travar_sos.sql`) → **Run**.
2. **Função `sos-conteudo`**: Supabase → **Edge Functions** → **Deploy a new
   function** → nome `sos-conteudo` → cole o código do arquivo
   `sos-conteudo-index.ts` que te enviei (ou de
   `supabase/functions/sos-conteudo/index.ts`) → ligue **Verify JWT** →
   **Deploy**.

### Credenciais do seu projeto (para configurar o app)

- **VITE_SUPABASE_URL** = `https://iqbrncszbkrmlgkmcixp.supabase.co`
- **VITE_SUPABASE_ANON_KEY** = a chave **anon/publishable** - pegue em
  Supabase → **Project Settings → API** (ou use o valor que te passei no chat).
  Essa chave é pública (vai no app mesmo), o RLS é quem protege os dados.

---

## Pré-requisitos (tenha à mão)

- [ ] Acesso ao painel da **Hostinger** (domínio `medveteduardosebastiao.com`)
- [ ] Uma conta **Vercel** (grátis) - ou usar a Hostinger para hospedar
- [ ] Uma conta **Resend** (grátis) para os e-mails → https://resend.com
- [ ] Acesso ao painel da **conta Hotmart que vende o produto** (a conta onde
      o e-book está cadastrado para venda, seja ela sua ou do Dr. Eduardo).
      O webhook precisa ser configurado nessa conta especificamente.
- [ ] Os **PDFs dos e-books** no computador
- [ ] **Node.js** instalado (só se for publicar pela Hostinger) - https://nodejs.org

---

## Parte 1 - Colocar o app no ar (≈ 20 min)

### Opção A - Vercel (recomendada, já vem com HTTPS)
1. Suba a pasta `pet-saudavel` para um repositório no GitHub.
2. https://vercel.com → **Add New → Project** → importe o repositório.
3. **Root Directory** = `pet-saudavel`.
4. **Environment Variables** - adicione as duas:
   - `VITE_SUPABASE_URL` = `https://iqbrncszbkrmlgkmcixp.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = a chave anon (Project Settings → API)
5. **Deploy**. Em ~1 min está no ar.
6. **Settings → Domains** → adicione `app.medveteduardosebastiao.com` e crie o
   **CNAME** indicado na Hostinger.

### Opção B - Hostinger (arquivos estáticos)
```bash
cd pet-saudavel
cp .env.example .env      # preencha as 2 variáveis acima
npm install
npm run build             # gera dist/
```
Depois crie o subdomínio `app.medveteduardosebastiao.com`, envie **todo o
conteúdo de `dist/`** (inclusive o `.htaccess`) e ligue o SSL.

✅ Abrindo o endereço, aparece a tela de login. Crie uma conta de teste,
cadastre um pet e uma vacina com reforço próximo - deve aparecer em "Próximos
cuidados". Instale na tela de início do celular.

---

## Parte 2 - Segredos das funções (≈ 10 min)

As funções já estão no ar, mas algumas precisam de segredos para funcionar.
Vá em Supabase → **Edge Functions → Secrets** (ou **Project Settings →
Functions**) e adicione:

| Segredo | Para quê | De onde vem |
|---|---|---|
| `HOTMART_HOTTOK` | validar o webhook da Hotmart | um token que **você inventa** (uma senha aleatória) |
| `RESEND_API_KEY` | enviar os lembretes | painel do Resend (Parte 4) |
| `REMINDER_FROM` | remetente do e-mail | ex.: `Dr. Eduardo Sebastião <no-reply@medveteduardosebastiao.com>` |
| `CRON_SECRET` | proteger a rotina de lembretes | outra senha aleatória que você inventa |

> `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` já existem
> automaticamente no ambiente das funções - **não precisa** cadastrar.

> Se preferir pela linha de comando: `supabase login`, depois
> `supabase link --project-ref iqbrncszbkrmlgkmcixp`, depois
> `supabase secrets set HOTMART_HOTTOK="..." RESEND_API_KEY="..." ...`

---

## Parte 3 - Ligar a Hotmart (≈ 20 min)

1. Use o mesmo token do `HOTMART_HOTTOK` (Parte 2).
2. Hotmart → **Ferramentas → Webhook (Postback)** → adicionar.
3. **URL** do webhook:
   `https://iqbrncszbkrmlgkmcixp.functions.supabase.co/hotmart-webhook?hottok=SEU_HOTMART_HOTTOK`
4. Marque os eventos: **Compra aprovada, Compra completa, Reembolso,
   Chargeback, Cancelamento**.
5. Use o botão de **teste** da Hotmart. No Supabase → **Table Editor → compras**
   deve aparecer uma linha.
6. Cadastre os e-books: suba os PDFs no bucket **`ebooks`** (Storage) e rode o
   `supabase/seed_produtos.sql` no **SQL Editor**, ajustando os valores. O
   `hotmart_product_id` precisa ser **igual** ao ID que a Hotmart envia.
7. No produto que corresponde ao guia de primeiros socorros, deixe
   `desbloqueia_sos = true` (já vem assim no `seed_produtos.sql` de exemplo).
   É esse campo que libera o passo a passo completo do SOS no app para quem
   comprar. Em qualquer outro produto, deixe `false`.

✅ Compra libera o e-book (e o SOS completo, se marcado) sozinha; reembolso
derruba o acesso.

---

## Parte 4 - Lembretes por e-mail (≈ 15 min)

1. Em https://resend.com, crie a conta e **verifique o domínio**
   `medveteduardosebastiao.com` (adiciona registros DNS na Hostinger).
2. Gere uma **API Key** → coloque em `RESEND_API_KEY` (Parte 2).
3. Confirme que `REMINDER_FROM` usa o domínio verificado.
4. Agende a rotina diária: abra `supabase/cron_lembretes.sql`, troque
   `SEU_PROJETO_REF` por **`iqbrncszbkrmlgkmcixp`** e `SEU_CRON_SECRET` pelo
   valor que você definiu, e rode no **SQL Editor**.
5. Teste na hora (cadastre antes uma dose que vença hoje ou em 7 dias):
   ```bash
   curl -X POST https://iqbrncszbkrmlgkmcixp.functions.supabase.co/send-reminders \
     -H "x-cron-secret: SEU_CRON_SECRET"
   ```

✅ Todo dia de manhã, quem tem dose próxima recebe o lembrete assinado.

---

## Parte 5 - Ajustes finais antes de divulgar

- [ ] `src/pages/Privacy.tsx`: preencher **e-mail de contato** e a **data**.
- [ ] Revisar com o Dr. Eduardo as 2 fichas SOS grátis em `src/data/sosCards.ts`.
- [ ] Supabase → **Authentication → Providers → Email**: decidir se exige
      **confirmação de e-mail** (mais seguro) ou não (cadastro mais rápido).
- [ ] Supabase → **Authentication → URL Configuration**: colocar o endereço do
      app em **Site URL** (`https://app.medveteduardosebastiao.com`).
- [ ] (Opcional) trocar o `*` por seu domínio no CORS das funções, se quiser
      restringir quem chama.
- [ ] Avisar a base atual de compradores que o app chegou.

---

## Como atualizar depois

- **Vercel:** push no GitHub → deploy automático.
- **Hostinger:** `npm run build` e reenviar `dist/`.
- **Funções/banco:** dá para redeployar pela CLI do Supabase, ou me chamar.
```
Pet Saudável · v1 · Marca Dr. Eduardo Sebastião · Estratégia: Gabriela Carli
```
