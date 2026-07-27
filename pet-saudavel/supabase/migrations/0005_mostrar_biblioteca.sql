-- =========================================================================
-- Adiciona uma flag para produtos que devem destravar acesso (ex.: SOS)
-- mas NÃO devem aparecer como item na Biblioteca. Caso de uso: produto
-- antigo já descontinuado (ex.: "Primeiros Socorros Pet"), onde o
-- comprador já recebeu o PDF direto pela Hotmart e só ganha o acesso ao
-- app como bônus extra, sem duplicar o e-book dentro do app.
--
-- Todos os produtos existentes continuam aparecendo normalmente
-- (default true), então nada muda pro que já está no ar.
-- =========================================================================

alter table produtos
  add column if not exists mostrar_biblioteca boolean not null default true;
