import Link from "next/link"
import { redirect } from "next/navigation"
import { getPerfil } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { Logo } from "@/components/Logo"
import { PropostaForm } from "./PropostaForm"

export default async function PropostaPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect("/sistema/login")

  const voltarHref = perfil.role === "admin" ? "/sistema/admin" : "/sistema/vendedor"

  const supabase = await createClient()
  const { data: precos } = await supabase
    .from("tabela_precos")
    .select("servico")
    .order("ordem", { ascending: true })

  const vendedoresPrecos = (precos ?? []).map((p) => ({
    servico: p.servico as string,
    tipoSugerido: /google ads|meta ads|gestão/i.test(p.servico as string)
      ? ("mensal" as const)
      : ("setup" as const),
  }))

  return (
    <div className="min-h-screen bg-orth-dark">
      <header className="border-b border-orth-line/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-orth-dark/95 backdrop-blur z-10">
        <Logo size={26} />
        <Link href={voltarHref} className="text-orth-muted hover:text-white text-sm transition-colors">
          ← Voltar ao painel
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8">
          <p className="text-orth-sky text-xs font-semibold uppercase tracking-wider mb-2">
            Gerador de Proposta
          </p>
          <h1 className="font-display text-3xl text-white mb-3">Montar proposta comercial</h1>
          <p className="text-orth-muted leading-relaxed">
            Preencha os dados do cliente e os itens de investimento. O sistema monta o PDF pronto,
            no padrão visual da ORTH, com os totais de setup e mensalidade calculados
            automaticamente.
          </p>
        </div>

        <PropostaForm vendedoresPrecos={vendedoresPrecos} />
      </div>
    </div>
  )
}
