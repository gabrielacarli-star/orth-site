import React from "react";
import { CORES } from "../marca/paleta";

type Props = {
  /** 0 = boca fechada, 1 = boca aberta (cantando). */
  abertura?: number;
  /** Ignorado — Maria não tem asas. Existe pra manter a interface única. */
  asas?: number;
};

// ---------------------------------------------------------------------------
// Formas grandes, declaradas fora do componente pra não recalcular por frame.
// ---------------------------------------------------------------------------

/** Massa de cabelo atrás do corpo: longo, ondulado, passando dos ombros. */
const CABELO_TRAS =
  "M 150 22 C 88 22 50 76 48 152 C 46 214 50 268 58 312 C 72 302 84 316 96 304 " +
  "C 108 318 120 302 132 314 C 144 302 158 302 170 314 C 182 302 194 318 206 304 " +
  "C 218 316 230 302 244 312 C 252 268 256 214 254 152 C 252 76 212 22 150 22 Z";

/** Mecha da frente, lado esquerdo — emoldura o rosto e desce até o ombro. */
const MECHA_ESQ =
  "M 150 24 C 100 28 62 68 56 134 C 52 172 56 210 64 238 C 74 224 80 200 82 174 " +
  "C 86 138 98 106 120 88 C 134 76 145 52 150 24 Z";

const MECHA_DIR =
  "M 150 24 C 200 28 238 68 244 134 C 248 172 244 210 236 238 C 226 224 220 200 218 174 " +
  "C 214 138 202 106 180 88 C 166 76 155 52 150 24 Z";

/** Franja leve sobre a testa. */
const FRANJA =
  "M 66 118 C 74 62 106 30 150 30 C 194 30 226 62 234 118 C 222 92 204 74 182 66 " +
  "C 172 88 150 96 132 88 C 116 96 92 92 78 74 C 72 86 68 102 66 118 Z";

const VESTIDO =
  "M 112 216 C 96 220 88 250 74 306 C 118 322 182 322 226 306 C 212 250 204 220 188 216 " +
  "C 178 232 122 232 112 216 Z";

const CABECA = { cx: 150, cy: 124, rx: 88, ry: 92 };

/** Olho amendoado. `lado` = -1 esquerdo, +1 direito (espelha o canto externo). */
const olhoPath = (cx: number, lado: number) =>
  `M ${cx - 26} 132 C ${cx - 22} 110 ${cx - 8} 102 ${cx + 2 * lado} 103 ` +
  `C ${cx + 16} 105 ${cx + 25} 116 ${cx + 27} 132 ` +
  `C ${cx + 20} 154 ${cx + 6} 160 ${cx - 4} 158 ` +
  `C ${cx - 16} 155 ${cx - 24} 146 ${cx - 26} 132 Z`;

/**
 * Maria — protagonista do canal.
 *
 * ---
 * SOBRE O ESTILO
 *
 * Esta versão persegue "ilustração vetorial moderna" em vez de "vetor plano
 * com contorno preto". A diferença está em quatro coisas, e vale registrar
 * porque é o que separa desenho bonito de clipart:
 *
 * 1. **Nenhum contorno preto.** Cada forma é contornada por uma versão
 *    ESCURA DA PRÓPRIA COR (`peleTraco` na pele, `cabeloTraco` no cabelo).
 *    Traço preto uniforme em tudo é o item nº 1 que faz um desenho parecer
 *    adesivo — nenhuma ilustração infantil boa usa isso.
 *
 * 2. **Gradiente em tudo.** Pele, cabelo, vestido e íris usam gradiente em
 *    vez de cor chapada. É o que dá a sensação de volume e luz.
 *
 * 3. **Sombra desfocada.** Um filtro `feGaussianBlur` num punhado de formas
 *    de sombra faz o trabalho que na arte pintada é feito com pincel macio.
 *
 * 4. **Olho em camadas.** Formato amendoado (não círculo), esclera com
 *    sombra da pálpebra, íris com gradiente, anel límbico escuro, luz
 *    refletida embaixo, dois brilhos e cílios que afinam na ponta. O olho é
 *    onde mora 80% da simpatia de um personagem infantil.
 *
 * O que NÃO dá pra fazer aqui: textura pintada, pelo, luz volumétrica. Isso
 * vem de modelo de imagem, não de código.
 *
 * ---
 * IMPORTANTE: personagem original, desenhada do zero. Ela não é e não deve
 * virar o retrato de nenhuma criança real — ver "O que nunca entra" na Fase 2.
 */
