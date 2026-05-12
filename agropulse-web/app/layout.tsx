import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CountrySelectorModal } from "@/components/country/CountrySelectorModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroPulse — El pulso inteligente de tu cosecha",
  description:
    "Plataforma E-business AgriTech presente en 10 países LATAM que reduce hasta 40% las pérdidas post-cosecha mediante IoT, analítica predictiva y un marketplace B2B.",
  keywords: [
    "AgriTech LATAM",
    "E-business",
    "Marketplace agrícola",
    "IoT agro",
    "Cadena de frío",
    "Trazabilidad",
  ],
  authors: [{ name: "AgroPulse Technologies" }],
  openGraph: {
    title: "AgroPulse — El pulso inteligente de tu cosecha",
    description:
      "10 países LATAM. Reduce hasta 40% las pérdidas post-cosecha con IoT, ML y un marketplace B2B.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <CountrySelectorModal />
      </body>
    </html>
  );
}
