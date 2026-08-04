import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CORES } from "../marca/paleta";
import { NuvemPipoca, Coqueiro, Sol, Estrela } from "./elementos";
import type { NomeCenario } from "../marca/tipos";

const L = 1920;
const A = 1080;

/** Faixa de mar com ondas que sobem e descem devagar. */
const Mar: React.FC<{ topo: number }> = ({ topo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) * 0.8;

  // Duas ondas em velocidades diferentes dão sensação de profundidade
  // sem custo nenhum de render.
  const onda = (desloc: number, amp: number) => {
    const pontos: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const px = (i / 24) * L;
      const py = topo + Math.sin(i * 0.7 + t * 2 + desloc) * amp;
      pontos.push(`${i === 0 ? "M" : "L"} ${px} ${py}`);
    }
    return `${pontos.join(" ")} L ${L} ${A} L 0 ${A} Z`;
  };

  return (
    <svg viewBox={`0 0 ${L} ${A}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="cg-mar-raso" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9EE0F5" />
          <stop offset="100%" stopColor="#5FC0E8" />
        </linearGradient>
        <linearGradient id="cg-mar-fundo" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#41A9DC" />
          <stop offset="100%" stopColor="#1F7FB8" />
        </linearGradient>
      </defs>
      <path d={onda(0, 14)} fill="url(#cg-mar-raso)" />
      <path d={onda(2.2, 10)} fill="url(#cg-mar-fundo)" />
      {/* Faixa de espuma onde a onda quebra */}
      <path d={onda(2.2, 10)} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} />
    </svg>
  );
};

/** Praia — cenário principal do pilar Dia. */
const Praia: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;

  // Nuvens andam devagar e voltam pro começo (loop infinito sem emenda).
  const deriva = (velocidade: number, inicio: number) =>
    ((inicio + s * velocidade) % (L + 400)) - 300;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#BFEAFF 0%, #9BDCFB 46%, #7ACDF6 100%)" }}>
      <Sol x={1340} y={44} tamanho={300} giro={s * 6} />

      <NuvemPipoca x={deriva(14, 120)} y={110} tamanho={300} opacidade={0.95} />
      <NuvemPipoca x={deriva(9, 780)} y={220} tamanho={220} opacidade={0.8} />
      <NuvemPipoca x={deriva(19, 1380)} y={80} tamanho={180} opacidade={0.85} />

      {/* Mar ocupa a faixa do meio */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(500px 0 ${A - 760}px 0)` }}>
        <Mar topo={520} />
      </div>

      {/* Areia */}
      <svg viewBox={`0 0 ${L} ${A}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="cg-areia" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF0CE" />
            <stop offset="52%" stopColor={CORES.areia} />
            <stop offset="100%" stopColor="#F3D191" />
          </linearGradient>
        </defs>
        <path d={`M 0 780 C 400 740 1100 800 ${L} 750 L ${L} ${A} L 0 ${A} Z`} fill="url(#cg-areia)" />
        {/* Areia molhada na beira, em vez de traço preto */}
        <path
          d={`M 0 780 C 400 740 1100 800 ${L} 750`}
          fill="none"
          stroke="#E9C489"
          strokeWidth={16}
          opacity={0.7}
        />
        <path
          d={`M 0 786 C 400 746 1100 806 ${L} 756`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={5}
          opacity={0.45}
        />
      </svg>

      <Coqueiro x={210} y={900} tamanho={420} />
      <Coqueiro x={1730} y={950} tamanho={480} espelhado />
    </AbsoluteFill>
  );
};

/** Coqueiral — usado em episódios de frutas, cores e tamanhos. */
const Coqueiral: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#CFF1FF 0%, #A6E1FC 55%, #86D2F7 100%)" }}>
      <NuvemPipoca x={((200 + s * 11) % 2300) - 300} y={90} tamanho={260} opacidade={0.9} />
      <NuvemPipoca x={((1100 + s * 7) % 2300) - 300} y={200} tamanho={200} opacidade={0.75} />

      {/* Colinas ao fundo */}
      <svg viewBox={`0 0 ${L} ${A}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="cg-colina" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A6E9C0" />
            <stop offset="100%" stopColor="#63CC8C" />
          </linearGradient>
          <linearGradient id="cg-grama" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5FD08C" />
            <stop offset="100%" stopColor="#2E9954" />
          </linearGradient>
        </defs>
        <ellipse cx={420} cy={880} rx={620} ry={280} fill="url(#cg-colina)" />
        <ellipse cx={1500} cy={900} rx={700} ry={300} fill="url(#cg-colina)" />
        <path d={`M 0 800 C 500 760 1300 830 ${L} 780 L ${L} ${A} L 0 ${A} Z`} fill="url(#cg-grama)" />
        <path
          d={`M 0 800 C 500 760 1300 830 ${L} 780`}
          fill="none"
          stroke="#8BE0AC"
          strokeWidth={8}
          opacity={0.6}
        />
      </svg>

      <Coqueiro x={330} y={880} tamanho={520} />
      <Coqueiro x={980} y={840} tamanho={400} espelhado />
      <Coqueiro x={1650} y={900} tamanho={560} />
    </AbsoluteFill>
  );
};

