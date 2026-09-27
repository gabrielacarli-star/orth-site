import { requireVendedor } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { StatusClienteSelect } from "@/components/sistema/StatusClienteSelect"
import { PropostaEditor } from "@/components/sistema/PropostaEditor"
import { GoogleNegocioEditor } from "@/components/sistema/GoogleNegocioEditor"
import { NovoClienteForm } from "./NovoClienteForm"
import type { Cliente, GoogleNegocioConexao } from "@/lib/types"

export default async function VendedorClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ google_ok?: string; google_erro?: string }>
}) {
  const perfil = await requireVendedor()
  const supabase = await createClient()
  const { google_ok, google_erro } = await searchParams

  const [{ data }, { data: conexoesData }] = await Promise.all([
    supabase
      .from("clientes")
      .select("*")
      .eq("vendedor_id", perfil.id)
      .order("created_at", { ascending: false }),
    createAdminClient()
      .from("google_negocio_conexoes")
      .select(
        "id, cliente_id, vendedor_id, google_email, location_display_name, descricao_negocio, palavras_chave, ativo, ultimo_post_em, ultimo_erro, created_at"
      )
      .eq("vendedor_id", perfil.id),
  ])

  const clientes = (data ?? []) as Cliente[]
  const conexoesPorCliente = new Map(
    ((conexoesData ?? []) as GoogleNegocioConexao[]).map((c) => [c.cliente_id, c])
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white">Meus Clientes</h1>
        <p className="text-orth-muted text-sm mt-1">
          Cadastre um lead assim que iniciar a conversa — antes mesmo de fechar a venda.
        </p>
      </div>

      {google_ok && (
        <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          Google Meu Negócio conectado com sucesso.
        </p>
      )}
      {google_erro && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {google_erro}
        </p>
      )}

      <NovoClienteForm />

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 divide-y divide-orth-line/10">
        {clientes.map((c) => (
          <div key={c.id} className="py-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-white text-sm font-medium">{c.nome}</p>
              {c.empresa && <p className="text-orth-muted text-xs">{c.empresa}</p>}
              <p className="text-orth-muted text-xs mt-0.5">
                {[c.telefone, c.email].filter(Boolean).join(" · ") || "—"}
              </p>
              {c.notas && <p className="text-orth-muted text-xs mt-0.5">{c.notas}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusClienteSelect clienteId={c.id} status={c.status} />
              <PropostaEditor cliente={c} />
              <GoogleNegocioEditor clienteId={c.id} conexao={conexoesPorCliente.get(c.id) ?? null} />
            </div>
          </div>
        ))}
        {clientes.length === 0 && (
          <p className="py-4 text-center text-orth-muted text-sm">
            Nenhum cliente cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  )
}
