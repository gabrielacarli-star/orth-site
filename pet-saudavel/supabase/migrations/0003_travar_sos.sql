-- =========================================================================
-- Pet Saudável - travar o conteúdo completo do SOS atrás da compra
-- -------------------------------------------------------------------------
-- Antes, as fichas de Engasgo e Hemorragia eram uma amostra grátis e o
-- texto vinha dentro do pacote do app (visível no código do navegador).
-- Agora TODO o passo a passo do SOS mora aqui no banco, protegido por RLS
-- (sem nenhuma política = acesso negado por padrão) e só é entregue pela
-- Edge Function "sos-conteudo", que confere a compra antes de responder.
-- O app nunca mais carrega o texto sensível no pacote público.
-- =========================================================================

-- Marca qual produto do catálogo libera o conteúdo completo do SOS.
alter table produtos add column if not exists desbloqueia_sos boolean not null default false;

-- Conteúdo protegido de cada emergência.
create table if not exists sos_conteudo (
  slug text primary key,
  sinais jsonb not null default '[]'::jsonb,
  passos jsonb not null default '[]'::jsonb,
  nunca_faca text,
  levar_ao_vet text
);

alter table sos_conteudo enable row level security;
-- Nenhuma política criada de propósito: nem anon nem authenticated
-- conseguem ler direto. Só a service_role (usada pela Edge Function,
-- depois de validar a compra) tem acesso.

