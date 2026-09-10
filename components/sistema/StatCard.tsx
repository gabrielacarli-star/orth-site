export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5">
      <p className="text-orth-muted text-sm">{label}</p>
      <p className="text-white text-2xl font-display mt-1">{value}</p>
      {hint && <p className="text-orth-muted text-xs mt-1">{hint}</p>}
    </div>
  )
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
