import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, CreditCard, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth-helpers";
import { ordersDb, usersDb } from "@/lib/db/store";
import { formatPriceByCode, getCountry } from "@/lib/countries";
import { OrderStatusStream } from "@/components/realtime/OrderStatusStream";
import { OrderActions } from "@/components/pedidos/OrderActions";
import type { OrderStatus } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "Detalle de pedido — AgroPulse",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  recibido: "Recibido",
  confirmado_productor: "Confirmado por productor",
  preparando: "Preparando",
  empacado: "Empacado",
  en_transito: "En tránsito",
  ultima_milla: "Última milla",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default async function OrderDetailPage(
  props: PageProps<"/pedidos/[id]">,
) {
  const user = await getCurrentUser();
  const { id } = await props.params;
  if (!user) redirect(`/login?from=/pedidos/${id}`);

  const order = ordersDb.findById(id);
  if (!order) notFound();

  // Permisos
  const isAdmin = user.role === "admin";
  const isOwnerCliente = user.role === "cliente" && order.customerId === user.id;
  const isInvolvedProductor =
    user.role === "productor" && order.items.some((i) => i.productorId === user.id);
  const isAssignedLogistica =
    user.role === "logistica" && order.logisticaUserId === user.id;
  const isUnassignedLogistica =
    user.role === "logistica" && !order.logisticaUserId;

  if (
    !isAdmin &&
    !isOwnerCliente &&
    !isInvolvedProductor &&
    !isAssignedLogistica &&
    !isUnassignedLogistica
  ) {
    redirect("/pedidos");
  }

  const country = getCountry(order.country);
  const productor = usersDb.findById(order.items[0]?.productorId ?? "");
  const logistica = order.logisticaUserId
    ? usersDb.findById(order.logisticaUserId)
    : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <Container className="py-10">
          <Link
            href="/pedidos"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-3"
          >
            <ArrowLeft size={14} /> Volver a mis pedidos
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
                Pedido
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink font-mono">
                {order.shortCode}
              </h1>
              <p className="mt-1 text-muted">
                Creado el{" "}
                {new Date(order.createdAt).toLocaleString("es-CR", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <Badge
              variant={
                order.status === "entregado"
                  ? "success"
                  : order.status === "cancelado"
                    ? "danger"
                    : "brand"
              }
              className="text-sm py-1.5 px-3"
            >
              {STATUS_LABELS[order.status]}
            </Badge>
          </div>

          <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-6">
              {/* Items */}
              <section className="rounded-2xl border border-border-soft bg-surface p-6">
                <h2 className="font-semibold text-ink mb-4">Productos del pedido</h2>
                <ul className="space-y-3">
                  {order.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center gap-4 rounded-xl border border-border-soft p-3"
                    >
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink truncate">{item.productName}</p>
                        <p className="text-xs text-muted">{item.productorName}</p>
                        <p className="text-xs text-muted mt-1">
                          {item.quantity} {item.unit} ×{" "}
                          {formatPriceByCode(item.unitPrice, order.country)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-ink tabular-nums">
                        {formatPriceByCode(item.subtotal, order.country)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 space-y-2 text-sm border-t border-border-soft pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="tabular-nums">
                      {formatPriceByCode(order.subtotal, order.country)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Comisión AgroPulse (4%)</span>
                    <span className="tabular-nums">
                      {formatPriceByCode(order.commissionFee, order.country)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Envío</span>
                    <span className="tabular-nums">
                      {formatPriceByCode(order.shippingFee, order.country)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border-soft">
                    <span className="font-semibold text-ink">Total</span>
                    <span className="text-base font-semibold text-ink tabular-nums">
                      {formatPriceByCode(order.total, order.country)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Cliente / Productor / Logística */}
              <section className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border-soft bg-surface p-5">
                  <p className="text-[11px] uppercase tracking-wider text-muted mb-2">
                    Cliente
                  </p>
                  <p className="text-sm font-medium text-ink flex items-center gap-2">
                    <User size={14} className="text-muted" />
                    {order.customerInfo.name}
                  </p>
                  <p className="text-xs text-muted flex items-center gap-1.5 mt-1.5">
                    <Mail size={11} /> {order.customerInfo.email}
                  </p>
                  <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
                    <Phone size={11} /> {order.customerInfo.phone}
                  </p>
                  <p className="text-xs text-muted flex items-start gap-1.5 mt-1">
                    <MapPin size={11} className="flex-shrink-0 mt-0.5" />
                    <span>
                      {order.customerInfo.address.line1}
                      {order.customerInfo.address.line2 &&
                        `, ${order.customerInfo.address.line2}`}
                      , {order.customerInfo.address.city},{" "}
                      {order.customerInfo.address.state} {country.flag}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-border-soft bg-surface p-5">
                  <p className="text-[11px] uppercase tracking-wider text-muted mb-2">
                    Productor principal
                  </p>
                  {productor ? (
                    <>
                      <p className="text-sm font-medium text-ink">{productor.name}</p>
                      <p className="text-xs text-muted">
                        {productor.cooperativa ?? "Productor independiente"}
                      </p>
                      <p className="text-xs text-muted mt-1.5">
                        {productor.address?.city}, {productor.address?.state}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted">Información no disponible</p>
                  )}
                </div>
              </section>

              {logistica && (
                <section className="rounded-2xl border border-border-soft bg-surface p-5">
                  <p className="text-[11px] uppercase tracking-wider text-muted mb-2">
                    Logística asignada
                  </p>
                  <p className="text-sm font-medium text-ink">{logistica.name}</p>
                  <p className="text-xs text-muted">
                    {logistica.vehicleType} · placa {logistica.licensePlate}
                  </p>
                </section>
              )}

              {/* Pago */}
              <section className="rounded-2xl border border-border-soft bg-surface p-5">
                <p className="text-[11px] uppercase tracking-wider text-muted mb-2">
                  Pago
                </p>
                <p className="text-sm font-medium text-ink flex items-center gap-2">
                  <CreditCard size={14} className="text-muted" />
                  {order.paymentMethodLabel}
                </p>
                <p className="text-xs text-muted mt-1">
                  Estado: <strong className="text-ink">{order.paymentStatus}</strong>
                </p>
              </section>

              {/* Mapa placeholder */}
              <section className="rounded-2xl border border-border-soft bg-surface p-5">
                <p className="text-[11px] uppercase tracking-wider text-muted mb-3">
                  Ruta estimada
                </p>
                <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-border-soft grid place-items-center">
                  <div className="text-center">
                    <MapPin size={32} className="text-brand mx-auto" />
                    <p className="mt-2 text-sm font-medium text-ink">
                      {productor?.address?.city ?? "Origen"} →{" "}
                      {order.customerInfo.address.city}
                    </p>
                    <p className="text-xs text-muted">
                      Mapa Leaflet (ETA{" "}
                      {new Date(order.estimatedDelivery).toLocaleDateString("es-CR")})
                    </p>
                  </div>
                </div>
              </section>

              {order.notes && (
                <section className="rounded-2xl border border-border-soft bg-surface p-5">
                  <p className="text-[11px] uppercase tracking-wider text-muted mb-2">
                    Notas
                  </p>
                  <p className="text-sm text-ink/85 leading-relaxed">{order.notes}</p>
                </section>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
              <OrderStatusStream
                orderId={order.id}
                currentStatus={order.status}
                history={order.statusHistory}
                initialOrder={order}
              />

              <OrderActions
                orderId={order.id}
                currentStatus={order.status}
                userRole={user.role}
                userId={user.id}
                productorIds={order.items.map((i) => i.productorId)}
                logisticaUserId={order.logisticaUserId}
              />
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
