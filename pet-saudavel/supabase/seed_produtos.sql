-- =========================================================================
-- Exemplo de cadastro de e-books no catálogo.
-- Rode no SQL Editor DEPOIS de subir os PDFs no bucket privado "ebooks".
--
-- • hotmart_product_id → o ID do produto na Hotmart (o mesmo que chega no webhook)
-- • arquivo_path        → caminho do PDF dentro do bucket "ebooks"
-- • capa_url            → imagem da capa (pode ficar no bucket público pet-fotos
--                         ou em qualquer URL de imagem)
-- • link_compra         → link de checkout da Hotmart (para quem ainda não comprou)
-- =========================================================================

insert into produtos (hotmart_product_id, titulo, descricao, capa_url, arquivo_path, link_compra, ativo)
values
  (
    'SUBSTITUA_ID_HOTMART',
    'Guia de Emergências do Pet',
    'O passo a passo completo para agir nas principais emergências até chegar ao veterinário.',
    'https://SUBSTITUA-URL-DA-CAPA.jpg',
    'guia-emergencias.pdf',
    'https://pay.hotmart.com/SUBSTITUA-LINK-CHECKOUT',
    true
  )
on conflict (hotmart_product_id) do update
  set titulo = excluded.titulo,
      descricao = excluded.descricao,
      capa_url = excluded.capa_url,
      arquivo_path = excluded.arquivo_path,
      link_compra = excluded.link_compra,
      ativo = excluded.ativo;
