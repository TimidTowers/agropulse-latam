import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartPageClient } from "@/components/carrito/CartPageClient";

export const metadata: Metadata = {
  title: "Carrito — AgroPulse",
  description: "Revisa los lotes agregados y simula tu pedido B2B.",
};

export default function CarritoPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <CartPageClient />
      </main>
      <Footer />
    </>
  );
}
