-- =========================================================================
-- Avisa a Gabriela por e-mail toda vez que um pet é cadastrado no app.
--
-- ANTES de rodar: troque SEU_CRON_SECRET pelo mesmo valor que já está
-- salvo no secret CRON_SECRET das Edge Functions, e faça o deploy da
-- função "notify-novo-pet" (mesmo processo de sempre).
-- =========================================================================

create or replace function public.notificar_novo_pet()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  email_dono text;
begin
  select email into email_dono from auth.users where id = new.user_id;

  perform net.http_post(
    url     := 'https://iqbrncszbkrmlgkmcixp.functions.supabase.co/notify-novo-pet',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', 'SEU_CRON_SECRET'
    ),
    body    := jsonb_build_object('pet_nome', new.nome, 'especie', new.especie, 'dono_email', email_dono)
  );
  return new;
end;
$$;

drop trigger if exists on_pet_created_notificar on pets;
create trigger on_pet_created_notificar
  after insert on pets
  for each row execute function public.notificar_novo_pet();

-- A função só deve rodar pelo trigger - nunca ser chamada via API REST.
revoke execute on function public.notificar_novo_pet() from public;
revoke execute on function public.notificar_novo_pet() from anon;
revoke execute on function public.notificar_novo_pet() from authenticated;
