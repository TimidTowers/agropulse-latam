import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ArrowRight, Inbox } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth-helpers";
import { ordersDb } from "@/lib/db/store";
import { formatPriceByCode, getCountry } from "@/lib/countries";
import type { OrderExtended, OrderStatus } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "Mis pedidos — AgroPulse",
  description: "Seguimiento en tiempo real de tus pedidos B2B.",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  recibido: "Recibido",
  confirmado_productor: "Confirmado",
  preparando: "Preparando",
  empacado: "Empacado",
  en_transito: "En tránsito",
  ultima_milla: "Última milla",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function statusVariant(s: OrderStatus): "default" | "warning" | "brand" | "success" | "danger" | "info" {
  switch (s) {
    case "recibido":
    case "confirmado_productor":
      return "info";
    case "preparando":
    case "empacado":
      return "warning";
    case "en_transito":
    case "ultima_milla":
      return "brand";
    case "entregado":
      return "success";
    case "cancelado":
      return "danger";
    default:
      return "default";
  }
}

export default async function PedidosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/pedidos");

  let orders: OrderExtended[] = [];
  if (user.role === "admin") orders = ordersDb.listAll();
  else if (user.role === "cliente") orders = ordersDb.listByCustomer(user.id);
  else if (user.role === "productor") orders = ordersDb.listByProductor(user.id);
  else if (user.role === "logistica") orders = ordersDb.listByLogistica(user.id);

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
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-soft bg-surface p-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
                  <Inbox size={28} />
                </div>
                <p className="mt-5 text-ink font-medium">Aún no tienes pedidos</p>
                <p className="mt-1 text-sm text-muted">
                  {user.role === "cliente"
                    ? "Explora el marketplace y crea tu primer pedido B2B."
                    : "Cuando recibas tu primer pedido aparecerá aquí."}
                </p>
                {user.role === "cliente" && (
                  <Link href="/marketplace" className="mt-6 inline-block">
                    <Button size="lg">
                      Ir al marketplace <ArrowRight size={16} />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => {
                  const country = getCountry(o.country);
                  return (
                    <li key={o.id}>
                      <Link
                        href={`/pedidos/${o.id}`}
                        className="block rounded-2xl border border-border-soft bg-surface p-5 hover:border-brand/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                              <Package size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-mono text-sm font-semibold text-ink">
                                  {o.shortCode}
                                </p>
                                <span className="inline-flex items-center gap-1 text-[10px] text-muted">
                                  <span>{country.flag}</span>
                                  {country.code}
                                </span>
                              </div>
                              <p className="text-xs text-muted">
                                {new Date(o.createdAt).toLocaleDateString("es-CR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}{" "}
                                · {o.items.length} item{o.items.length !== 1 && "s"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <Badge variant={statusVariant(o.status)}>
                              {STATUS_LABELS[o.status]}
                            </Badge>
                            <p className="text-base font-semibold text-ink tabular-nums">
                              {formatPriceByCode(o.total, o.country)}
                            </p>
                            <span className="text-sm font-medium text-brand">
                              Ver detalle →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
