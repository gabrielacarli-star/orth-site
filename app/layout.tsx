import type { Metadata } from "next"
import { DM_Serif_Display, Geist } from "next/font/google"
import "./globals.css"

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ORTH Digital — Sites Profissionais em 72 horas | Brasil e Portugal",
  description:
    "Criamos sites profissionais, responsivos e focados em conversão com entrega expressa em até 72 horas. Atendemos empresas no Brasil e em Portugal.",
  keywords: [
    "criar site profissional",
    "site em 72 horas",
    "agência digital",
    "site para empresa",
    "site para negócio",
    "ORTH Digital",
  ],
  authors: [{ name: "ORTH Digital" }],
  creator: "ORTH Digital",
  metadataBase: new URL("https://orthdigital.com.br"),
  openGraph: {
    title: "ORTH Digital — Sites que vendem. Entregues em 72h.",
    description:
      "Agência especializada em sites profissionais de alto impacto com entrega em até 72 horas. Brasil e Portugal.",
    url: "https://orthdigital.com.br",
    siteName: "ORTH Digital",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORTH Digital — Sites que vendem. Entregues em 72h.",
    description:
      "Agência especializada em sites profissionais de alto impacto com entrega em até 72 horas.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSerif.variable} ${geist.variable} h-full antialiased`}
    >
      <head>
        {/* ════════════════════════════════════════════════════
            META PIXEL — Cole seu Pixel ID abaixo e descomente
            ════════════════════════════════════════════════════
        <script dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'SEU_PIXEL_ID_AQUI');
          fbq('track', 'PageView');
        `}} />
        */}

        {/* ════════════════════════════════════════════════════
            GOOGLE TAG MANAGER — Substitua GTM-XXXXXXX e descomente
            ════════════════════════════════════════════════════
        <script dangerouslySetInnerHTML={{ __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');
        `}} />
        */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ORTH Digital",
              url: "https://orthdigital.com.br",
              email: "orthdigital@gmail.com",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+55-11-93341-4950",
                  contactType: "sales",
                  areaServed: "BR",
                  availableLanguage: "Portuguese",
                },
                {
                  "@type": "ContactPoint",
                  telephone: "+351-928-278-804",
                  contactType: "sales",
                  areaServed: "PT",
                  availableLanguage: "Portuguese",
                },
              ],
              sameAs: ["https://instagram.com/orthdigital"],
            }),
          }}
        />
      </head>
      <body className="min-h-full bg-orth-dark text-white overflow-x-hidden">
        {/* GTM noscript — descomente e substitua GTM-XXXXXXX
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0" width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        */}
        {children}
      </body>
    </html>
  )
}
