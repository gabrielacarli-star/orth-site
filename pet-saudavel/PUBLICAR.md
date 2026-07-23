# 🚀 Publicar o Pet Saudável — passo a passo

Guia para colocar o app no ar. Segue na ordem. Cada bloco tem um ✅ no final
para você saber que terminou aquela parte. Tempo estimado: **1 a 2 horas**,
a maior parte esperando coisas carregarem.

> **O que já está pronto** (feito na preparação): todo o código do app, todas
> as telas, o banco de dados em SQL, as funções de servidor (Hotmart, e-books,
> lembretes, excluir conta), os ícones, o service worker (offline) e a política
> de privacidade base. Você **não vai programar** — vai criar contas, colar
> chaves e publicar.

---

## Pré-requisitos (tenha à mão)

- [ ] Acesso ao painel da **Hostinger** (onde mora o domínio `medveteduardosebastiao.com`)
- [ ] Uma conta **Supabase** (grátis) → https://supabase.com
- [ ] Uma conta **Resend** (grátis) para os e-mails → https://resend.com
- [ ] Acesso ao painel da **Hotmart** do Dr. Eduardo
- [ ] Os **PDFs dos e-books** no computador
- [ ] O **Node.js** instalado no computador (https://nodejs.org — versão LTS)

---

## Parte 1 — Criar o backend no Supabase (≈ 25 min)

### 1.1 Criar o projeto
1. Entre em https://supabase.com → **New project**.
2. Nome: `pet-saudavel`. Escolha uma senha de banco forte (guarde-a).
3. Região: **South America (São Paulo)** se disponível.
4. Aguarde ~2 min até o projeto ficar pronto.

### 1.2 Criar as tabelas
1. Menu lateral → **SQL Editor** → **New query**.
2. Abra o arquivo `supabase/migrations/0001_init.sql` deste projeto, copie **tudo** e cole.
3. Clique **Run**. Deve aparecer "Success".

✅ As 6 tabelas, a segurança (RLS) e o gatilho de compras estão criados.

### 1.3 Criar os buckets de arquivos
1. Menu lateral → **Storage** → **New bucket**.
2. Crie o bucket **`pet-fotos`** e marque como **Public bucket**. Create.
3. Crie o bucket **`ebooks`** e deixe **PRIVADO** (não marque público). Create.
4. Volte ao **SQL Editor** e rode o bloco de políticas do bucket `pet-fotos`
   que está **comentado no final** do arquivo `0001_init.sql` (tire os `--` das
   3 políticas `storage.objects` e clique Run).

✅ Fotos dos pets (público) e e-books (privado) prontos.

### 1.4 Guardar as chaves do projeto
Menu lateral → **Project Settings** → **API**. Anote:
- **Project URL** → algo como `https://abcdefgh.supabase.co`
- **anon public** key → chave longa que começa com `eyJ...`
- **service_role** key → **SECRETA**, nunca vai no app. Só nos segredos das funções.

✅ Chaves anotadas.

---

## Parte 2 — Colocar o app no ar (≈ 20 min)

Você pode publicar de dois jeitos. **A Vercel é a mais fácil** (recomendada) e
já vem com HTTPS; a Hostinger funciona se quiser tudo no mesmo lugar.

### Opção A — Vercel (recomendada)
1. Suba este projeto para um repositório no GitHub (a pasta `pet-saudavel`).
2. Em https://vercel.com → **Add New → Project** → importe o repositório.
3. Em **Root Directory**, aponte para `pet-saudavel`.
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` = a Project URL do passo 1.4
   - `VITE_SUPABASE_ANON_KEY` = a anon key do passo 1.4
5. **Deploy**. Em ~1 min o app está no ar num endereço `.vercel.app`.
6. Em **Settings → Domains**, adicione `app.medveteduardosebastiao.com` e siga a
   instrução de DNS (você cria um registro **CNAME** na Hostinger apontando para
   a Vercel).

### Opção B — Hostinger (arquivos estáticos)
1. No computador, dentro da pasta `pet-saudavel`:
   ```bash
   cp .env.example .env      # e preencha as duas variáveis do passo 1.4
   npm install
   npm run build             # gera a pasta dist/
   ```
2. No painel Hostinger, crie o subdomínio **`app.medveteduardosebastiao.com`**.
3. No **Gerenciador de Arquivos**, entre na pasta desse subdomínio e envie
   **todo o conteúdo de `dist/`** (inclusive o arquivo `.htaccess`).
4. Confirme que o HTTPS/SSL está ligado para o subdomínio.

✅ Abrindo `https://app.medveteduardosebastiao.com` aparece a tela de login.

> **Teste rápido:** crie uma conta de teste, cadastre um pet, registre uma
> vacina com reforço para daqui a poucos dias e veja aparecer em "Próximos
> cuidados". Instale na tela de início do celular.

---

## Parte 3 — Funções de servidor (Hotmart, e-books, lembretes) (≈ 30 min)

As funções ficam no Supabase (Edge Functions). Precisam da CLI do Supabase.

### 3.1 Instalar a CLI e conectar
```bash
npm install -g supabase
supabase login
cd pet-saudavel
supabase link --project-ref SEU_PROJETO_REF   # o "abcdefgh" da sua URL
```

### 3.2 Cadastrar os segredos das funções
```bash
supabase secrets set \
  SUPABASE_SERVICE_ROLE_KEY="a service_role do passo 1.4" \
  HOTMART_HOTTOK="voce-cria-esse-token-ver-parte-4" \
  RESEND_API_KEY="a chave do Resend (parte 5)" \
  REMINDER_FROM="Dr. Eduardo Sebastião <no-reply@medveteduardosebastiao.com>" \
  CRON_SECRET="uma-frase-secreta-qualquer-para-o-agendador"
```
> `SUPABASE_URL` e `SUPABASE_ANON_KEY` já existem automaticamente no ambiente
> das funções — não precisa cadastrar.

### 3.3 Publicar as funções
```bash
supabase functions deploy hotmart-webhook
supabase functions deploy claim-purchase
supabase functions deploy ebook-url
supabase functions deploy delete-account
supabase functions deploy send-reminders
```

✅ As 5 funções estão no ar. As URLs ficam em
`https://SEU_PROJETO_REF.functions.supabase.co/<nome-da-funcao>`.

---

## Parte 4 — Ligar a Hotmart (≈ 20 min)

1. Crie um token qualquer (uma senha aleatória) — esse é o **HOTMART_HOTTOK**.
   Use o mesmo valor que você colocou nos segredos (passo 3.2).
2. No painel da Hotmart → **Ferramentas → Webhook (Postback)** → adicionar.
3. **URL** do webhook:
   `https://SEU_PROJETO_REF.functions.supabase.co/hotmart-webhook?hottok=SEU_HOTMART_HOTTOK`
4. Marque os eventos: **Compra aprovada, Compra completa, Reembolso, Chargeback,
   Cancelamento**.
5. Salve e use o botão de **teste** da Hotmart. No Supabase, em **Table Editor →
   compras**, deve aparecer uma linha.
6. Cadastre os e-books no catálogo: suba os PDFs no bucket **`ebooks`** e rode o
   `supabase/seed_produtos.sql` (ajustando os valores) no SQL Editor. O
   `hotmart_product_id` precisa ser **igual** ao ID que a Hotmart envia.

✅ Compra na Hotmart libera o e-book sozinha; reembolso derruba o acesso.

---

## Parte 5 — Lembretes por e-mail (≈ 20 min)

1. Em https://resend.com, crie a conta e **verifique o domínio**
   `medveteduardosebastiao.com` (adiciona uns registros DNS na Hostinger).
2. Gere uma **API Key** → esse é o `RESEND_API_KEY` (passo 3.2).
3. Confirme que o remetente em `REMINDER_FROM` usa o domínio verificado.
4. Agende a rotina diária: abra `supabase/cron_lembretes.sql`, troque
   `SEU_PROJETO_REF` e `SEU_CRON_SECRET`, e rode no SQL Editor.
5. Teste na hora (sem esperar o horário):
   ```bash
   curl -X POST https://SEU_PROJETO_REF.functions.supabase.co/send-reminders \
     -H "x-cron-secret: SEU_CRON_SECRET"
   ```
   (Cadastre antes uma dose que vença hoje ou em 7 dias para ver o e-mail chegar.)

✅ Todo dia de manhã, quem tem dose próxima recebe o lembrete assinado.

---

## Parte 6 — Ajustes finais antes de divulgar

- [ ] Abrir `src/pages/Privacy.tsx` e preencher **e-mail de contato** e a **data**.
- [ ] Revisar com o Dr. Eduardo o texto das fichas SOS em `src/data/sosCards.ts`
      (as 2 gratuitas: *engasgo* e *hemorragia*).
- [ ] No Supabase → **Authentication → Providers → Email**: decidir se exige
      **confirmação de e-mail** (mais seguro) ou não (cadastro mais rápido).
- [ ] No Supabase → **Authentication → URL Configuration**: colocar o endereço
      do app em **Site URL** (ex.: `https://app.medveteduardosebastiao.com`).
- [ ] (Opcional) Em produção, trocar o `*` por seu domínio no
      `supabase/functions/_shared/cors.ts` e no `hotmart-webhook`.
- [ ] Enviar o aviso para a base atual de compradores: "o app do Dr. Eduardo
      chegou". Peça para instalarem na tela de início.

---

## Depois de publicar — como atualizar

- **Vercel:** faça o push no GitHub → deploy automático.
- **Hostinger:** rode `npm run build` e reenvie a pasta `dist/`.
- **Funções:** `supabase functions deploy <nome>` de novo.

Qualquer dúvida em qualquer passo, é só chamar que a gente resolve junto.
```
Pet Saudável · v1 · Marca Dr. Eduardo Sebastião · Estratégia: Gabriela Carli
```
