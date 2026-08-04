import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CORES } from "../marca/paleta";
import { FONTE } from "../marca/fonte";

/**
 * Linha da letra na tela.
 *
 * Legenda em vídeo infantil não é acessibilidade só: é o que faz o pai
 * cantar junto, e vídeo que o pai canta junto é vídeo que roda de novo.
 * Também ajuda alfabetização, o que dá um argumento de valor real contra a
 * política de conteúdo inautêntico do YouTube.
 */
export const Legenda: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada com molinha — nada aparece de repente neste canal.
  const entrada = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const y = interpolate(entrada, [0, 1], [90, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 70,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${y}px)`,
        opacity: entrada,
      }}
    >
      <div
        style={{
          background: CORES.branco,
          border: `8px solid ${CORES.traco}`,
          borderRadius: 999,
          padding: "22px 64px",
          maxWidth: 1500,
          textAlign: "center",
          boxShadow: `0 10px 0 ${CORES.traco}22`,
        }}
      >
        <span
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 62,
            lineHeight: 1.1,
            color: CORES.traco,
            letterSpacing: "-0.01em",
          }}
        >
          {texto}
        </span>
      </div>
    </div>
  );
};
