import { createClient } from "@/lib/supabase/server"
import type { TabelaPreco } from "@/lib/types"

export default async function VendedorPrecosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("tabela_precos")
    .select("*")
    .order("ordem", { ascending: true })

  const precos = (data ?? []) as TabelaPreco[]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl text-white">Tabela de Preços</h1>
        <p className="text-orth-muted text-sm mt-1">
          Valores oficiais da ORTH Digital para uso em propostas comerciais.
        </p>
      </div>

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 divide-y divide-orth-line/10">
        {precos.map((p) => (
          <div key={p.id} className="p-5">
            <p className="text-white font-medium">{p.servico}</p>
            <p className="text-orth-sky text-lg font-display mt-0.5">{p.valor_descricao}</p>
            {p.condicao_pagamento && (
              <p className="text-orth-muted text-sm mt-1">{p.condicao_pagamento}</p>
            )}
          </div>
        ))}
        {precos.length === 0 && (
          <p className="p-5 text-center text-orth-muted text-sm">
            Nenhum item cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  )
}
