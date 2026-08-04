import React from "react";
import { CORES, CONTORNO, TRACO } from "../marca/paleta";

type Props = {
  /** 0 = boca fechada, 1 = boca aberta (cantando). */
  abertura?: number;
  /** Ignorado — Nina não tem asas. Existe pra manter a interface única. */
  asas?: number;
};

// Curva da tromba. Sai de dentro da cabeça e desce pra frente.
const TROMBA = "M 72 82 C 48 78 30 88 22 104";
const TROMBA_GROSSURA = 38;

const CABECA = { x: 106, y: 84, r: 48 };

/**
 * Nina — anta roxa, a irmã mais velha.
 *
 * De perfil olhando pra esquerda (o `espelhado` do episodio.json vira ela
 * pro outro lado). A tromba é o personagem inteiro: sem ela clara, a Nina
 * vira "mais um hipopótamo roxo" e a gente perde o motivo de ter escolhido
 * anta na Fase 2.
 *
 * O desenho é feito em DUAS camadas, e essa é a parte que importa:
 *
 *   1. camada escura — cabeça e tromba desenhadas maiores, em cor de traço
 *   2. camada roxa   — as mesmas formas, menores, por cima
 *
 * O que sobra da camada escura nas bordas É o contorno. Fazer assim (em vez
 * de dar `stroke` em cada forma) é o que elimina a emenda escura no meio da
 * junção da tromba com a cabeça — com `stroke`, o contorno da cabeça sempre
 * cortaria a tromba ao meio.
 */
export const Nina: React.FC<Props> = ({ abertura = 0 }) => {
  const boca = 3 + abertura * 10;

  return (
    <svg viewBox="0 0 280 220" width="100%" height="100%">
      {/* Patas de trás */}
      <g fill={CORES.ninaEscuro} {...CONTORNO}>
        <rect x={146} y={162} width={28} height={46} rx={14} />
        <rect x={212} y={162} width={28} height={46} rx={14} />
      </g>

      {/* Corpo — mais baixo e mais atrás que a cabeça, pra as duas formas
          não virarem uma bolha roxa só */}
      <ellipse cx={184} cy={136} rx={72} ry={48} fill={CORES.nina} {...CONTORNO} />

      {/* Rabinho */}
      <path d="M 254 120 C 268 114 272 104 266 96" fill="none" {...CONTORNO} strokeWidth={9} />

      {/* Barriga clara */}
      <ellipse cx={184} cy={156} rx={52} ry={22} fill={CORES.ninaClaro} />

      {/* Patas da frente */}
      <g fill={CORES.nina} {...CONTORNO}>
        <rect x={128} y={164} width={28} height={44} rx={14} />
        <rect x={192} y={164} width={28} height={44} rx={14} />
      </g>

      {/* Orelha */}
      <ellipse
        cx={122}
        cy={40}
        rx={14}
        ry={19}
        fill={CORES.ninaEscuro}
        {...CONTORNO}
        transform="rotate(14 122 40)"
      />

      {/* Camada 1 — tudo em cor de traço, um pouco maior */}
      <g fill={CORES.traco} stroke={CORES.traco} strokeLinecap="round">
        <circle cx={CABECA.x} cy={CABECA.y} r={CABECA.r + TRACO / 2} />
        <path d={TROMBA} fill="none" strokeWidth={TROMBA_GROSSURA + TRACO} />
      </g>

      {/* Camada 2 — as mesmas formas em roxo, por cima. O que sobra da
          camada de baixo nas bordas vira o contorno, sem emenda no meio. */}
      <g fill={CORES.nina} stroke={CORES.nina} strokeLinecap="round">
        <circle cx={CABECA.x} cy={CABECA.y} r={CABECA.r} />
        <path d={TROMBA} fill="none" strokeWidth={TROMBA_GROSSURA} />
      </g>

      {/* Narina, na ponta da tromba */}
      <circle cx={18} cy={112} r={6} fill={CORES.traco} />

      {/* Boca, logo atrás da tromba */}
      <ellipse cx={62} cy={122} rx={12} ry={boca} fill={CORES.traco} />

      {/* Olho */}
      <circle cx={112} cy={74} r={15} fill={CORES.branco} {...CONTORNO} strokeWidth={6} />
      <circle cx={107} cy={77} r={8} fill={CORES.traco} />
      <circle cx={104} cy={72} r={3.4} fill={CORES.branco} />

      {/* Bochecha */}
      <ellipse cx={128} cy={104} rx={14} ry={9} fill={CORES.coral} opacity={0.45} />
    </svg>
  );
};
