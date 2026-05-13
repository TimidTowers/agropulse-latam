import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bell } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { MermasChart } from "@/components/dashboard/MermasChart";
import { AlertList } from "@/components/dashboard/AlertList";
import { alertas, proximasCosechas } from "@/lib/mock-data/kpis";
import { orders } from "@/lib/mock-data/orders";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { DashboardCountryBadge } from "@/components/dashboard/DashboardCountryBadge";
import { LiveBadge, LiveKpiCards } from "@/components/realtime/LiveKpiCards";

export const metadata: Metadata = {
  title: "Dashboard — AgroPulse",
};

export default function DashboardPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Top bar */}
      <header className="h-16 border-b border-border-soft bg-surface flex items-center px-6 sticky top-0 z-30">
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div>
            <h1 className="text-base font-semibold text-ink">Resumen</h1>
            <p className="text-xs text-muted">Vista general del productor</p>
          </div>
          <LiveBadge />
        </div>
        <div className="flex items-center gap-3">
          <DashboardCountryBadge />
          <button
            aria-label="Notificaciones"
            className="relative h-9 w-9 grid place-items-center rounded-lg border border-border-soft hover:bg-surface-2"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-border-soft">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white text-xs font-semibold">
              ST
            </div>
            <div className="hidden sm:block text-xs">
              <p className="font-medium text-ink leading-tight">
                Sebastián Torres
              </p>
              <p className="text-muted leading-tight">Invernaderos La Esperanza</p>
            </div>
          </div>
        </div>
      </header>

      <Container size="wide" className="py-8">
        {/* Bienvenida */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Buen día, Sebastián.
          </h2>
          <p className="text-muted mt-0.5">
            Hoy tienes <strong className="text-ink">2 alertas activas</strong> y{" "}
            <strong className="text-ink">3 nuevos pedidos</strong> esperando
            confirmación.
          </p>
        </div>

        {/* KPIs — live updates via SSE */}
        <LiveKpiCards />

        {/* Charts */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 mb-8">
          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-ink">Ventas mensuales</h3>
                <p className="text-xs text-muted">Últimos 12 meses (MXN)</p>
              </div>
              <Badge variant="success">+14% vs prom. anual</Badge>
            </div>
            <SalesChart />
          </section>

          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-ink">Mermas históricas</h3>
                <p className="text-xs text-muted">% sobre cosecha total</p>
              </div>
              <Badge variant="success">Objetivo alcanzado</Badge>
            </div>
            <MermasChart />
          </section>
        </div>

        {/* Alertas + cosechas */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4 mb-8">
          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-ink">Alertas activas</h3>
                <p className="text-xs text-muted">
                  Eventos IoT y de inventario por revisar
                </p>
              </div>
              <Link
                href="/dashboard/sensores"
                className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
              >
                Ver sensores <ArrowUpRight size={12} />
              </Link>
            </div>
            <AlertList alertas={alertas} />
          </section>

          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-ink">Próximas cosechas</h3>
                <p className="text-xs text-muted">Planificación a 7 días</p>
              </div>
            </div>
            <ul className="space-y-3">
              {proximasCosechas.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-2/40 border border-border-soft"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {c.producto}
                    </p>
                    <p className="text-xs text-muted truncate">{c.productor}</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold text-ink">
                      {c.toneladasEstimadas} t
                    </p>
                    <p className="text-xs text-muted">{formatDate(c.fecha)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Pedidos recientes */}
        <section className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-ink">Pedidos recientes</h3>
              <p className="text-xs text-muted">Últimas 6 órdenes del marketplace</p>
            </div>
            <Link
              href="/marketplace"
              className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
            >
              Ir al marketplace <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-y border-border-soft bg-surface-2/30">
                <tr className="text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-6 py-3 font-medium">Folio</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                  <th className="px-6 py-3 font-medium">Comprador</th>
                  <th className="px-6 py-3 font-medium">Productos</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border-soft last:border-0">
                    <td className="px-6 py-3 font-mono text-xs text-ink">
                      {o.id}
                    </td>
                    <td className="px-6 py-3 text-muted">
                      {formatDate(o.fecha)}
                    </td>
                    <td className="px-6 py-3 text-ink">{o.comprador}</td>
                    <td className="px-6 py-3 text-muted text-xs">
                      {o.productos.map((p) => p.nombre).join(", ")}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-ink">
                      ${o.total.toLocaleString("es-MX")}
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        variant={
                          o.estado === "entregado"
                            ? "success"
                            : o.estado === "en tránsito"
                              ? "info"
                              : o.estado === "pendiente"
                                ? "warning"
                                : "danger"
                        }
                      >
                        {o.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
    </main>
  );
}
