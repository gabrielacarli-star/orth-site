import { useNavigate } from "react-router-dom"
import { Seal } from "../components/ui"

// Política de Privacidade — modelo base (LGPD/RGPD).
// ⚠️ Revise com apoio jurídico antes de publicar e confira nome da empresa,
// endereço e e-mail de contato do responsável pelos dados.
export default function Privacy() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto min-h-full max-w-[640px] bg-parchment px-6 py-10">
      <div className="text-center">
        <Seal size={56} />
        <h1 className="mt-3 font-display text-xl font-bold text-ink">Política de Privacidade</h1>
        <p className="text-xs text-muted">Pet Saudável · Dr. Eduardo Sebastião</p>
      </div>

      <div className="prose-sm mt-8 space-y-5 text-sm leading-relaxed text-ink">
        <Bloco titulo="1. Quem somos">
          O aplicativo Pet Saudável é oferecido por Dr. Eduardo Sebastião (CRMV-MT). O responsável
          pelo tratamento dos dados pode ser contatado pelo e-mail{" "}
          <strong>[inserir e-mail de contato]</strong>.
        </Bloco>
        <Bloco titulo="2. Quais dados coletamos">
          <ul className="ml-5 list-disc space-y-1">
            <li>Dados de conta: seu e-mail e uma senha criptografada.</li>
            <li>
              Dados que você cadastra sobre seus pets: nome, foto, espécie, raça, data de
              nascimento, alergias, vacinas, antiparasitários e registros de peso.
            </li>
            <li>Registros de compras de e-books, para liberar o acesso ao conteúdo.</li>
          </ul>
        </Bloco>
        <Bloco titulo="3. Para que usamos">
          Para manter seus registros organizados, mostrar os próximos cuidados, enviar lembretes por
          e-mail sobre vacinas e antiparasitários e liberar os e-books que você adquiriu. Não
          vendemos seus dados.
        </Bloco>
        <Bloco titulo="4. Base legal">
          Tratamos seus dados com base no seu consentimento e na execução do serviço que você
          solicita ao usar o app. Você pode retirar o consentimento apagando sua conta.
        </Bloco>
        <Bloco titulo="5. Compartilhamento">
          Usamos provedores de tecnologia para operar o serviço (armazenamento e envio de e-mails).
          Eles tratam os dados apenas para viabilizar o funcionamento do app, sob contrato.
        </Bloco>
        <Bloco titulo="6. Seus direitos">
          Você pode acessar, corrigir e apagar seus dados a qualquer momento. A exclusão total da
          conta e de todos os dados está disponível em <strong>Conta → Excluir minha conta</strong>,
          dentro do app.
        </Bloco>
        <Bloco titulo="7. Saúde animal">
          O Pet Saudável organiza e educa. Ele não realiza diagnóstico, não prescreve medicamentos e
          não substitui a consulta veterinária. Em emergências, procure sempre um veterinário.
        </Bloco>
        <Bloco titulo="8. Alterações">
          Podemos atualizar esta política. Avisaremos sobre mudanças relevantes dentro do app.
        </Bloco>
        <p className="text-xs text-muted">Última atualização: [inserir data ao publicar].</p>
      </div>

      <button onClick={() => navigate(-1)} className="mt-8 text-sm text-muted underline">
        ‹ Voltar
      </button>
    </div>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
        {titulo}
      </h2>
      <div className="mt-1 text-muted">{children}</div>
    </section>
  )
}
