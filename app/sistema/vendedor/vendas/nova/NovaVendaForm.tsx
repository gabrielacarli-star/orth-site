"use client"

import { useActionState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { registrarVenda, type VendaFormState } from "@/lib/actions/vendas"

const initialState: VendaFormState = {}
const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"
const fileClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white text-sm file:mr-3 file:rounded-md file:border-0 file:bg-orth-electric file:text-white file:px-3 file:py-1.5 file:text-xs file:cursor-pointer"

export function NovaVendaForm() {
  const [state, formAction, pending] = useActionState(registrarVenda, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      router.push("/sistema/vendedor/vendas")
    }
  }, [state?.success, router])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-orth-line/10 bg-orth-navy/40 p-6"
    >
      <div>
        <label className="block text-sm text-orth-muted mb-1.5">Nome do cliente</label>
        <input name="cliente_nome" required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-orth-muted mb-1.5">Serviço vendido</label>
        <input name="servico" placeholder="ex: Criação de site" required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-orth-muted mb-1.5">Valor da venda (R$)</label>
        <input name="valor_venda" type="number" step="0.01" min="0.01" required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-orth-muted mb-1.5">Data da venda</label>
        <input
          name="data_venda"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm text-orth-muted mb-1.5">Observações (opcional)</label>
        <textarea name="observacoes" rows={2} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-orth-muted mb-1.5">
          Comprovante de pagamento do cliente
        </label>
        <input name="comprovante" type="file" accept="image/*,application/pdf" required className={fileClass} />
      </div>

      <div>
        <label className="block text-sm text-orth-muted mb-1.5">Contrato assinado</label>
        <input name="contrato" type="file" accept="image/*,application/pdf" required className={fileClass} />
      </div>

      {state?.error && (
        <p className="sm:col-span-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Registrar venda"}
      </button>
    </form>
  )
}
