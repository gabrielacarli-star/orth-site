import React from "react";
import { CORES, CONTORNO } from "../marca/paleta";

type Props = {
  /** 0 = bico fechado, 1 = bico totalmente aberto (usado pra cantar). */
  abertura?: number;
  /** 0 = asas paradas, 1 = asas levantadas. */
  asas?: number;
};

/**
 * Pipo — passarinho amarelo, protagonista.
 *
 * Desenhado de frente, corpo e cabeça num círculo só (formato "bolinha"),
 * que é o que dá a silhueta reconhecível em miniatura pequena.
 * O bico é dividido em duas metades pra poder abrir quando ele canta.
 */
export const Pipo: React.FC<Props> = ({ abertura = 0, asas = 0 }) => {
  // O bico de baixo gira pra baixo conforme "abertura".
  const giroBico = abertura * 22;
  // As asas sobem e giram um pouco.
  const giroAsa = asas * 30;

  return (
    <svg viewBox="0 0 200 210" width="100%" height="100%">
      {/* Pés — desenhados primeiro pra ficarem atrás do corpo */}
      <g {...CONTORNO} fill={CORES.bico}>
        <path d="M 82 168 L 82 186 M 70 192 L 94 192" strokeWidth={9} />
        <path d="M 118 168 L 118 186 M 106 192 L 130 192" strokeWidth={9} />
      </g>

      {/* Asas — atrás do corpo, presas bem abaixo da linha dos olhos.
          Se a asa sobe até a altura do olho, o cérebro lê como ORELHA e o
          Pipo vira um bichinho genérico em vez de passarinho. Por isso o
          topo da asa fica em y=118, já abaixo dos olhos (y=94), e o giro
          acontece em torno do ponto onde ela se prende ao corpo. */}
      <g fill={CORES.pipoEscuro} {...CONTORNO}>
        <ellipse
          cx={38}
          cy={150}
          rx={18}
          ry={32}
          transform={`rotate(${24 + giroAsa} 38 122)`}
        />
        <ellipse
          cx={162}
          cy={150}
          rx={18}
          ry={32}
          transform={`rotate(${-24 - giroAsa} 162 122)`}
        />
      </g>

      {/* Corpo */}
      <circle cx={100} cy={112} r={60} fill={CORES.pipo} {...CONTORNO} />

      {/* Barriga mais clara — sem contorno, é só uma mancha de cor */}
      <ellipse cx={100} cy={138} rx={38} ry={30} fill={CORES.pipoClaro} />

      {/* Topete de três penas */}
      <g {...CONTORNO} strokeWidth={9} fill="none">
        <path d="M 100 54 C 96 34 84 28 78 26" />
        <path d="M 100 52 C 100 32 100 26 100 20" />
        <path d="M 100 54 C 104 34 116 28 122 26" />
      </g>

      {/* Bico — metade de cima fixa, metade de baixo gira pra abrir */}
      <g fill={CORES.bico} {...CONTORNO}>
        <path d="M 84 114 L 116 114 L 100 126 Z" />
        <path
          d="M 84 114 L 116 114 L 100 130 Z"
          transform={`rotate(${giroBico} 100 114)`}
        />
      </g>

      {/* Olhos grandes — proporção de filhote, é o que lê como "fofo" */}
      <g>
        <circle cx={78} cy={94} r={15} fill={CORES.branco} {...CONTORNO} strokeWidth={6} />
        <circle cx={122} cy={94} r={15} fill={CORES.branco} {...CONTORNO} strokeWidth={6} />
        <circle cx={80} cy={96} r={8} fill={CORES.traco} />
        <circle cx={124} cy={96} r={8} fill={CORES.traco} />
        <circle cx={77} cy={92} r={3.2} fill={CORES.branco} />
        <circle cx={121} cy={92} r={3.2} fill={CORES.branco} />
      </g>

      {/* Bochechas */}
      <ellipse cx={58} cy={118} rx={11} ry={7} fill={CORES.coral} opacity={0.5} />
      <ellipse cx={142} cy={118} rx={11} ry={7} fill={CORES.coral} opacity={0.5} />
    </svg>
  );
};
