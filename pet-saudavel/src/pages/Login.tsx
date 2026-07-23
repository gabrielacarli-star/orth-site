import { useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Button, Field, Input, Seal } from "../components/ui"

type Modo = "login" | "cadastro"

export default function Login() {
  const [modo, setModo] = useState<Modo>("login")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [aceite, setAceite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setAviso(null)

    if (modo === "cadastro" && !aceite) {
      setErro("É preciso aceitar a Política de Privacidade para criar a conta.")
      return
    }
    setLoading(true)
    try {
      if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password: senha })
        if (error) throw error
        // Se a confirmação por e-mail estiver ligada, não há sessão ainda.
        if (!data.session) {
          setAviso(
            "Conta criada! Confirme o e-mail que enviamos para entrar. Se não achar, veja o spam.",
          )
        }
      }
    } catch (err) {
      setErro(traduzErro(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-[440px] flex-col justify-center bg-parchment px-6 py-12">
      <div className="text-center">
        <Seal size={72} />
        <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          Dr. Eduardo Sebastião · CRMV-MT
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Pet Saudável</h1>
        <p className="mt-2 italic text-muted">
          Os cuidados do seu pet, organizados e sempre à mão.
        </p>
      </div>

      <form onSubmit={enviar} className="mt-8 space-y-4">
        <Field label="E-mail">
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
          />
        </Field>
        <Field label="Senha" hint={modo === "cadastro" ? "Mínimo de 6 caracteres." : undefined}>
          <Input
            type="password"
            autoComplete={modo === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
          />
        </Field>

        {modo === "cadastro" && (
          <label className="flex items-start gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={aceite}
              onChange={(e) => setAceite(e.target.checked)}
              className="mt-1"
            />
            <span>
              Li e aceito a{" "}
              <Link to="/privacidade" className="text-ink underline">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
        )}

        {erro && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{erro}</p>
        )}
        {aviso && (
          <p className="rounded-lg bg-success/15 px-3 py-2 text-sm text-success">{aviso}</p>
        )}

        <Button type="submit" block loading={loading}>
          {modo === "login" ? "Entrar" : "Criar conta grátis"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {modo === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
        <button
          onClick={() => {
            setModo(modo === "login" ? "cadastro" : "login")
            setErro(null)
            setAviso(null)
          }}
          className="font-semibold text-ink underline"
        >
          {modo === "login" ? "Cadastre-se" : "Entrar"}
        </button>
      </p>
    </div>
  )
}

function traduzErro(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (/Invalid login credentials/i.test(msg)) return "E-mail ou senha incorretos."
  if (/User already registered/i.test(msg)) return "Este e-mail já tem conta. Faça login."
  if (/Password should be at least/i.test(msg)) return "A senha precisa de no mínimo 6 caracteres."
  if (/Email not confirmed/i.test(msg)) return "Confirme seu e-mail antes de entrar."
  if (/rate limit|Too many/i.test(msg)) return "Muitas tentativas. Aguarde um instante."
  return "Não foi possível concluir. Verifique a conexão e tente de novo."
}
