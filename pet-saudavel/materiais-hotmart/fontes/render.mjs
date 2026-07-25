// Requer Node.js + Playwright instalado (`npm install -D playwright` e
// `npx playwright install chromium`, ou aponte executablePath para um
// Chromium já instalado na máquina).
import { chromium } from "playwright"
import path from "path"
import { fileURLToPath } from "url"

const DIR = path.dirname(fileURLToPath(import.meta.url))

const docs = [
  { html: "a-transporte.html", pdf: "SOS-Pet-Bonus-Guia-de-Transporte-Seguro.pdf", kicker: "GUIA DE TRANSPORTE SEGURO" },
  { html: "b-alimentos.html", pdf: "SOS-Pet-Bonus-Alimentos-que-Intoxicam.pdf", kicker: "ALIMENTOS QUE PODEM INTOXICAR SEU PET" },
  { html: "c-carteira.html", pdf: "SOS-Pet-Bonus-Carteira-de-Vacinacao.pdf", kicker: "CARTEIRA DE VACINACAO" },
  { html: "d-acesso.html", pdf: "SOS-Pet-Como-Acessar-o-App.pdf", kicker: "COMO ACESSAR SEU CONTEUDO" },
]

const browser = await chromium.launch()
for (const d of docs) {
  const page = await browser.newPage()
  await page.goto(`file://${path.join(DIR, d.html)}`, { waitUntil: "networkidle" })
  await page.pdf({
    path: path.join(DIR, d.pdf),
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-family:Georgia,serif; font-size:7.5px; width:100%; text-align:center; color:#6F5B3E; letter-spacing:0.1em; padding-top:6px;">${d.kicker}</div>`,
    footerTemplate: `<div style="font-family:Georgia,serif; font-size:8px; width:100%; text-align:center; color:#6F5B3E;">Pet Saudável &middot; SOS Pet &middot; <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
    margin: { top: "16mm", bottom: "14mm", left: "16mm", right: "16mm" },
  })
  console.log("gerado:", d.pdf)
  await page.close()
}
await browser.close()
