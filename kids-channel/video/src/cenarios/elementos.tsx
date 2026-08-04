import React from "react";
import { CORES } from "../marca/paleta";

/**
 * Elementos do cenário.
 *
 * Mesma receita dos personagens: nenhum contorno preto, gradiente em toda
 * forma, sombra desfocada. Contorno preto no cenário é ainda pior que no
 * personagem — puxa o olho pro fundo em vez de pro rosto de quem canta.
 */

/**
 * Nuvem de pipoca — a assinatura visual do canal.
 *
 * Aglomerado de círculos que lê como pipoca e como nuvem ao mesmo tempo. A
 * versão com contorno preto virava adesivo; aqui a silhueta se define por
 * uma sombra azulada suave na base, que é como nuvem funciona de verdade.
 */
export const NuvemPipoca: React.FC<{
  x: number;
  y: number;
  tamanho: number;
  opacidade?: number;
}> = ({ x, y, tamanho, opacidade = 1 }) => (
  <svg
    viewBox="0 0 220 140"
    width={tamanho}
    style={{ position: "absolute", left: x, top: y, opacity: opacidade }}
  >
    <defs>
      <linearGradient id="cg-nuvem" x1="30%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="62%" stopColor="#F4FAFF" />
        <stop offset="100%" stopColor="#D8E9F6" />
      </linearGradient>
      <filter id="cg-nuvem-sombra" x="-30%" y="-30%" width="160%" height="180%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    {/* Sombra da base */}
    <g fill="#B9D6EA" opacity={0.55} filter="url(#cg-nuvem-sombra)">
      <ellipse cx={112} cy={104} rx={80} ry={22} />
    </g>
    <g fill="url(#cg-nuvem)">
      <circle cx={62} cy={74} r={40} />
      <circle cx={112} cy={56} r={46} />
      <circle cx={162} cy={78} r={36} />
      <circle cx={92} cy={94} r={32} />
      <circle cx={136} cy={96} r={28} />
    </g>
    {/* Luz no topo */}
    <g fill="#FFFFFF" opacity={0.9}>
      <circle cx={106} cy={44} r={26} />
      <circle cx={64} cy={62} r={18} />
    </g>
  </svg>
);

