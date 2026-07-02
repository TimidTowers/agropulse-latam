import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth-helpers";
import { paymentMethodsDb } from "@/lib/db/store";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — AgroPulse",
  description: "Confirma tu pedido B2B y elige método de pago local.",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/checkout");

  // Clientes, productores y admin pueden completar checkout.
  // Los productores compran con 8% de descuento automático (PRODUCER_DISCOUNT_PCT).
  if (user.role === "logistica") {
    redirect("/marketplace");
  }

  const paymentMethods = paymentMethodsDb.listByCountry(user.country);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <CheckoutForm user={user} paymentMethods={paymentMethods} />
      </main>
      <Footer />
    </>
  );
}
