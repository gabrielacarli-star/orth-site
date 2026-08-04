import React from "react";
import { CORES, CONTORNO } from "../marca/paleta";

/**
 * Nuvem de pipoca — a assinatura visual do canal.
 *
 * É um aglomerado de círculos sobrepostos com contorno grosso: lê como
 * pipoca e como nuvem ao mesmo tempo. Esse é o elemento que faz alguém
 * reconhecer o canal numa miniatura de 120px sem ler o título.
 */
export const NuvemPipoca: React.FC<{
  x: number;
  y: number;
  tamanho: number;
  opacidade?: number;
}> = ({ x, y, tamanho, opacidade = 1 }) => (
  <svg
    viewBox="0 0 220 130"
    width={tamanho}
    style={{ position: "absolute", left: x, top: y, opacity: opacidade }}
  >
    <g fill={CORES.branco} {...CONTORNO} strokeWidth={7}>
      {/* Os círculos se sobrepõem, então o contorno interno some e sobra só
          a silhueta externa recortada — o efeito "pipoca". */}
      <circle cx={62} cy={72} r={42} />
      <circle cx={112} cy={54} r={48} />
      <circle cx={162} cy={76} r={38} />
      <circle cx={92} cy={92} r={34} />
      <circle cx={136} cy={94} r={30} />
    </g>
    {/* Segunda passada só com preenchimento, pra tapar os contornos internos */}
    <g fill={CORES.branco}>
      <circle cx={62} cy={72} r={38} />
      <circle cx={112} cy={54} r={44} />
      <circle cx={162} cy={76} r={34} />
      <circle cx={92} cy={92} r={30} />
      <circle cx={136} cy={94} r={26} />
    </g>
  </svg>
);

/** Coqueiro. `lado` espelha o desenho pra não parecer que são todos iguais. */
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
    {/* Tronco levemente curvado */}
    <path
      d="M 118 420 C 112 320 104 220 128 120"
      fill="none"
      stroke={CORES.traco}
      strokeWidth={34}
      strokeLinecap="round"
    />
    <path
      d="M 118 420 C 112 320 104 220 128 120"
      fill="none"
      stroke="#A9762F"
      strokeWidth={22}
      strokeLinecap="round"
    />

    {/* Folhas */}
    <g fill={CORES.verde} {...CONTORNO} strokeWidth={7}>
      <path d="M 128 120 C 70 96 30 108 8 140 C 48 140 96 138 128 128 Z" />
      <path d="M 128 120 C 186 96 226 108 250 140 C 210 140 160 138 128 128 Z" />
      <path d="M 128 118 C 104 68 64 44 26 44 C 52 82 92 112 128 126 Z" />
      <path d="M 128 118 C 152 68 192 44 230 44 C 204 82 164 112 128 126 Z" />
    </g>

    {/* Cocos */}
    <g fill="#8A5A2B" {...CONTORNO} strokeWidth={6}>
      <circle cx={112} cy={140} r={17} />
      <circle cx={146} cy={146} r={15} />
    </g>
  </svg>
);

/** Sol com raios. Usado só no pilar Dia. */
export const Sol: React.FC<{ x: number; y: number; tamanho: number; giro: number }> = ({
  x,
  y,
  tamanho,
  giro,
}) => (
  <svg
    viewBox="0 0 200 200"
    width={tamanho}
    style={{ position: "absolute", left: x, top: y }}
  >
    <g transform={`rotate(${giro} 100 100)`} stroke={CORES.pipoEscuro} strokeWidth={12} strokeLinecap="round">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 12;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * 66}
            y1={100 + Math.sin(a) * 66}
            x2={100 + Math.cos(a) * 88}
            y2={100 + Math.sin(a) * 88}
          />
        );
      })}
    </g>
    <circle cx={100} cy={100} r={58} fill={CORES.pipo} stroke={CORES.pipoEscuro} strokeWidth={10} />
  </svg>
);

/** Estrela de cinco pontas — pilar Noite. */
export const Estrela: React.FC<{
  x: number;
  y: number;
  tamanho: number;
  brilho: number;
}> = ({ x, y, tamanho, brilho }) => (
  <svg
    viewBox="0 0 100 100"
    width={tamanho}
    style={{ position: "absolute", left: x, top: y, opacity: brilho }}
  >
    <path
      d="M 50 8 L 61 38 L 93 38 L 67 57 L 77 88 L 50 69 L 23 88 L 33 57 L 7 38 L 39 38 Z"
      fill={CORES.pipoClaro}
    />
  </svg>
);
