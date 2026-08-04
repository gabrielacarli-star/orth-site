import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CORES } from "../marca/paleta";
import { FONTE } from "../marca/fonte";
import { NuvemPipoca } from "../cenarios/elementos";
import { Maria } from "../personagens/Maria";

/**
 * Vinheta de abertura — 8 segundos, IDÊNTICA em todo episódio.
 *
 * Repetição exata é de propósito: é o sinal que a criança usa pra saber
 * "é o meu desenho". Também é o que constrói reconhecimento de marca, que é
 * o degrau necessário pra licenciamento lá na frente (Fase 1, seção 2.4).
 */
export const Vinheta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pulo = spring({ frame: frame - 8, fps, config: { damping: 9, mass: 0.6 } });
  const nome = spring({ frame: frame - 26, fps, config: { damping: 12 } });

  // Sai de cena no último meio segundo.
  const saida = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, ${CORES.ceuClaro}, ${CORES.ceu})`,
        opacity: saida,
      }}
    >
      <NuvemPipoca x={180} y={120} tamanho={280} opacidade={0.9} />
      <NuvemPipoca x={1420} y={180} tamanho={240} opacidade={0.85} />
      <NuvemPipoca x={760} y={60} tamanho={200} opacidade={0.7} />

      {/* Maria entra pulando */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 108,
          width: 470,
          height: 646,
          transform: `translateX(-50%) scale(${pulo}) rotate(${interpolate(pulo, [0, 1], [-25, 0])}deg)`,
        }}
      >
        <Maria abertura={0.35} />
      </div>

      {/* Nome do canal */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 720,
          textAlign: "center",
          transform: `scale(${nome})`,
          opacity: nome,
        }}
      >
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 132,
            color: CORES.branco,
            WebkitTextStroke: `12px ${CORES.traco}`,
            paintOrder: "stroke fill",
            letterSpacing: "-0.02em",
          }}
        >
          Maria e Amigos
        </div>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 700,
            fontSize: 48,
            color: CORES.traco,
            marginTop: 6,
            opacity: 0.75,
          }}
        >
          Ilha Pipoca
        </div>
      </div>
    </AbsoluteFill>
  );
};
