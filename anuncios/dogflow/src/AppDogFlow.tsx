import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

/**
 * Tela do app DogFlow, recriada em código a partir do print.
 *
 * Recriar em vez de usar a imagem parada resolve dois problemas de uma vez:
 * dá pra ANIMAR a rolagem (o trecho original é uma gravação de tela rolando,
 * e imagem parada quebraria o ritmo) e o resultado fica nítido em qualquer
 * resolução, sem o serrilhado de um print esticado pra 720x1280.
 */

const ROXO = "#7C3AED";
const AMARELO = "#FDE047";
const TINTA = "#1E1B4B";
const AZUL = "#4F46E5";
const BORDA = "#E7E7EF";

const CURSOS = [
  { titulo: "Cachorro — curso básico", sub: "Socialización y los primeros pasos en casa", tag: "EN CURSO" },
  { titulo: "Perro adulto — curso básico", sub: "Para perros de más de 10 meses" },
  { titulo: "Juegos contra el aburrimiento", sub: "Mantén la cabeza de tu perro ocupada" },
  { titulo: "Trucos para impresionar", sub: "Trucos divertidos que quedan bien en vídeo" },
  { titulo: "Paseo sin tirones", sub: "Camina tranquilo contigo, sin correa tensa" },
  { titulo: "Quedarse solo en casa", sub: "Adiós a la ansiedad por separación" },
  { titulo: "Silbato y llamada", sub: "Que vuelva a ti a la primera" },
  { titulo: "Buenos modales", sub: "Nada de saltar sobre las visitas" },
];

const Pata: React.FC<{ tamanho: number; cor: string }> = ({ tamanho, cor }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 100 100">
    <g fill={cor}>
      <ellipse cx={30} cy={30} rx={11} ry={14} />
      <ellipse cx={52} cy={22} rx={11} ry={15} />
      <ellipse cx={73} cy={32} rx={11} ry={14} />
      <ellipse cx={84} cy={54} rx={10} ry={12} />
      <path d="M 30 58 C 44 46 62 46 74 60 C 84 72 78 86 62 86 C 52 86 46 86 38 86 C 24 86 20 70 30 58 Z" />
    </g>
  </svg>
);

export const AppDogFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Rolagem lenta, como o dedo de alguém percorrendo a tela.
  const rolagem = interpolate(frame, [0, durationInFrames], [0, 470], {
    extrapolateRight: "clamp",
  });
  // Entra com um leve zoom, pra o corte não ser seco.
  const zoom = interpolate(frame, [0, fps * 1.5], [1.06, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#FFFFFF",
        overflow: "hidden",
        fontFamily: '"Nunito", "Trebuchet MS", system-ui, sans-serif',
        transform: `scale(${zoom})`,
      }}
    >
      {/* Cabeçalho fixo */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 132,
          display: "flex", alignItems: "center", gap: 18, padding: "0 34px",
          borderBottom: `2px solid ${BORDA}`, background: "#FFFFFF", zIndex: 2,
        }}
      >
        <div
          style={{
            width: 62, height: 62, borderRadius: 16, background: ROXO,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Pata tamanho={38} cor="#FFFFFF" />
        </div>
        <span style={{ fontSize: 42, fontWeight: 800, color: TINTA }}>DogFlow</span>
      </div>

      {/* Conteúdo que rola */}
      <div style={{ position: "absolute", top: 132, left: 0, right: 0, transform: `translateY(${-rolagem}px)` }}>
        <div style={{ padding: "34px 34px 0" }}>
          <div style={{ fontSize: 54, fontWeight: 800, color: TINTA, marginBottom: 26 }}>Cursos</div>

          {CURSOS.map((c) => (
            <div
              key={c.titulo}
              style={{
                display: "flex", gap: 22, alignItems: "center",
                background: "#FFFFFF", border: `2px solid ${BORDA}`, borderRadius: 22,
                padding: 22, marginBottom: 20,
                boxShadow: "0 3px 10px rgba(30,27,75,0.05)",
              }}
            >
              <div
                style={{
                  width: 96, height: 96, borderRadius: 18, background: AMARELO,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Pata tamanho={58} cor={TINTA} />
              </div>
              <div style={{ minWidth: 0 }}>
                {c.tag ? (
                  <span
                    style={{
                      display: "inline-block", background: "#D7F7E2", color: "#158B4B",
                      fontSize: 20, fontWeight: 800, letterSpacing: 0.6,
                      padding: "5px 14px", borderRadius: 8, marginBottom: 10,
                    }}
                  >
                    {c.tag}
                  </span>
                ) : null}
                <div style={{ fontSize: 29, fontWeight: 800, color: TINTA, lineHeight: 1.15 }}>{c.titulo}</div>
                <div style={{ fontSize: 23, color: AZUL, marginTop: 5, lineHeight: 1.2 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra de baixo, fixa */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 116,
          borderTop: `2px solid ${BORDA}`, background: "#FFFFFF", zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "space-around",
          fontSize: 24, fontWeight: 700,
        }}
      >
        <span style={{ color: ROXO }}>Mi curso</span>
        <span style={{ color: "#9A9AB0" }}>Entrenamiento</span>
        <span style={{ color: "#9A9AB0" }}>Silbato</span>
        <span style={{ color: "#9A9AB0" }}>Otros</span>
      </div>
    </div>
  );
};
