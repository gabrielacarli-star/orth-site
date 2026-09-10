import { createClient } from "@/lib/supabase/server"
import { StatusClienteSelect } from "@/components/sistema/StatusClienteSelect"
import { PropostaEditor } from "@/components/sistema/PropostaEditor"
import { NovoClienteAdminForm } from "./NovoClienteAdminForm"
import type { Cliente } from "@/lib/types"

interface ClienteComVendedor extends Cliente {
  perfis: { nome: string } | null
}

export default async function AdminClientesPage() {
  const supabase = await createClient()

  const [{ data: clientesData }, { data: vendedoresData }] = await Promise.all([
    supabase
      .from("clientes")
      .select("*, perfis(nome)")
      .order("created_at", { ascending: false }),
    supabase
      .from("vendedores")
      .select("id, perfis(nome)")
      .eq("ativo", true)
      .order("created_at", { ascending: true }),
  ])

  const clientes = (clientesData ?? []) as unknown as ClienteComVendedor[]
  const vendedores = (vendedoresData ?? []).map((v) => ({
    id: v.id,
    nome: (v.perfis as unknown as { nome: string } | null)?.nome ?? "—",
  }))

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-white">Clientes</h1>

      <NovoClienteAdminForm vendedores={vendedores} />

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
        {clientes.map((c) => (
          <div key={c.id} className="py-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-white text-sm font-medium">{c.nome}</p>
              <p className="text-orth-sky text-xs">{c.perfis?.nome ?? "—"}</p>
              {c.empresa && <p className="text-orth-muted text-xs">{c.empresa}</p>}
              <p className="text-orth-muted text-xs mt-0.5">
                {[c.telefone, c.email].filter(Boolean).join(" · ") || "—"}
              </p>
              {c.notas && <p className="text-orth-muted text-xs mt-0.5">{c.notas}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusClienteSelect clienteId={c.id} status={c.status} />
              <PropostaEditor cliente={c} />
            </div>
          </div>
        ))}
        {clientes.length === 0 && (
          <p className="py-4 text-center text-orth-muted text-sm">
            Nenhum cliente cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  )
}
