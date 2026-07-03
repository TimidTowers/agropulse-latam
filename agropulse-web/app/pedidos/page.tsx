import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { OrdersList } from "@/components/pedidos/OrdersList";
import { getCurrentUser } from "@/lib/auth-helpers";
import { ordersDb } from "@/lib/db/store";
import { ensureProgress } from "@/lib/orders/progression-server";
import type { OrderExtended } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "Mis pedidos — AgroPulse",
  description: "Seguimiento en tiempo real de tus pedidos B2B.",
};

export default async function PedidosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/pedidos");

  let orders: OrderExtended[] = [];
  if (user.role === "admin") orders = await ordersDb.listAll();
  else if (user.role === "cliente") orders = await ordersDb.listByCustomer(user.id);
  else if (user.role === "productor") orders = await ordersDb.listByProductor(user.id);
  else if (user.role === "logistica") orders = await ordersDb.listByLogistica(user.id);

  // Progresión determinística: el estado se deriva del tiempo transcurrido
  // (monótono, nunca retrocede) ANTES de renderizar.
  orders = await Promise.all(orders.map((o) => ensureProgress(o)));

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <Container className="py-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
            {user.role === "cliente"
              ? "Mis compras"
              : user.role === "productor"
                ? "Pedidos recibidos"
                : user.role === "logistica"
                  ? "Mis envíos"
                  : "Todos los pedidos"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            {user.role === "cliente" ? "Mis pedidos" : "Pedidos"}
          </h1>
          <p className="mt-2 text-muted">
            {orders.length} pedido{orders.length !== 1 && "s"} en total.
          </p>

          <div className="mt-8">
            <OrdersList orders={orders} role={user.role} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
