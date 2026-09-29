import { requireAdmin } from "@/lib/dal"
import { createAdminClient } from "@/lib/supabase/admin"
import { vaultConfigurado } from "@/lib/crypto/vault"
import { NovaSenhaForm } from "./NovaSenhaForm"
import { SenhaItem } from "./SenhaItem"
import type { SenhaAcesso } from "@/lib/types"

export default async function SenhasPage() {
  await requireAdmin()

  const admin = createAdminClient()
  const { data } = await admin
    .from("senhas_acesso")
    .select("id, titulo, usuario, url, notas, criado_por, created_at, updated_at")
    .order("titulo", { ascending: true })

  const senhas = (data ?? []) as SenhaAcesso[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white">Senhas de acesso</h1>
        <p className="text-orth-muted text-sm mt-1">
          Cofre interno pra guardar os logins das contas da ORTH (redes sociais, painéis, ferramentas).
          Visível só pra administração. As senhas ficam criptografadas no banco.
        </p>
      </div>

      {!vaultConfigurado() && (
        <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          O cofre ainda não foi configurado (falta a variável VAULT_ENCRYPTION_KEY na Vercel). Você
          pode ver os títulos já cadastrados, mas não vai conseguir criar ou revelar senhas novas até
          isso ser configurado.
        </p>
      )}

      <NovaSenhaForm />

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
        {senhas.map((s) => (
          <SenhaItem key={s.id} senha={s} />
        ))}
        {senhas.length === 0 && (
          <p className="py-4 text-center text-orth-muted text-sm">Nenhuma senha cadastrada ainda.</p>
        )}
      </div>
    </div>
  )
}
