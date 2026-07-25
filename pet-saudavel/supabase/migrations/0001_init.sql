-- =========================================================================
-- Pet Saudável - esquema inicial do banco (v1)
-- Cole tudo no Supabase → SQL Editor → Run. Roda de uma vez só.
-- Idempotente o suficiente para rodar novamente sem quebrar (usa IF NOT EXISTS).
-- =========================================================================

-- ---------- TABELAS ----------

create table if not exists pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  nome text not null,
  especie text,            -- cao | gato | outro
  raca text,
  nascimento date,
  alergias text,
  foto_url text,
  created_at timestamptz default now()
);

create table if not exists vacinas (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references pets on delete cascade not null,
  nome text not null,
  data_aplicacao date not null,
  proxima_dose date,
  observacao text
);

create table if not exists antiparasitarios (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references pets on delete cascade not null,
  tipo text,               -- vermifugo | pulga | carrapato
  produto text,
  data_aplicacao date not null,
  intervalo_dias int not null default 90,
  proxima_dose date
);

create table if not exists pesos (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references pets on delete cascade not null,
  data date not null,
  peso_kg numeric(5,2) not null
);

create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  hotmart_product_id text unique,
  titulo text not null,
  descricao text,
  capa_url text,
  arquivo_path text,       -- caminho no Storage privado (bucket "ebooks")
  link_compra text,
  ativo boolean default true
);

create table if not exists compras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  email_compra text not null,
  hotmart_product_id text not null,
  status text default 'ativo',   -- ativo | reembolsado
  criado_em timestamptz default now()
);

-- índices úteis
create index if not exists idx_pets_user on pets(user_id);
create index if not exists idx_vacinas_pet on vacinas(pet_id);
create index if not exists idx_antip_pet on antiparasitarios(pet_id);
create index if not exists idx_pesos_pet on pesos(pet_id);
create index if not exists idx_compras_user on compras(user_id);
create index if not exists idx_compras_email on compras(lower(email_compra));

-- ---------- ROW LEVEL SECURITY ----------
-- Cada tutor só enxerga (e altera) o que é dele.

alter table pets enable row level security;
alter table vacinas enable row level security;
alter table antiparasitarios enable row level security;
alter table pesos enable row level security;
alter table compras enable row level security;
alter table produtos enable row level security;

-- pets: dono é o user_id
drop policy if exists "dono do pet" on pets;
create policy "dono do pet" on pets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- vacinas / antiparasitarios / pesos: dono via pet
drop policy if exists "dono via pet" on vacinas;
create policy "dono via pet" on vacinas
  for all using (exists (
    select 1 from pets where pets.id = vacinas.pet_id and pets.user_id = auth.uid()))
  with check (exists (
    select 1 from pets where pets.id = vacinas.pet_id and pets.user_id = auth.uid()));

drop policy if exists "dono via pet" on antiparasitarios;
create policy "dono via pet" on antiparasitarios
  for all using (exists (
    select 1 from pets where pets.id = antiparasitarios.pet_id and pets.user_id = auth.uid()))
  with check (exists (
    select 1 from pets where pets.id = antiparasitarios.pet_id and pets.user_id = auth.uid()));

drop policy if exists "dono via pet" on pesos;
create policy "dono via pet" on pesos
  for all using (exists (
    select 1 from pets where pets.id = pesos.pet_id and pets.user_id = auth.uid()))
  with check (exists (
    select 1 from pets where pets.id = pesos.pet_id and pets.user_id = auth.uid()));

-- compras: o tutor só lê as próprias. Inserção/atualização é feita pelas
-- Edge Functions com a service_role (que ignora RLS), nunca pelo cliente.
drop policy if exists "minhas compras" on compras;
create policy "minhas compras" on compras
  for select using (auth.uid() = user_id);

-- produtos: catálogo público - qualquer usuário logado vê a lista.
drop policy if exists "catalogo publico" on produtos;
create policy "catalogo publico" on produtos
  for select using (ativo = true);

-- ---------- TRIGGER: liga compras antigas a novos cadastros ----------
-- Quando alguém cria conta com um e-mail que já tem compra registrada
-- (webhook chegou antes do cadastro), o acesso é vinculado automaticamente.

create or replace function public.link_compras_ao_novo_usuario()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update compras
     set user_id = new.id
   where user_id is null
     and lower(email_compra) = lower(new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_link_compras on auth.users;
create trigger on_auth_user_created_link_compras
  after insert on auth.users
  for each row execute function public.link_compras_ao_novo_usuario();

-- A função só deve rodar pelo trigger - nunca ser chamada via API REST.
revoke execute on function public.link_compras_ao_novo_usuario() from public;
revoke execute on function public.link_compras_ao_novo_usuario() from anon;
revoke execute on function public.link_compras_ao_novo_usuario() from authenticated;

-- =========================================================================
-- STORAGE - buckets e políticas.
-- Buckets:
--   • "pet-fotos"  → PÚBLICO   (fotos dos pets)
--   • "ebooks"     → PRIVADO   (PDFs; acesso só via link temporário assinado)
-- =========================================================================

-- Cria os buckets (idempotente).
insert into storage.buckets (id, name, public)
values ('pet-fotos', 'pet-fotos', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('ebooks', 'ebooks', false)
on conflict (id) do update set public = false;

-- Bucket público pet-fotos: os arquivos são servidos pela URL pública, então
-- NÃO se cria política de SELECT (isso só habilitaria listar todos os arquivos).
-- Cada tutor só escreve/edita/apaga na própria pasta ({user_id}/arquivo).
drop policy if exists "fotos dono escreve" on storage.objects;
create policy "fotos dono escreve" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'pet-fotos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "fotos dono atualiza" on storage.objects;
create policy "fotos dono atualiza" on storage.objects
  for update to authenticated
  using (bucket_id = 'pet-fotos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "fotos dono apaga" on storage.objects;
create policy "fotos dono apaga" on storage.objects
  for delete to authenticated
  using (bucket_id = 'pet-fotos' and (storage.foldername(name))[1] = auth.uid()::text);

-- O bucket "ebooks" NÃO recebe política pública: os arquivos só são
-- acessíveis via Edge Function "ebook-url", que confere a compra e gera
-- um link assinado de curta duração usando a service_role.
