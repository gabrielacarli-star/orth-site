import { redirect } from "next/navigation"
import { adminJaExiste } from "@/lib/actions/setup"
import { SetupForm } from "./SetupForm"
import { Logo } from "@/components/Logo"

export default async function SetupPage() {
  if (await adminJaExiste()) {
    redirect("/sistema/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-orth-dark">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size={40} />
        </div>

        <div className="bg-orth-navy/60 border border-orth-line/10 rounded-2xl p-8">
          <h1 className="font-display text-2xl text-white mb-1 text-center">
            Configuração inicial
          </h1>
          <p className="text-orth-muted text-sm text-center mb-6">
            Crie a conta de administrador(a) do sistema. Esta tela só funciona
            uma vez — depois disso, o acesso é só por login.
          </p>

          <SetupForm />
        </div>
      </div>
    </div>
  )
}
