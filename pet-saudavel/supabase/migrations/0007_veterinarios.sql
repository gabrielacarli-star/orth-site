-- =========================================================================
-- Área do Veterinário: permite que um veterinário cadastrado registre
-- vacinas e antiparasitários direto no pet do tutor, sem precisar do
-- celular dele. Acesso é sempre via Edge Function com service_role
-- (nunca RLS direto no cliente), pra não abrir brecha de um veterinário
-- ler/escrever dados de outro tutor por engano.
-- =========================================================================

create table if not exists veterinarios (
  user_id uuid primary key references auth.users on delete cascade,
  nome text not null,
  crmv text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table veterinarios enable row level security;

-- Só pra decidir se mostra o link "Área do Veterinário" na tela de Conta.
-- Não dá acesso a mais nada por si só (isso é validado nas Edge Functions).
drop policy if exists "vet ve o proprio cadastro" on veterinarios;
create policy "vet ve o proprio cadastro" on veterinarios
  for select using (auth.uid() = user_id);
