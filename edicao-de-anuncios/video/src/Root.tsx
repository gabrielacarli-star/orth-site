import React from "react";
import { Composition } from "remotion";
import { Anuncio } from "./Anuncio";
import { carregarFonte } from "./fonte";

// Catálogo dos anúncios. Este arquivo é GERADO — rode
// `python3 scripts/indexar.py` depois de criar ou editar um anuncio.json.
import { ANUNCIOS } from "./anuncios";

carregarFonte();

export const RemotionRoot: React.FC = () => (
  <>
    {ANUNCIOS.map((dados) => (
      <Composition
        key={dados.id}
        id={dados.id}
        component={Anuncio}
        durationInFrames={Math.round(dados.duracaoSegundos * dados.fps)}
        fps={dados.fps}
        width={720}
        height={1280}
        defaultProps={{ dados }}
      />
    ))}
  </>
);
