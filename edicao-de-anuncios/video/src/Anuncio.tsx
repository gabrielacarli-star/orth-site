import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile,
  useCurrentFrame, useVideoConfig, interpolate,
} from "remotion";
import type { Anuncio as Dados } from "./tipos";

/**
 * Monta o anúncio a partir do anuncio.json. Não tem nada específico de um
 * anúncio aqui dentro — troque o JSON e é outro vídeo.
 *
 * A ordem das camadas importa: vídeo mudo por baixo, faixas de desfoque
 * por cima dele, textos novos por cima do desfoque, áudio por fora de
 * tudo.
 */

const FONTE = '"Baloo 2", "Trebuchet MS", system-ui, sans-serif';

/**
 * Texto no estilo de legenda queimada de rede social: branco com contorno
 * preto grosso. É o que a maioria dos criativos usa, então o texto novo
 * some no meio dos que já estavam lá.
 */
const Texto: React.FC<{
  texto: string; topo: number; tamanho: number; largura: number;
}> = ({ texto, topo, tamanho, largura }) => {
  const frame = useCurrentFrame();
  // Fade de 4 frames: sem isso o texto "aparece" com um estalo visual que
  // denuncia a montagem.
  const entrada = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: topo }}
    >
      <div
        style={{
          fontFamily: FONTE, fontWeight: 800, fontSize: tamanho, lineHeight: 1.12,
          color: "#FFFFFF", WebkitTextStroke: "9px #12100E", paintOrder: "stroke fill",
          textAlign: "center", maxWidth: largura, textTransform: "uppercase",
          opacity: entrada,
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Tapa uma faixa do vídeo desfocando o que está atrás.
 *
 * Serve pra apagar texto queimado — o nome de outra marca, por exemplo —
 * quando o texto novo é mais curto e não cobriria as pontas do antigo.
 *
 * Usa `backdrop-filter`, que borra o que JÁ está pintado atrás. A
 * tentação é desenhar uma segunda cópia do vídeo desfocada por cima:
 * **não funciona**. Duas instâncias de OffthreadVideo do mesmo arquivo no
 * mesmo frame não decodificam as duas, e a de cima sai preta. Se
 * desconfiar, meça o brilho da faixa com o desfoque desligado.
 *
 * A máscara com degradê nas pontas evita a borda dura de um recorte seco —
 * num fundo texturizado o resultado lê como profundidade de campo, não
 * como remendo.
 */
const Faixa: React.FC<{ topo: number; altura: number; desfoque: number }> = ({
  topo, altura, desfoque,
}) => {
  const suave = Math.min(26, altura / 4);
  const mascara =
    `linear-gradient(to bottom, transparent 0px, black ${suave}px,` +
    ` black ${altura - suave}px, transparent ${altura}px)`;

  return (
    <div
      style={{
        position: "absolute", top: topo, left: 0, width: "100%", height: altura,
        backdropFilter: `blur(${desfoque}px)`,
        WebkitBackdropFilter: `blur(${desfoque}px)`,
        WebkitMaskImage: mascara, maskImage: mascara,
      }}
    />
  );
};

export const Anuncio: React.FC<{ dados: Dados }> = ({ dados }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const f = (segundos: number) => Math.round(segundos * fps);

  const prefixo = dados.prefixo ?? dados.id;
  const cantado = dados.audio === "jingle";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Vídeo original, sempre mudo: todo o áudio é novo. */}
      <OffthreadVideo src={staticFile(dados.video)} muted />

      {/* Textos novos, cada um com sua faixa de desfoque por baixo. */}
      {(dados.textos ?? []).map((t, i) => (
        <Sequence key={i} from={f(t.de)} durationInFrames={f(t.ate) - f(t.de)}>
          {t.taparAltura ? (
            <Faixa
              topo={t.topo ?? 470}
              altura={t.taparAltura}
              desfoque={t.desfoque ?? 16}
            />
          ) : null}
          <Texto
            texto={t.texto}
            topo={(t.topo ?? 470) + 8}
            tamanho={t.tamanho ?? 56}
            largura={t.largura ?? 640}
          />
        </Sequence>
      ))}

      {cantado ? (
        /* Jingle cantado: é o áudio inteiro, então entra alto. Fade curto
           nas pontas só pra não estalar. */
        <Audio
          src={staticFile(dados.jingle!.arquivo)}
          volume={(x) =>
            interpolate(
              x,
              [0, 6, durationInFrames - 24, durationInFrames],
              [0, dados.jingle!.volume ?? 0.9, dados.jingle!.volume ?? 0.9, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : (
        <>
          {/* Cada fala no instante em que a original entrava. */}
          {(dados.falas ?? []).map((fala, i) => (
            <Sequence key={i} from={f(fala.em)}>
              <Audio src={staticFile(`${prefixo}-${i + 1}.mp3`)} volume={1} />
            </Sequence>
          ))}

          {/* Trilha por baixo. O fade é relativo à duração da composição,
              então ele acompanha sozinho se você cortar o fim do vídeo. */}
          {dados.trilha ? (
            <Audio
              src={staticFile(dados.trilha.arquivo)}
              volume={(x) =>
                interpolate(
                  x,
                  [0, 15, durationInFrames - 36, durationInFrames],
                  [0, dados.trilha!.volume ?? 0.24, dados.trilha!.volume ?? 0.24, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                )
              }
            />
          ) : null}
        </>
      )}
    </AbsoluteFill>
  );
};
