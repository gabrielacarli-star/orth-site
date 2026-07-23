import type { Peso } from "../lib/types"
import { formatarData, parseISO } from "../lib/dates"

// Gráfico de linha simples em SVG — sem bibliotecas, leve e offline.
export function WeightChart({ pesos }: { pesos: Peso[] }) {
  const dados = [...pesos].sort((a, b) => a.data.localeCompare(b.data))
  if (dados.length < 2) return null

  const W = 320
  const H = 160
  const P = 28 // padding interno

  const valores = dados.map((d) => d.peso_kg)
  const tempos = dados.map((d) => parseISO(d.data).getTime())
  const minV = Math.min(...valores)
  const maxV = Math.max(...valores)
  const spanV = maxV - minV || 1
  const minT = Math.min(...tempos)
  const maxT = Math.max(...tempos)
  const spanT = maxT - minT || 1

  const x = (t: number) => P + ((t - minT) / spanT) * (W - P * 2)
  const y = (v: number) => H - P - ((v - minV) / spanV) * (H - P * 2)

  const pontos = dados.map((d) => ({
    cx: x(parseISO(d.data).getTime()),
    cy: y(d.peso_kg),
    v: d.peso_kg,
  }))
  const path = pontos.map((p, i) => `${i === 0 ? "M" : "L"} ${p.cx} ${p.cy}`).join(" ")

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gráfico de peso">
        {/* linhas de grade horizontais */}
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={P}
            x2={W - P}
            y1={P + f * (H - P * 2)}
            y2={P + f * (H - P * 2)}
            stroke="#E3D7BE"
            strokeWidth="1"
          />
        ))}
        {/* rótulos min/max */}
        <text x="2" y={y(maxV) + 4} fontSize="9" fill="#6F5B3E">
          {maxV.toFixed(1)}
        </text>
        <text x="2" y={y(minV) + 4} fontSize="9" fill="#6F5B3E">
          {minV.toFixed(1)}
        </text>
        {/* linha */}
        <path d={path} fill="none" stroke="#B2925A" strokeWidth="2" />
        {/* pontos */}
        {pontos.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="3.5" fill="#241C14" />
        ))}
      </svg>
      <div className="flex justify-between px-2 text-[10px] text-muted">
        <span>{formatarData(dados[0].data)}</span>
        <span>{formatarData(dados[dados.length - 1].data)}</span>
      </div>
    </div>
  )
}
