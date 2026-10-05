"use client"

import { useEffect, useState } from "react"

function diff(alvo: number) {
  const ms = Math.max(0, alvo - Date.now())
  return {
    dias: Math.floor(ms / 86_400_000),
    horas: Math.floor((ms / 3_600_000) % 24),
    min: Math.floor((ms / 60_000) % 60),
    seg: Math.floor((ms / 1000) % 60),
  }
}

export function Countdown({ alvoISO }: { alvoISO: string }) {
  const alvo = new Date(alvoISO).getTime()
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null)

  useEffect(() => {
    const tick = () => setT(diff(alvo))
    const primeiro = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(primeiro)
      clearInterval(id)
    }
  }, [alvo])

  const itens: [string, number | undefined][] = [
    ["dias", t?.dias],
    ["horas", t?.horas],
    ["min", t?.min],
    ["seg", t?.seg],
  ]

  return (
    <div className="flex gap-2 sm:gap-3">
      {itens.map(([rotulo, valor]) => (
        <div
          key={rotulo}
          className="w-16 sm:w-20 rounded-xl bg-[#002776] border border-white/15 py-2 text-center"
        >
          <div className="text-2xl sm:text-3xl font-bold tabular-nums text-[#FFDF00]">
            {valor === undefined ? "--" : String(valor).padStart(2, "0")}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-white/70">{rotulo}</div>
        </div>
      ))}
    </div>
  )
}
