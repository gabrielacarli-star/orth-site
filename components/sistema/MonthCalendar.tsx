import Link from "next/link"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
  addMonths,
  subMonths,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Agendamento } from "@/lib/types"

function mesParam(d: Date) {
  return format(d, "yyyy-MM")
}

export function MonthCalendar({
  mes,
  agendamentos,
}: {
  mes: Date
  agendamentos: Agendamento[]
}) {
  const inicioGrade = startOfWeek(startOfMonth(mes), { weekStartsOn: 0 })
  const fimGrade = endOfWeek(endOfMonth(mes), { weekStartsOn: 0 })
  const dias = eachDayOfInterval({ start: inicioGrade, end: fimGrade })

  const porDia = new Map<string, Agendamento[]>()
  for (const a of agendamentos) {
    const chave = format(new Date(a.data_hora), "yyyy-MM-dd")
    porDia.set(chave, [...(porDia.get(chave) ?? []), a])
  }

  const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

  return (
    <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`?mes=${mesParam(subMonths(mes, 1))}`}
          className="text-orth-muted hover:text-white text-sm px-2 py-1"
        >
          ← anterior
        </Link>
        <h2 className="text-white font-display text-lg capitalize">
          {format(mes, "MMMM 'de' yyyy", { locale: ptBR })}
        </h2>
        <Link
          href={`?mes=${mesParam(addMonths(mes, 1))}`}
          className="text-orth-muted hover:text-white text-sm px-2 py-1"
        >
          próximo →
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-orth-muted text-xs mb-1">
        {diasSemana.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dias.map((dia) => {
          const chave = format(dia, "yyyy-MM-dd")
          const eventos = porDia.get(chave) ?? []
          return (
            <div
              key={chave}
              className={cn(
                "min-h-[64px] sm:min-h-[80px] rounded-lg border border-orth-line/10 p-1.5 text-left",
                !isSameMonth(dia, mes) && "opacity-30",
                isToday(dia) && "border-orth-electric/60"
              )}
            >
              <span
                className={cn(
                  "text-xs",
                  isToday(dia) ? "text-orth-sky font-semibold" : "text-orth-muted"
                )}
              >
                {format(dia, "d")}
              </span>
              <div className="mt-1 space-y-0.5">
                {eventos.slice(0, 2).map((e) => (
                  <p
                    key={e.id}
                    className="text-[10px] leading-tight text-white bg-orth-electric/20 rounded px-1 py-0.5 truncate"
                    title={e.titulo}
                  >
                    {format(new Date(e.data_hora), "HH:mm")} {e.titulo}
                  </p>
                ))}
                {eventos.length > 2 && (
                  <p className="text-[10px] text-orth-muted">+{eventos.length - 2}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
