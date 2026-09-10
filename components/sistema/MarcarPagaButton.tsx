"use client"

import { useTransition } from "react"
import { marcarComoPaga } from "@/lib/actions/vendas"

export function MarcarPagaButton({ vendaId }: { vendaId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => marcarComoPaga(vendaId))}
      disabled={pending}
      className="text-xs rounded-full px-2.5 py-1 bg-orth-electric/20 text-orth-sky hover:bg-orth-electric/30 transition-colors disabled:opacity-50"
    >
      {pending ? "marcando..." : "Marcar como paga"}
    </button>
  )
}
