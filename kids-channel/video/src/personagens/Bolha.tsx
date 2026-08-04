import React from "react";
import { CORES } from "../marca/paleta";

type Props = {
  /** Ignorado — Bolha não fala. Existe só pra ter a mesma interface. */
  abertura?: number;
  /** Ignorado — Bolha não tem asas. Existe pra manter a interface única. */
  asas?: number;
};

/**
 * Bolha — peixinho dentro de uma bolha d'água que quica em terra firme.
 *
 * Não fala, só faz sons. É o alívio cômico e o gancho de repetição.
 *
 * O truque visual aqui é a bolha parecer VIDRO: gradiente radial quase
 * transparente, um brilho grande em cima à esquerda, um reflexo fino
 * embaixo à direita e uma borda clara. Bolha sem esses três reflexos vira
 * só um círculo azul.
 */
export const Bolha: React.FC<Props> = () => {
  return (
    <svg viewBox="0 0 240 240" width="100%" height="100%">
      <defs>
        <radialGradient id="bg-bolha" cx="34%" cy="28%" r="76%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.14} />
          <stop offset="55%" stopColor={CORES.bolhaClaro} stopOpacity={0.16} />
          <stop offset="86%" stopColor={CORES.bolha} stopOpacity={0.3} />
          <stop offset="100%" stopColor={CORES.bolha} stopOpacity={0.5} />
        </radialGradient>
        <linearGradient id="bg-peixe" x1="24%" y1="0%" x2="76%" y2="100%">
          <stop offset="0%" stopColor="#FFC470" />
          <stop offset="50%" stopColor="#F79A2E" />
          <stop offset="100%" stopColor="#D9711A" />
        </linearGradient>
        <linearGradient id="bg-nadadeira" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFB05A" />
          <stop offset="100%" stopColor="#D9711A" />
        </linearGradient>
        <radialGradient id="bg-iris" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor={CORES.olhosClaro} />
          <stop offset="52%" stopColor={CORES.olhos} />
          <stop offset="100%" stopColor={CORES.olhosEscuro} />
        </radialGradient>
        <filter id="bg-suave" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Rabo */}
      <path
        d="M 156 120 C 176 100 198 94 208 100 C 200 118 200 126 208 144 C 198 150 176 142 156 122 Z"
        fill="url(#bg-nadadeira)"
        stroke="#C4640F"
        strokeWidth={2.5}
      />

      {/* Nadadeira de cima */}
      <path
        d="M 104 88 C 108 66 122 56 136 60 C 132 74 130 84 130 92 Z"
        fill="url(#bg-nadadeira)"
        stroke="#C4640F"
        strokeWidth={2.5}
      />

      {/* Corpo do peixinho */}
      <ellipse cx={112} cy={122} rx={50} ry={38} fill="url(#bg-peixe)" stroke="#C4640F" strokeWidth={2.5} />
      {/* Listras de peixe-palhaço */}
      <g fill="#FFFFFF" opacity={0.85}>
        <path d="M 92 88 C 84 106 84 140 92 156 C 100 152 104 148 106 144 C 100 132 100 112 106 100 C 104 96 100 92 92 88 Z" />
        <path d="M 138 96 C 146 112 146 134 138 150 C 144 146 150 140 154 132 C 150 122 150 122 154 112 C 150 106 144 100 138 96 Z" />
      </g>
      <ellipse cx={104} cy={106} rx={30} ry={18} fill="#FFD9A0" opacity={0.55} filter="url(#bg-suave)" />

      {/* Nadadeira lateral */}
      <ellipse cx={116} cy={140} rx={20} ry={12} fill="#E88A26" stroke="#C4640F" strokeWidth={2} transform="rotate(16 116 140)" />

      {/* Olho */}
      <ellipse cx={86} cy={110} rx={16} ry={17} fill="#FFFFFF" />
      <circle cx={83} cy={111} r={11.5} fill="url(#bg-iris)" />
      <circle cx={83} cy={111} r={11.5} fill="none" stroke={CORES.olhosEscuro} strokeWidth={2.2} opacity={0.8} />
      <circle cx={83} cy={111} r={5.5} fill="#241C1A" />
      <circle cx={80} cy={106} r={4} fill="#FFFFFF" />
      <circle cx={87} cy={116} r={2} fill="#FFFFFF" opacity={0.85} />
      <path d="M 70 108 A 16 17 0 0 1 102 108" fill="none" stroke="#C4640F" strokeWidth={5} strokeLinecap="round" />

      {/* Boquinha em "o" — a cara de espanto permanente do Bolha */}
      <ellipse cx={66} cy={132} rx={7} ry={8} fill="#B3510B" />

      {/* Bolha d'água, por cima de tudo */}
      <circle cx={120} cy={120} r={110} fill="url(#bg-bolha)" />
      <circle cx={120} cy={120} r={110} fill="none" stroke="#BFE6FA" strokeWidth={5} opacity={0.9} />
      <circle cx={120} cy={120} r={110} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.7} />
      {/* Os três reflexos que fazem parecer vidro */}
      <path d="M 52 74 C 62 46 88 26 118 22" fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" opacity={0.85} />
      <path d="M 42 108 C 42 92 46 78 54 66" fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity={0.6} />
      <path d="M 172 190 C 190 176 202 156 206 136" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
};
