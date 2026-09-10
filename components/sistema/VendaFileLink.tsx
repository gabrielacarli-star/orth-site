"use client"

import { useState } from "react"
import { gerarUrlArquivo } from "@/lib/actions/vendas"

export function VendaFileLink({
  bucket,
  path,
  label,
}: {
  bucket: "comprovantes" | "contratos"
  path: string | null
  label: string
}) {
  const [loading, setLoading] = useState(false)

  if (!path) return <span className="text-orth-muted text-xs">{label}: —</span>

  async function abrir() {
    setLoading(true)
    try {
      const url = await gerarUrlArquivo(bucket, path!)
      window.open(url, "_blank", "noopener,noreferrer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={abrir}
      disabled={loading}
      className="text-xs text-orth-sky hover:text-white underline underline-offset-2 disabled:opacity-50"
    >
      {loading ? "abrindo..." : label}
    </button>
  )
}
