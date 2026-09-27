import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { StatusClienteSelect } from "@/components/sistema/StatusClienteSelect"
import { PropostaEditor } from "@/components/sistema/PropostaEditor"
import { GoogleNegocioEditor } from "@/components/sistema/GoogleNegocioEditor"
import { NovoClienteAdminForm } from "./NovoClienteAdminForm"
import type { Cliente, GoogleNegocioConexao } from "@/lib/types"

interface ClienteComVendedor extends Cliente {
  perfis: { nome: string } | null
}

interface Grupo {
  vendedorId: string
  nome: string
  clientes: ClienteComVendedor[]
}

export default async function AdminClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ google_ok?: string; google_erro?: string }>
}) {
  const supabase = await createClient()
  const { google_ok, google_erro } = await searchParams

  const [{ data: clientesData }, { data: vendedoresData }, { data: conexoesData }] = await Promise.all([
    supabase
      .from("clientes")
      .select("*, perfis(nome)")
      .order("created_at", { ascending: false }),
    supabase
      .from("vendedores")
      .select("id, perfis(nome)")
      .eq("ativo", true)
      .order("created_at", { ascending: true }),
    createAdminClient()
      .from("google_negocio_conexoes")
      .select(
        "id, cliente_id, vendedor_id, google_email, location_display_name, descricao_negocio, palavras_chave, ativo, ultimo_post_em, ultimo_erro, created_at"
      ),
  ])

  const clientes = (clientesData ?? []) as unknown as ClienteComVendedor[]
  const conexoesPorCliente = new Map(
    ((conexoesData ?? []) as GoogleNegocioConexao[]).map((c) => [c.cliente_id, c])
  )
  const vendedores = (vendedoresData ?? []).map((v) => ({
    id: v.id,
    nome: (v.perfis as unknown as { nome: string } | null)?.nome ?? "—",
  }))

  const porVendedor = new Map<string, Grupo>()
  for (const c of clientes) {
    const grupo = porVendedor.get(c.vendedor_id) ?? {
      vendedorId: c.vendedor_id,
      nome: c.perfis?.nome ?? "—",
      clientes: [],
    }
    grupo.clientes.push(c)
    porVendedor.set(c.vendedor_id, grupo)
  }
  const grupos = [...porVendedor.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Clientes</h1>

      {google_ok && (
        <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          Google Meu Negócio conectado com sucesso.
        </p>
      )}
      {google_erro && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {google_erro}
        </p>
      )}

      <NovoClienteAdminForm vendedores={vendedores} />

      {grupos.length === 0 && (
        <p className="py-4 text-center text-orth-muted text-sm rounded-xl border border-orth-line/10 bg-orth-navy/40">
          Nenhum cliente cadastrado ainda.
        </p>
      )}

      {grupos.map((grupo) => (
        <section key={grupo.vendedorId} className="space-y-3">
          <h2 className="text-white font-display text-lg flex items-baseline gap-2">
            {grupo.nome}
            <span className="text-orth-muted text-sm font-sans">
              {grupo.clientes.length} {grupo.clientes.length === 1 ? "lead" : "leads"}
            </span>
          </h2>

          <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
            {grupo.clientes.map((c) => (
              <div key={c.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-medium">{c.nome}</p>
                  {c.empresa && <p className="text-orth-muted text-xs">{c.empresa}</p>}
                  <p className="text-orth-muted text-xs mt-0.5">
                    {[c.telefone, c.email].filter(Boolean).join(" · ") || "—"}
                  </p>
                  {c.notas && <p className="text-orth-muted text-xs mt-0.5">{c.notas}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusClienteSelect clienteId={c.id} status={c.status} />
                  <PropostaEditor cliente={c} />
                  <GoogleNegocioEditor clienteId={c.id} conexao={conexoesPorCliente.get(c.id) ?? null} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
