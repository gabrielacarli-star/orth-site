-- =========================================================================
-- Cadastro dos 2 order bumps + 1 upsell do funil do SOS Pet.
--
-- ANTES de rodar, faça os uploads no Supabase → Storage:
--   • bucket "ebooks" (privado)   → suba os 3 PDFs (nomes abaixo)
--   • bucket "pet-fotos" (público) → suba as 3 capas (nomes abaixo)
--     copie a "public URL" de cada uma e cole no lugar de cada
--     SUBSTITUA-URL-DA-CAPA-* correspondente.
--
-- Nenhum destes 3 produtos libera o SOS (desbloqueia_sos = false): só o
-- produto principal "SOS Pet" faz isso.
--
-- Sem link de checkout próprio por enquanto (bumps/upsell normalmente não
-- têm página de vendas separada). Se tiver, é só trocar o NULL pelo link.
-- =========================================================================

insert into produtos (hotmart_product_id, titulo, descricao, capa_url, arquivo_path, link_compra, ativo, desbloqueia_sos)
values
  (
    '8100878',
    'Kit Farmácia Pet em Casa',
    'O que ter ANTES da emergência: lista de compras de farmácia humana segura para pets, quantidades por porte, o que nunca dar ao seu pet e como montar e organizar a caixa de primeiros socorros.',
    'https://iqbrncszbkrmlgkmcixp.supabase.co/storage/v1/object/public/pet-fotos/capakitfarmacia.png',
    'kit-farmacia-pet-em-casa.pdf',
    null,
    true,
    false
  ),
  (
    '8100897',
    'Sinais Silenciosos',
    'Os 10 avisos que o seu pet dá antes de uma emergência. Aprenda a enxergar o que o veterinário enxerga, horas ou dias antes de um quadro grave, com a escala de urgência de cada sinal.',
    'https://iqbrncszbkrmlgkmcixp.supabase.co/storage/v1/object/public/pet-fotos/capasinaissilenciosos.png',
    'sinais-silenciosos.pdf',
    null,
    true,
    false
  ),
  (
    '8035651',
    'Plano de Ação 10 Dias',
    'Acompanhamento exclusivo no WhatsApp com o Dr. Eduardo: 10 dias de orientação prática, dia após dia, até você ter o plano de emergência do seu pet completo e testado.',
    'https://iqbrncszbkrmlgkmcixp.supabase.co/storage/v1/object/public/pet-fotos/capaplano10dias.png',
    'plano-10-dias-como-funciona.pdf',
    null,
    true,
    false
  )
on conflict (hotmart_product_id) do update
  set titulo = excluded.titulo,
      descricao = excluded.descricao,
      capa_url = excluded.capa_url,
      arquivo_path = excluded.arquivo_path,
      ativo = excluded.ativo,
      desbloqueia_sos = excluded.desbloqueia_sos;
