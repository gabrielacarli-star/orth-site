import React from "react";
import { Composition, Still } from "remotion";
import { Episodio } from "./Episodio";
import { Vinheta } from "./componentes/Vinheta";
import { Capa } from "./componentes/Capa";
import { CapaStreaming } from "./componentes/CapaStreaming";
import { carregarFonte } from "./marca/fonte";

// Catálogo de episódios. Pra adicionar o próximo: escreva o roteiro em
// scripts/roteiros.py e rode `python3 scripts/criar_episodio.py` — ele cria
// a pasta e regenera este índice sozinho.
import { EPISODIOS } from "./episodios";

carregarFonte();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {EPISODIOS.map((ep) => (
        <React.Fragment key={ep.id}>
          {/* Episódio completo — é este que sobe pro YouTube. */}
          <Composition
            id={`ep-${ep.id}`}
            component={Episodio}
            durationInFrames={Math.round(ep.duracaoSegundos * ep.fps)}
            fps={ep.fps}
            width={1920}
            height={1080}
            defaultProps={{ episodio: ep }}
          />

          {/* Prévia de 30s — pra revisar rápido sem esperar o render inteiro. */}
          <Composition
            id={`previa-${ep.id}`}
            component={Episodio}
            durationInFrames={30 * ep.fps}
            fps={ep.fps}
            width={1920}
            height={1080}
            defaultProps={{ episodio: ep }}
          />

          {/* Thumbnail no formato do YouTube: uma cena do refrão com o
              título por cima. Mude `momentoSegundos` pra escolher outra cena. */}
          <Still
            id={`capa-${ep.id}`}
            component={Capa}
            width={1280}
            height={720}
            defaultProps={{ episodio: ep, momentoSegundos: 30 }}
          />
        </React.Fragment>
      ))}

      {/* Capa quadrada do álbum, pra Spotify/Apple/Deezer (Fase 6).
          Eles exigem 3000x3000 exatos. */}
      <Still
        id="capa-streaming"
        component={CapaStreaming}
        width={3000}
        height={3000}
        defaultProps={{ titulo: "Ilha Pipoca", artista: "Maria e Amigos" }}
      />

      {/* A vinheta sozinha, pra conferir a marca sem abrir um episódio. */}
      <Composition
        id="vinheta"
        component={Vinheta}
        durationInFrames={8 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
