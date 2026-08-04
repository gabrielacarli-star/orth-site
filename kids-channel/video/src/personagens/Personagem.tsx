import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Maria } from "./Maria";
import { Pipo } from "./Pipo";
import { Nina } from "./Nina";
import { Bolha } from "./Bolha";
import type { PersonagemEmCena } from "../marca/tipos";

// Tamanho base de cada personagem em pixels, num vídeo de 1920x1080.
// A "escala" no episodio.json multiplica esses valores.
//
// Personagem em vídeo infantil é GRANDE: ocupa quase metade da altura da
// tela. Criança de 2 anos assiste de longe, na TV da sala, e precisa
// enxergar a expressão do rosto. Personagem pequeno num cenário bonito é
// erro clássico de quem vem de design e não de animação infantil.
const TAMANHO_BASE: Record<PersonagemEmCena["quem"], { largura: number; altura: number }> = {
  maria: { largura: 420, altura: 588 },
  pipo: { largura: 400, altura: 434 },
  nina: { largura: 620, altura: 494 },
  bolha: { largura: 340, altura: 340 },
};

const COMPONENTES = { maria: Maria, pipo: Pipo, nina: Nina, bolha: Bolha };

/**
 * Coloca um personagem em cena e cuida de toda a animação "de vida":
 * respiração parada, pulinho, boca abrindo no ritmo, sombra no chão.
 *
 * Cada personagem tem uma "fase" própria (calculada a partir do nome e da
 * posição) pra que dois personagens na mesma cena nunca fiquem quicando em
 * uníssono — isso é o que separa animação viva de bonequinho de PowerPoint.
 *
 * O x,y do episodio.json aponta pros PÉS do personagem, não pro centro:
 * "y = 0.82" quer dizer "os pés encostam a 82% da altura da tela".
 */
export const Personagem: React.FC<{
  dados: PersonagemEmCena;
  /** Batidas por minuto da música — tudo se mexe no tempo dela. */
  bpm?: number;
}> = ({ dados, bpm = 104 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { quem, x, y, escala = 1, cantando = false, espelhado = false } = dados;

  const Desenho = COMPONENTES[quem];
  const base = TAMANHO_BASE[quem];
  const largura = base.largura * escala;
  const altura = base.altura * escala;

  // Fase individual pra dessincronizar personagens na mesma cena.
  const fase = (quem.charCodeAt(0) + x * 37) % 6.28;

  const framesPorBatida = (60 / bpm) * fps;
  const t = (frame / framesPorBatida) * Math.PI + fase;

  // Pulinho. O Bolha quica muito mais que os outros — é a graça dele.
  const alturaPulo = quem === "bolha" ? 52 : 16;
  const subida = Math.abs(Math.sin(t));
  const pulo = subida * -alturaPulo;

  // "Squash and stretch": achata no impacto, estica no ar.
  const impacto = Math.abs(Math.cos(t));
  const deformacao = quem === "bolha" ? 0.1 : 0.035;
  const escalaX = 1 + impacto * deformacao;
  const escalaY = 1 - impacto * deformacao;

  // Boca abrindo em cada colcheia quando o personagem canta.
  const abertura = cantando
    ? interpolate(Math.sin((frame / framesPorBatida) * Math.PI * 2), [-1, 1], [0.15, 1])
    : 0;

  const asas = interpolate(Math.sin(t / 2), [-1, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: largura,
        height: altura,
        transform: "translate(-50%, -100%)",
      }}
    >
      {/* Sombra no chão. Fica FORA do pulo: ela não sobe junto, só encolhe
          conforme o personagem se afasta do chão. É o detalhe que faz o
          personagem parecer apoiado em vez de colado por cima do cenário. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -altura * 0.03,
          width: largura * 0.6 * (1 - subida * 0.28),
          height: altura * 0.07,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "rgba(45, 42, 50, 0.18)",
        }}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${pulo}px) scale(${escalaX * (espelhado ? -1 : 1)}, ${escalaY})`,
          transformOrigin: "center bottom",
        }}
      >
        <Desenho abertura={abertura} asas={asas} />
      </div>
    </div>
  );
};
