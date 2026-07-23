import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { Layout } from "../components/Layout"
import { Button, Field, Input, Select, Spinner, Textarea } from "../components/ui"
import type { Especie, Pet } from "../lib/types"

export default function PetForm() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [carregando, setCarregando] = useState(editando)
  const [salvando, setSalvando] = useState(false)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [nome, setNome] = useState("")
  const [especie, setEspecie] = useState<Especie>("cao")
  const [raca, setRaca] = useState("")
  const [nascimento, setNascimento] = useState("")
  const [alergias, setAlergias] = useState("")
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          const p = data as Pet
          setNome(p.nome)
          setEspecie((p.especie ?? "cao") as Especie)
          setRaca(p.raca ?? "")
          setNascimento(p.nascimento ?? "")
          setAlergias(p.alergias ?? "")
          setFotoUrl(p.foto_url)
        }
        setCarregando(false)
      })
  }, [id])

  async function enviarFoto(file: File) {
    if (!user) return
    setEnviandoFoto(true)
    setErro(null)
    try {
      const ext = file.name.split(".").pop() ?? "jpg"
      const caminho = `${user.id}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage
        .from("pet-fotos")
        .upload(caminho, file, { upsert: true, contentType: file.type })
      if (error) throw error
      const { data } = supabase.storage.from("pet-fotos").getPublicUrl(caminho)
      setFotoUrl(data.publicUrl)
    } catch {
      setErro("Não foi possível enviar a foto. Você pode salvar sem ela e tentar depois.")
    } finally {
      setEnviandoFoto(false)
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSalvando(true)
    setErro(null)
    const payload = {
      nome: nome.trim(),
      especie,
      raca: raca.trim() || null,
      nascimento: nascimento || null,
      alergias: alergias.trim() || null,
      foto_url: fotoUrl,
    }
    try {
      if (editando) {
        const { error } = await supabase.from("pets").update(payload).eq("id", id!)
        if (error) throw error
        navigate(`/pets/${id}`)
      } else {
        const { data, error } = await supabase
          .from("pets")
          .insert({ ...payload, user_id: user.id })
          .select("id")
          .single()
        if (error) throw error
        navigate(`/pets/${data!.id}`)
      }
    } catch {
      setErro("Não foi possível salvar. Verifique a conexão e tente de novo.")
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <Layout title="Pet">
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={editando ? "Editar pet" : "Novo pet"}>
      <form onSubmit={salvar} className="space-y-4">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-parchment"
          >
            {enviandoFoto ? (
              <Spinner size={24} />
            ) : fotoUrl ? (
              <img src={fotoUrl} alt="Foto do pet" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl">📷</span>
            )}
          </button>
          <span className="text-xs text-muted">Toque para adicionar uma foto</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void enviarFoto(f)
            }}
          />
        </div>

        <Field label="Nome">
          <Input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Rex" />
        </Field>

        <Field label="Espécie">
          <Select value={especie} onChange={(e) => setEspecie(e.target.value as Especie)}>
            <option value="cao">Cão</option>
            <option value="gato">Gato</option>
            <option value="outro">Outro</option>
          </Select>
        </Field>

        <Field label="Raça">
          <Input value={raca} onChange={(e) => setRaca(e.target.value)} placeholder="Ex.: SRD, Poodle…" />
        </Field>

        <Field label="Data de nascimento">
          <Input type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
        </Field>

        <Field label="Alergias" hint="Opcional. Anote o que o veterinário já identificou.">
          <Textarea
            value={alergias}
            onChange={(e) => setAlergias(e.target.value)}
            placeholder="Ex.: alergia a frango…"
          />
        </Field>

        {erro && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{erro}</p>}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" loading={salvando} className="flex-1">
            Salvar
          </Button>
        </div>
      </form>
    </Layout>
  )
}
