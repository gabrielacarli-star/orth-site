import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Cenario } from "./cenarios/Cenario";
import { Personagem } from "./personagens/Personagem";
import { Legenda } from "./componentes/Legenda";
import { Vinheta } from "./componentes/Vinheta";
import type { Episodio as TipoEpisodio, Cena } from "./marca/tipos";

/**
 * Monta o episódio inteiro a partir do episodio.json.
 *
 * Nada aqui é escrito à mão por episódio: muda o JSON, muda o vídeo. É esse
 * desacoplamento que permite o pipeline gerar episódio novo sem tocar em
 * código, e permite trocar a faixa de áudio pra outro idioma sem refazer
 * nada da animação (Fase 1, seção 2.3).
 */

/**
 * Movimento lento de câmera.
 *
 * Cena parada é o que mais denuncia vídeo montado por template — e é
 * literalmente o critério que a política de conteúdo inautêntico do YouTube
 * descreve ("pouca ou nenhuma variação"). Um zoom de 4% ao longo da cena
 * resolve: quase imperceptível conscientemente, mas a imagem nunca congela.
 *
 * A direção alterna por cena (uma aproxima, a outra afasta) e o lado do
 * deslocamento também. Como depende só do índice da cena, o resultado é
 * determinístico: renderiza igual toda vez.
 */
const useCamera = (indice: number, duracaoEmFrames: number) => {
  const frame = useCurrentFrame();
  const avanco = interpolate(frame, [0, duracaoEmFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const aproxima = indice % 2 === 0;
  const paraDireita = indice % 4 < 2;

  const zoom = aproxima
    ? interpolate(avanco, [0, 1], [1.0, 1.04])
    : interpolate(avanco, [0, 1], [1.04, 1.0]);

  // O deslocamento é pequeno de propósito: com zoom de 4% sobra pouca margem,
  // e passar dela mostraria a borda preta do cenário.
  const desloca = interpolate(avanco, [0, 1], [0, paraDireita ? 14 : -14]);

  return { transform: `scale(${zoom}) translateX(${desloca}px)` };
};

const UmaCena: React.FC<{ cena: Cena; indice: number; duracaoEmFrames: number }> = ({
  cena,
  indice,
  duracaoEmFrames,
}) => {
  const camera = useCamera(indice, duracaoEmFrames);

  return (
    <AbsoluteFill>
      {/* A câmera move cenário e personagens juntos... */}
      <AbsoluteFill style={camera}>
        <Cenario nome={cena.cenario} />
        {cena.personagens.map((p, i) => (
          <Personagem key={`${p.quem}-${i}`} dados={p} />
        ))}
      </AbsoluteFill>

      {/* ...mas NÃO a legenda: texto que escorrega junto com a câmera fica
          difícil de acompanhar, e quem lê é o pai cantando junto. */}
      {cena.legenda ? <Legenda texto={cena.legenda} /> : null}
    </AbsoluteFill>
  );
};

export const Episodio: React.FC<{ episodio: TipoEpisodio }> = ({ episodio }) => {
  const { fps } = useVideoConfig();
  const emFrames = (segundos: number) => Math.round(segundos * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* A música cobre o episódio inteiro. Sem arquivo, renderiza mudo —
          é assim que dá pra ver a animação antes de gerar o áudio. */}
      {episodio.audio ? <Audio src={staticFile(episodio.audio)} /> : null}

      {/* Vinheta de marca, sempre nos primeiros 8 segundos */}
      <Sequence durationInFrames={emFrames(8)}>
        <Vinheta />
      </Sequence>

      {episodio.cenas.map((cena, i) => (
        <Sequence
          key={i}
          from={emFrames(cena.de)}
          durationInFrames={emFrames(cena.ate - cena.de)}
        >
          <UmaCena cena={cena} indice={i} duracaoEmFrames={emFrames(cena.ate - cena.de)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