insert into sos_conteudo (slug, sinais, passos, nunca_faca, levar_ao_vet) values
(
  'engasgo',
  '["Tosse forte e repentina, ou esforço de tossir sem conseguir emitir som","Boca aberta, pescoço esticado para frente, esforço visível para respirar","Som agudo e ofegante ao tentar puxar o ar (estridor)","Patas levadas à boca, animal esfregando o focinho no chão","Gengivas e língua mudando de rosa para azulado ou arroxeado (cianose): sinal grave","Pânico, agitação intensa e, em casos extremos, colapso"]',
  '["Mantenha a calma e contenha o animal com firmeza, mas sem agredir: o pânico dele pode fazê-lo morder por reflexo ou por dor.","Abra a boca com cuidado e olhe o fundo da garganta. Se enxergar o objeto e ele estiver acessível, remova com os dedos ou uma pinça, sempre puxando para fora, nunca empurrando. Se houver qualquer perfuração visível ou sangramento, não tente remover: isso pode piorar o caso. Nesse caso, a remoção deve ser feita por um médico veterinário, com o paciente anestesiado.","Cães pequenos e gatos: segure o animal de cabeça para baixo (suspenso pelas patas traseiras ou pela cintura) e dê 4 a 5 tapas firmes com a palma da mão, entre as escápulas.","Cães médios e grandes (manobra de Heimlich pet): fique atrás do animal, passe os braços ao redor do abdômen, logo atrás das costelas, feche uma das mãos e aplique 4 a 5 compressões rápidas e firmes, para dentro e para cima.","Reavalie a boca após cada série de manobras para ver se o objeto se soltou.","Se o animal perder a consciência, cheque a boca novamente e inicie o transporte imediato, mantendo as manobras no caminho."]',
  'Introduzir os dedos às cegas repetidamente na garganta. Isso costuma empurrar o objeto mais fundo e transformar uma obstrução parcial em total.',
  'Sempre, mesmo que o objeto saia e o pet pareça recuperado. Pode haver lesão na garganta ou no esôfago invisível a olho nu.'
),
(
  'hemorragia',
  '["Sangue visível, contínuo ou em jatos, saindo de um ferimento","Gengivas pálidas ou esbranquiçadas (perda significativa de sangue)","Respiração acelerada, fraqueza, animal apático ou frio","Sangramento que não cessa após alguns minutos de pressão"]',
  '["Aplique uma gaze ou pano limpo diretamente sobre o ferimento, com pressão firme e constante. Não levante para conferir se parou: isso reinicia o sangramento.","Se o pano encharcar, coloque outro por cima, sem remover o primeiro.","Eleve a região ferida acima do nível do coração, se possível e sem forçar movimentos.","Mantenha o animal o mais imóvel possível durante o transporte: agitação eleva a pressão e aumenta o sangramento."]',
  'Limpar o ferimento com álcool, água oxigenada ou produtos caseiros antes de estancar. Isso atrapalha a coagulação, causa dor e pode danificar o tecido.',
  'Qualquer sangramento que não estanca em 5 a 10 minutos de pressão direta, ferimentos profundos ou extensos, e qualquer sinal de gengiva pálida e fraqueza.'
),
(
  'intoxicacao',
  '["Vômito (às vezes com sangue) e diarreia","Salivação excessiva","Letargia, fraqueza, dificuldade de ficar em pé","Tremores musculares, descoordenação ao andar","Perda de apetite repentina","Em casos graves: convulsões, urina muito escura, ausência de urina, gengivas pálidas ou amareladas"]',
  '["Identifique e retire do alcance o que foi ingerido. Guarde a embalagem, o rótulo ou uma amostra: isso direciona o tratamento.","Anote a quantidade aproximada e o horário da ingestão.","Ligue imediatamente para o veterinário ou centro de intoxicação, mesmo sem sintomas. Informe espécie, peso, o que foi ingerido e quando.","Siga rigorosamente a orientação recebida. A indução de vômito só deve ser feita sob orientação veterinária e dentro de uma janela de tempo específica. Não faça isso sozinho.","Leve o paciente ao atendimento levando junto a embalagem da substância."]',
  'Nunca induza vômito por conta própria. Em ingestão de produtos cáusticos, derivados de petróleo ou objetos pontiagudos, o vômito causa mais dano ao subir pelo esôfago.',
  'Imediatamente ao confirmar ou suspeitar de ingestão, mesmo sem sintoma algum. Em intoxicação, esperar o sintoma aparecer é esperar tempo demais.'
),
(
  'convulsao',
  '["Perda de consciência com movimentos rígidos e involuntários das patas (remada)","Salivação intensa, mastigação no vazio","Perda de controle da bexiga ou do intestino","Olhar fixo e vidrado antes ou durante a crise","Desorientação, cegueira temporária ou agitação após a crise (fase pós-ictal)"]',
  '["Não tente conter o animal. Afaste objetos e móveis ao redor que possam machucá-lo (cantos, escadas, água).","Cronometre a duração exata pelo celular: essa é a informação mais importante para o veterinário.","Reduza estímulos: apague a luz forte, faça silêncio, afaste outros animais e pessoas agitadas.","Grave um vídeo da crise, se conseguir: ajuda enormemente no diagnóstico."]',
  'Não coloque a mão ou objetos na boca do animal durante a crise. Ao contrário do mito, ele não vai engolir a língua, e você corre risco real de uma mordida grave e involuntária.',
  'Imediatamente, desde a primeira convulsão da vida do animal. Não espere o paciente ter uma segunda crise.'
),
(
  'afogamento',
  '["Animal encontrado submerso ou boiando sem reagir","Tosse intensa, respiração ruidosa e ofegante ao sair da água","Letargia ou inconsciência","Espuma na boca ou nas narinas","Gengivas azuladas"]',
  '["Retire o animal da água rapidamente. Posicione a cabeça mais baixa que o corpo, inclinada para um lado, para drenar a água das vias aéreas.","Cheque e remova qualquer obstrução visível da boca.","Se não estiver respirando, inicie respiração artificial: feche a boca do animal e sopre firme pelo focinho, observando o peito subir, a cada 4 a 5 segundos.","Sem batimento perceptível, inicie a reanimação cardiopulmonar: 30 compressões torácicas para 2 ventilações.","Mesmo recuperado e aparentemente bem, leve ao atendimento e monitore as próximas 24 a 48 horas."]',
  'Não perca tempo com manobras agressivas para esvaziar a barriga. O foco é via aérea livre e respiração, não o estômago. De preferência, faça a manobra dentro do carro, a caminho do veterinário.',
  'Sempre, mesmo após recuperação completa aparente. A observação das próximas 48 horas é parte do tratamento.'
),
(
  'picada',
  '["Inchaço repentino, sobretudo na face, focinho ou patas","Vermelhidão e dor no ponto da picada","Salivação, vômito","Coceira intensa, urticária (caroços na pele)","Picada de cobra: dois pontos de perfuração, inchaço progressivo e intenso, sangramento no local, fraqueza","Sinal de alerta máximo: dificuldade respiratória, inchaço de focinho ou garganta (anafilaxia)"]',
  '["Identifique, com segurança, o agente (inseto ou cobra). Fotografe de longe, sem se arriscar.","Mantenha o animal o mais imóvel possível: o movimento espalha o veneno mais rápido pela circulação.","Se a picada for em uma pata, mantenha o membro abaixo do nível do coração.","Em picada de abelha visível, remova o ferrão raspando com a borda de um cartão rígido.","Leve ao veterinário imediatamente, principalmente em qualquer suspeita de cobra ou sinal de reação alérgica."]',
  'Nunca corte, chupe, aplique torniquete ou gelo direto sobre picada de cobra. Essas práticas antigas concentram o veneno e podem custar o membro ou a vida do animal.',
  'Imediatamente em qualquer suspeita de cobra, e em picada de inseto com inchaço facial de evolução rápida ou qualquer dificuldade para respirar.'
),
(
  'queimaduras',
  '["Vermelhidão, bolhas ou pele esbranquiçada na região","Perda de pelo na área afetada","Lambedura insistente do local","Dor intensa ao toque (ou, paradoxalmente, ausência de dor em queimaduras profundas)","Cheiro de pelo queimado"]',
  '["Resfrie a área imediatamente com água corrente fria, não gelada, por 10 a 15 minutos, para parar o dano térmico nos tecidos.","Não arranque pelos ou tecido grudado na queimadura.","Cubra com gaze limpa e seca, sem apertar.","Em queimadura química, lave abundantemente com água corrente por 15 a 20 minutos, removendo o produto da pele e do pelo.","Impeça que o animal lamba a área: use cone ou cubra o local com uma gaze limpa durante o transporte."]',
  'Nunca aplique manteiga, pasta de dente, gelo direto, pomada humana ou qualquer receita caseira. Essas substâncias retêm calor, contaminam a lesão e dificultam o tratamento.',
  'Sempre que a queimadura for maior que poucos centímetros, tiver bolhas ou pele esbranquiçada, atingir rosto, patas ou genitais, ou for de origem química ou elétrica.'
),
(
  'fraturas',
  '["Recusa em apoiar a pata ou andar (claudicação súbita e total)","Deformidade visível, ângulo anormal no membro","Inchaço rápido na região","Dor intensa, vocalização ao se mover ou ao toque","Fratura exposta: osso visível através da pele","Em trauma de coluna: arrastar as patas traseiras, perda de movimento"]',
  '["Minimize a movimentação. Improvise uma maca rígida (tábua, papelão firme, bandeja) e mova o animal como um bloco único, sem torcer a coluna.","Imobilize o membro com uma tala improvisada (jornal grosso enrolado, papelão, madeira) presa com bandagem, firme mas sem cortar a circulação.","Em fratura exposta, cubra com gaze limpa e levemente umedecida com soro fisiológico, sem tentar recolocar o osso.","Mantenha o animal aquecido e calmo: o frio e o estresse agravam o estado de choque.","Transporte com cuidado e velocidade ao veterinário."]',
  'Nunca tente colocar o osso no lugar ou endireitar o membro. Isso só deve ser feito por um veterinário, frequentemente sob anestesia.',
  'Imediatamente, em qualquer suspeita de fratura ou trauma. O atraso compromete a cicatrização e, em casos de coluna, pode definir entre o animal voltar a andar ou não.'
)
on conflict (slug) do update set
  sinais = excluded.sinais,
  passos = excluded.passos,
  nunca_faca = excluded.nunca_faca,
  levar_ao_vet = excluded.levar_ao_vet;
