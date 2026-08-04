import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useVideoConfig } from "remotion";
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

const UmaCena: React.FC<{ cena: Cena }> = ({ cena }) => (
  <AbsoluteFill>
    <Cenario nome={cena.cenario} />
    {cena.personagens.map((p, i) => (
      <Personagem key={`${p.quem}-${i}`} dados={p} />
    ))}
    {cena.legenda ? <Legenda texto={cena.legenda} /> : null}
  </AbsoluteFill>
);

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
          <UmaCena cena={cena} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
