import React from "react";
import { CORES, CONTORNO } from "../marca/paleta";

type Props = {
  /** Ignorado — Bolha não fala. Existe só pra ter a mesma interface dos outros. */
  abertura?: number;
  /** Ignorado — Bolha não tem asas. Existe pra manter a interface única. */
  asas?: number;
};

/**
 * Bolha — peixinho azul dentro de uma bolha d'água que quica em terra firme.
 *
 * Não fala, só faz sons. É o alívio cômico e o "gancho" que a criança espera
 * e pede de novo (o papel que o Baby Shark cumpre). Custo de animação é
 * quase zero: é um círculo que quica.
 */
export const Bolha: React.FC<Props> = () => {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      {/* Bolha d'água */}
      <circle cx={100} cy={100} r={72} fill={CORES.bolhaClaro} opacity={0.55} />
      <circle cx={100} cy={100} r={72} fill="none" {...CONTORNO} />

      {/* Brilho da bolha — o toque que faz parecer água e não só um círculo */}
      <path
        d="M 54 74 C 60 56 76 44 92 42"
        fill="none"
        stroke={CORES.branco}
        strokeWidth={11}
        strokeLinecap="round"
        opacity={0.9}
      />

      {/* Rabo do peixinho */}
      <path
        d="M 132 100 L 158 82 L 158 118 Z"
        fill={CORES.bolhaEscuro}
        {...CONTORNO}
        strokeWidth={6}
      />

      {/* Corpo do peixinho */}
      <ellipse cx={98} cy={100} rx={38} ry={28} fill={CORES.bolha} {...CONTORNO} strokeWidth={6} />

      {/* Nadadeira de cima */}
      <path
        d="M 92 74 L 104 56 L 114 78"
        fill={CORES.bolhaEscuro}
        {...CONTORNO}
        strokeWidth={6}
      />

      {/* Olho */}
      <circle cx={78} cy={94} r={12} fill={CORES.branco} {...CONTORNO} strokeWidth={5} />
      <circle cx={75} cy={96} r={6.5} fill={CORES.traco} />
      <circle cx={73} cy={92} r={2.6} fill={CORES.branco} />

      {/* Boquinha em "o" — a cara de espanto permanente do Bolha */}
      <ellipse cx={62} cy={112} rx={6} ry={7} fill={CORES.traco} />
    </svg>
  );
};
