import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Layout } from "../components/Layout"
import { Button, Field, Input, Seal, Spinner, Textarea } from "../components/ui"
import type { Peso, Pet } from "../lib/types"
import { idade } from "../lib/dates"

export default function EmergencyCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState<Pet | null>(null)
  const [pesoAtual, setPesoAtual] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)

  const [condicoesSaude, setCondicoesSaude] = useState("")
  const [medicacaoContinua, setMedicacaoContinua] = useState("")
  const [vetNome, setVetNome] = useState("")
  const [vetTelefone, setVetTelefone] = useState("")
  const [emergTelefone, setEmergTelefone] = useState("")
  const [emergEndereco, setEmergEndereco] = useState("")

  useEffect(() => {
    if (!id) return
    void carregar(id)
  }, [id])

  async function carregar(petId: string) {
    setLoading(true)
    const [{ data: p }, { data: pesos }] = await Promise.all([
      supabase.from("pets").select("*").eq("id", petId).single(),
      supabase
        .from("pesos")
        .select("*")
        .eq("pet_id", petId)
        .order("data", { ascending: false })
        .limit(1),
    ])
    const petData = (p as Pet) ?? null
    setPet(petData)
    setPesoAtual(((pesos as Peso[] | null) ?? [])[0]?.peso_kg ?? null)
    if (petData) {
      setCondicoesSaude(petData.condicoes_saude ?? "")
      setMedicacaoContinua(petData.medicacao_continua ?? "")
      setVetNome(petData.vet_nome ?? "")
      setVetTelefone(petData.vet_telefone ?? "")
      setEmergTelefone(petData.emergencia_24h_telefone ?? "")
      setEmergEndereco(petData.emergencia_24h_endereco ?? "")
    }
    setLoading(false)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!pet) return
    setSalvando(true)
    setSalvo(false)
    await supabase
      .from("pets")
      .update({
        condicoes_saude: condicoesSaude.trim() || null,
        medicacao_continua: medicacaoContinua.trim() || null,
        vet_nome: vetNome.trim() || null,
        vet_telefone: vetTelefone.trim() || null,
        emergencia_24h_telefone: emergTelefone.trim() || null,
        emergencia_24h_endereco: emergEndereco.trim() || null,
      })
      .eq("id", pet.id)
    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  if (loading) {
    return (
      <Layout title="Cartão de emergência">
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      </Layout>
    )
  }
  if (!pet) {
    return (
      <Layout title="Cartão de emergência">
        <p className="text-sm text-muted">Pet não encontrado.</p>
        <Link to="/pets" className="mt-3 inline-block text-sm text-muted underline">
          ‹ Voltar aos pets
        </Link>
      </Layout>
    )
  }

  return (
    <Layout title="Cartão de emergência">
      {/* Cartão, no visual do material impresso do Dr. Eduardo. É esta parte que fica boa ao imprimir. */}
      <div className="rounded-xl border-2 border-gold bg-card px-5 py-6 text-center">
        <Seal size={56} />
        <p className="mt-3 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Primeiros socorros para cães e gatos
        </p>
        <h1 className="mt-1 font-display text-xl font-bold text-ink">Cartão de Emergência do Pet</h1>

        <div className="mt-5 space-y-2.5 text-left">
          <DadoLinha rotulo="Nome do pet" valor={pet.nome} />
          <DadoLinha rotulo="Espécie e raça" valor={`${especieLabel(pet.especie)}${pet.raca ? ` · ${pet.raca}` : ""}`} />
          <DadoLinha
            rotulo="Peso aproximado · Idade"
            valor={`${pesoAtual ? `${pesoAtual.toFixed(1)} kg` : "não registrado"}${pet.nascimento ? ` · ${idade(pet.nascimento)}` : ""}`}
          />
          <DadoLinha rotulo="Alergias conhecidas" valor={pet.alergias || "nenhuma registrada"} />
          <DadoLinha rotulo="Condições de saúde pré-existentes" valor={condicoesSaude || "não informado"} />
          <DadoLinha rotulo="Medicação de uso contínuo" valor={medicacaoContinua || "não informado"} />
        </div>

        <div className="mt-5 border-t border-gold pt-5 text-left">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
            Em caso de emergência, ligue antes de sair de casa
          </p>
          <div className="mt-3 space-y-2.5">
            <DadoLinha rotulo="Veterinário de confiança" valor={vetNome && vetTelefone ? `${vetNome} · ${vetTelefone}` : vetNome || vetTelefone || "não informado"} />
            <DadoLinha rotulo="Atendimento 24h (telefone)" valor={emergTelefone || "não informado"} />
            <DadoLinha rotulo="Endereço do atendimento 24h" valor={emergEndereco || "não informado"} />
          </div>
        </div>

        <div className="mt-5 border-t border-gold pt-5 text-left">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
            Nos primeiros segundos
          </p>
          <ol className="mt-2 space-y-1.5 text-sm text-ink">
            <li>1. Mantenha a calma: o pet sente a sua tensão.</li>
            <li>2. Ligue ao veterinário enquanto presta o socorro.</li>
            <li>3. Nunca dê remédio humano por conta própria.</li>
          </ol>
        </div>

        <div className="mt-6 border-t border-gold pt-4">
          <p className="font-display text-sm font-bold text-ink">Dr. Eduardo Sebastião</p>
          <p className="text-xs italic text-muted">Médico Veterinário · CRMV-MT 6412</p>
          <p className="mx-auto mt-2 max-w-xs text-[11px] text-muted">
            Material educativo de primeiros socorros até chegar ao veterinário. Não substitui
            consulta, diagnóstico ou tratamento profissional.
          </p>
        </div>
      </div>

      {/* Edição dos dados que ainda faltam. Some da versão impressa. */}
      <div className="mt-8 print:hidden">
        <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
          Preencher / editar
        </p>
        <p className="mt-1 text-xs text-muted">
          Nome, espécie, raça, alergias e peso vêm do perfil do pet. Complete o resto aqui.
        </p>
        <form onSubmit={salvar} className="mt-3 space-y-4">
          <Field label="Condições de saúde pré-existentes">
            <Textarea
              value={condicoesSaude}
              onChange={(e) => setCondicoesSaude(e.target.value)}
              placeholder="Ex.: cardiopatia, epilepsia…"
            />
          </Field>
          <Field label="Medicação de uso contínuo">
            <Textarea
              value={medicacaoContinua}
              onChange={(e) => setMedicacaoContinua(e.target.value)}
              placeholder="Ex.: nome do remédio e horário"
            />
          </Field>
          <div className="flex gap-2">
            <div className="flex-1">
              <Field label="Veterinário de confiança">
                <Input value={vetNome} onChange={(e) => setVetNome(e.target.value)} placeholder="Nome" />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Telefone">
                <Input value={vetTelefone} onChange={(e) => setVetTelefone(e.target.value)} placeholder="(00) 00000-0000" />
              </Field>
            </div>
          </div>
          <Field label="Atendimento 24h, telefone">
            <Input value={emergTelefone} onChange={(e) => setEmergTelefone(e.target.value)} placeholder="(00) 00000-0000" />
          </Field>
          <Field label="Endereço do atendimento 24h">
            <Input value={emergEndereco} onChange={(e) => setEmergEndereco(e.target.value)} placeholder="Rua, número, bairro" />
          </Field>

          {salvo && (
            <p className="rounded-lg bg-success/15 px-3 py-2 text-sm text-success">Cartão salvo.</p>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => window.print()}>
              🖨️ Imprimir
            </Button>
            <Button type="submit" className="flex-1" loading={salvando}>
              Salvar
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-6 print:hidden">
        <button onClick={() => navigate(-1)} className="text-sm text-muted underline">
          ‹ Voltar
        </button>
      </div>
    </Layout>
  )
}

function DadoLinha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="font-display text-[10px] font-semibold uppercase tracking-wider text-muted">
        {rotulo}
      </p>
      <p className="text-sm text-ink">{valor}</p>
    </div>
  )
}

function especieLabel(e: Pet["especie"]) {
  if (e === "cao") return "Cão"
  if (e === "gato") return "Gato"
  if (e === "outro") return "Outro"
  return "Pet"
}
