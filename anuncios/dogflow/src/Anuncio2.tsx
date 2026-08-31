import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile,
  useVideoConfig, interpolate,
} from "remotion";

const FPS = 30;
const s = (segundos: number) => Math.round(segundos * FPS);

/**
 * Segundo anúncio: uma montagem de cinco ganchos ("cómo evitar que...").
 *
 * Diferente do primeiro, aqui não há nada de outra marca pra trocar na
 * imagem — nem gravação de tela de app, nem nome queimado, nem cartão
 * final. O texto na tela é genérico e continua valendo. Então o trabalho é
 * só o áudio: narração nova e trilha nova por baixo.
 *
 * Vale registrar o outro lado disso: o vídeo também não menciona o DogFlow
 * em lugar nenhum, e termina 3 segundos depois da última fala sem chamada
 * pra ação. Como peça de tráfego ele prende atenção, mas não manda ninguém
 * a lugar nenhum.
 */

/**
 * Onde cada fala entra, em segundos.
 *
 * São os instantes em que as falas ORIGINAIS entravam, obtidos
 * transcrevendo o vídeo com timestamp por palavra. Manter as mesmas marcas
 * é o que faz a narração casar com o corte e com o texto queimado na tela,
 * sem reeditar imagem nenhuma.
 *
 * A primeira foi de 0,22s pra 0,10s: é a única fala longa demais pro
 * espaço que tem até a próxima, e adiantar 0,12s foi mais barato que
 * acelerá-la além do resto.
 */
const NARRACAO: Array<[number, string]> = [
  [0.10, "n2-1.mp3"],
  [3.56, "n2-2.mp3"],
  [8.96, "n2-3.mp3"],
  [16.46, "n2-4.mp3"],
  [21.26, "n2-5.mp3"],
];

export const Anuncio2: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Vídeo original, mudo — a narração e a trilha são novas */}
      <OffthreadVideo src={staticFile("original-2.mp4")} muted />

      {/* Narração nova, cada fala no instante em que a original caía */}
      {NARRACAO.map(([t, arquivo]) => (
        <Sequence key={arquivo} from={s(t)}>
          <Audio src={staticFile(arquivo)} volume={1} />
        </Sequence>
      ))}

      {/* Trilha por baixo.
          Um pouco mais alta que a do primeiro anúncio (0,26 contra 0,22):
          lá ela acompanhava uma narração quase contínua, aqui ela fica
          sozinha em três trechos longos entre um gancho e outro. */}
      <Audio
        src={staticFile("trilha-2.mp3")}
        volume={(f) =>
          interpolate(f, [0, 15, durationInFrames - 36, durationInFrames], [0, 0.26, 0.26, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
