import { useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { Layout } from "../components/Layout"
import { Button, Card, SectionTitle } from "../components/ui"

export default function Account() {
  const { user, signOut } = useAuth()
  const [excluindo, setExcluindo] = useState(false)

  async function excluirConta() {
    const txt = prompt(
      'Isto apaga sua conta e TODOS os dados dos seus pets, para sempre.\n\nPara confirmar, digite: EXCLUIR',
    )
    if (txt !== "EXCLUIR") return
    setExcluindo(true)
    try {
      const { error } = await supabase.functions.invoke("delete-account")
      if (error) throw error
      await signOut()
    } catch {
      alert("Não foi possível excluir agora. Tente novamente ou fale com o suporte.")
      setExcluindo(false)
    }
  }

  return (
    <Layout title="Minha conta">
      <SectionTitle>Conta</SectionTitle>
      <Card>
        <p className="text-xs uppercase tracking-wide text-muted">E-mail</p>
        <p className="font-medium text-ink">{user?.email}</p>
      </Card>

      <div className="mt-4 space-y-2">
        <Button variant="ghost" block onClick={() => void signOut()}>
          Sair
        </Button>
      </div>

      <div className="mt-8">
        <SectionTitle>Privacidade</SectionTitle>
        <Card>
          <p className="text-sm text-muted">
            Seus dados são tratados conforme a nossa{" "}
            <Link to="/privacidade" className="text-ink underline">
              Política de Privacidade
            </Link>
            . Você pode apagar sua conta a qualquer momento.
          </p>
        </Card>
      </div>

      <div className="mt-8 border-t border-line pt-5">
        <button
          onClick={excluirConta}
          disabled={excluindo}
          className="text-sm text-danger underline disabled:opacity-50"
        >
          {excluindo ? "Excluindo…" : "Excluir minha conta e meus dados"}
        </button>
        <p className="mt-1 text-xs text-muted">
          Remove permanentemente sua conta, pets, vacinas, pesos e histórico.
        </p>
      </div>

      <footer className="mt-10 border-t border-gold pt-5 text-center">
        <p className="font-display text-[10px] uppercase tracking-[0.14em] text-muted">
          Pet Saudável · Dr. Eduardo Sebastião
        </p>
        <p className="mt-1 text-xs italic text-muted">CRMV-MT · O app organiza e educa, não substitui o veterinário.</p>
      </footer>
    </Layout>
  )
}
