import type { Metadata } from "next";
import { ordersDb } from "@/lib/db/store";
import { Badge } from "@/components/ui/Badge";
import { getCountry } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Pedidos — Admin AgroPulse",
};

export default function AdminOrdersPage() {
  const orders = ordersDb.listAll();
  return (
    <main className="p-6 lg:p-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Pedidos
        </h1>
        <p className="mt-1 text-sm text-muted">
          Lista global de órdenes en todos los países.
        </p>
      </header>

      <section className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Pedido
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Cliente
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                País
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Total
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Estado
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No hay pedidos todavía. Los pedidos creados desde el carrito
                  aparecerán aquí.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border-soft">
                <td className="px-4 py-3 font-mono text-xs">{o.shortCode}</td>
                <td className="px-4 py-3">
                  <p className="text-ink">{o.customerInfo.name}</p>
                  <p className="text-xs text-muted">{o.customerInfo.email}</p>
                </td>
                <td className="px-4 py-3 text-xs">
                  {getCountry(o.country).flag} {o.country}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {o.currency} {o.total.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {new Date(o.createdAt).toLocaleDateString("es-CR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function statusVariant(
  s: string,
): "default" | "success" | "warning" | "danger" | "info" | "brand" {
  if (s === "entregado") return "success";
  if (s === "cancelado") return "danger";
  if (s === "en_transito" || s === "ultima_milla") return "info";
  if (s === "preparando" || s === "empacado") return "warning";
  return "brand";
}
