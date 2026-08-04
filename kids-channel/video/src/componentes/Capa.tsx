import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Episodio } from "../Episodio";
import { CORES } from "../marca/paleta";
import { FONTE } from "../marca/fonte";
import type { Episodio as TipoEpisodio } from "../marca/tipos";

/**
 * Thumbnail do episódio.
 *
 * Não é um print de um frame qualquer: é uma cena escolhida do episódio com
 * o título por cima, em texto grande e contornado. Em canal infantil a
 * miniatura é vista de longe, na TV, muitas vezes por quem ainda não lê —
 * então vale mais rosto grande de personagem do que texto bonito.
 *
 * O truque do `Sequence from={-momento}`: deslocamento negativo faz o
 * conteúdo enxergar um frame lá na frente do episódio já no frame 0. É como
 * a gente congela o refrão numa composição `Still`, que por definição só
 * tem um frame.
 */
export const Capa: React.FC<{
  episodio: TipoEpisodio;
  /** Em que segundo do episódio congelar. */
  momentoSegundos: number;
}> = ({ episodio, momentoSegundos }) => {
  const { fps, width } = useVideoConfig();

  // A animação é desenhada pra 1920x1080 e usa tamanhos em pixel. Pra capa
  // em 1280x720, monta em 1920x1080 mesmo e reduz tudo junto — assim a capa
  // é exatamente o frame do vídeo, e não um enquadramento diferente.
  const reducao = width / 1920;

  // Na capa a legenda do episódio sai: quem manda o recado é o título.
  const semLegenda: TipoEpisodio = {
    ...episodio,
    cenas: episodio.cenas.map(({ legenda: _legenda, ...cena }) => cena),
  };

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          transform: `scale(${reducao})`,
          transformOrigin: "top left",
        }}
      >
        <Sequence from={-Math.round(momentoSegundos * fps)}>
          <Episodio episodio={semLegenda} />
        </Sequence>
      </div>

      {/* Tarja do título, cobrindo a legenda do próprio episódio */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 28,
        }}
      >
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 104,
            lineHeight: 1,
            textAlign: "center",
            color: CORES.pipo,
            WebkitTextStroke: `14px ${CORES.traco}`,
            paintOrder: "stroke fill",
            maxWidth: "92%",
          }}
        >
          {episodio.titulo}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
