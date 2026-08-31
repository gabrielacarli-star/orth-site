import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile,
  useVideoConfig, useCurrentFrame, interpolate,
} from "remotion";
import { AppDogFlow } from "./AppDogFlow";

const FPS = 25;
const s = (segundos: number) => Math.round(segundos * FPS);

/** Janela em que o vídeo original mostra a gravação de tela do outro app. */
const APP_INICIO = 11.7;
const APP_FIM = 17.3;

/** Janela em que aparece "¡SE LLAMA EVERYDOGGY!" na imagem. */
const MARCA_INICIO = 18.05;
const MARCA_FIM = 20.25;

/** Faixa vertical onde todo o texto queimado do vídeo fica. */
const FAIXA_TOPO = 470;
const FAIXA_ALTURA = 180;

const FONTE = '"Baloo 2", "Trebuchet MS", system-ui, sans-serif';

/** Texto no mesmo estilo do que já está queimado no vídeo original. */
const Legenda: React.FC<{ texto: string; tamanho?: number }> = ({ texto, tamanho = 56 }) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: FAIXA_TOPO + 8 }}>
      <div
        style={{
          fontFamily: FONTE, fontWeight: 800, fontSize: tamanho, lineHeight: 1.12,
          color: "#FFFFFF", WebkitTextStroke: "9px #12100E", paintOrder: "stroke fill",
          textAlign: "center", maxWidth: 640, textTransform: "uppercase",
          opacity: entrada,
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Tapa o texto antigo desfocando só a faixa onde ele está.
 *
 * Desenhar o texto novo por cima não bastaria: "¡SE LLAMA DOGFLOW!" é mais
 * curto que "¡SE LLAMA EVERYDOGGY!" e sobrariam letras do original nas
 * pontas. Desfocar a faixa resolve, e como o fundo ali é chão de madeira o
 * resultado lê como profundidade de campo, não como remendo.
 */
const TaparFaixa: React.FC = () => {
  // Desfoca a faixa usando `backdrop-filter`, que borra o que JÁ está
  // pintado atrás, em vez de desenhar uma segunda cópia do vídeo por cima.
  //
  // A primeira tentativa foi justamente a segunda cópia, e não funciona:
  // duas instâncias de OffthreadVideo do mesmo arquivo no mesmo frame não
  // decodificam as duas, e a de cima sai preta. Deu pra confirmar medindo o
  // brilho da faixa com o desfoque desligado — 51 contra 142 em volta.
  //
  // A máscara com degradê nas pontas evita a borda dura de um recorte seco.
  const mascara =
    `linear-gradient(to bottom,` +
    ` transparent 0px,` +
    ` black 26px,` +
    ` black ${FAIXA_ALTURA - 26}px,` +
    ` transparent ${FAIXA_ALTURA}px)`;

  return (
    <div
      style={{
        position: "absolute",
        top: FAIXA_TOPO,
        left: 0,
        width: 720,
        height: FAIXA_ALTURA,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        WebkitMaskImage: mascara,
        maskImage: mascara,
      }}
    />
  );
};

export const Anuncio: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  const falas: Array<[number, string]> = [
    [0.10, "ok-1.mp3"],
    [5.45, "ok-2.mp3"],
    [8.86, "ok-3.mp3"],
    [10.50, "ok-4.mp3"],
    [13.73, "ok-5.mp3"],
    [18.30, "ok-6.mp3"],
    [20.30, "ok-7.mp3"],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Vídeo original, mudo — a trilha e a narração são novas */}
      <OffthreadVideo src={staticFile("original.mp4")} muted />

      {/* Trecho do app: cobre a gravação de tela do outro app pela do DogFlow.
          Os dois textos que estavam queimados nesse trecho são redesenhados,
          porque a tela nova cobriria eles junto. */}
      <Sequence from={s(APP_INICIO)} durationInFrames={s(APP_FIM) - s(APP_INICIO)}>
        <AppDogFlow />
        <Sequence durationInFrames={s(13.6) - s(APP_INICIO)}>
          <Legenda texto="Con vídeos cortos" />
        </Sequence>
        <Sequence from={s(13.7) - s(APP_INICIO)}>
          <Legenda texto="Para cualquier problema de comportamiento" tamanho={50} />
        </Sequence>
      </Sequence>

      {/* Troca do nome da marca */}
      <Sequence from={s(MARCA_INICIO)} durationInFrames={s(MARCA_FIM) - s(MARCA_INICIO)}>
        <TaparFaixa />
        <Legenda texto="¡Se llama DogFlow!" tamanho={60} />
      </Sequence>

      {/* Narração nova, cada fala no instante em que a original caía */}
      {falas.map(([t, arquivo]) => (
        <Sequence key={arquivo} from={s(t)}>
          <Audio src={staticFile(arquivo)} volume={1} />
        </Sequence>
      ))}

      {/* Trilha por baixo, com fade no fim */}
      <Audio
        src={staticFile("trilha.mp3")}
        volume={(f) =>
          interpolate(f, [0, 12, durationInFrames - 30, durationInFrames], [0, 0.22, 0.22, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
