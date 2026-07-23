import { Link, useParams } from "react-router-dom"
import { Layout } from "../components/Layout"
import { Button, Card, EmptyState } from "../components/ui"
import { findSos } from "../data/sosCards"

export default function SOSDetail() {
  const { slug } = useParams()
  const card = slug ? findSos(slug) : undefined

  if (!card) {
    return (
      <Layout title="Emergência">
        <EmptyState icon="🚨" titulo="Ficha não encontrada">
          <Link to="/sos">
            <Button variant="ghost">Voltar às emergências</Button>
          </Link>
        </EmptyState>
      </Layout>
    )
  }

  return (
    <Layout title={card.titulo}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{card.icone}</span>
        <div>
          <h2 className="font-display text-lg font-bold text-ink">{card.titulo}</h2>
          <p className="text-sm text-muted">{card.resumo}</p>
        </div>
      </div>

      {card.gratis ? (
        <>
          <ol className="mt-5 space-y-3">
            {card.passos.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dark font-display text-xs font-bold text-parchment">
                  {i + 1}
                </span>
                <span className="text-sm text-ink">{p}</span>
              </li>
            ))}
          </ol>

          {card.atencao && (
            <div className="mt-5 rounded-xl border-l-4 border-danger bg-danger-soft px-4 py-3">
              <p className="text-sm text-ink/90">
                <strong className="text-danger">Atenção:</strong> {card.atencao}
              </p>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-gold bg-card px-4 py-3 text-center">
            <p className="text-sm text-muted">
              Estas orientações não substituem o veterinário. Ao menor sinal de gravidade, vá à
              clínica <strong>imediatamente</strong>.
            </p>
          </div>
        </>
      ) : (
        <div className="mt-6">
          {card.atencao && (
            <div className="mb-4 rounded-xl border-l-4 border-danger bg-danger-soft px-4 py-3">
              <p className="text-sm text-ink/90">
                <strong className="text-danger">Atenção:</strong> {card.atencao}
              </p>
            </div>
          )}
          <Card className="text-center">
            <div className="text-3xl">🔒</div>
            <p className="mt-2 font-display font-semibold text-ink">
              Protocolo completo no Guia de Emergências
            </p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
              O passo a passo detalhado desta e de outras emergências faz parte do e-book do Dr.
              Eduardo. Quem já tem, encontra na biblioteca.
            </p>
            <Link to="/biblioteca" className="mt-4 inline-block">
              <Button variant="gold">Ver na biblioteca</Button>
            </Link>
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Link to="/sos" className="text-sm text-muted underline">
          ‹ Voltar às emergências
        </Link>
      </div>
    </Layout>
  )
}
