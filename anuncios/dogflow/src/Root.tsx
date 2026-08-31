import React from "react";
import { Composition } from "remotion";
import { Anuncio } from "./Anuncio";
import { carregarFonte } from "./fonte";

carregarFonte();

/**
 * Onde o anúncio termina, em segundos.
 *
 * O vídeo original tem 25,11s, mas os últimos 3 segundos são o cartão final
 * da EveryDoggy — logo, nome e botões de loja de outra marca. Cortar ali é
 * obrigatório, não estético: é a única parte do vídeo que não dá pra
 * localizar por cima.
 *
 * 22,10s é o último frame limpo. A partir de 22,15s o cartão já começa a
 * aparecer em fade. A última fala ("Toca abajo para probarla") entra aos
 * 20,30s e dura 1,62s, então termina aos 21,92s — cabe inteira.
 *
 * O fade da trilha no Anuncio.tsx é relativo à duração, então ele acompanha
 * este corte sozinho.
 */
const FIM = 22.1;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="anuncio"
    component={Anuncio}
    durationInFrames={Math.round(FIM * 25)}
    fps={25}
    width={720}
    height={1280}
  />
);
