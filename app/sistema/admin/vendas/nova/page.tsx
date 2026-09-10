import { createClient } from "@/lib/supabase/server"
import { NovaVendaAdminForm } from "./NovaVendaAdminForm"

export default async function NovaVendaAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("vendedores")
    .select("id, ativo, perfis(nome)")
    .eq("ativo", true)
    .order("created_at", { ascending: true })

  const vendedores = (data ?? []).map((v) => ({
    id: v.id,
    nome: (v.perfis as unknown as { nome: string } | null)?.nome ?? "—",
  }))

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl text-white">Registrar venda</h1>
        <p className="text-orth-muted text-sm mt-1">
          Registre em nome de qualquer vendedor(a) ativo — inclusive você mesma.
        </p>
      </div>
      <NovaVendaAdminForm vendedores={vendedores} />
    </div>
  )
}
