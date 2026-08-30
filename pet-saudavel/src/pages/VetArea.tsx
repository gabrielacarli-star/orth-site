import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Layout } from "../components/Layout"
import { Button, Card, EmptyState, Field, Input, Select, Textarea } from "../components/ui"
import { hojeISO, somaDias } from "../lib/dates"

interface PetEncontrado {
  pet_id: string
  pet_nome: string
  especie: string | null
  raca: string | null
  tutor_email: string | null
}

export default function VetArea() {
  const [nomePet, setNomePet] = useState("")
  const [emailTutor, setEmailTutor] = useState("")
  const [buscando, setBuscando] = useState(false)
  const [buscou, setBuscou] = useState(false)
  const [resultados, setResultados] = useState<PetEncontrado[]>([])
  const [petSelecionado, setPetSelecionado] = useState<PetEncontrado | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function buscar(e: React.FormEvent) {
    e.preventDefault()
    if (!nomePet.trim() && !emailTutor.trim()) return
    setBuscando(true)
    setErro(null)
    setPetSelecionado(null)
    try {
      const { data, error } = await supabase.functions.invoke<{ pets: PetEncontrado[]; error?: string }>(
        "vet-buscar-pet",
        { body: { nome_pet: nomePet.trim(), email_tutor: emailTutor.trim() } },
      )
      if (error || data?.error) throw error ?? new Error(data?.error)
      setResultados(data?.pets ?? [])
      setBuscou(true)
    } catch {
      setErro("Não foi possível buscar agora. Tente novamente.")
    } finally {
      setBuscando(false)
    }
  }

  return (
    <Layout title="Área do Veterinário">
      <div className="rounded-xl border-l-4 border-gold bg-card px-4 py-3">
        <p className="font-display text-sm font-semibold text-ink">Registrar cuidado num pet</p>
        <p className="mt-1 text-sm text-muted">
          Busque pelo nome do pet e/ou pelo e-mail do tutor pra registrar vacina ou antiparasitário
          direto, sem precisar do celular dele.
        </p>
      </div>

      <form onSubmit={buscar} className="mt-4 space-y-3">
        <Field label="Nome do pet">
          <Input value={nomePet} onChange={(e) => setNomePet(e.target.value)} placeholder="Ex.: Helena" />
        </Field>
        <Field label="E-mail do tutor" hint="Pode preencher só um dos dois campos.">
          <Input
            type="email"
            value={emailTutor}
            onChange={(e) => setEmailTutor(e.target.value)}
            placeholder="tutor@email.com"
          />
        </Field>
        <Button type="submit" variant="gold" block loading={buscando}>
          Buscar
        </Button>
      </form>

      {erro && <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{erro}</p>}

      {buscou && !petSelecionado && (
        <div className="mt-5 space-y-2">
          {resultados.length === 0 ? (
            <EmptyState icon="🔍" titulo="Nenhum pet encontrado" texto="Confira o nome ou o e-mail digitado." />
          ) : (
            resultados.map((p) => (
              <button key={p.pet_id} type="button" onClick={() => setPetSelecionado(p)} className="block w-full text-left">
                <Card className="flex items-center gap-3 transition hover:border-gold">
                  <span className="text-2xl">{p.especie === "gato" ? "🐈" : p.especie === "cao" ? "🐕" : "🐾"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-ink">{p.pet_nome}</p>
                    <p className="truncate text-xs text-muted">{p.tutor_email}</p>
                  </div>
                  <span className="text-gold">›</span>
                </Card>
              </button>
            ))
          )}
        </div>
      )}

      {petSelecionado && (
        <div className="mt-5">
          <button onClick={() => setPetSelecionado(null)} className="mb-3 text-sm text-muted underline">
            ‹ Voltar à busca
          </button>
          <Card className="mb-4">
            <p className="font-display font-semibold text-ink">{petSelecionado.pet_nome}</p>
            <p className="text-xs text-muted">{petSelecionado.tutor_email}</p>
          </Card>
          <RegistrarCuidado petId={petSelecionado.pet_id} />
        </div>
      )}
    </Layout>
  )
}

function RegistrarCuidado({ petId }: { petId: string }) {
  const [categoria, setCategoria] = useState<"vacina" | "antiparasitario">("vacina")
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [nome, setNome] = useState("")
  const [dataAplicacao, setDataAplicacao] = useState(hojeISO())
  const [proximaDose, setProximaDose] = useState("")
  const [observacao, setObservacao] = useState("")

  const [tipoAntip, setTipoAntip] = useState("vermifugo")
  const [produto, setProduto] = useState("")
  const [intervalo, setIntervalo] = useState("")

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setErro(null)
    setSucesso(false)
    try {
      const body: Record<string, unknown> = { pet_id: petId, categoria, data_aplicacao: dataAplicacao }
      if (categoria === "vacina") {
        body.nome = nome.trim()
        body.proxima_dose = proximaDose || null
        body.observacao = observacao.trim() || null
      } else {
        const dias = parseInt(intervalo, 10)
        body.tipo = tipoAntip
        body.produto = produto.trim() || null
        body.intervalo_dias = dias || 90
        body.proxima_dose = somaDias(dataAplicacao, dias || 90)
      }

      const { data, error } = await supabase.functions.invoke<{ ok?: boolean; error?: string }>(
        "vet-registrar-cuidado",
        { body },
      )
      if (error || !data?.ok) throw error ?? new Error(data?.error)

      setSucesso(true)
      setNome("")
      setProximaDose("")
      setObservacao("")
      setProduto("")
      setIntervalo("")
      setDataAplicacao(hojeISO())
    } catch {
      setErro("Não foi possível salvar agora. Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setCategoria("vacina")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
            categoria === "vacina" ? "border-gold bg-gold/15 text-ink" : "border-line text-muted"
          }`}
        >
          💉 Vacina
        </button>
        <button
          type="button"
          onClick={() => setCategoria("antiparasitario")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
            categoria === "antiparasitario" ? "border-gold bg-gold/15 text-ink" : "border-line text-muted"
          }`}
        >
          🐜 Antiparasitário
        </button>
      </div>

      <form onSubmit={salvar} className="space-y-3">
        {categoria === "vacina" ? (
          <>
            <Field label="Vacina">
              <Input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: V10, Antirrábica…" />
            </Field>
            <Field label="Data da aplicação">
              <Input type="date" required value={dataAplicacao} onChange={(e) => setDataAplicacao(e.target.value)} />
            </Field>
            <Field label="Próximo reforço" hint="Deixe em branco se não houver.">
              <Input type="date" value={proximaDose} onChange={(e) => setProximaDose(e.target.value)} />
            </Field>
            <Field label="Observação">
              <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Opcional" />
            </Field>
          </>
        ) : (
          <>
            <Field label="Tipo">
              <Select value={tipoAntip} onChange={(e) => setTipoAntip(e.target.value)}>
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
            <Field label="Repetir a cada (dias)">
              <Input
                type="number"
                min={1}
                required
                value={intervalo}
                onChange={(e) => setIntervalo(e.target.value)}
                placeholder="Ex.: 90"
              />
            </Field>
          </>
        )}

        {erro && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{erro}</p>}
        {sucesso && (
          <p className="rounded-lg bg-success/15 px-3 py-2 text-sm text-success">
            Registrado com sucesso! Já aparece no app do tutor.
          </p>
        )}

        <Button type="submit" variant="gold" block loading={salvando}>
          Salvar
        </Button>
      </form>
    </Card>
  )
}
