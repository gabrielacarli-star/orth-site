import { FONTE_BASE64 } from "./fonte-embutida";

/**
 * Fonte da marca: Baloo 2 (SIL Open Font License — uso comercial liberado,
 * inclusive em vídeo monetizado).
 *
 * Aqui tem uma decisão que custou dois renders quebrados, então vale
 * explicar:
 *
 * O jeito "certo" de carregar fonte no Remotion é `delayRender()` + esperar
 * a fonte carregar. Só que o Remotion recicla as abas do navegador durante
 * um render longo, e a cada aba nova essa espera acontece de novo. Se ela
 * pendurar UMA vez — e ela pendura, tanto baixando de public/ (morreu no
 * frame 159) quanto de `data:` (morreu no frame 427) — o render inteiro
 * morre no meio, depois de meia hora de trabalho.
 *
 * A solução é não ter espera nenhuma: a fonte vai embutida em base64 dentro
 * do bundle e é injetada como um `@font-face` normal, de forma síncrona.
 * Não tem download, não tem promise, não tem `delayRender` — logo não tem
 * como travar. O `font-display: block` garante que o navegador use a fonte
 * certa ou nada, nunca a fonte de reserva.
 *
 * Efeito colateral: o bundle fica ~550 KB maior. Vale o negócio.
 */

const CSS = `@font-face {
  font-family: "Baloo 2";
  font-style: normal;
  font-weight: 100 900;
  font-display: block;
  src: url(data:font/ttf;base64,${FONTE_BASE64}) format("truetype");
}`;

let injetada = false;

export const carregarFonte = () => {
  if (injetada || typeof document === "undefined") return;
  injetada = true;

  const estilo = document.createElement("style");
  estilo.setAttribute("data-fonte", "baloo2");
  estilo.textContent = CSS;
  document.head.appendChild(estilo);
};

/** Pilha de fontes usada em todo texto do canal. */
export const FONTE = '"Baloo 2", "Nunito", system-ui, sans-serif';
