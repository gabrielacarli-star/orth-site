import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { AdminClientesKanban } from "@/components/sistema/AdminClientesKanban"
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
  for (const v of vendedores) {
    porVendedor.set(v.id, { vendedorId: v.id, nome: v.nome, clientes: [] })
  }
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

      <AdminClientesKanban grupos={grupos} conexoesPorCliente={conexoesPorCliente} />
    </div>
  )
}
