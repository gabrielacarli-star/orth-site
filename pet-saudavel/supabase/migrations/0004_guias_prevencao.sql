-- =========================================================================
-- Guias de prevenção (bônus do SOS Pet): "Alimentos que podem intoxicar seu
-- pet" e "Como transportar um pet ferido".
--
-- Reaproveitam a MESMA infra do SOS: ficam na tabela protegida sos_conteudo
-- (RLS sem policy = acesso negado por padrão) e são entregues pela Edge
-- Function "sos-conteudo", que já confere a compra antes de responder. Ou
-- seja: não precisa de tabela nova nem de função nova, só rodar este SQL.
--
-- Conteúdo real do guia "Primeiros Socorros para Cães e Gatos" do
-- Dr. Eduardo Sebastião (CRMV-MT 6412).
-- =========================================================================

insert into sos_conteudo (slug, sinais, passos, nunca_faca, levar_ao_vet) values
(
  'alimentos-perigosos',
  '[
    "Vômito (às vezes com sangue) e diarreia",
    "Salivação excessiva",
    "Letargia, fraqueza, dificuldade de ficar em pé",
    "Tremores musculares, descoordenação ao andar",
    "Perda de apetite repentina",
    "Em casos graves: convulsões, urina muito escura, ausência de urina, gengivas pálidas ou amareladas"
  ]',
  '[
    "Uva e uva-passa: causam insuficiência renal aguda, mesmo em pequena quantidade.",
    "Chocolate: quanto mais amargo ou escuro, mais tóxico (teobromina). Afeta o coração e o sistema nervoso.",
    "Cebola e alho (crus, cozidos ou em pó): destroem as hemácias e causam anemia.",
    "Xilitol: adoçante de chicletes e balas diet. Provoca queda brusca de glicose e dano ao fígado, causando letargia e vômitos.",
    "Macadâmia: causa fraqueza, tremores e febre em cães.",
    "Abacate: a persina é tóxica e, por ser muito calórico, pode predispor à pancreatite em pacientes suscetíveis.",
    "Álcool: mesmo em pequena dose afeta gravemente o sistema nervoso.",
    "Café e bebidas com cafeína: perigosos para o coração e o sistema nervoso central, podendo causar agitação, hiperatividade e inquietação.",
    "Massa de pão crua (com fermento): fermenta no estômago, causa distensão e libera álcool, levando a letargia, ataxia e desorientação.",
    "Ossos cozidos: lascam e podem causar perfuração ou obstrução intestinal, fraturas dentárias, engasgo e lesões na boca."
  ]',
  'Induzir vômito por conta própria. Em ingestão de produtos cáusticos (soda, desentupidor), derivados de petróleo ou objetos pontiagudos, o vômito causa mais dano ao subir pelo esôfago.',
  'Imediatamente ao confirmar ou suspeitar de ingestão, mesmo sem nenhum sintoma. Em intoxicação, esperar o sintoma aparecer é esperar tempo demais.'
),
(
  'transporte-seguro',
  '[]',
  '[
    "Mantenha o animal aquecido com uma manta ou toalha. O estresse e a perda de calor agravam o estado de choque.",
    "Movimente animais com suspeita de trauma como um bloco único, sem torcer a coluna ou o pescoço.",
    "Use uma maca improvisada rígida (tábua, papelão firme, bandeja, tampa de caixa) para cães maiores ou casos de trauma.",
    "Para gatos e cães pequenos feridos, uma caixa de transporte com a parte de cima removível facilita colocar e tirar sem forçar movimentos.",
    "Cuidado com mordidas: um animal com dor pode morder por reflexo, mesmo o tutor que ama.",
    "Dificuldade respiratória: deixe o animal na posição em que ele respira melhor. Não force-o a deitar.",
    "Inconsciente: deite de lado, com a cabeça levemente estendida e mais baixa, para não aspirar saliva ou vômito.",
    "Suspeita de fratura na coluna: imobilize numa maca rígida e evite qualquer flexão das costas."
  ]',
  null,
  'Ligue para o veterinário antes de sair de casa, avisando que está a caminho e o que aconteceu. A equipe ganha tempo preparando o que será necessário antes mesmo de você chegar.'
)
on conflict (slug) do update
  set sinais = excluded.sinais,
      passos = excluded.passos,
      nunca_faca = excluded.nunca_faca,
      levar_ao_vet = excluded.levar_ao_vet;
