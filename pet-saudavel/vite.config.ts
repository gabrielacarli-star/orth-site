import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"

// Static SPA build → deploy the `dist/` folder to Hostinger (or Vercel/Netlify).
// All backend lives in Supabase; this app ships zero server code.
export default defineConfig({
  // Tailwind entra pelo plugin @tailwindcss/vite — não usamos PostCSS.
  // O objeto vazio impede o Vite de procurar (e herdar) o postcss.config
  // do projeto Next.js na pasta acima.
  css: { postcss: {} },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Pet Saudável — Dr. Eduardo Sebastião",
        short_name: "Pet Saudável",
        description:
          "Organize as vacinas, o peso e as emergências do seu pet. Por Dr. Eduardo Sebastião.",
        lang: "pt-BR",
        theme_color: "#241C14",
        background_color: "#F1E7D2",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache the whole app shell so as SOS (emergências) abre offline.
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Fontes do Google — cache-first, funcionam offline após o 1º acesso.
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
