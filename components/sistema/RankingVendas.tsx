import { formatBRL } from "@/components/sistema/StatCard"

export interface RankingItem {
  vendedorId: string
  nome: string
  totalVendido: number
  comissaoGerada: number
  qtdVendas: number
}

const MEDALHAS = ["🥇", "🥈", "🥉"]

export function RankingVendas({ ranking }: { ranking: RankingItem[] }) {
  return (
    <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5">
      <h2 className="text-white font-display text-lg mb-4">Ranking de Vendas do Mês</h2>

      {ranking.length === 0 ? (
        <p className="text-orth-muted text-sm py-2">Nenhuma venda registrada este mês ainda.</p>
      ) : (
        <div className="space-y-1">
          {ranking.map((r, i) => (
            <div
              key={r.vendedorId}
              className="flex items-center justify-between gap-3 py-2.5 border-t border-orth-line/10 first:border-t-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 text-center text-sm shrink-0">
                  {MEDALHAS[i] ?? `${i + 1}º`}
                </span>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{r.nome}</p>
                  <p className="text-orth-muted text-xs">
                    {r.qtdVendas} {r.qtdVendas === 1 ? "venda" : "vendas"}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-white text-sm font-medium">{formatBRL(r.totalVendido)}</p>
                <p className="text-orth-muted text-xs">{formatBRL(r.comissaoGerada)} comissão</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
