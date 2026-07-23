import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Layout } from "../components/Layout"
import { Badge, Button, Card, EmptyState, SectionTitle, Spinner } from "../components/ui"
import type { Cuidado, Pet } from "../lib/types"
import { diasAte, formatarData, rotuloPrazo } from "../lib/dates"

const JANELA_DIAS = 30

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [pets, setPets] = useState<Pet[]>([])
  const [cuidados, setCuidados] = useState<Cuidado[]>([])

  useEffect(() => {
    void carregar()
  }, [])

  async function carregar() {
    setLoading(true)
    const { data: petsData } = await supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: true })
    const meusPets = (petsData ?? []) as Pet[]
    setPets(meusPets)

    if (meusPets.length === 0) {
      setCuidados([])
      setLoading(false)
      return
    }

    const petIds = meusPets.map((p) => p.id)
    const nomePorPet = new Map(meusPets.map((p) => [p.id, p.nome]))

    const [{ data: vacinas }, { data: antip }] = await Promise.all([
      supabase.from("vacinas").select("*").in("pet_id", petIds).not("proxima_dose", "is", null),
      supabase
        .from("antiparasitarios")
        .select("*")
        .in("pet_id", petIds)
        .not("proxima_dose", "is", null),
    ])

    const itens: Cuidado[] = []
    for (const v of vacinas ?? []) {
      itens.push({
        id: `v-${v.id}`,
        petId: v.pet_id,
        petNome: nomePorPet.get(v.pet_id) ?? "",
        tipo: "vacina",
        titulo: v.nome,
        data: v.proxima_dose!,
      })
    }
    for (const a of antip ?? []) {
      itens.push({
        id: `a-${a.id}`,
        petId: a.pet_id,
        petNome: nomePorPet.get(a.pet_id) ?? "",
        tipo: (a.tipo ?? "vermifugo") as Cuidado["tipo"],
        titulo: rotuloAntip(a.tipo),
        data: a.proxima_dose!,
      })
    }

    const filtrados = itens
      .filter((c) => diasAte(c.data) <= JANELA_DIAS)
      .sort((x, y) => x.data.localeCompare(y.data))
    setCuidados(filtrados)
    setLoading(false)
  }

  if (loading) {
    return (
      <Layout title="Início">
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      </Layout>
    )
  }

  const atrasados = cuidados.filter((c) => diasAte(c.data) < 0)
  const proximos = cuidados.filter((c) => diasAte(c.data) >= 0)

  return (
    <Layout title="Início">
      {pets.length === 0 ? (
        <EmptyState
          icon="🐾"
          titulo="Comece cadastrando seu pet"
          texto="Depois é só registrar as vacinas, o peso e acompanhar os próximos cuidados por aqui."
        >
          <Link to="/pets/novo">
            <Button variant="gold">+ Cadastrar meu pet</Button>
          </Link>
        </EmptyState>
      ) : (
        <>
          <SectionTitle num="01">Próximos cuidados</SectionTitle>

          {cuidados.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">
                Nada vencendo nos próximos {JANELA_DIAS} dias. Está tudo em dia 🎉
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {atrasados.length > 0 && (
                <p className="font-display text-xs font-semibold uppercase tracking-wider text-danger">
                  Atrasados
                </p>
              )}
              {atrasados.map((c) => (
                <CuidadoRow key={c.id} c={c} atrasado />
              ))}

              {atrasados.length > 0 && proximos.length > 0 && (
                <p className="pt-2 font-display text-xs font-semibold uppercase tracking-wider text-muted">
                  A caminho
                </p>
              )}
              {proximos.map((c) => (
                <CuidadoRow key={c.id} c={c} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <SectionTitle num="02">Meus pets</SectionTitle>
            <div className="space-y-2">
              {pets.map((p) => (
                <Link key={p.id} to={`/pets/${p.id}`} className="block">
                  <Card className="flex items-center gap-3 transition hover:border-gold">
                    <PetAvatar pet={p} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display font-semibold text-ink">{p.nome}</p>
                      <p className="text-xs text-muted">{especieLabel(p.especie)}</p>
                    </div>
                    <span className="text-gold">›</span>
                  </Card>
                </Link>
              ))}
              <Link to="/pets/novo" className="block">
                <Button variant="ghost" block>
                  + Adicionar outro pet
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

function CuidadoRow({ c, atrasado }: { c: Cuidado; atrasado?: boolean }) {
  return (
    <Link to={`/pets/${c.petId}`} className="block">
      <Card
        className={`flex items-center gap-3 transition hover:border-gold ${
          atrasado ? "border-danger/40" : ""
        }`}
      >
        <span className="text-xl">{iconePorTipo(c.tipo)}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-ink">{c.titulo}</p>
          <p className="truncate text-xs text-muted">
            {c.petNome} · {formatarData(c.data)}
          </p>
        </div>
        <Badge tone={atrasado ? "danger" : "gold"}>{rotuloPrazo(c.data)}</Badge>
      </Card>
    </Link>
  )
}

function PetAvatar({ pet }: { pet: Pet }) {
  if (pet.foto_url) {
    return (
      <img
        src={pet.foto_url}
        alt={pet.nome}
        className="h-11 w-11 rounded-full border border-gold object-cover"
      />
    )
  }
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold bg-parchment text-lg">
      {pet.especie === "gato" ? "🐈" : pet.especie === "cao" ? "🐕" : "🐾"}
    </div>
  )
}

function iconePorTipo(t: Cuidado["tipo"]) {
  return t === "vacina" ? "💉" : t === "pulga" ? "🐜" : t === "carrapato" ? "🕷️" : "💊"
}
function rotuloAntip(tipo: string | null) {
  if (tipo === "pulga") return "Antipulgas"
  if (tipo === "carrapato") return "Anticarrapato"
  return "Vermífugo"
}
function especieLabel(e: Pet["especie"]) {
  if (e === "cao") return "Cão"
  if (e === "gato") return "Gato"
  if (e === "outro") return "Outro"
  return "—"
}
