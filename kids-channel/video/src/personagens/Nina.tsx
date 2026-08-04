import React from "react";
import { CORES } from "../marca/paleta";

type Props = {
  /** 0 = boca fechada, 1 = boca aberta (cantando). */
  abertura?: number;
  /** Ignorado — Nina não tem asas. Existe pra manter a interface única. */
  asas?: number;
};

const CABECA = { cx: 108, cy: 96, r: 52 };

/**
 * Tromba como forma AFUNILADA, não como traço de espessura única.
 *
 * Traço uniforme dava um apêndice pendurado com a mesma grossura do começo
 * ao fim — lia como mangueira, não como focinho. Focinho de verdade é largo
 * na base e afina até a ponta arredondada, que cai um pouco.
 */
const TROMBA =
  "M 80 68 C 52 64 24 74 16 96 C 8 116 20 130 36 124 C 50 118 62 110 84 106 Z";

/**
 * Nina — anta roxa, a irmã mais velha da turma.
 *
 * Mesmo acabamento da Maria e do Pipo: nenhum contorno preto (o contorno é
 * um roxo escuro), gradiente em todas as formas, sombra desfocada e olho em
 * camadas.
 *
 * A tromba continua sendo o personagem inteiro — é o que impede ela de ser
 * "mais um hipopótamo roxo" e é o que dá silhueta registrável. Ela é
 * desenhada em duas passadas (contorno largo e preenchimento estreito por
 * cima, ambos antes da cabeça) pra a emenda com a cabeça sumir.
 */
export const Nina: React.FC<Props> = ({ abertura = 0 }) => {
  const boca = 3 + abertura * 10;

  return (
    <svg viewBox="0 0 300 240" width="100%" height="100%">
      <defs>
        <radialGradient id="ng-corpo" cx="34%" cy="26%" r="84%">
          <stop offset="0%" stopColor="#C89BF5" />
          <stop offset="52%" stopColor={CORES.nina} />
          <stop offset="100%" stopColor={CORES.ninaEscuro} />
        </radialGradient>
        <radialGradient id="ng-cabeca" cx="34%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#CDA4F7" />
          <stop offset="55%" stopColor={CORES.nina} />
          <stop offset="100%" stopColor="#7434BC" />
        </radialGradient>
        <linearGradient id="ng-pata" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={CORES.nina} />
          <stop offset="100%" stopColor="#6E2FB4" />
        </linearGradient>
        <radialGradient id="ng-iris" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor={CORES.olhosClaro} />
          <stop offset="52%" stopColor={CORES.olhos} />
          <stop offset="100%" stopColor={CORES.olhosEscuro} />
        </radialGradient>
        <linearGradient id="ng-esclera" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DCD5D0" />
          <stop offset="45%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F6EEE9" />
        </linearGradient>
        <filter id="ng-suave" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id="ng-clip-corpo">
          <ellipse cx={196} cy={144} rx={82} ry={56} />
        </clipPath>
        <clipPath id="ng-clip-cabeca">
          <circle cx={CABECA.cx} cy={CABECA.cy} r={CABECA.r} />
        </clipPath>
      </defs>

      {/* Patas de trás */}
      <g fill="url(#ng-pata)" stroke="#5E259E" strokeWidth={3}>
        <path d="M 158 176 C 156 198 156 214 158 224 L 186 224 C 188 214 188 198 186 176 Z" />
        <path d="M 226 176 C 224 198 224 214 226 224 L 254 224 C 256 214 256 198 254 176 Z" />
      </g>

      {/* Corpo */}
      <ellipse cx={196} cy={144} rx={82} ry={56} fill="url(#ng-corpo)" stroke="#6E2FB4" strokeWidth={3} />
      <g clipPath="url(#ng-clip-corpo)">
        <ellipse cx={272} cy={162} rx={64} ry={62} fill="#5E259E" opacity={0.45} filter="url(#ng-suave)" />
        <ellipse cx={182} cy={172} rx={58} ry={30} fill="#D9BCF8" opacity={0.7} filter="url(#ng-suave)" />
      </g>

      {/* Rabinho */}
      <path
        d="M 274 128 C 290 122 294 110 288 100"
        fill="none"
        stroke="#6E2FB4"
        strokeWidth={9}
        strokeLinecap="round"
      />

      {/* Patas da frente */}
      <g fill="url(#ng-pata)" stroke="#5E259E" strokeWidth={3}>
        <path d="M 138 180 C 136 200 136 214 138 224 L 166 224 C 168 214 168 200 166 180 Z" />
        <path d="M 206 180 C 204 200 204 214 206 224 L 234 224 C 236 214 236 200 234 180 Z" />
      </g>

      {/* Orelha */}
      <ellipse cx={132} cy={46} rx={19} ry={25} fill="#7E3BC8" stroke="#5E259E" strokeWidth={3} transform="rotate(18 132 46)" />
      <ellipse cx={132} cy={48} rx={9} ry={15} fill={CORES.vestidoMeio} opacity={0.6} transform="rotate(18 132 48)" />

      {/* Tromba — desenhada ANTES da cabeça, pra a emenda sumir atrás dela */}
      <path d={TROMBA} fill="url(#ng-cabeca)" stroke="#6E2FB4" strokeWidth={3} />
      {/* Brilho no dorso, que é o que dá volume à tromba */}
      <path
        d="M 76 76 C 52 74 32 84 26 100"
        fill="none"
        stroke="#D2AEF8"
        strokeWidth={9}
        strokeLinecap="round"
        opacity={0.5}
      />

      {/* Cabeça */}
      <circle cx={CABECA.cx} cy={CABECA.cy} r={CABECA.r} fill="url(#ng-cabeca)" stroke="#6E2FB4" strokeWidth={3} />
      <g clipPath="url(#ng-clip-cabeca)">
        <ellipse cx={158} cy={112} rx={54} ry={58} fill="#5E259E" opacity={0.35} filter="url(#ng-suave)" />
      </g>

      {/* Narina e boca */}
      <ellipse cx={26} cy={116} rx={6} ry={5} fill="#4A1C7E" />
      <ellipse cx={74} cy={118} rx={11} ry={boca} fill="#4A1C7E" />

      {/* Olho — mesma receita em camadas do resto do elenco */}
      <ellipse cx={116} cy={84} rx={16} ry={18} fill="url(#ng-esclera)" />
      <circle cx={113} cy={85} r={12} fill="url(#ng-iris)" />
      <path d="M 104 90 A 9 9 0 0 0 122 90" fill={CORES.olhosClaro} opacity={0.55} />
      <circle cx={113} cy={85} r={12} fill="none" stroke={CORES.olhosEscuro} strokeWidth={2.5} opacity={0.8} />
      <circle cx={113} cy={85} r={5.5} fill="#241C1A" />
      <circle cx={109} cy={80} r={4} fill="#FFFFFF" />
      <circle cx={117} cy={91} r={2.1} fill="#FFFFFF" opacity={0.85} />
      <path d="M 100 82 A 16 18 0 0 1 132 82" fill="none" stroke="#5E259E" strokeWidth={6} strokeLinecap="round" />
      <path d="M 103 71 C 97 65 93 62 89 60" fill="none" stroke="#5E259E" strokeWidth={4} strokeLinecap="round" />

      {/* Bochecha */}
      <ellipse cx={132} cy={116} rx={18} ry={12} fill={CORES.vestidoMeio} opacity={0.5} filter="url(#ng-suave)" />
    </svg>
  );
};
