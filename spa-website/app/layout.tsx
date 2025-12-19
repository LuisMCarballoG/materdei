import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

// Base URL for production
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mater-dei.netlify.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#9B7BB8",
};

export const metadata: Metadata = {
  // ========== BASIC SEO ==========
  title: {
    default: "Mater Dei Spa - Cabina & Spa en Tres Valles, Veracruz",
    template: "%s | Mater Dei Spa",
  },
  description: "Spa profesional en Tres Valles, Veracruz. Tratamientos faciales, masajes relajantes, limpieza facial profunda, microdermoabrasión y más. Agenda tu cita hoy. Lic. en Cosmetología.",
  
  // ========== KEYWORDS & CATEGORIZATION ==========
  keywords: [
    "spa tres valles",
    "spa veracruz",
    "masajes relajantes veracruz",
    "limpieza facial tres valles",
    "tratamientos faciales",
    "microdermoabrasion",
    "masaje descontracturante",
    "tratamientos antiedad",
    "cabina spa",
    "mater dei spa",
    "cosmetologia veracruz",
    "belleza tres valles",
  ],
  category: "Salud y Belleza",
  
  // ========== AUTHORSHIP & OWNERSHIP ==========
  authors: [{ name: "Mater Dei Spa", url: siteUrl }],
  creator: "Mater Dei Spa",
  publisher: "Mater Dei Spa",
  
  // ========== INDEXING & ROBOTS ==========
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // ========== OPEN GRAPH (Facebook, WhatsApp, LinkedIn) ==========
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Mater Dei Spa",
    title: "Mater Dei Spa - Cabina & Spa en Tres Valles, Veracruz",
    description: "Renueva tu cuerpo y alma en Mater Dei Spa. Tratamientos faciales profesionales, masajes relajantes y terapéuticos. Precios desde $200 MXN. ¡Agenda tu cita por WhatsApp!",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Mater Dei Spa - Logo",
        type: "image/png",
      },
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mater Dei Spa - Tratamientos de belleza en Tres Valles",
        type: "image/png",
      },
    ],
  },
  
  // ========== TWITTER/X CARDS ==========
  twitter: {
    card: "summary_large_image",
    title: "Mater Dei Spa - Cabina & Spa en Tres Valles",
    description: "Tratamientos faciales y masajes profesionales en Veracruz. Precios desde $200 MXN. ¡Agenda tu cita!",
    images: [`${siteUrl}/logo.png`],
    creator: "@MaterDeiSpa",
    site: "@MaterDeiSpa",
  },
  
  // ========== VERIFICATION & APPS ==========
  verification: {
    // Add your verification codes when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  
  // ========== ICONS & MANIFEST ==========
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  
  // ========== CANONICAL & ALTERNATES ==========
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "es-MX": "/",
    },
  },
  
  // ========== APP LINKS (for mobile) ==========
  appLinks: {
    web: {
      url: siteUrl,
      should_fallback: true,
    },
  },

  // ========== OTHER SEO ==========
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  
  // ========== AI SEO / GEO (Generative Engine Optimization) ==========
  // These help AI assistants understand and cite your content
  other: {
    // Schema.org hints for AI
    "ai:description": "Mater Dei Spa es un spa profesional ubicado en Tres Valles, Veracruz, México. Ofrecemos servicios de limpieza facial profunda ($280 MXN), microdermoabrasión ($300 MXN), tratamientos antiedad ($300 MXN), masajes relajantes de medio cuerpo ($250 MXN) y cuerpo completo ($330 MXN), masaje descontracturante ($200 MXN por zona) y masaje para piernas cansadas ($200 MXN). La dueña es Teresita de Jesús, Licenciada en Cosmetología. Para agendar citas, contactar vía WhatsApp al 288 119 8312.",
    "ai:entity_type": "LocalBusiness",
    "ai:business_name": "Mater Dei - Cabina & Spa",
    "ai:location": "Tres Valles, Veracruz, México",
    "ai:phone": "+52 288 119 8312",
    "ai:services": "Limpieza facial, Microdermoabrasión, Tratamientos antiedad, Masajes relajantes, Masaje descontracturante, Masaje piernas cansadas",
    "ai:price_range": "$200 - $330 MXN",
    
    // Citation helpers for AI
    "citation:source": "Mater Dei Spa Website",
    "citation:url": siteUrl,
    "citation:date": new Date().toISOString().split("T")[0],
    
    // Business contact for AI assistants
    "contact:whatsapp": "+5212881198312",
    "contact:phone": "288 119 8312",
    
    // Geo location hints
    "geo:region": "MX-VER",
    "geo:placename": "Tres Valles, Veracruz",
    "geo:country": "Mexico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <head>
        {/* ========== STRUCTURED DATA (JSON-LD) ========== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              "@id": siteUrl,
              name: "Mater Dei - Cabina & Spa",
              alternateName: "Mater Dei Spa",
              description: "Spa profesional en Tres Valles, Veracruz. Tratamientos faciales, masajes relajantes y terapéuticos.",
              url: siteUrl,
              telephone: "+52-288-119-8312",
              image: `${siteUrl}/logo.png`,
              logo: `${siteUrl}/logo.png`,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Tres Valles",
                addressRegion: "Veracruz",
                addressCountry: "MX",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "18.2333",
                longitude: "-96.1667",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "09:00",
                  closes: "19:00",
                },
              ],
              priceRange: "$200 - $330 MXN",
              currenciesAccepted: "MXN",
              paymentAccepted: "Cash, Card",
              areaServed: {
                "@type": "City",
                name: "Tres Valles",
              },
              founder: {
                "@type": "Person",
                name: "Teresita de Jesús",
                jobTitle: "Licenciada en Cosmetología",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicios de Spa",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Limpieza Facial Profunda",
                      description: "Limpieza profunda para una piel radiante",
                    },
                    price: "280",
                    priceCurrency: "MXN",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Limpieza con Microdermoabrasión",
                      description: "Exfoliación avanzada para piel suave",
                    },
                    price: "300",
                    priceCurrency: "MXN",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Tratamientos Antiedad",
                      description: "Rejuvenecimiento facial especializado",
                    },
                    price: "300",
                    priceCurrency: "MXN",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Masaje Relajante Medio Cuerpo",
                      description: "50 minutos de relajación",
                    },
                    price: "250",
                    priceCurrency: "MXN",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Masaje Relajante Cuerpo Completo",
                      description: "1 hora 20 minutos de relajación total",
                    },
                    price: "330",
                    priceCurrency: "MXN",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Masaje Descontracturante",
                      description: "Alivio de tensiones 40 min por zona",
                    },
                    price: "200",
                    priceCurrency: "MXN",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Masaje Piernas Cansadas",
                      description: "Recupera la vitalidad de tus piernas",
                    },
                    price: "200",
                    priceCurrency: "MXN",
                  },
                ],
              },
              sameAs: [
                "https://wa.me/5212881198312",
              ],
            }),
          }}
        />
        
        {/* ========== ADDITIONAL AI/LLM OPTIMIZATION ========== */}
        {/* llms.txt style content for AI crawlers */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Perplexity/AI assistant hints */}
        <meta name="ai-content-declaration" content="human-created" />
        
        {/* WhatsApp specific */}
        <meta property="og:whatsapp:phone" content="+5212881198312" />
        
        {/* Pinterest */}
        <meta name="pinterest-rich-pin" content="true" />
        
        {/* Mobile app capable */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mater Dei Spa" />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
