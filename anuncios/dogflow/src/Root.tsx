import React from "react";
import { Composition } from "remotion";
import { Anuncio } from "./Anuncio";
import { carregarFonte } from "./fonte";

carregarFonte();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="anuncio"
    component={Anuncio}
    durationInFrames={Math.round(25.11 * 25)}
    fps={25}
    width={720}
    height={1280}
  />
);
