import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sistema de Vendedores — ORTH Digital",
  robots: { index: false, follow: false },
}

export default function SistemaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>
}
