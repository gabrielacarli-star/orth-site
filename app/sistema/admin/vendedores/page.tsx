import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { CriarVendedorForm } from "./CriarVendedorForm"
import { VendedorRow } from "./VendedorRow"
import type { VendedorComPerfil } from "@/lib/types"

export default async function VendedoresPage() {
  const supabase = await createClient()
  const admin = createAdminClient()

  const [{ data: vendedores }, { data: config }, { data: usersData }] = await Promise.all([
    supabase
      .from("vendedores")
      .select("*, perfis(nome, role)")
      .order("created_at", { ascending: false }),
    supabase.from("config").select("comissao_percentual_padrao").single(),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ])

  const emailPorId = new Map(usersData?.users.map((u) => [u.id, u.email]))
  const lista: VendedorComPerfil[] = (vendedores ?? []).map((v) => ({
    ...v,
    email: emailPorId.get(v.id) ?? undefined,
  }))

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-white">Vendedores</h1>

      <CriarVendedorForm comissaoPadrao={config?.comissao_percentual_padrao ?? 20} />

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-left text-orth-muted text-xs uppercase tracking-wide">
              <th className="pb-3 font-medium">Nome</th>
              <th className="pb-3 font-medium">Telefone</th>
              <th className="pb-3 font-medium">CPF/CNPJ</th>
              <th className="pb-3 font-medium">Comissão</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((v) => (
              <VendedorRow key={v.id} vendedor={v} />
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-orth-muted text-sm">
                  Nenhum vendedor cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
