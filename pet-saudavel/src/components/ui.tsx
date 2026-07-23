import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"

/* Selo circular "ES" da marca — usado no cabeçalho e telas de boas-vindas. */
export function Seal({ size = 64 }: { size?: number }) {
  return (
    <div
      className="relative mx-auto flex items-center justify-center rounded-full border-2 border-gold"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute rounded-full border border-gold"
        style={{ inset: size * 0.06 }}
      />
      <span
        className="font-display font-bold tracking-wide text-ink"
        style={{ fontSize: size * 0.36 }}
      >
        ES
      </span>
    </div>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "gold"
  block?: boolean
  loading?: boolean
}

export function Button({
  variant = "primary",
  block,
  loading,
  className = "",
  children,
  disabled,
  ...rest
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-display text-sm font-semibold tracking-wide transition disabled:opacity-50 disabled:cursor-not-allowed"
  const variants: Record<string, string> = {
    primary: "bg-dark text-parchment hover:bg-ink border border-dark",
    gold: "bg-gold text-dark hover:brightness-95 border border-gold",
    ghost: "bg-transparent text-ink border border-gold hover:bg-card",
    danger: "bg-danger text-white hover:brightness-95 border border-danger",
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${block ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size={16} /> : children}
    </button>
  )
}

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-gold border-t-transparent"
      style={{ width: size, height: size }}
      aria-label="Carregando"
    />
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

const inputCls =
  "w-full rounded-lg border border-line bg-white/60 px-3 py-2.5 text-ink placeholder:text-muted/60 focus:border-gold"

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-20 ${props.className ?? ""}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ""}`} />
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-card p-4 ${className}`}>{children}</div>
  )
}

export function SectionTitle({ num, children }: { num?: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline gap-2 border-b border-gold pb-2">
      {num && <span className="font-display text-xs font-bold text-gold">{num}</span>}
      <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
        {children}
      </span>
    </div>
  )
}

export function EmptyState({
  icon,
  titulo,
  texto,
  children,
}: {
  icon: string
  titulo: string
  texto?: string
  children?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-dashed border-gold/60 bg-card/50 px-6 py-10 text-center">
      <div className="mb-3 text-4xl">{icon}</div>
      <p className="font-display text-base font-semibold text-ink">{titulo}</p>
      {texto && <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{texto}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode
  tone?: "muted" | "danger" | "success" | "gold"
}) {
  const tones: Record<string, string> = {
    muted: "bg-line/60 text-muted",
    danger: "bg-danger-soft text-danger",
    success: "bg-success/15 text-success",
    gold: "bg-gold/20 text-muted",
  }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}
