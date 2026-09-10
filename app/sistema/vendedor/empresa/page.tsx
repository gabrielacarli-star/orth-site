import { EMAIL, INSTAGRAM, PHONE_BR, PHONE_PT } from "@/lib/constants"

export default function SobreEmpresaPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl text-white">Sobre a ORTH Digital</h1>
        <p className="text-orth-muted text-sm mt-1">
          Informações de referência para o seu dia a dia como vendedor(a).
        </p>
      </div>

      <section className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 space-y-3">
        <h2 className="text-white font-medium">Como funciona o pagamento</h2>
        <ul className="text-orth-muted text-sm space-y-2 list-disc pl-4">
          <li>Na assinatura do contrato, o cliente paga o valor do site somado ao setup do serviço contratado.</li>
          <li>A primeira mensalidade vence 30 dias após a assinatura do contrato.</li>
          <li>As mensalidades seguintes se repetem a cada 30 dias, sempre contadas a partir da data de assinatura.</li>
          <li>Contratando mais de um serviço, cada serviço soma o seu próprio valor tanto no setup quanto na mensalidade.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 space-y-3">
        <h2 className="text-white font-medium">Custos que não estão inclusos</h2>
        <ul className="text-orth-muted text-sm space-y-2 list-disc pl-4">
          <li>A verba de anúncios do Google Ads e do Meta Ads é paga pelo cliente diretamente às plataformas. Não integra os valores da tabela e não transita pela ORTH.</li>
          <li>Domínio e hospedagem do site são contratados e pagos pelo cliente diretamente ao provedor.</li>
          <li>Não estão inclusos custos de terceiros não especificados, como banco de imagens, registro de marca ou domínio adicional.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 space-y-2">
        <h2 className="text-white font-medium">Sua comissão</h2>
        <p className="text-orth-muted text-sm">
          Sua comissão é calculada automaticamente sobre o valor de cada venda que você
          registrar no sistema, com comprovante de pagamento e contrato anexados. O
          percentual aplicado é o que está cadastrado no seu perfil — se ele mudar, a
          administração avisa antes.
        </p>
      </section>

      <section className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 space-y-2">
        <h2 className="text-white font-medium">Contato da ORTH</h2>
        <ul className="text-orth-muted text-sm space-y-1">
          <li>E-mail: <a href={EMAIL} className="text-orth-sky hover:text-white">orthdigital@gmail.com</a></li>
          <li>Telefone/WhatsApp Brasil: {PHONE_BR}</li>
          <li>Telefone/WhatsApp Portugal: {PHONE_PT}</li>
          <li>
            Instagram:{" "}
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-orth-sky hover:text-white">
              @orthdigital
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
