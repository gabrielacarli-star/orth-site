import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Layout } from "../components/Layout"
import { Button, Card, EmptyState, Spinner } from "../components/ui"
import type { Pet } from "../lib/types"
import { idade } from "../lib/dates"

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setPets((data ?? []) as Pet[])
        setLoading(false)
      })
  }, [])

  return (
    <Layout title="Meus pets">
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      ) : pets.length === 0 ? (
        <EmptyState icon="🐾" titulo="Nenhum pet ainda" texto="Cadastre seu primeiro pet para começar.">
          <Link to="/pets/novo">
            <Button variant="gold">+ Cadastrar pet</Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {pets.map((p) => (
            <Link key={p.id} to={`/pets/${p.id}`} className="block">
              <Card className="flex items-center gap-3 transition hover:border-gold">
                {p.foto_url ? (
                  <img
                    src={p.foto_url}
                    alt={p.nome}
                    className="h-12 w-12 rounded-full border border-gold object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-parchment text-xl">
                    {p.especie === "gato" ? "🐈" : p.especie === "cao" ? "🐕" : "🐾"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold text-ink">{p.nome}</p>
                  <p className="text-xs text-muted">
                    {p.raca || (p.especie === "gato" ? "Gato" : p.especie === "cao" ? "Cão" : "Pet")}
                    {p.nascimento ? ` · ${idade(p.nascimento)}` : ""}
                  </p>
                </div>
                <span className="text-gold">›</span>
              </Card>
            </Link>
          ))}
          <Link to="/pets/novo" className="block pt-2">
            <Button variant="ghost" block>
              + Adicionar outro pet
            </Button>
          </Link>
        </div>
      )}
    </Layout>
  )
}
