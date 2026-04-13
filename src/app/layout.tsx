import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { LangProvider } from "@/contexts/LangContext";

export const metadata: Metadata = {
  title: {
    default: "3-1 Notary A Plus | Taxes, Notaría e Inmigración | Louisville, KY",
    template: "%s | 3-1 Notary A Plus Louisville KY",
  },
  description:
    "Myrna Rodríguez — Agente certificada IRS. Taxes individuales y de negocios, Notario Público, Inmigración, ITIN, Registro de Negocios y Traducciones en Louisville, KY 40219. Llama al 502-654-7076.",
  keywords: [
    "taxes louisville ky",
    "notario publico louisville",
    "tax preparation louisville",
    "inmigración louisville kentucky",
    "ITIN louisville",
    "tax services hispanic louisville",
    "notary public louisville ky",
    "preparacion de taxes louisville",
    "IRS certified agent louisville",
    "immigration forms louisville",
    "traducciones certificadas louisville",
    "registro de negocios louisville",
    "8514 preston hwy louisville",
    "taxes camioneros ifta irp kyu",
    "notaria publica louisville ky",
  ],
  authors: [{ name: "Myrna Rodríguez" }],
  creator: "3-1 Notary A Plus",
  publisher: "3-1 Notary A Plus",
  metadataBase: new URL("https://notaryaplus.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "3-1 Notary A Plus | Taxes, Notaría e Inmigración | Louisville, KY",
    description:
      "15 años sirviendo a la comunidad hispana de Louisville, KY. Taxes, Notaría, Inmigración, ITIN, Negocios. Llama al 502-654-7076.",
    url: "https://notaryaplus.com",
    siteName: "3-1 Notary A Plus",
    type: "website",
    locale: "es_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "3-1 Notary A Plus Business & Tax Services",
              image: "https://notaryaplus.com/images/tarjeta-frente.jpg",
              "@id": "https://notaryaplus.com",
              url: "https://notaryaplus.com",
              telephone: "502-654-7076",
              email: "notaryaplus31@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "8514 Preston Hwy",
                addressLocality: "Louisville",
                addressRegion: "KY",
                postalCode: "40219",
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 38.1282,
                longitude: -85.6814,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "10:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "17:00",
                },
              ],
              priceRange: "$$",
              servesCuisine: undefined,
              sameAs: [
                "https://www.facebook.com/profile.php?id=100063453922386",
                "https://www.instagram.com/myrna.chacon.1",
              ],
              description:
                "Agente certificada y aceptada por el IRS. Taxes individuales y de negocios, Notario Público, Inmigración, ITIN, Registro de Negocios y Traducciones. 15 años sirviendo a Louisville, KY.",
            }),
          }}
        />
        <LangProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </LangProvider>
      </body>
    </html>
  );
}
