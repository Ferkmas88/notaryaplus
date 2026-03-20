import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "3-1 Notary A Plus | Business & Tax Services | Louisville, KY",
  description:
    "15 años sirviendo a la comunidad. Taxes individuales y de negocios, Notario Público, Inmigración, Registro de Negocios y Traducciones profesionales. Louisville, KY 40219. Agente certificada por el IRS.",
  keywords:
    "notario louisville ky, taxes louisville, inmigración louisville, ITIN, notary public louisville, tax services louisville, trámites consulares",
  openGraph: {
    title: "3-1 Notary A Plus | Business & Tax Services",
    description:
      "15 años sirviendo a la comunidad hispana de Louisville, KY. Taxes, Notaría, Inmigración, Negocios.",
    type: "website",
    locale: "es_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
