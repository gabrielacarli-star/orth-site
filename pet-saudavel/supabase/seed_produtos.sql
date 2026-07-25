-- =========================================================================
-- Cadastro do produto "SOS Pet" no catálogo.
--
-- ANTES de rodar, faça os 2 uploads no Supabase → Storage:
--   1. bucket "ebooks" (privado)   → suba materiais-hotmart/bonus-sos-pet.pdf
--   2. bucket "pet-fotos" (público) → suba materiais-hotmart/capa-sos-pet.png
--      copie a "public URL" gerada e cole no lugar de SUBSTITUA-URL-DA-CAPA
--      abaixo.
--
-- Também troque SUBSTITUA-LINK-CHECKOUT pelo link de vendas do produto na
-- Hotmart (Produtos → SOS Pet → Página de vendas → copiar link).
-- =========================================================================

insert into produtos (hotmart_product_id, titulo, descricao, capa_url, arquivo_path, link_compra, ativo, desbloqueia_sos)
values
  (
    '8190678',
    'SOS Pet',
    'O guia completo de primeiros socorros para cães e gatos: as 8 emergências mais comuns, passo a passo. Com 3 bônus: carteira de vacinação, guia de transporte seguro e alimentos que podem intoxicar seu pet.',
    'https://SUBSTITUA-URL-DA-CAPA.png',
    'bonus-sos-pet.pdf',
    'https://pay.hotmart.com/SUBSTITUA-LINK-CHECKOUT',
    true,
    true
  )
on conflict (hotmart_product_id) do update
  set titulo = excluded.titulo,
      descricao = excluded.descricao,
      capa_url = excluded.capa_url,
      arquivo_path = excluded.arquivo_path,
      link_compra = excluded.link_compra,
      ativo = excluded.ativo,
      desbloqueia_sos = excluded.desbloqueia_sos;

-- Outros produtos que NÃO devem liberar o SOS: deixe desbloqueia_sos = false
-- (ou simplesmente omita a coluna, o padrão já é false).