/** Coqueiro. `espelhado` inverte o desenho pra não parecerem todos iguais. */
export const Coqueiro: React.FC<{
  x: number;
  y: number;
  tamanho: number;
  espelhado?: boolean;
}> = ({ x, y, tamanho, espelhado = false }) => (
  <svg
    viewBox="0 0 260 420"
    width={tamanho}
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -100%) scaleX(${espelhado ? -1 : 1})`,
    }}
  >
    <defs>
      <linearGradient id="cg-tronco" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C99457" />
        <stop offset="42%" stopColor="#A9762F" />
        <stop offset="100%" stopColor="#7C5320" />
      </linearGradient>
      <linearGradient id="cg-folha" x1="10%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#79DDA0" />
        <stop offset="46%" stopColor={CORES.verde} />
        <stop offset="100%" stopColor="#249B52" />
      </linearGradient>
      <linearGradient id="cg-folha-tras" x1="10%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#3FB273" />
        <stop offset="100%" stopColor="#1B7C42" />
      </linearGradient>
      <radialGradient id="cg-coco" cx="34%" cy="30%" r="76%">
        <stop offset="0%" stopColor="#B07A45" />
        <stop offset="100%" stopColor="#6E4620" />
      </radialGradient>
    </defs>

    {/* Tronco levemente curvado */}
    <path d="M 118 420 C 112 320 104 220 128 120" fill="none" stroke="url(#cg-tronco)" strokeWidth={30} strokeLinecap="round" />
    {/* Anéis do tronco — textura barata que muda muito a leitura */}
    <g fill="none" stroke="#7C5320" strokeWidth={3} opacity={0.4} strokeLinecap="round">
      {[150, 190, 230, 270, 310, 350, 390].map((cy, i) => (
        <path key={cy} d={`M ${104 + i * 1.8} ${cy} q 12 6 24 0`} />
      ))}
    </g>

    {/* Folhas de trás, mais escuras */}
    <g fill="url(#cg-folha-tras)">
      <path d="M 128 122 C 68 96 26 108 4 142 C 46 142 96 140 128 130 Z" />
      <path d="M 128 122 C 188 96 230 108 254 142 C 212 142 160 140 128 130 Z" />
    </g>
    {/* Folhas da frente */}
    <g fill="url(#cg-folha)">
      <path d="M 128 118 C 102 66 62 42 22 42 C 50 82 92 112 128 126 Z" />
      <path d="M 128 118 C 154 66 194 42 234 42 C 206 82 164 112 128 126 Z" />
      <path d="M 128 120 C 84 106 46 116 22 140 C 62 142 100 136 128 128 Z" />
      <path d="M 128 120 C 172 106 210 116 234 140 C 194 142 156 136 128 128 Z" />
    </g>
    {/* Nervura das folhas */}
    <g fill="none" stroke="#1B7C42" strokeWidth={2.5} opacity={0.45} strokeLinecap="round">
      <path d="M 128 124 C 100 96 66 62 30 48" />
      <path d="M 128 124 C 156 96 190 62 226 48" />
      <path d="M 128 126 C 96 122 58 126 28 138" />
      <path d="M 128 126 C 160 122 198 126 228 138" />
    </g>

    {/* Cocos */}
    <g fill="url(#cg-coco)">
      <circle cx={112} cy={140} r={17} />
      <circle cx={146} cy={146} r={15} />
      <circle cx={130} cy={158} r={13} />
    </g>
    <g fill="#D8A874" opacity={0.55}>
      <circle cx={107} cy={134} r={5} />
      <circle cx={142} cy={141} r={4} />
    </g>
  </svg>
);

/** Sol com brilho difuso. Usado só no pilar Dia. */
export const Sol: React.FC<{ x: number; y: number; tamanho: number; giro: number }> = ({
  x,
  y,
  tamanho,
  giro,
}) => (
  <svg viewBox="0 0 220 220" width={tamanho} style={{ position: "absolute", left: x, top: y }}>
    <defs>
      <radialGradient id="cg-sol" cx="38%" cy="32%" r="72%">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="58%" stopColor={CORES.pipo} />
        <stop offset="100%" stopColor="#F0A81E" />
      </radialGradient>
      <radialGradient id="cg-sol-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFE28A" stopOpacity={0.55} />
        <stop offset="100%" stopColor="#FFE28A" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={110} cy={110} r={108} fill="url(#cg-sol-halo)" />
    <g transform={`rotate(${giro} 110 110)`} stroke="#FFCF52" strokeWidth={11} strokeLinecap="round" opacity={0.9}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 12;
        return (
          <line
            key={i}
            x1={110 + Math.cos(a) * 66}
            y1={110 + Math.sin(a) * 66}
            x2={110 + Math.cos(a) * 90}
            y2={110 + Math.sin(a) * 90}
          />
        );
      })}
    </g>
    <circle cx={110} cy={110} r={58} fill="url(#cg-sol)" />
  </svg>
);

/** Estrela de cinco pontas — pilar Noite. */
export const Estrela: React.FC<{
  x: number;
  y: number;
  tamanho: number;
  brilho: number;
}> = ({ x, y, tamanho, brilho }) => (
  <svg viewBox="0 0 100 100" width={tamanho} style={{ position: "absolute", left: x, top: y, opacity: brilho }}>
    <path
      d="M 50 8 L 61 38 L 93 38 L 67 57 L 77 88 L 50 69 L 23 88 L 33 57 L 7 38 L 39 38 Z"
      fill={CORES.cabeloBrilho}
    />
  </svg>
);