export const Maria: React.FC<Props> = ({ abertura = 0 }) => {
  const bocaAltura = 5 + abertura * 15;
  const bocaLargura = 17 + abertura * 5;

  return (
    <svg viewBox="0 0 300 420" width="100%" height="100%">
      <defs>
        {/* Luz vindo de cima e da esquerda em todos os gradientes — coerência
            de iluminação é o que faz as partes parecerem o mesmo desenho. */}
        <radialGradient id="mg-pele" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={CORES.pele} />
          <stop offset="62%" stopColor={CORES.peleMeia} />
          <stop offset="100%" stopColor={CORES.peleSombra} />
        </radialGradient>

        <linearGradient id="mg-cabelo" x1="20%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor={CORES.cabeloBrilho} />
          <stop offset="34%" stopColor={CORES.cabelo} />
          <stop offset="72%" stopColor={CORES.cabeloMeio} />
          <stop offset="100%" stopColor={CORES.cabeloEscuro} />
        </linearGradient>

        <linearGradient id="mg-cabelo-tras" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={CORES.cabeloMeio} />
          <stop offset="100%" stopColor={CORES.cabeloEscuro} />
        </linearGradient>

        <linearGradient id="mg-vestido" x1="25%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={CORES.vestido} />
          <stop offset="58%" stopColor={CORES.vestidoMeio} />
          <stop offset="100%" stopColor={CORES.vestidoEscuro} />
        </linearGradient>

        <radialGradient id="mg-iris" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor={CORES.olhosClaro} />
          <stop offset="52%" stopColor={CORES.olhos} />
          <stop offset="100%" stopColor={CORES.olhosEscuro} />
        </radialGradient>

        <linearGradient id="mg-esclera" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DCD5D0" />
          <stop offset="42%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F6EEE9" />
        </linearGradient>

        {/* Margaridinhas do vestido */}
        <pattern id="mg-flores" width="34" height="34" patternUnits="userSpaceOnUse">
          <g fill="#FFFFFF" opacity={0.9}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx={11}
                cy={11}
                rx={3}
                ry={6}
                transform={`rotate(${a} 11 11)`}
              />
            ))}
            <circle cx={11} cy={11} r={2.6} fill={CORES.cabeloMeio} />
          </g>
          <g fill="#FFFFFF" opacity={0.75}>
            {[36, 108, 180, 252, 324].map((a) => (
              <ellipse
                key={a}
                cx={27}
                cy={26}
                rx={2.2}
                ry={4.4}
                transform={`rotate(${a} 27 26)`}
              />
            ))}
            <circle cx={27} cy={26} r={1.9} fill={CORES.cabeloMeio} />
          </g>
        </pattern>

        <filter id="mg-suave" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="mg-suave-forte" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>

        <clipPath id="mg-clip-cabeca">
          <ellipse cx={CABECA.cx} cy={CABECA.cy} rx={CABECA.rx} ry={CABECA.ry} />
        </clipPath>
        <clipPath id="mg-clip-vestido">
          <path d={VESTIDO} />
        </clipPath>
        <clipPath id="mg-clip-cabelo">
          <path d={CABELO_TRAS} />
        </clipPath>
      </defs>

      {/* ================= CABELO DE TRÁS ================= */}
      <path d={CABELO_TRAS} fill="url(#mg-cabelo-tras)" stroke={CORES.cabeloTraco} strokeWidth={3} />
      <g clipPath="url(#mg-clip-cabelo)">
        {/* Ondas internas — fios largos e macios, não riscos */}
        <g fill="none" stroke={CORES.cabeloTraco} strokeWidth={4} opacity={0.35} strokeLinecap="round">
          <path d="M 74 120 C 62 172 62 236 72 296" />
          <path d="M 104 108 C 92 168 92 240 100 302" />
          <path d="M 196 108 C 208 168 208 240 200 302" />
          <path d="M 226 120 C 238 172 238 236 228 296" />
        </g>
        <g fill="none" stroke={CORES.cabeloBrilho} strokeWidth={7} opacity={0.4} strokeLinecap="round">
          <path d="M 88 118 C 78 170 78 234 86 292" />
          <path d="M 212 118 C 222 170 222 234 214 292" />
        </g>
      </g>

      {/* ================= PERNAS E SAPATOS ================= */}
      <g stroke={CORES.peleTraco} strokeWidth={3}>
        <path d="M 118 296 C 116 330 116 356 118 372 L 144 372 C 146 356 146 330 144 296 Z" fill="url(#mg-pele)" />
        <path d="M 156 296 C 154 330 154 356 156 372 L 182 372 C 184 356 184 330 182 296 Z" fill="url(#mg-pele)" />
      </g>
      <g stroke={CORES.vestidoTraco} strokeWidth={3}>
        <path d="M 112 368 C 106 388 112 400 132 400 L 150 400 C 156 400 158 392 156 382 C 154 372 150 368 142 368 Z" fill={CORES.vestidoMeio} />
        <path d="M 188 368 C 194 388 188 400 168 400 L 150 400 C 144 400 142 392 144 382 C 146 372 150 368 158 368 Z" fill={CORES.vestidoMeio} />
      </g>
      <g fill={CORES.cabeloBrilho} stroke={CORES.cabeloTraco} strokeWidth={2}>
        <circle cx={124} cy={382} r={5} />
        <circle cx={176} cy={382} r={5} />
      </g>

      {/* ================= BRAÇOS ================= */}
      <g fill="none" strokeLinecap="round">
        <path d="M 112 232 C 84 246 66 272 60 300" stroke={CORES.peleTraco} strokeWidth={32} />
        <path d="M 188 232 C 216 246 234 272 240 300" stroke={CORES.peleTraco} strokeWidth={32} />
        <path d="M 112 232 C 84 246 66 272 60 300" stroke="url(#mg-pele)" strokeWidth={26} />
        <path d="M 188 232 C 216 246 234 272 240 300" stroke="url(#mg-pele)" strokeWidth={26} />
      </g>
      <g fill="url(#mg-pele)" stroke={CORES.peleTraco} strokeWidth={3}>
        <ellipse cx={58} cy={306} rx={16} ry={18} />
        <ellipse cx={242} cy={306} rx={16} ry={18} />
      </g>

      {/* ================= VESTIDO ================= */}
      <path d={VESTIDO} fill="url(#mg-vestido)" stroke={CORES.vestidoTraco} strokeWidth={3} />
      <g clipPath="url(#mg-clip-vestido)">
        <rect x={60} y={200} width={190} height={130} fill="url(#mg-flores)" opacity={0.85} />
        {/* Sombra do lado direito e sob a gola */}
        <ellipse cx={252} cy={280} rx={64} ry={80} fill={CORES.vestidoTraco} opacity={0.3} filter="url(#mg-suave-forte)" />
        <ellipse cx={150} cy={214} rx={62} ry={22} fill={CORES.vestidoTraco} opacity={0.35} filter="url(#mg-suave)" />
        {/* Dobras */}
        <g fill="none" stroke={CORES.vestidoTraco} strokeWidth={4} opacity={0.28} strokeLinecap="round">
          <path d="M 118 246 C 112 272 106 292 100 308" />
          <path d="M 150 250 C 150 274 150 292 150 310" />
          <path d="M 184 246 C 190 272 196 292 202 308" />
        </g>
      </g>
      {/* Alcinhas */}
      <g fill="none" stroke={CORES.vestidoMeio} strokeWidth={9} strokeLinecap="round">
        <path d="M 122 214 C 126 198 130 190 136 184" />
        <path d="M 178 214 C 174 198 170 190 164 184" />
      </g>

      {/* ================= PESCOÇO ================= */}
      <path d="M 126 190 C 128 208 128 216 126 222 L 174 222 C 172 216 172 208 174 190 Z" fill={CORES.peleMeia} />
      <ellipse cx={150} cy={200} rx={30} ry={16} fill={CORES.peleSombra} opacity={0.55} filter="url(#mg-suave)" />

      {/* ================= CABEÇA ================= */}
      <ellipse
        cx={CABECA.cx}
        cy={CABECA.cy}
        rx={CABECA.rx}
        ry={CABECA.ry}
        fill="url(#mg-pele)"
        stroke={CORES.peleTraco}
        strokeWidth={3}
      />
      <g clipPath="url(#mg-clip-cabeca)">
        {/* Sombra do lado direito e sombra que a franja projeta na testa */}
        <ellipse cx={252} cy={140} rx={78} ry={92} fill={CORES.peleSombra} opacity={0.4} filter="url(#mg-suave-forte)" />
        <ellipse cx={150} cy={70} rx={92} ry={34} fill={CORES.peleSombra} opacity={0.5} filter="url(#mg-suave)" />
      </g>

      {/* Orelhinhas */}
      <g fill={CORES.peleMeia} stroke={CORES.peleTraco} strokeWidth={3}>
        <ellipse cx={64} cy={136} rx={11} ry={16} />
        <ellipse cx={236} cy={136} rx={11} ry={16} />
      </g>

      {/* ================= CABELO DA FRENTE ================= */}
      <path d={FRANJA} fill="url(#mg-cabelo)" stroke={CORES.cabeloTraco} strokeWidth={3} />
      <path d={MECHA_ESQ} fill="url(#mg-cabelo)" stroke={CORES.cabeloTraco} strokeWidth={3} />
      <path d={MECHA_DIR} fill="url(#mg-cabelo)" stroke={CORES.cabeloTraco} strokeWidth={3} />

      {/* Faixa de brilho: é ela que faz ler como cabelo e não como capacete */}
      <path
        d="M 92 62 C 116 40 152 34 186 46 C 158 50 122 62 100 84 Z"
        fill={CORES.cabeloBrilho}
        opacity={0.75}
        filter="url(#mg-suave)"
      />
      {/* Fios soltos */}
      <g fill="none" stroke={CORES.cabeloTraco} strokeWidth={3} opacity={0.45} strokeLinecap="round">
        <path d="M 150 32 C 122 44 100 68 90 100" />
        <path d="M 150 34 C 178 46 200 70 210 102" />
        <path d="M 132 40 C 112 56 98 78 92 104" />
      </g>

      {/* Florzinha no cabelo */}
      <g transform="translate(70 74) rotate(-16)">
        <g fill={CORES.vestido} stroke={CORES.vestidoTraco} strokeWidth={2}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-13} rx={8} ry={13} transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r={7} fill={CORES.cabeloBrilho} stroke={CORES.cabeloTraco} strokeWidth={2} />
      </g>

      {/* ================= ROSTO ================= */}
      {/* Sobrancelhas — arqueadas, na cor do cabelo escurecida */}
      <g fill="none" stroke={CORES.cabeloTraco} strokeWidth={7} strokeLinecap="round" opacity={0.85}>
        <path d="M 92 100 C 102 88 118 86 136 96" />
        <path d="M 208 100 C 198 88 182 86 164 96" />
      </g>

      {[
        { cx: 118, lado: -1 },
        { cx: 182, lado: 1 },
      ].map(({ cx, lado }) => (
        <g key={cx}>
          {/* Esclera */}
          <path d={olhoPath(cx, lado)} fill="url(#mg-esclera)" />
          {/* Íris */}
          <circle cx={cx + lado * 2} cy={131} r={17} fill="url(#mg-iris)" />
          {/* Luz refletida no fundo da íris */}
          <path
            d={`M ${cx + lado * 2 - 12} 137 A 13 13 0 0 0 ${cx + lado * 2 + 12} 137`}
            fill={CORES.olhosClaro}
            opacity={0.55}
          />
          {/* Anel límbico */}
          <circle
            cx={cx + lado * 2}
            cy={131}
            r={17}
            fill="none"
            stroke={CORES.olhosEscuro}
            strokeWidth={3}
            opacity={0.8}
          />
          <circle cx={cx + lado * 2} cy={131} r={7.5} fill="#241C1A" />
          {/* Dois brilhos: um grande em cima, um pequeno embaixo do outro lado */}
          <circle cx={cx + lado * 2 - 6} cy={124} r={5.5} fill="#FFFFFF" />
          <circle cx={cx + lado * 2 + 7} cy={139} r={2.8} fill="#FFFFFF" opacity={0.85} />
          {/* Sombra da pálpebra sobre a esclera */}
          <path
            d={olhoPath(cx, lado)}
            fill="none"
            stroke={CORES.peleSombra}
            strokeWidth={7}
            opacity={0.45}
          />
          {/* Linha de cílios superior — grossa no meio, some nas pontas */}
          <path
            d={`M ${cx - 27} 130 C ${cx - 22} 108 ${cx - 6} 100 ${cx + 4} 102 C ${cx + 18} 105 ${cx + 26} 116 ${cx + 28} 131`}
            fill="none"
            stroke={CORES.cabeloTraco}
            strokeWidth={7}
            strokeLinecap="round"
          />
          {/* Cílios no canto externo */}
          <g fill="none" stroke={CORES.cabeloTraco} strokeWidth={4} strokeLinecap="round">
            <path d={`M ${cx + lado * 25} 118 C ${cx + lado * 33} 112 ${cx + lado * 37} 108 ${cx + lado * 39} 104`} />
            <path d={`M ${cx + lado * 27} 128 C ${cx + lado * 36} 126 ${cx + lado * 41} 124 ${cx + lado * 44} 121`} />
          </g>
          {/* Traço leve da pálpebra inferior */}
          <path
            d={`M ${cx - 18} 152 C ${cx - 8} 159 ${cx + 8} 158 ${cx + 20} 149`}
            fill="none"
            stroke={CORES.peleTraco}
            strokeWidth={2.5}
            opacity={0.5}
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Nariz — só a ponta e a sombra, como em ilustração de verdade */}
      <ellipse cx={150} cy={162} rx={9} ry={6} fill={CORES.peleSombra} opacity={0.45} filter="url(#mg-suave)" />
      <circle cx={152} cy={160} r={3.5} fill={CORES.pele} opacity={0.9} />

      {/* Sardinhas */}
      <g fill={CORES.peleTraco} opacity={0.4}>
        {[
          [108, 164], [96, 170], [118, 172], [102, 178], [124, 179],
          [192, 164], [204, 170], [182, 172], [198, 178], [176, 179],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} />
        ))}
      </g>

      {/* Boca: sorriso aberto, não elipse.
          Borda de cima quase reta e cantos subindo; borda de baixo estufada.
          Elipse pura lê como "o" de susto, não como criança cantando. */}
      <g>
        <path
          d={
            `M ${150 - bocaLargura} 184 ` +
            `Q 150 ${180 - bocaAltura * 0.18} ${150 + bocaLargura} 184 ` +
            `Q 150 ${184 + bocaAltura * 2.1} ${150 - bocaLargura} 184 Z`
          }
          fill={CORES.boca}
        />
        {/* Dentinhos de cima, acompanhando a curva do lábio */}
        <path
          d={
            `M ${150 - bocaLargura * 0.82} ${184.5} ` +
            `Q 150 ${181 - bocaAltura * 0.14} ${150 + bocaLargura * 0.82} ${184.5} ` +
            `Q 150 ${186 + Math.min(bocaAltura * 0.5, 7)} ${150 - bocaLargura * 0.82} ${184.5} Z`
          }
          fill="#FFFFFF"
        />
        {/* Língua no fundo */}
        <ellipse
          cx={150}
          cy={184 + bocaAltura * 1.35}
          rx={bocaLargura * 0.52}
          ry={bocaAltura * 0.5}
          fill={CORES.lingua}
        />
      </g>

      {/* Bochechas */}
      <ellipse cx={102} cy={172} rx={22} ry={14} fill={CORES.vestidoMeio} opacity={0.45} filter="url(#mg-suave)" />
      <ellipse cx={198} cy={172} rx={22} ry={14} fill={CORES.vestidoMeio} opacity={0.45} filter="url(#mg-suave)" />
    </svg>
  );
};
