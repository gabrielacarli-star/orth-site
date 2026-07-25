-- =========================================================================
-- Pet Saudável - Cartão de Emergência do Pet
-- -------------------------------------------------------------------------
-- Campos extras para o cartão de emergência (baseado no material impresso
-- do Dr. Eduardo). Nome, espécie, raça, idade e alergias já existem na
-- tabela pets; aqui só entram os campos que faltam.
-- Idempotente: pode rodar de novo sem quebrar.
-- =========================================================================

alter table pets
  add column if not exists condicoes_saude text,
  add column if not exists medicacao_continua text,
  add column if not exists vet_nome text,
  add column if not exists vet_telefone text,
  add column if not exists emergencia_24h_telefone text,
  add column if not exists emergencia_24h_endereco text;
