import React from "react";
import { AbsoluteFill } from "remotion";
import { CORES } from "../marca/paleta";
import { FONTE } from "../marca/fonte";
import { Maria } from "../personagens/Maria";
import { Pipo } from "../personagens/Pipo";
import { NuvemPipoca, Sol } from "../cenarios/elementos";

/**
 * Capa quadrada do álbum, pra distribuição em streaming (Fase 6).
 *
 * Spotify, Apple Music e Deezer exigem **3000x3000 px**, quadrado exato,
 * e todos rejeitam capa com: endereço de site, "@", preço, logo de loja,
 * ou qualquer coisa que pareça propaganda. Por isso aqui só tem
 * personagem e nome.
 *
 * Também precisa funcionar a 55x55 px, que é o tamanho real dela na tela
 * do celular de quem está ouvindo. Daí personagem grande e nome curto: os
 * mesmos motivos da miniatura do YouTube, só que ainda mais extremos.
 */
export const CapaStreaming: React.FC<{
  titulo: string;
  artista: string;
}> = ({ titulo, artista }) => (
  <AbsoluteFill
    style={{ background: "linear-gradient(160deg, #BFEAFF 0%, #9BDCFB 44%, #FFE8BD 100%)" }}
  >
    <Sol x={2280} y={140} tamanho={520} giro={0} />
    <NuvemPipoca x={180} y={220} tamanho={640} opacidade={0.95} />
    <NuvemPipoca x={1900} y={620} tamanho={420} opacidade={0.75} />

    {/* Faixa de areia */}
    <svg viewBox="0 0 3000 3000" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="cs-areia" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF0CE" />
          <stop offset="100%" stopColor="#F3D191" />
        </linearGradient>
      </defs>
      <path d="M 0 1980 C 700 1900 2200 2060 3000 1940 L 3000 3000 L 0 3000 Z" fill="url(#cs-areia)" />
    </svg>

    {/* Elenco */}
    <div style={{ position: "absolute", left: 620, top: 640, width: 1180, height: 1652 }}>
      <Maria abertura={0.7} />
    </div>
    <div style={{ position: "absolute", left: 1780, top: 1360, width: 900, height: 976 }}>
      <Pipo abertura={0.6} asas={0.8} />
    </div>

    {/* Nome do álbum */}
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150 }}>
      <div
        style={{
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: 300,
          lineHeight: 0.95,
          textAlign: "center",
          color: CORES.pipo,
          WebkitTextStroke: `34px #5C4432`,
          paintOrder: "stroke fill",
          maxWidth: "92%",
        }}
      >
        {titulo}
      </div>
      <div
        style={{
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: 132,
          marginTop: 40,
          color: "#FFFFFF",
          WebkitTextStroke: "18px #5C4432",
          paintOrder: "stroke fill",
        }}
      >
        {artista}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
