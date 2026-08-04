import React from "react";
import { Composition, Still } from "remotion";
import { Episodio } from "./Episodio";
import { Vinheta } from "./componentes/Vinheta";
import { Capa } from "./componentes/Capa";
import { carregarFonte } from "./marca/fonte";
import type { Episodio as TipoEpisodio } from "./marca/tipos";

// Catálogo de episódios. Pra adicionar o próximo, cria a pasta em
// ../../episodios/, importa o JSON aqui e coloca na lista. Só isso.
import ep001 from "../../episodios/001-as-cores-da-ilha/episodio.json";

carregarFonte();

const EPISODIOS = [ep001] as unknown as TipoEpisodio[];

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
