import { NovaVendaForm } from "./NovaVendaForm"

export default function NovaVendaPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl text-white">Registrar venda</h1>
        <p className="text-orth-muted text-sm mt-1">
          Anexe o comprovante de pagamento e o contrato assinado — sua comissão é
          calculada automaticamente.
        </p>
      </div>
      <NovaVendaForm />
    </div>
  )
}
