// Utilidades de data — tudo em português do Brasil, sem dependências externas.

const MS_DIA = 1000 * 60 * 60 * 24

/** Data de hoje no fuso local, normalizada para meia-noite (ISO yyyy-mm-dd). */
export function hojeISO(): string {
  const d = new Date()
  return toISO(d)
}

export function toISO(d: Date): string {
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 10)
}

/** Soma dias a uma data ISO e devolve nova data ISO. */
export function somaDias(iso: string, dias: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + dias)
  return toISO(d)
}

export function parseISO(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, day ?? 1)
}

/** Diferença em dias inteiros entre `iso` e hoje (positivo = futuro). */
export function diasAte(iso: string): number {
  const alvo = parseISO(iso).getTime()
  const hoje = parseISO(hojeISO()).getTime()
  return Math.round((alvo - hoje) / MS_DIA)
}

/** Formata ISO → "23/07/2026". */
export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = parseISO(iso)
  return d.toLocaleDateString("pt-BR")
}

/** Rótulo humano relativo: "atrasado 3 dias", "hoje", "em 5 dias". */
export function rotuloPrazo(iso: string): string {
  const d = diasAte(iso)
  if (d < 0) return `atrasado ${Math.abs(d)} ${Math.abs(d) === 1 ? "dia" : "dias"}`
  if (d === 0) return "vence hoje"
  if (d === 1) return "amanhã"
  return `em ${d} dias`
}

/** Idade legível a partir da data de nascimento. */
export function idade(nascimentoISO: string | null): string {
  if (!nascimentoISO) return ""
  const nasc = parseISO(nascimentoISO)
  const hoje = new Date()
  let anos = hoje.getFullYear() - nasc.getFullYear()
  let meses = hoje.getMonth() - nasc.getMonth()
  if (hoje.getDate() < nasc.getDate()) meses--
  if (meses < 0) {
    anos--
    meses += 12
  }
  if (anos <= 0 && meses <= 0) return "recém-nascido"
  if (anos <= 0) return `${meses} ${meses === 1 ? "mês" : "meses"}`
  if (meses <= 0) return `${anos} ${anos === 1 ? "ano" : "anos"}`
  return `${anos} ${anos === 1 ? "ano" : "anos"} e ${meses} ${meses === 1 ? "mês" : "meses"}`
}
