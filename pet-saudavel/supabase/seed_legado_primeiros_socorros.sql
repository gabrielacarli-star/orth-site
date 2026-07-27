-- =========================================================================
-- Libera o SOS completo para quem já comprou o produto antigo "Primeiros
-- Socorros Pet" (código 8028977, R$37) antes do app existir. Essas pessoas
-- já receberam o PDF pela própria Hotmart — aqui só ganham o acesso ao
-- app como bônus, sem aparecer nenhum item novo na Biblioteca (por isso
-- mostrar_biblioteca = false).
--
-- Rode APÓS a migração 0005_mostrar_biblioteca.sql.
-- Idempotente: pode rodar mais de uma vez sem duplicar nada.
-- =========================================================================

-- 1) Registra o produto (sem aparecer na Biblioteca, só destrava o SOS).
insert into produtos (hotmart_product_id, titulo, descricao, ativo, desbloqueia_sos, mostrar_biblioteca)
values (
  '8028977',
  'Primeiros Socorros Pet (legado)',
  'Produto antigo, vendido antes do app existir. Só destrava o SOS, sem item na Biblioteca.',
  true,
  true,
  false
)
on conflict (hotmart_product_id) do update
  set desbloqueia_sos = excluded.desbloqueia_sos,
      ativo = excluded.ativo,
      mostrar_biblioteca = excluded.mostrar_biblioteca;

-- 2) Libera o acesso para os 23 compradores confirmados (status Completo
--    ou Aprovado no relatório da Hotmart). Quando cada um criar conta no
--    app com o mesmo e-mail, o gatilho existente vincula automaticamente.
insert into compras (email_compra, hotmart_product_id, status)
select v.email, '8028977', 'ativo'
from (values
  ('mennetmarlene@gmail.com'),
  ('anastaciacrespo@gmail.com'),
  ('licalopes18@outlook.com'),
  ('luciafeijo@gmail.com'),
  ('reginafreire135@gmail.com'),
  ('dra.selma@gmail.com'),
  ('duda.cris68@hotmail.com'),
  ('nelsonlourenco58@terra.com.br'),
  ('rosamariabrand@hotmail.com'),
  ('pchagas2018@icloud.com'),
  ('milene_maia@hotmail.com'),
  ('moura.isabella@gmail.com'),
  ('marabarretos@gmail.com'),
  ('marise.tikle.vieira@gmail.com'),
  ('luciananvet@gmail.com'),
  ('adtorretta@gmail.com'),
  ('ivillard@gmail.com'),
  ('milton-goulart@uol.com.br'),
  ('gpnogueira@ymail.com'),
  ('suely.almeida@gmail.com'),
  ('nicifran_monteiro@yahoo.com.br'),
  ('beatrizdbvianna@gmail.com'),
  ('albertina.nascimento@saaesaolourenco.mg.gov.br')
) as v(email)
where not exists (
  select 1 from compras c
  where lower(c.email_compra) = v.email and c.hotmart_product_id = '8028977'
);
