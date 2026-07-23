import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Layout } from "../components/Layout"
import { Button, Card, EmptyState, Field, Input, Spinner } from "../components/ui"
import type { Compra, Produto } from "../lib/types"

export default function Library() {
  const [loading, setLoading] = useState(true)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [meus, setMeus] = useState<Set<string>>(new Set())
  const [abrindo, setAbrindo] = useState<string | null>(null)
  const [claimOpen, setClaimOpen] = useState(false)

  useEffect(() => {
    void carregar()
  }, [])

  async function carregar() {
    setLoading(true)
    const [{ data: prods }, { data: compras }] = await Promise.all([
      supabase.from("produtos").select("*").eq("ativo", true),
      supabase.from("compras").select("*").eq("status", "ativo"),
    ])
    setProdutos((prods ?? []) as Produto[])
    const owned = new Set((compras as Compra[] | null)?.map((c) => c.hotmart_product_id) ?? [])
    setMeus(owned)
    setLoading(false)
  }

  async function abrir(p: Produto) {
    setAbrindo(p.id)
    try {
      // Edge Function gera um link temporário (expira em minutos) só para quem comprou.
      const { data, error } = await supabase.functions.invoke<{ url: string }>("ebook-url", {
        body: { produto_id: p.id },
      })
      if (error || !data?.url) throw error ?? new Error("sem url")
      window.open(data.url, "_blank", "noopener")
    } catch {
      alert("Não foi possível abrir agora. Tente novamente em instantes.")
    } finally {
      setAbrindo(null)
    }
  }

  return (
    <Layout title="Biblioteca">
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      ) : produtos.length === 0 ? (
        <EmptyState icon="📖" titulo="Em breve" texto="Os e-books do Dr. Eduardo aparecerão aqui." />
      ) : (
        <>
          <div className="space-y-3">
            {produtos.map((p) => {
              const tem = p.hotmart_product_id ? meus.has(p.hotmart_product_id) : false
              return (
                <Card key={p.id} className="flex gap-3">
                  <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md border border-line bg-parchment">
                    {p.capa_url ? (
                      <img src={p.capa_url} alt={p.titulo} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">📕</div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-display font-semibold leading-tight text-ink">{p.titulo}</p>
                    {p.descricao && (
                      <p className="mt-1 line-clamp-3 text-xs text-muted">{p.descricao}</p>
                    )}
                    <div className="mt-auto pt-2">
                      {tem ? (
                        <Button variant="gold" onClick={() => abrir(p)} loading={abrindo === p.id}>
                          📖 Ler agora
                        </Button>
                      ) : p.link_compra ? (
                        <a href={p.link_compra} target="_blank" rel="noopener noreferrer">
                          <Button>Comprar</Button>
                        </a>
                      ) : (
                        <Button disabled>Indisponível</Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 text-center">
            {!claimOpen ? (
              <button onClick={() => setClaimOpen(true)} className="text-sm text-muted underline">
                Já comprei e não apareceu
              </button>
            ) : (
              <ClaimForm
                onDone={() => {
                  setClaimOpen(false)
                  void carregar()
                }}
                onCancel={() => setClaimOpen(false)}
              />
            )}
          </div>
        </>
      )}
    </Layout>
  )
}

function ClaimForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    setMsg(null)
    try {
      const { data, error } = await supabase.functions.invoke<{ vinculadas: number }>(
        "claim-purchase",
        { body: { email: email.trim().toLowerCase() } },
      )
      if (error) throw error
      const n = data?.vinculadas ?? 0
      if (n > 0) {
        setMsg(`Pronto! ${n} compra(s) liberada(s). Já pode ler.`)
        setTimeout(onDone, 1500)
      } else {
        setErro("Nenhuma compra encontrada para esse e-mail. Confira se digitou o mesmo do checkout.")
      }
    } catch {
      setErro("Não foi possível verificar agora. Tente novamente em instantes.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-2 text-left">
      <form onSubmit={enviar} className="space-y-3">
        <Field label="E-mail usado na compra" hint="Digite o e-mail que você usou no checkout da Hotmart.">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
          />
        </Field>
        {erro && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{erro}</p>}
        {msg && <p className="rounded-lg bg-success/15 px-3 py-2 text-sm text-success">{msg}</p>}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" loading={loading}>
            Liberar acesso
          </Button>
        </div>
      </form>
    </Card>
  )
}
