import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Layout } from "../components/Layout"
import { WeightChart } from "../components/WeightChart"
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Select,
  Spinner,
  Textarea,
} from "../components/ui"
import type { Antiparasitario, Peso, Pet, TipoAntiparasitario, Vacina } from "../lib/types"
import { formatarData, hojeISO, idade, rotuloPrazo, somaDias } from "../lib/dates"

type Aba = "vacinas" | "antiparasitarios" | "peso"

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState<Pet | null>(null)
  const [aba, setAba] = useState<Aba>("vacinas")
  const [loading, setLoading] = useState(true)

  const [vacinas, setVacinas] = useState<Vacina[]>([])
  const [antip, setAntip] = useState<Antiparasitario[]>([])
  const [pesos, setPesos] = useState<Peso[]>([])

  useEffect(() => {
    if (!id) return
    void carregar(id)
  }, [id])

  async function carregar(petId: string) {
    setLoading(true)
    const [{ data: p }, { data: v }, { data: a }, { data: w }] = await Promise.all([
      supabase.from("pets").select("*").eq("id", petId).single(),
      supabase.from("vacinas").select("*").eq("pet_id", petId).order("data_aplicacao", { ascending: false }),
      supabase
        .from("antiparasitarios")
        .select("*")
        .eq("pet_id", petId)
        .order("data_aplicacao", { ascending: false }),
      supabase.from("pesos").select("*").eq("pet_id", petId).order("data", { ascending: false }),
    ])
    setPet((p as Pet) ?? null)
    setVacinas((v ?? []) as Vacina[])
    setAntip((a ?? []) as Antiparasitario[])
    setPesos((w ?? []) as Peso[])
    setLoading(false)
  }

  if (loading) {
    return (
      <Layout title="Pet">
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      </Layout>
    )
  }
  if (!pet) {
    return (
      <Layout title="Pet">
        <EmptyState icon="🐾" titulo="Pet não encontrado" />
      </Layout>
    )
  }

  return (
    <Layout title={pet.nome}>
      {/* Cabeçalho do pet */}
      <div className="flex items-center gap-3">
        {pet.foto_url ? (
          <img
            src={pet.foto_url}
            alt={pet.nome}
            className="h-16 w-16 rounded-full border-2 border-gold object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-card text-2xl">
            {pet.especie === "gato" ? "🐈" : pet.especie === "cao" ? "🐕" : "🐾"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold text-ink">{pet.nome}</h2>
          <p className="text-xs text-muted">
            {pet.raca || (pet.especie === "gato" ? "Gato" : pet.especie === "cao" ? "Cão" : "Pet")}
            {pet.nascimento ? ` · ${idade(pet.nascimento)}` : ""}
          </p>
          {pet.alergias && (
            <p className="mt-0.5 text-xs text-danger">⚠️ Alergias: {pet.alergias}</p>
          )}
        </div>
        <Link
          to={`/pets/${pet.id}/editar`}
          className="rounded-lg border border-gold px-2.5 py-1 font-display text-xs text-muted"
        >
          Editar
        </Link>
      </div>

      {/* Abas */}
      <div className="no-scrollbar mt-5 flex gap-1 overflow-x-auto border-b border-gold">
        {(
          [
            ["vacinas", "💉 Vacinas"],
            ["antiparasitarios", "💊 Antiparasitários"],
            ["peso", "⚖️ Peso"],
          ] as [Aba, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={`whitespace-nowrap px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide transition ${
              aba === key ? "border-b-2 border-gold text-ink" : "text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {aba === "vacinas" && (
          <VacinasTab petId={pet.id} vacinas={vacinas} onChange={() => carregar(pet.id)} />
        )}
        {aba === "antiparasitarios" && (
          <AntipTab petId={pet.id} itens={antip} onChange={() => carregar(pet.id)} />
        )}
        {aba === "peso" && <PesoTab petId={pet.id} pesos={pesos} onChange={() => carregar(pet.id)} />}
      </div>

      <div className="mt-10 border-t border-line pt-4">
        <button
          onClick={async () => {
            if (confirm(`Excluir ${pet.nome} e todo o histórico? Não dá para desfazer.`)) {
              await supabase.from("pets").delete().eq("id", pet.id)
              navigate("/pets")
            }
          }}
          className="text-xs text-danger underline"
        >
          Excluir este pet
        </button>
      </div>
    </Layout>
  )
}

/* ---------------- Vacinas ---------------- */
function VacinasTab({
  petId,
  vacinas,
  onChange,
}: {
  petId: string
  vacinas: Vacina[]
  onChange: () => void
}) {
  const [aberto, setAberto] = useState(false)
  const [nome, setNome] = useState("")
  const [dataAplicacao, setDataAplicacao] = useState(hojeISO())
  const [proximaDose, setProximaDose] = useState("")
  const [obs, setObs] = useState("")
  const [salvando, setSalvando] = useState(false)

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    await supabase.from("vacinas").insert({
      pet_id: petId,
      nome: nome.trim(),
      data_aplicacao: dataAplicacao,
      proxima_dose: proximaDose || null,
      observacao: obs.trim() || null,
    })
    setSalvando(false)
    setAberto(false)
    setNome("")
    setProximaDose("")
    setObs("")
    setDataAplicacao(hojeISO())
    onChange()
  }

  return (
    <div className="space-y-3">
      {!aberto && <Button variant="gold" block onClick={() => setAberto(true)}>+ Registrar vacina</Button>}

      {aberto && (
        <Card>
          <form onSubmit={salvar} className="space-y-3">
            <Field label="Vacina">
              <Input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: V10, Antirrábica…" />
            </Field>
            <Field label="Data da aplicação">
              <Input type="date" required value={dataAplicacao} onChange={(e) => setDataAplicacao(e.target.value)} />
            </Field>
            <Field label="Próximo reforço" hint="Data que o veterinário indicou. Deixe em branco se não houver.">
              <Input type="date" value={proximaDose} onChange={(e) => setProximaDose(e.target.value)} />
            </Field>
            <Field label="Observação">
              <Textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Opcional" />
            </Field>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" loading={salvando}>
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {vacinas.length === 0 && !aberto ? (
        <EmptyState icon="💉" titulo="Nenhuma vacina registrada" texto="Guarde aqui a carteira de vacinação do seu pet." />
      ) : (
        vacinas.map((v) => (
          <Card key={v.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display font-semibold text-ink">{v.nome}</p>
              <p className="text-xs text-muted">Aplicada em {formatarData(v.data_aplicacao)}</p>
              {v.observacao && <p className="mt-1 text-xs text-muted">{v.observacao}</p>}
            </div>
            {v.proxima_dose && (
              <div className="shrink-0 text-right">
                <p className="text-[10px] uppercase tracking-wide text-muted">Reforço</p>
                <Badge tone={badgeTone(v.proxima_dose)}>{rotuloPrazo(v.proxima_dose)}</Badge>
                <p className="mt-0.5 text-[10px] text-muted">{formatarData(v.proxima_dose)}</p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  )
}

/* ---------------- Antiparasitários ---------------- */
function AntipTab({
  petId,
  itens,
  onChange,
}: {
  petId: string
  itens: Antiparasitario[]
  onChange: () => void
}) {
  const [aberto, setAberto] = useState(false)
  const [tipo, setTipo] = useState<TipoAntiparasitario>("vermifugo")
  const [produto, setProduto] = useState("")
  const [dataAplicacao, setDataAplicacao] = useState(hojeISO())
  const [intervalo, setIntervalo] = useState("")
  const [salvando, setSalvando] = useState(false)

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const dias = parseInt(intervalo, 10)
    if (!dias || dias <= 0) return
    setSalvando(true)
    await supabase.from("antiparasitarios").insert({
      pet_id: petId,
      tipo,
      produto: produto.trim() || null,
      data_aplicacao: dataAplicacao,
      intervalo_dias: dias,
      proxima_dose: somaDias(dataAplicacao, dias),
    })
    setSalvando(false)
    setAberto(false)
    setProduto("")
    setIntervalo("")
    setDataAplicacao(hojeISO())
    onChange()
  }

  return (
    <div className="space-y-3">
      {!aberto && (
        <Button variant="gold" block onClick={() => setAberto(true)}>
          + Registrar antiparasitário
        </Button>
      )}

      {aberto && (
        <Card>
          <form onSubmit={salvar} className="space-y-3">
            <Field label="Tipo">
              <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoAntiparasitario)}>
                <option value="vermifugo">Vermífugo</option>
                <option value="pulga">Antipulgas</option>
                <option value="carrapato">Anticarrapato</option>
              </Select>
            </Field>
            <Field label="Produto">
              <Input value={produto} onChange={(e) => setProduto(e.target.value)} placeholder="Nome do produto (opcional)" />
            </Field>
            <Field label="Data da aplicação">
              <Input type="date" required value={dataAplicacao} onChange={(e) => setDataAplicacao(e.target.value)} />
            </Field>
            <Field
              label="Repetir a cada (dias)"
              hint="Preencha conforme a orientação do seu veterinário. O app calcula a próxima data."
            >
              <Input
                type="number"
                min={1}
                required
                value={intervalo}
                onChange={(e) => setIntervalo(e.target.value)}
                placeholder="Ex.: 30, 90…"
              />
            </Field>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" loading={salvando}>
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {itens.length === 0 && !aberto ? (
        <EmptyState
          icon="💊"
          titulo="Nenhum registro"
          texto="Vermífugo, antipulgas e anticarrapato — o app avisa quando repetir."
        />
      ) : (
        itens.map((a) => (
          <Card key={a.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display font-semibold text-ink">{tipoLabel(a.tipo)}</p>
              <p className="text-xs text-muted">
                {a.produto ? `${a.produto} · ` : ""}
                {formatarData(a.data_aplicacao)} · a cada {a.intervalo_dias} dias
              </p>
            </div>
            {a.proxima_dose && (
              <div className="shrink-0 text-right">
                <p className="text-[10px] uppercase tracking-wide text-muted">Próxima</p>
                <Badge tone={badgeTone(a.proxima_dose)}>{rotuloPrazo(a.proxima_dose)}</Badge>
                <p className="mt-0.5 text-[10px] text-muted">{formatarData(a.proxima_dose)}</p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  )
}

/* ---------------- Peso ---------------- */
function PesoTab({ petId, pesos, onChange }: { petId: string; pesos: Peso[]; onChange: () => void }) {
  const [data, setData] = useState(hojeISO())
  const [valor, setValor] = useState("")
  const [salvando, setSalvando] = useState(false)

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const kg = parseFloat(valor.replace(",", "."))
    if (!kg || kg <= 0) return
    setSalvando(true)
    await supabase.from("pesos").insert({ pet_id: petId, data, peso_kg: kg })
    setSalvando(false)
    setValor("")
    setData(hojeISO())
    onChange()
  }

  const ultimo = pesos[0]

  return (
    <div className="space-y-3">
      {ultimo && (
        <Card>
          <p className="text-xs uppercase tracking-wide text-muted">Peso atual</p>
          <p className="font-display text-2xl font-bold text-ink">
            {ultimo.peso_kg.toFixed(1)} <span className="text-base text-muted">kg</span>
          </p>
          <p className="text-xs text-muted">em {formatarData(ultimo.data)}</p>
          {pesos.length >= 2 && (
            <div className="mt-3">
              <WeightChart pesos={pesos} />
            </div>
          )}
        </Card>
      )}

      <Card>
        <form onSubmit={salvar} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Field label="Peso (kg)">
                <Input
                  inputMode="decimal"
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="Ex.: 8,5"
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Data">
                <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
              </Field>
            </div>
          </div>
          <Button type="submit" block loading={salvando}>
            Registrar peso
          </Button>
        </form>
      </Card>

      {pesos.length === 0 ? (
        <EmptyState icon="⚖️" titulo="Nenhum peso registrado" texto="Pese uma vez por mês — é o que revela problemas cedo." />
      ) : (
        <div className="space-y-1.5">
          {pesos.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-line bg-card px-3 py-2 text-sm"
            >
              <span className="text-muted">{formatarData(p.data)}</span>
              <span className="font-display font-semibold text-ink">{p.peso_kg.toFixed(1)} kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------- helpers ---------------- */
function tipoLabel(t: TipoAntiparasitario | null) {
  if (t === "pulga") return "Antipulgas"
  if (t === "carrapato") return "Anticarrapato"
  return "Vermífugo"
}
function badgeTone(iso: string): "danger" | "gold" | "success" {
  const d = new Date(iso).getTime() - new Date(hojeISO()).getTime()
  const dias = Math.round(d / 86400000)
  if (dias < 0) return "danger"
  if (dias <= 7) return "gold"
  return "success"
}
