import Link from "next/link"
import { redirect } from "next/navigation"
import { getPerfil } from "@/lib/dal"
import { Logo } from "@/components/Logo"
import { AssistenteChat } from "./AssistenteChat"

export default async function AssistentePage() {
  const perfil = await getPerfil()
  if (!perfil) redirect("/sistema/login")

  const voltarHref = perfil.role === "admin" ? "/sistema/admin" : "/sistema/vendedor"

  return (
    <div className="min-h-screen bg-orth-dark flex flex-col">
      <header className="border-b border-orth-line/10 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-orth-dark/95 backdrop-blur z-10">
        <Logo size={26} />
        <Link href={voltarHref} className="text-orth-muted hover:text-white text-sm transition-colors">
          ← Voltar ao painel
        </Link>
      </header>

      <div className="max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 flex flex-col min-h-0">
        <div className="mb-6 shrink-0">
          <p className="text-orth-sky text-xs font-semibold uppercase tracking-wider mb-2">
            Assistente de IA
          </p>
          <h1 className="font-display text-3xl text-white mb-3">Tire suas dúvidas sobre a ORTH</h1>
          <p className="text-orth-muted leading-relaxed">
            Pergunte sobre os serviços, como argumentar com um cliente, diferenças entre Google
            Ads e Meta Ads, ou qualquer dúvida do dia a dia de vendas. O assistente não informa
            preços: pra isso, use a Tabela de Preços ou o Gerador de Proposta.
          </p>
        </div>

        <AssistenteChat />
      </div>
    </div>
  )
}
