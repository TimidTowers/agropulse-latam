import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";

export const metadata: Metadata = {
  title: "Marketplace B2B LATAM — AgroPulse",
  description:
    "Catálogo en vivo de lotes de productos perecederos directos del productor en 10 países LATAM, con trazabilidad y cadena de frío garantizada.",
};

export default function MarketplacePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <MarketplaceClient />
      </main>
      <Footer />
    </>
  );
}
