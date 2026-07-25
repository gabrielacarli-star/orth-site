import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Layout } from "../components/Layout"
import { Button, Card, EmptyState, Spinner } from "../components/ui"
import { findGuiaMeta } from "../data/guias"
import type { SosConteudo } from "../lib/types"

// Reaproveita a mesma Edge Function e a mesma tabela protegida do SOS
// (sos_conteudo / sos-conteudo): é o mesmo esquema de compra que libera o
// conteúdo, só muda o slug e como a tela apresenta o resultado.
export default function GuiaDetail() {
  const { slug } = useParams()
  const meta = slug ? findGuiaMeta(slug) : undefined

  const [loading, setLoading] = useState(true)
  const [conteudo, setConteudo] = useState<SosConteudo | null>(null)
  const [semAcesso, setSemAcesso] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setSemAcesso(false)
    setConteudo(null)
    supabase.functions
      .invoke<SosConteudo>("sos-conteudo", { body: { slug } })
      .then(({ data, error }) => {
        if (error || !data) {
          setSemAcesso(true)
        } else {
          setConteudo(data)
        }
        setLoading(false)
      })
  }, [slug])

  if (!meta) {
    return (
      <Layout title="Guia">
        <EmptyState icon="📘" titulo="Guia não encontrado">
          <Link to="/sos">
            <Button variant="ghost">Voltar às emergências</Button>
          </Link>
        </EmptyState>
      </Layout>
    )
  }

  return (
    <Layout title={meta.titulo}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{meta.icone}</span>
        <div>
          <h2 className="font-display text-lg font-bold text-ink">{meta.titulo}</h2>
          <p className="text-sm text-muted">{meta.resumo}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size={28} />
        </div>
      ) : conteudo ? (
        <>
          {conteudo.sinais.length > 0 && meta.labelSinais && (
            <div className="mt-5">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
                {meta.labelSinais}
              </p>
              <ul className="mt-2 space-y-1.5">
                {conteudo.sinais.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink">
                    <span className="text-gold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {conteudo.passos.length > 0 && (
            <div className="mt-5">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
                {meta.labelPassos}
              </p>
              {meta.passosNumerados ? (
                <ol className="mt-2 space-y-3">
                  {conteudo.passos.map((p, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dark font-display text-xs font-bold text-parchment">
                        {i + 1}
                      </span>
                      <span className="text-sm text-ink">{p}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-2 space-y-2">
                  {conteudo.passos.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink">
                      <span className="text-gold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {conteudo.nunca_faca && (
            <div className="mt-5 rounded-xl border-l-4 border-danger bg-danger-soft px-4 py-3">
              <p className="text-sm text-ink/90">
                <strong className="text-danger">Nunca faça:</strong> {conteudo.nunca_faca}
              </p>
            </div>
          )}

          {conteudo.levar_ao_vet && (
            <div className="mt-3 rounded-xl border-l-4 border-success bg-success/10 px-4 py-3">
              <p className="text-sm text-ink/90">
                <strong className="text-success">{meta.labelLevar}:</strong> {conteudo.levar_ao_vet}
              </p>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-gold bg-card px-4 py-3 text-center">
            <p className="text-sm text-muted">
              Este guia é educativo e não substitui o veterinário. Ao menor sinal de gravidade, vá
              à clínica <strong>imediatamente</strong>.
            </p>
          </div>
        </>
      ) : (
        semAcesso && (
          <div className="mt-6">
            <Card className="text-center">
              <div className="text-3xl">🔒</div>
              <p className="mt-2 font-display font-semibold text-ink">
                Guia completo no SOS Pet
              </p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
                Este guia é um dos bônus do e-book do Dr. Eduardo. Quem já comprou, encontra na
                biblioteca.
              </p>
              <Link to="/biblioteca" className="mt-4 inline-block">
                <Button variant="gold">Ver na biblioteca</Button>
              </Link>
            </Card>
          </div>
        )
      )}

      <div className="mt-6">
        <Link to="/sos" className="text-sm text-muted underline">
          ‹ Voltar às emergências
        </Link>
      </div>
    </Layout>
  )
}
