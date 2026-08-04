import React from "react";
import { CORES } from "../marca/paleta";

type Props = {
  /** 0 = bico fechado, 1 = bico totalmente aberto (usado pra cantar). */
  abertura?: number;
  /** 0 = asas paradas, 1 = asas levantadas. */
  asas?: number;
};

/**
 * Contorno "fofo": um círculo com o perímetro ondulado, feito de arcos
 * quadráticos que saem e voltam.
 *
 * É o truque que faz um pintinho parecer PENUGEM em vez de uma bola lisa
 * amarela. Sem isso ele vira um emoji. Determinístico (mesmo path em todo
 * frame), então não treme entre um frame e outro.
 */
const contornoFofo = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pontas: number,
  bico: number,
) => {
  const ponto = (i: number) => {
    const a = (i / pontas) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  };
  const [x0, y0] = ponto(0);
  let d = `M ${x0.toFixed(1)} ${y0.toFixed(1)}`;
  for (let i = 1; i <= pontas; i++) {
    const a = ((i - 0.5) / pontas) * Math.PI * 2 - Math.PI / 2;
    const ctrlX = cx + Math.cos(a) * (rx + bico);
    const ctrlY = cy + Math.sin(a) * (ry + bico);
    const [x, y] = ponto(i);
    d += ` Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} Z`;
};

const CORPO = contornoFofo(120, 138, 76, 74, 22, 7);

/**
 * Pipo — pintinho amarelo, melhor amigo da Maria.
 *
 * Mesmo acabamento da Maria (ver o comentário longo em Maria.tsx): nenhum
 * contorno preto, gradiente em todas as formas, sombra desfocada e olho em
 * camadas. É essa receita repetida que faz o elenco parecer da mesma mão em
 * vez de três desenhos de origens diferentes.
 */
export const Pipo: React.FC<Props> = ({ abertura = 0, asas = 0 }) => {
  const giroBico = abertura * 20;
  const giroAsa = asas * 26;

  return (
    <svg viewBox="0 0 240 260" width="100%" height="100%">
      <defs>
        <radialGradient id="pg-corpo" cx="34%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#FFEFA8" />
          <stop offset="52%" stopColor={CORES.pipo} />
          <stop offset="100%" stopColor={CORES.pipoEscuro} />
        </radialGradient>
        <linearGradient id="pg-asa" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={CORES.pipo} />
          <stop offset="100%" stopColor="#D98F14" />
        </linearGradient>
        <linearGradient id="pg-bico" x1="20%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#FFC078" />
          <stop offset="55%" stopColor={CORES.bico} />
          <stop offset="100%" stopColor="#E07B22" />
        </linearGradient>
        <radialGradient id="pg-iris" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor={CORES.olhosClaro} />
          <stop offset="52%" stopColor={CORES.olhos} />
          <stop offset="100%" stopColor={CORES.olhosEscuro} />
        </radialGradient>
        <linearGradient id="pg-esclera" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DCD5D0" />
          <stop offset="45%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F6EEE9" />
        </linearGradient>
        <filter id="pg-suave" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id="pg-clip-corpo">
          <path d={CORPO} />
        </clipPath>
      </defs>

      {/* Pezinhos de três dedos */}
      <g fill="none" stroke="#D97B1E" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 96 200 L 96 226 M 82 236 L 96 226 L 110 236 M 96 226 L 96 240" />
        <path d="M 144 200 L 144 226 M 130 236 L 144 226 L 158 236 M 144 226 L 144 240" />
      </g>

      {/* Asa de trás, mais escura — dá profundidade sem custar nada */}
      <g transform={`rotate(${-20 - giroAsa} 186 128)`}>
        <path
          d="M 186 118 C 210 122 222 146 216 170 C 210 190 190 194 182 178 C 176 164 178 136 186 118 Z"
          fill="#D08610"
          stroke="#B0700C"
          strokeWidth={3}
        />
      </g>

      {/* Corpo */}
      <path d={CORPO} fill="url(#pg-corpo)" stroke="#D89416" strokeWidth={3} />
      <g clipPath="url(#pg-clip-corpo)">
        {/* Sombra do lado direito */}
        <ellipse cx={216} cy={158} rx={78} ry={80} fill="#C97F0E" opacity={0.42} filter="url(#pg-suave)" />
        {/* Barriga clara */}
        <ellipse cx={112} cy={176} rx={48} ry={40} fill="#FFF0AE" opacity={0.75} filter="url(#pg-suave)" />
      </g>

      {/* Topete de três penas */}
      <g fill="none" stroke="#E6A61C" strokeWidth={10} strokeLinecap="round">
        <path d="M 120 68 C 114 46 100 38 92 34" />
        <path d="M 120 66 C 120 44 120 34 120 26" />
        <path d="M 120 68 C 126 46 140 38 148 34" />
      </g>

      {/* Asa da frente, com penas desenhadas por dentro. Fica no mesmo grupo
          do transform pra as penas girarem junto quando a asa bate. */}
      <g transform={`rotate(${24 + giroAsa} 56 130)`}>
        <path
          d="M 56 120 C 30 126 18 152 26 176 C 34 196 56 198 64 180 C 70 164 66 138 56 120 Z"
          fill="url(#pg-asa)"
          stroke="#C88A12"
          strokeWidth={3}
        />
        <g fill="none" stroke="#B87C0E" strokeWidth={3} opacity={0.55} strokeLinecap="round">
          <path d="M 46 134 C 34 148 30 164 34 178" />
          <path d="M 56 140 C 46 154 44 168 48 182" />
        </g>
      </g>

      {/* Bico — metade de cima fixa, metade de baixo gira pra abrir */}
      <g stroke="#D2701C" strokeWidth={2.5} strokeLinejoin="round">
        <path d="M 100 148 L 140 148 L 120 164 Z" fill="url(#pg-bico)" />
        <path
          d="M 100 148 L 140 148 L 120 170 Z"
          fill="#E68A2E"
          transform={`rotate(${giroBico} 120 148)`}
        />
      </g>

      {/* Olhos — mesma receita em camadas usada na Maria */}
      {[
        { cx: 92, lado: -1 },
        { cx: 148, lado: 1 },
      ].map(({ cx, lado }) => (
        <g key={cx}>
          <ellipse cx={cx} cy={120} rx={20} ry={22} fill="url(#pg-esclera)" />
          <circle cx={cx + lado * 2} cy={121} r={15} fill="url(#pg-iris)" />
          <path
            d={`M ${cx + lado * 2 - 10} 126 A 11 11 0 0 0 ${cx + lado * 2 + 10} 126`}
            fill={CORES.olhosClaro}
            opacity={0.55}
          />
          <circle
            cx={cx + lado * 2}
            cy={121}
            r={15}
            fill="none"
            stroke={CORES.olhosEscuro}
            strokeWidth={2.5}
            opacity={0.8}
          />
          <circle cx={cx + lado * 2} cy={121} r={7} fill="#241C1A" />
          <circle cx={cx + lado * 2 - 5} cy={115} r={5} fill="#FFFFFF" />
          <circle cx={cx + lado * 2 + 6} cy={128} r={2.6} fill="#FFFFFF" opacity={0.85} />
          {/* Pálpebra + cílio, no tom do próprio bicho e não em preto */}
          <path
            d={`M ${cx - 20} 118 A 20 22 0 0 1 ${cx + 20} 118`}
            fill="none"
            stroke="#B87C0E"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx + lado * 19} 106 C ${cx + lado * 26} 100 ${cx + lado * 30} 97 ${cx + lado * 33} 95`}
            fill="none"
            stroke="#B87C0E"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Bochechas */}
      <ellipse cx={64} cy={150} rx={17} ry={11} fill={CORES.vestidoMeio} opacity={0.5} filter="url(#pg-suave)" />
      <ellipse cx={176} cy={150} rx={17} ry={11} fill={CORES.vestidoMeio} opacity={0.5} filter="url(#pg-suave)" />
    </svg>
  );
};