/** Casa da árvore — cenário das músicas de rotina (banho, dentes, dormir). */
const CasaDaArvore: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#D6F2FF 0%, #AEE3FA 48%, #FFE9BD 100%)" }}>
    <svg viewBox={`0 0 ${L} ${A}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="cg-tronco-casa" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C99457" />
          <stop offset="45%" stopColor="#A9762F" />
          <stop offset="100%" stopColor="#7C5320" />
        </linearGradient>
        <radialGradient id="cg-copa" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#8DE3AD" />
          <stop offset="55%" stopColor={CORES.verde} />
          <stop offset="100%" stopColor="#249B52" />
        </radialGradient>
        <linearGradient id="cg-parede" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF3D6" />
          <stop offset="100%" stopColor="#F0D296" />
        </linearGradient>
        <linearGradient id="cg-telhado" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FF9A9A" />
          <stop offset="100%" stopColor="#DE4B4B" />
        </linearGradient>
        <linearGradient id="cg-chao" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5FD08C" />
          <stop offset="100%" stopColor="#2E9954" />
        </linearGradient>
      </defs>

      {/* Tronco */}
      <path d="M 880 1080 L 880 420 L 1060 420 L 1060 1080 Z" fill="url(#cg-tronco-casa)" />
      <g fill="none" stroke="#7C5320" strokeWidth={5} opacity={0.35} strokeLinecap="round">
        <path d="M 906 520 q 30 16 60 0" />
        <path d="M 906 660 q 30 16 60 0" />
        <path d="M 906 800 q 30 16 60 0" />
        <path d="M 906 940 q 30 16 60 0" />
      </g>

      {/* Copa */}
      <g fill="url(#cg-copa)">
        <circle cx={760} cy={300} r={200} />
        <circle cx={1180} cy={280} r={220} />
        <circle cx={970} cy={200} r={230} />
      </g>

      {/* Piso da casinha */}
      <rect x={520} y={620} width={900} height={40} rx={20} fill="#C98A3E" />

      {/* Parede + telhado */}
      <rect x={600} y={380} width={740} height={250} rx={24} fill="url(#cg-parede)" />
      <path d="M 560 390 L 970 200 L 1380 390 Z" fill="url(#cg-telhado)" />

      {/* Janela redonda */}
      <circle cx={970} cy={490} r={78} fill="#CFEFFF" stroke="#E0BE84" strokeWidth={8} />
      <path d="M 892 490 L 1048 490 M 970 412 L 970 568" stroke="#E0BE84" strokeWidth={8} />

      {/* Chão */}
      <path d={`M 0 900 L ${L} 880 L ${L} ${A} L 0 ${A} Z`} fill="url(#cg-chao)" />
    </svg>
  </AbsoluteFill>
);

/** Céu noturno — o cenário inteiro do pilar Noite. */
const CeuNoturno: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps;

  // Estrelas com posição fixa (pseudo-aleatória determinística: precisa ser
  // igual em todo render, senão elas "pulam" entre os frames).
  const estrelas = Array.from({ length: 34 }).map((_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    const seed2 = (i * 4021 + 7919) % 104729;
    return {
      x: r * L,
      y: (seed2 / 104729) * 560,
      tamanho: 16 + ((i * 7) % 20),
      // Piscada lenta e dessincronizada. Nunca mais rápido que 1x por
      // segundo — regra de segurança da Fase 2 (fotossensibilidade).
      brilho: 0.45 + 0.45 * Math.sin(s * 0.9 + i),
    };
  });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(${CORES.noite}, ${CORES.noiteClaro})` }}>
      {estrelas.map((e, i) => (
        <Estrela key={i} {...e} />
      ))}

      {/* Lua */}
      <svg viewBox="0 0 200 200" width={280} style={{ position: "absolute", left: 1480, top: 90 }}>
        <circle cx={100} cy={100} r={78} fill={CORES.pipoClaro} />
        <circle cx={78} cy={82} r={12} fill={CORES.areiaEscuro} opacity={0.4} />
        <circle cx={118} cy={116} r={16} fill={CORES.areiaEscuro} opacity={0.35} />
        <circle cx={126} cy={70} r={9} fill={CORES.areiaEscuro} opacity={0.4} />
      </svg>

      {/* Mar escuro + areia */}
      <svg viewBox={`0 0 ${L} ${A}`} style={{ position: "absolute", inset: 0 }}>
        <path d={`M 0 640 L ${L} 620 L ${L} 830 L 0 850 Z`} fill="#12205C" />
        <path d={`M 0 850 C 500 810 1300 870 ${L} 830 L ${L} ${A} L 0 ${A} Z`} fill="#2A3C7A" />
      </svg>
    </AbsoluteFill>
  );
};

const MAPA: Record<NomeCenario, React.FC> = {
  praia: Praia,
  coqueiral: Coqueiral,
  "casa-da-arvore": CasaDaArvore,
  "ceu-noturno": CeuNoturno,
};

export const Cenario: React.FC<{ nome: NomeCenario }> = ({ nome }) => {
  const Desenho = MAPA[nome];
  return <Desenho />;
};
