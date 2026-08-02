-- =========================================================================
-- Avisa a Gabriela por e-mail toda vez que alguém cria conta no app.
--
-- ANTES de rodar: troque SEU_CRON_SECRET pelo mesmo valor que já está
-- salvo no secret CRON_SECRET das Edge Functions, e faça o deploy da
-- função "notify-cadastro" (mesmo processo de sempre).
-- =========================================================================

create or replace function public.notificar_novo_cadastro()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url     := 'https://iqbrncszbkrmlgkmcixp.functions.supabase.co/notify-cadastro',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', 'SEU_CRON_SECRET'
    ),
    body    := jsonb_build_object('email', new.email, 'criado_em', new.created_at)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_notificar on auth.users;
create trigger on_auth_user_created_notificar
  after insert on auth.users
  for each row execute function public.notificar_novo_cadastro();

-- A função só deve rodar pelo trigger - nunca ser chamada via API REST.
revoke execute on function public.notificar_novo_cadastro() from public;
revoke execute on function public.notificar_novo_cadastro() from anon;
revoke execute on function public.notificar_novo_cadastro() from authenticated;
