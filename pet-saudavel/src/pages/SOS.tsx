import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Card } from "../components/ui"
import { SOS_CARDS } from "../data/sosCards"
import { checkSosAccess } from "../lib/sosAccess"

export default function SOS() {
  const [temAcesso, setTemAcesso] = useState<boolean | null>(null)

  useEffect(() => {
    checkSosAccess().then(setTemAcesso)
  }, [])

  return (
    <Layout title="Emergências">
      <div className="rounded-xl border-l-4 border-danger bg-danger-soft px-4 py-3">
        <p className="font-display text-sm font-semibold text-danger">Primeiros socorros</p>
        <p className="mt-1 text-sm text-ink/80">
          Orientações para agir <strong>até chegar à clínica veterinária</strong>. Não substituem
          o atendimento. Em qualquer emergência, procure um veterinário imediatamente.
        </p>
      </div>

      <Link to="/pets" className="mt-4 block">
        <Card className="flex items-center gap-3 border-gold transition hover:bg-gold/10">
          <span className="text-2xl">🪪</span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold text-ink">Cartão de emergência</p>
            <p className="text-xs text-muted">
              Preencha os dados de cada pet e do veterinário para ter tudo à mão na hora do aperto.
            </p>
          </div>
          <span className="text-gold">›</span>
        </Card>
      </Link>

      {temAcesso === false && (
        <div className="mt-4 rounded-xl border border-gold bg-card px-4 py-3">
          <p className="text-sm text-ink">
            <strong>🔒 O passo a passo completo é exclusivo de quem já comprou</strong> o Guia de
            Emergências do Dr. Eduardo.
          </p>
          <Link to="/biblioteca" className="mt-2 inline-block text-sm font-semibold text-ink underline">
            Ver na biblioteca
          </Link>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {SOS_CARDS.map((c) => (
          <Link key={c.slug} to={`/sos/${c.slug}`} className="block">
            <Card className="flex items-center gap-3 transition hover:border-gold">
              <span className="text-2xl">{c.icone}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-ink">{c.titulo}</p>
                <p className="truncate text-xs text-muted">{c.resumo}</p>
              </div>
              {temAcesso ? (
                <span className="text-gold">›</span>
              ) : (
                <span className="text-sm" title="Disponível para quem comprou o guia">
                  🔒
                </span>
              )}
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        O passo a passo completo faz parte do <em>Guia de Emergências</em> do Dr. Eduardo.
      </p>
    </Layout>
  )
}
