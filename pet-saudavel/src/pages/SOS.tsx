import { Link } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Card } from "../components/ui"
import { SOS_CARDS } from "../data/sosCards"

export default function SOS() {
  return (
    <Layout title="Emergências">
      <div className="rounded-xl border-l-4 border-danger bg-danger-soft px-4 py-3">
        <p className="font-display text-sm font-semibold text-danger">Primeiros socorros</p>
        <p className="mt-1 text-sm text-ink/80">
          Orientações para agir <strong>até chegar à clínica veterinária</strong>. Não substituem
          o atendimento. Em qualquer emergência, procure um veterinário imediatamente.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {SOS_CARDS.map((c) => (
          <Link key={c.slug} to={`/sos/${c.slug}`} className="block">
            <Card className="flex items-center gap-3 transition hover:border-gold">
              <span className="text-2xl">{c.icone}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-ink">{c.titulo}</p>
                <p className="truncate text-xs text-muted">{c.resumo}</p>
              </div>
              {c.gratis ? (
                <span className="text-gold">›</span>
              ) : (
                <span className="text-sm" title="Disponível no e-book">
                  🔒
                </span>
              )}
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        As fichas 🔒 fazem parte do <em>Guia de Emergências</em> do Dr. Eduardo.
      </p>
    </Layout>
  )
}
