import Link from "next/link"
import { redirect } from "next/navigation"
import { getPerfil } from "@/lib/dal"
import { Logo } from "@/components/Logo"
import { Secao, Card, Objecao, Tabela } from "@/components/sistema/manual/Secao"

const TOC = [
  { id: "inicio", label: "Como usar este guia" },
  { id: "servicos", label: "O que a ORTH vende" },
  { id: "site-tipos", label: "Landing page, site, web app e app" },
  { id: "trafego", label: "O que é tráfego pago" },
  { id: "google-ads", label: "Google Ads" },
  { id: "meta-ads", label: "Meta Ads (Facebook e Instagram)" },
  { id: "google-vs-meta", label: "Google Ads x Meta Ads" },
  { id: "diagnostico", label: "Descobrindo o que o cliente precisa" },
  { id: "objecoes", label: "Perguntas e objeções comuns" },
  { id: "glossario", label: "Glossário rápido" },
]

export default async function ManualPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect("/sistema/login")

  const voltarHref = perfil.role === "admin" ? "/sistema/admin" : "/sistema/vendedor"

  return (
    <div className="min-h-screen bg-orth-dark select-text">
      <header className="border-b border-orth-line/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-orth-dark/95 backdrop-blur z-10">
        <Logo size={26} />
        <Link href={voltarHref} className="text-orth-muted hover:text-white text-sm transition-colors">
          ← Voltar ao painel
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex gap-10">
        <nav className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
          <p className="text-orth-muted text-xs uppercase tracking-wide mb-3">Neste guia</p>
          <ul className="space-y-1">
            {TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block text-sm text-orth-muted hover:text-white py-1 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 min-w-0 max-w-3xl">
          <div className="mb-10">
            <p className="text-orth-sky text-xs font-semibold uppercase tracking-wider mb-2">
              Manual de Vendas
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-white mb-3">
              Guia Completo de Produtos e Serviços da ORTH
            </h1>
            <p className="text-orth-muted leading-relaxed">
              Este material existe pra você entender, com profundidade, cada serviço que a ORTH
              vende: o que é, pra que serve, qual o benefício real pro cliente e como responder
              às dúvidas mais comuns. Não tem valores aqui. Pra preços, consulte a{" "}
              <Link
                href={`${voltarHref}/precos`}
                className="text-orth-sky hover:text-white underline underline-offset-2"
              >
                Tabela de Preços
              </Link>{" "}
              do sistema.
            </p>
          </div>

          <Secao id="inicio" kicker="Antes de começar" titulo="Como usar este guia">
            <p>
              Cada seção deste manual responde a uma pergunta que ou o cliente vai te fazer, ou
              você precisa saber pra recomendar o serviço certo. A ideia não é decorar, é
              entender o suficiente pra explicar com suas próprias palavras, com confiança.
            </p>
            <p>
              Sempre que bater dúvida numa conversa com cliente, essa é a primeira parada.
              As seções de <strong>objeções</strong> e <strong>glossário</strong>, no final, são
              boas de deixar abertas durante uma ligação ou reunião.
            </p>
          </Secao>

          <Secao id="servicos" kicker="Visão geral" titulo="O que a ORTH vende">
            <p>A ORTH ajuda negócios em duas frentes, que normalmente andam juntas:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card titulo="1. Existir online">
                Criação de site: a casa digital do negócio. Pode ser um site institucional, uma
                landing page ou um web app, dependendo do objetivo.
              </Card>
              <Card titulo="2. Ser encontrado">
                Gestão de Google Ads e Gestão de Meta Ads: tráfego pago pra colocar o negócio na
                frente de quem procura ou de quem tem potencial de comprar.
              </Card>
            </div>
            <p>
              Um cliente ideal, com o tempo, tem as duas frentes rodando ao mesmo tempo. Cada
              uma resolve um problema diferente, e juntas elas se reforçam.
            </p>
          </Secao>

          <Secao
            id="site-tipos"
            kicker="Fundamentos"
            titulo="Landing page, site institucional, web app e aplicativo"
          >
            <p>
              Essas quatro palavras são usadas (e confundidas) o tempo todo. Saber a diferença
              evita vender a coisa errada pro cliente errado, e evita prometer algo que não é o
              que ele realmente precisa.
            </p>

            <Card titulo="Landing Page">
              Uma página <strong>única</strong>, focada em <strong>uma única ação</strong>: deixar
              o contato, comprar um produto específico, se inscrever num evento. Sem menu cheio
              de distrações, sem 10 links pra clicar: só o caminho até a conversão. É a página
              certa pra colocar por trás de um anúncio (Google Ads ou Meta Ads), porque toda a
              atenção da pessoa vai pra uma coisa só.
            </Card>

            <Card titulo="Site Institucional">
              Um site com <strong>várias páginas</strong> (Home, Sobre, Serviços, Portfólio,
              Contato...) que apresenta a empresa <strong>inteira</strong>. É a casa digital
              permanente do negócio: onde alguém cai quando procura o nome da empresa no Google,
              pede indicação e vai conferir, ou quer entender tudo o que a empresa faz antes de
              decidir. Gera credibilidade e serve pra sempre, não só pra uma campanha.
            </Card>

            <Card titulo="Web App">
              Diferente de um site (que a pessoa só <strong>lê</strong>), um web app é algo que a
              pessoa <strong>usa</strong>: faz login, preenche dados, agenda, acompanha um pedido,
              acessa um painel. Tem lógica por trás: banco de dados, permissões, cálculos. O
              próprio sistema onde você está lendo este manual agora é um web app. É um projeto
              maior e mais complexo que um site simples, com prazo e valor próprios (confira a
              Tabela de Preços). Não trate como “só mais um site”.
            </Card>

            <Card titulo="Aplicativo (App nativo)">
              É o programa instalado direto no celular, baixado pela App Store ou Google Play
              (ou um site que se comporta como app, o chamado PWA). Só faz sentido quando o
              negócio realmente precisa de recursos do celular: notificação push, câmera, GPS,
              uso offline, ou quando o uso é tão frequente que “ter o ícone na tela” importa.
              É o projeto mais caro e demorado dos quatro, porque envolve duas plataformas
              (iOS e Android) e aprovação nas lojas. Na dúvida, um site ou web app bem feito
              resolve o problema por uma fração do custo. Não empurre “app” pro cliente sem
              necessidade real, e sempre fale com a administração antes de propor.
            </Card>

            <Tabela
              colunas={["Tipo", "Pra que serve", "Quando indicar", "Exemplo"]}
              linhas={[
                [
                  "Landing Page",
                  "Converter em UMA ação específica",
                  "Campanha de anúncio, lançamento, promoção",
                  "Página de uma oferta ou evento",
                ],
                [
                  "Site Institucional",
                  "Apresentar a empresa inteira e gerar confiança",
                  "Presença digital permanente, ser achado no Google",
                  "Home, Sobre, Serviços, Contato",
                ],
                [
                  "Web App",
                  "O usuário faz login e executa tarefas",
                  "Sistema interno, portal do cliente, agendamento",
                  "Este próprio sistema de vendedores",
                ],
                [
                  "Aplicativo (App)",
                  "Rodar no celular com recursos nativos",
                  "Uso frequente, push, câmera, GPS, offline",
                  "App de delivery, app bancário",
                ],
              ]}
            />
          </Secao>

          <Secao id="trafego" kicker="Fundamentos" titulo="O que é tráfego pago">
            <p>
              <strong>Tráfego</strong> é só o nome técnico pra “pessoas chegando”: no site, no
              perfil, na loja. <strong>Tráfego pago</strong> é pagar pra aparecer na frente de
              gente, em vez de esperar aparecer sozinho (orgânico), o que pode levar meses ou
              nunca acontecer, dependendo da concorrência.
            </p>
            <p>
              As duas plataformas que a ORTH gerencia, <strong>Google Ads</strong> e{" "}
              <strong>Meta Ads</strong>, funcionam como um leilão: quem anuncia dá um lance por
              espaço/atenção, e a plataforma decide quem aparece com base nesse lance e na
              qualidade do anúncio.
            </p>
            <p>
              Ponto importante pra deixar claro com o cliente: <strong>a verba do anúncio vai
              direto pra Google ou Meta</strong>, não passa pela ORTH. O que a ORTH cobra é pela{" "}
              <strong>gestão</strong>: estratégia, criação das campanhas, criativos, e otimização
              contínua pra gastar bem esse dinheiro.
            </p>
          </Secao>

          <Secao id="google-ads" kicker="Serviço" titulo="Google Ads">
            <p>
              É a plataforma de anúncios do Google. Os formatos mais comuns:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Rede de Pesquisa</strong>: texto no topo dos resultados, quando alguém já
                está buscando ativamente (ex: “encanador em São Paulo”).
              </li>
              <li>
                <strong>Google Shopping</strong>: produto com foto e preço, direto na busca.
              </li>
              <li>
                <strong>Rede Display</strong>: banners em sites parceiros do Google.
              </li>
              <li>
                <strong>YouTube Ads</strong>: anúncios em vídeo.
              </li>
              <li>
                <strong>Performance Max</strong>: campanha automatizada que combina vários
                formatos, otimizada pelo próprio Google.
              </li>
            </ul>
            <p>
              <strong>Por que funciona:</strong> Google Ads captura uma <strong>demanda que já
              existe</strong>. A pessoa já decidiu que quer aquilo, só falta decidir com quem.
              É por isso que costuma converter mais rápido.
            </p>
            <p>
              <strong>Benefícios pro cliente:</strong> aparece exatamente na hora em que alguém
              procura o que ele vende; segmentação por cidade/bairro; métricas claras de retorno;
              excelente pra serviços locais e urgentes (advogado, dentista, encanador, assistência
              técnica) e pra negócios B2B.
            </p>
            <p>
              <strong>Quando indicar:</strong> o cliente vende algo que as pessoas já procuram
              ativamente no Google, e quer resultado mais rápido em vendas ou orçamentos.
            </p>
          </Secao>

          <Secao id="meta-ads" kicker="Serviço" titulo="Meta Ads (Facebook e Instagram)">
            <p>
              É a plataforma de anúncios da Meta, aparece no Feed, Stories e Reels do Facebook e
              do Instagram. Formatos: imagem única, carrossel, vídeo, Stories, Reels.
            </p>
            <p>
              <strong>Por que funciona:</strong> ao contrário do Google, a pessoa não precisa
              estar procurando nada. A Meta usa idade, interesses, comportamento e localização
              pra <strong>encontrar quem tem perfil</strong> de comprar aquilo. É venda por
              descoberta e impulso, muito visual.
            </p>
            <p>
              <strong>Benefícios pro cliente:</strong> ótimo pra produtos visuais (moda, estética,
              alimentação, decoração), construção de marca, alcance de público novo e amplo,
              e <strong>remarketing</strong>: mostrar o anúncio de novo pra quem já visitou o
              site ou o perfil, mas não comprou.
            </p>
            <p>
              <strong>Quando indicar:</strong> o cliente tem um produto ou serviço que se vende
              bem visualmente, quer aumentar audiência/marca junto com vendas, ou o público dele
              é mais amplo (não busca ativamente, precisa “descobrir” a marca).
            </p>
          </Secao>

          <Secao id="google-vs-meta" kicker="Comparação" titulo="Google Ads x Meta Ads: qual escolher">
            <p>
              Não é uma escolha de “ou/ou” na maioria dos casos. Os dois resolvem problemas
              diferentes e se completam. Mas se precisar recomendar prioridade:
            </p>
            <Tabela
              colunas={["Critério", "Google Ads", "Meta Ads"]}
              linhas={[
                ["O que captura", "Demanda que já existe", "Demanda que se descobre"],
                [
                  "Melhor pra",
                  "Serviços locais/urgentes, alta intenção de compra, B2B",
                  "Produtos visuais, marca, público amplo, impulso",
                ],
                ["Formato principal", "Texto de busca, Shopping, vídeo", "Imagem, vídeo, carrossel, Stories/Reels"],
                [
                  "Velocidade de resultado",
                  "Costuma converter mais rápido (a intenção já existe)",
                  "Pode levar mais tempo pra \"esquentar\" o público",
                ],
              ]}
            />
            <p>
              Regra prática: <strong>Google Ads pega quem já quer comprar hoje; Meta Ads cria a
              vontade de comprar amanhã.</strong> Um cliente maduro, com verba, geralmente se
              beneficia dos dois rodando juntos.
            </p>
          </Secao>

          <Secao
            id="diagnostico"
            kicker="Na prática"
            titulo="Como descobrir o que o cliente realmente precisa"
          >
            <p>Use essas perguntas numa conversa de diagnóstico, na ordem:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>“Você já tem site?”</strong> Não → decidir entre landing page e site
                institucional antes de qualquer outra coisa.
              </li>
              <li>
                <strong>“É pra vender uma coisa específica agora, ou apresentar a empresa
                toda?”</strong> Uma oferta → Landing Page. A empresa toda → Site Institucional.
              </li>
              <li>
                <strong>“As pessoas já procuram o que você vende no Google?”</strong> Sim →
                Google Ads faz sentido.
              </li>
              <li>
                <strong>“Seu produto é visual, ou você quer criar desejo/marca?”</strong> Sim →
                Meta Ads faz sentido.
              </li>
              <li>
                <strong>“Você precisa que o cliente FAÇA algo dentro do site: login, agendar,
                comprar com carrinho, acompanhar pedido?”</strong> Sim → provavelmente é um Web
                App, não um site simples. Fale com a administração antes de propor qualquer
                escopo ou prazo.
              </li>
            </ol>
          </Secao>

          <Secao id="objecoes" kicker="Na prática" titulo="Perguntas e objeções mais comuns">
            <Objecao pergunta="Por que Google Ads / Meta Ads é tão caro?">
              <p>
                Separe as duas partes: a <strong>verba do anúncio</strong> vai direto pra Google
                ou Meta, não pra ORTH. O que a ORTH cobra é pela <strong>gestão</strong>:
                estratégia, criação de campanhas e criativos, e otimização constante. É o
                trabalho de ter alguém especializado cuidando disso todo dia, em vez de contratar
                um funcionário só pra essa função.
              </p>
            </Objecao>
            <Objecao pergunta="Meu site vai aparecer na primeira página do Google de graça?">
              <p>
                Aparecer de graça (orgânico/SEO) é possível, mas é lento e depende de muitos
                fatores fora do nosso controle. Nunca prometa isso como garantia. Um site bem
                construído ajuda o SEO ao longo do tempo, mas quem garante aparecer{" "}
                <strong>imediatamente</strong> é o Google Ads (pago). Desconfie de qualquer
                oferta no mercado que “garanta primeira página” de graça. Isso não existe.
              </p>
            </Objecao>
            <Objecao pergunta="Por que preciso de site se já tenho Instagram?">
              <p>
                O Instagram não é seu: é uma plataforma que pode mudar regras, derrubar contas,
                e o algoritmo decide quem vê seu conteúdo. O site é um canal <strong>próprio
                </strong>, sempre no ar, do jeito que você quiser. Também é o que aparece quando
                alguém pesquisa o nome da empresa no Google, e passa mais credibilidade pra
                fechar negócios maiores.
              </p>
            </Objecao>
            <Objecao pergunta="Quanto tempo até eu ver resultado com tráfego pago?">
              <p>
                Cliques e visitas começam quase imediatamente. Mas o <strong>primeiro mês</strong>{" "}
                costuma ser de ajuste: o algoritmo da plataforma está aprendendo o que funciona
                melhor pra aquele público e aquele orçamento. Seja honesto sobre isso: resultado
                consistente melhora com o tempo, não é instantâneo.
              </p>
            </Objecao>
            <Objecao pergunta="Posso pausar o anúncio quando quiser?">
              <p>
                Sim, a mensalidade é mês a mês. Mas vale explicar: ligar e desligar campanha o
                tempo todo reseta o aprendizado da plataforma, e isso piora o resultado. Manter
                rodando de forma constante costuma valer mais a pena que picotar.
              </p>
            </Objecao>
            <Objecao pergunta="Vocês garantem vendas?">
              <p>
                Nunca prometa garantia de venda: o resultado final depende de fatores fora do
                nosso controle (preço do cliente, atendimento dele, concorrência, produto). O
                compromisso da ORTH é com o trabalho: estratégia, testes, otimização e
                transparência total nos relatórios. Prometer venda garantida é o tipo de coisa
                que pode virar problema sério depois, nunca faça isso.
              </p>
            </Objecao>
          </Secao>

          <Secao id="glossario" kicker="Referência rápida" titulo="Glossário de termos do marketing digital">
            <Tabela
              colunas={["Termo", "O que significa"]}
              linhas={[
                ["Lead", "Pessoa que demonstrou interesse (deixou contato) mas ainda não comprou."],
                ["Conversão", "Quando o visitante faz a ação desejada: comprar, preencher formulário, agendar."],
                ["CTR (Click-Through Rate)", "% de pessoas que clicaram no anúncio, entre quem viu."],
                ["CPC (Custo por Clique)", "Quanto custa, em média, cada clique no anúncio."],
                ["CPM (Custo por Mil)", "Quanto custa mostrar o anúncio 1.000 vezes."],
                ["CPA (Custo por Aquisição)", "Quanto custou, em média, cada venda ou lead gerado."],
                ["ROI / ROAS", "Retorno sobre o investimento: quanto voltou pra cada real investido."],
                ["Funil de vendas", "O caminho do cliente desde conhecer a marca até comprar (topo, meio, fundo)."],
                ["Remarketing", "Mostrar o anúncio de novo pra quem já visitou o site ou seguiu o perfil."],
                ["SEO", "Otimização pra aparecer organicamente (de graça) nos resultados do Google."],
                ["Segmentação / Público-alvo", "Pra quem exatamente o anúncio é direcionado."],
                ["CTA (Call-to-Action)", "O botão ou frase que pede a ação: \"Fale conosco\", \"Compre agora\"."],
              ]}
            />
          </Secao>

          <p className="text-orth-muted text-xs pt-10 border-t border-orth-line/10 mt-10">
            Documento interno da ORTH Digital, uso exclusivo da equipe. Não compartilhe fora da
            empresa.
          </p>
        </main>
      </div>
    </div>
  )
}
