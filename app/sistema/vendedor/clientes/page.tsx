import { requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { StatusClienteSelect } from "@/components/sistema/StatusClienteSelect"
import { NovoClienteForm } from "./NovoClienteForm"
import type { Cliente } from "@/lib/types"

export default async function VendedorClientesPage() {
  const perfil = await requireVendedor()
  const supabase = await createClient()

  const { data } = await supabase
    .from("clientes")
    .select("*")
    .eq("vendedor_id", perfil.id)
    .order("created_at", { ascending: false })

  const clientes = (data ?? []) as Cliente[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white">Meus Clientes</h1>
        <p className="text-orth-muted text-sm mt-1">
          Cadastre um lead assim que iniciar a conversa — antes mesmo de fechar a venda.
        </p>
      </div>

      <NovoClienteForm />

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
        {clientes.map((c) => (
          <div key={c.id} className="py-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-white text-sm font-medium">{c.nome}</p>
              {c.empresa && <p className="text-orth-muted text-xs">{c.empresa}</p>}
              <p className="text-orth-muted text-xs mt-0.5">
                {[c.telefone, c.email].filter(Boolean).join(" · ") || "—"}
              </p>
              {c.notas && <p className="text-orth-muted text-xs mt-0.5">{c.notas}</p>}
            </div>
            <StatusClienteSelect clienteId={c.id} status={c.status} />
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
