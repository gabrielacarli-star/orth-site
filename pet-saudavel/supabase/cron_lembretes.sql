-- =========================================================================
-- Agendamento da rotina diária de lembretes (pg_cron + pg_net).
-- Rode UMA vez, depois de fazer o deploy da função "send-reminders".
--
-- Antes de rodar, substitua:
--   • SEU_PROJETO_REF   → o ref do projeto (ex.: abcdefgh) na URL do Supabase
--   • SEU_CRON_SECRET   → o mesmo valor que você colocou no segredo CRON_SECRET
-- =========================================================================

-- 1) Habilita as extensões (no Supabase já vêm disponíveis).
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2) Agenda para todo dia às 12:00 UTC (~09:00 no horário de Brasília).
--    Ajuste o horário no primeiro campo do cron se quiser.
select cron.schedule(
  'lembretes-pet-saudavel',
  '0 12 * * *',
  $$
  select net.http_post(
    url     := 'https://SEU_PROJETO_REF.functions.supabase.co/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', 'SEU_CRON_SECRET'
    ),
    body    := '{}'::jsonb
  );
  $$
);

-- Para conferir os agendamentos:   select * from cron.job;
-- Para remover:                     select cron.unschedule('lembretes-pet-saudavel');
