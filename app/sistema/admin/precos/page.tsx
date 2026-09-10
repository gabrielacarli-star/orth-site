import { createClient } from "@/lib/supabase/server"
import { ComissaoPadraoForm } from "./ComissaoPadraoForm"
import { PrecosManager } from "./PrecosManager"

export default async function AdminPrecosPage() {
  const supabase = await createClient()

  const [{ data: config }, { data: precos }] = await Promise.all([
    supabase.from("config").select("comissao_percentual_padrao").single(),
    supabase.from("tabela_precos").select("*").order("ordem", { ascending: true }),
  ])

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-white">Preços & Comissão</h1>

      <section className="space-y-3">
        <h2 className="text-orth-muted text-sm uppercase tracking-wide">Comissão</h2>
        <ComissaoPadraoForm valorAtual={config?.comissao_percentual_padrao ?? 20} />
      </section>

      <section className="space-y-3">
        <h2 className="text-orth-muted text-sm uppercase tracking-wide">
          Tabela de preços (visível para os vendedores)
        </h2>
        <PrecosManager precos={precos ?? []} />
      </section>
    </div>
  )
}
