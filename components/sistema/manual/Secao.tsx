export function Secao({
  id,
  kicker,
  titulo,
  children,
}: {
  id: string
  kicker: string
  titulo: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 py-10 border-t border-orth-line/10 first:border-t-0 first:pt-0">
      <p className="text-orth-sky text-xs font-semibold uppercase tracking-wider mb-2">{kicker}</p>
      <h2 className="font-display text-2xl sm:text-3xl text-white mb-6">{titulo}</h2>
      <div className="space-y-5 text-orth-muted text-[15px] leading-relaxed [&_strong]:text-white [&_strong]:font-medium">
        {children}
      </div>
    </section>
  )
}

export function Card({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5">
      <h3 className="text-white font-medium mb-2">{titulo}</h3>
      <div className="text-orth-muted text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export function Objecao({
  pergunta,
  children,
}: {
  pergunta: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5">
      <p className="text-white font-medium mb-2">
        <span className="text-orth-electric mr-1.5">“</span>
        {pergunta}
        <span className="text-orth-electric ml-1">”</span>
      </p>
      <div className="text-orth-muted text-sm leading-relaxed space-y-2 pl-4 border-l-2 border-orth-electric/30">
        {children}
      </div>
    </div>
  )
}

export function Tabela({
  colunas,
  linhas,
}: {
  colunas: string[]
  linhas: (string | React.ReactNode)[][]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-orth-line/10">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="bg-orth-navy/60">
            {colunas.map((c, i) => (
              <th key={i} className="text-left text-white font-medium px-4 py-3">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i} className="border-t border-orth-line/10 bg-orth-navy/20">
              {linha.map((celula, j) => (
                <td key={j} className="px-4 py-3 text-orth-muted align-top">
                  {celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
