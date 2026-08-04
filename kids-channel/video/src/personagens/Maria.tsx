import React from "react";
import { CORES, CONTORNO, TRACO } from "../marca/paleta";

type Props = {
  /** 0 = boca fechada, 1 = boca aberta (cantando). */
  abertura?: number;
  /** Ignorado — Maria não tem asas. Existe pra manter a interface única. */
  asas?: number;
};

/**
 * Maria — menininha loira, protagonista do canal.
 *
 * Personagem HUMANA de propósito: criança pequena se identifica com criança,
 * não com bichinho. É por isso que o protagonista do CoComelon é o JJ e não
 * os animais — os bichos são os amigos. O Pipo continua no elenco, agora
 * como melhor amigo dela.
 *
 * Proporção: a cabeça ocupa ~45% da altura total. Isso é exagerado de
 * propósito — é a proporção de bebê, que é o que o cérebro lê como "fofo" e
 * o que mantém o rosto legível numa miniatura de 120px na TV da sala.
 *
 * IMPORTANTE: esta é uma personagem original, desenhada do zero em código.
 * Ela não é e não deve virar o retrato de nenhuma criança real — ver a
 * seção "O que nunca entra" na Fase 2.
 *
 * Pra mudar a aparência dela, mexa nas cores `pele`, `cabelo` e `vestido`
 * em marca/paleta.ts. O desenho inteiro acompanha.
 */
export const Maria: React.FC<Props> = ({ abertura = 0 }) => {
  const boca = 4 + abertura * 12;

  return (
    <svg viewBox="0 0 240 330" width="100%" height="100%">
      {/* Marias-chiquinhas — atrás da cabeça, na altura do queixo.
          Se ficarem na altura dos olhos, o cérebro lê como ORELHA e a Maria
          vira um bichinho. O laço em cima é o que amarra a leitura. */}
      <g fill={CORES.cabelo} {...CONTORNO}>
        <ellipse cx={30} cy={154} rx={27} ry={44} />
        <ellipse cx={210} cy={154} rx={27} ry={44} />
      </g>

      {/* Braços — antes do vestido, pra o ombro ficar coberto por ele */}
      <g fill="none" strokeLinecap="round">
        <path d="M 84 190 C 56 204 38 226 32 248" stroke={CORES.traco} strokeWidth={22 + TRACO} />
        <path d="M 156 190 C 184 204 202 226 208 248" stroke={CORES.traco} strokeWidth={22 + TRACO} />
        <path d="M 84 190 C 56 204 38 226 32 248" stroke={CORES.pele} strokeWidth={22} />
        <path d="M 156 190 C 184 204 202 226 208 248" stroke={CORES.pele} strokeWidth={22} />
      </g>

      {/* Pernas — também antes do vestido */}
      <g fill={CORES.pele} {...CONTORNO}>
        <rect x={90} y={244} width={24} height={54} rx={12} />
        <rect x={126} y={244} width={24} height={54} rx={12} />
      </g>

      {/* Sapatos */}
      <g fill={CORES.vestidoEscuro} {...CONTORNO}>
        <rect x={78} y={288} width={42} height={26} rx={13} />
        <rect x={120} y={288} width={42} height={26} rx={13} />
      </g>

      {/* Mãos */}
      <g fill={CORES.pele} {...CONTORNO}>
        <circle cx={32} cy={250} r={15} />
        <circle cx={208} cy={250} r={15} />
      </g>

      {/* Vestido */}
      <path
        d="M 84 174 C 72 176 62 208 50 258 C 90 268 150 268 190 258 C 178 208 168 176 156 174 Z"
        fill={CORES.vestido}
        {...CONTORNO}
      />
      {/* Barrinha mais escura na bainha */}
      <path
        d="M 52 250 C 92 260 148 260 188 250"
        fill="none"
        stroke={CORES.vestidoEscuro}
        strokeWidth={12}
        strokeLinecap="round"
      />

      {/* Pescoço — antes da cabeça, que cobre a emenda de cima */}
      <rect x={106} y={150} width={28} height={28} fill={CORES.peleSombra} />

      {/* Cabeça */}
      <circle cx={120} cy={92} r={70} fill={CORES.pele} {...CONTORNO} />

      {/* Cabelo: calota por cima da cabeça com franja ondulada.
          O arco acompanha exatamente a borda do círculo da cabeça, então o
          cabelo encaixa sem sobrar traço. */}
      <path
        d="M 52 76 A 70 70 0 0 1 188 76 C 168 96 150 64 120 78 C 90 64 72 96 52 76 Z"
        fill={CORES.cabelo}
        {...CONTORNO}
      />

      {/* Laços das chiquinhas */}
      <g fill={CORES.vestido} {...CONTORNO} strokeWidth={6}>
        <circle cx={56} cy={116} r={13} />
        <circle cx={184} cy={116} r={13} />
      </g>

      {/* Olhos */}
      <g>
        <circle cx={90} cy={106} r={16} fill={CORES.branco} {...CONTORNO} strokeWidth={6} />
        <circle cx={150} cy={106} r={16} fill={CORES.branco} {...CONTORNO} strokeWidth={6} />
        <circle cx={92} cy={108} r={9} fill={CORES.traco} />
        <circle cx={152} cy={108} r={9} fill={CORES.traco} />
        <circle cx={89} cy={104} r={3.6} fill={CORES.branco} />
        <circle cx={149} cy={104} r={3.6} fill={CORES.branco} />
      </g>

      {/* Narizinho */}
      <path
        d="M 116 126 C 120 130 124 130 126 126"
        fill="none"
        stroke={CORES.peleSombra}
        strokeWidth={6}
        strokeLinecap="round"
      />

      {/* Boca — abre quando ela canta */}
      <ellipse cx={120} cy={142} rx={14} ry={boca} fill={CORES.traco} />

      {/* Bochechas */}
      <ellipse cx={68} cy={130} rx={13} ry={9} fill={CORES.vestido} opacity={0.45} />
      <ellipse cx={172} cy={130} rx={13} ry={9} fill={CORES.vestido} opacity={0.45} />
    </svg>
  );
};
