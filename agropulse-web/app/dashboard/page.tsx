import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bell, Sprout, Inbox } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AlertList } from "@/components/dashboard/AlertList";
import { Badge } from "@/components/ui/Badge";
import { DashboardCountryBadge } from "@/components/dashboard/DashboardCountryBadge";
import { LiveBadge, LiveKpiCards } from "@/components/realtime/LiveKpiCards";
import { requireProductorDashboard } from "@/lib/dashboard-guard";
import { ordersDb, lotsDb } from "@/lib/db/store";
import { getCountry } from "@/lib/countries";
import {
  CURRENCIES,
  COUNTRY_TO_CURRENCY,
  convertCurrency,
  formatCurrency,
  resolveUserCurrency,
} from "@/lib/currency/rates";
import { alertas as ALL_ALERTAS } from "@/lib/mock-data/kpis";
import { PreferenceBanner } from "@/components/dashboard/PreferenceBanner";
import { ProductorSalesChart } from "@/components/dashboard/ProductorSalesChart";
import { ProductorMermasChart } from "@/components/dashboard/ProductorMermasChart";

export const metadata: Metadata = {
  title: "Dashboard — AgroPulse",
};

// Hash determinístico simple para generar mock por productor sin Date.now
function strHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const REFERENCE_NOW = new Date("2026-05-12T08:00:00Z").getTime();

export default async function DashboardPage() {
  const user = await requireProductorDashboard("/dashboard");
  const country = getCountry(user.country);
  const currency = resolveUserCurrency(user.preferredCurrency, user.country);
  const userCurrencyInfo = CURRENCIES[currency];

  // KPIs reales del productor
  const myLots = await lotsDb.listByProductor(user.id);
  const myOrders = await ordersDb.listByProductor(user.id);
  const activeLots = myLots.filter((l) => l.status === "activo");

  // Ventas: suma de items que le corresponden al productor en sus pedidos
  // El currency origen viene del país de cada pedido.
  const ventasTotal = myOrders.reduce((sum, o) => {
    const orderCurrency =
      (o.currency as keyof typeof CURRENCIES) ?? COUNTRY_TO_CURRENCY[o.country];
    const myItemsTotal = o.items
      .filter((i) => i.productorId === user.id)
      .reduce((s, i) => s + i.subtotal, 0);
    return sum + convertCurrency(myItemsTotal, orderCurrency, currency);
  }, 0);

  const pedidosPendientes = myOrders.filter(
    (o) => o.status === "recibido" || o.status === "confirmado_productor",
  );

  // Próximas cosechas — derivadas de los lotes del productor con expiración cercana
  const proximas = activeLots
    .map((l) => ({
      productName: l.productName,
      region: l.region,
      cooperativa: l.cooperativa,
      fecha: l.expirationDate,
      // valor estimado del stock
      valorEstimado: convertCurrency(
        l.quantity * l.pricePerUnit,
        (l.currency as keyof typeof CURRENCIES) ??
          COUNTRY_TO_CURRENCY[l.country],
        currency,
      ),
      stock: l.quantity,
      unidad: l.unit,
    }))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 4);

  // Alertas filtradas por país del productor + variante determinística
  const seed = strHash(user.id + user.cooperativa);
  const alertasProductor = ALL_ALERTAS.filter((_a, i) => ((seed + i) % 3) !== 0)
    .slice(0, 3)
    .map((a) => ({
      ...a,
      mensaje: a.mensaje.replace(
        /Lote L-\d{4}-\d{4}/,
        `Lote ${myLots[0]?.id?.slice(0, 12) ?? "L-2026-0211"}`,
      ),
    }));

  const totalPedidos = myOrders.length;
  const isEmpty = myLots.length === 0 && myOrders.length === 0;

  return (
    <main className="bg-background min-h-screen">
      <header className="h-16 border-b border-border-soft bg-surface flex items-center px-6 sticky top-0 z-30">
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div>
            <h1 className="text-base font-semibold text-ink">Resumen</h1>
            <p className="text-xs text-muted">
              {user.cooperativa ?? "Productor"} · {country.flag} {country.name}
            </p>
          </div>
          <LiveBadge />
        </div>
        <div className="flex items-center gap-3">
          <DashboardCountryBadge />
          <Link
            href="/perfil#currency"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink border border-border-soft rounded-lg px-2.5 py-1 hover:bg-surface-2"
            title="Cambiar moneda preferida"
          >
            <span aria-hidden>{userCurrencyInfo.flag}</span>
            <span className="font-mono">{currency}</span>
            <span className="text-muted">Cambiar</span>
          </Link>
          <button
            aria-label="Notificaciones"
            className="relative h-9 w-9 grid place-items-center rounded-lg border border-border-soft hover:bg-surface-2"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-border-soft">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white text-xs font-semibold">
              {initials(user.name)}
            </div>
            <div className="hidden sm:block text-xs">
              <p className="font-medium text-ink leading-tight">{user.name}</p>
              <p className="text-muted leading-tight">
                {user.cooperativa ?? "Productor independiente"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <Container size="wide" className="py-8">
        <PreferenceBanner userCountry={user.country} hasPreference={!!user.preferredCurrency} />

        {/* Bienvenida */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Hola, {user.name.split(" ")[0]}.
          </h2>
          <p className="text-muted mt-0.5">
            {pedidosPendientes.length > 0 ? (
              <>
                Tienes{" "}
                <strong className="text-ink">
                  {pedidosPendientes.length} pedido
                  {pedidosPendientes.length === 1 ? "" : "s"} pendiente
                  {pedidosPendientes.length === 1 ? "" : "s"}
                </strong>{" "}
                de confirmar y {activeLots.length} lote
                {activeLots.length === 1 ? "" : "s"} activo
                {activeLots.length === 1 ? "" : "s"}.
              </>
            ) : (
              <>Tienes {activeLots.length} lote{activeLots.length === 1 ? "" : "s"} activo{activeLots.length === 1 ? "" : "s"} y {totalPedidos} pedido{totalPedidos === 1 ? "" : "s"} en total.</>
            )}
          </p>
        </div>

        {/* Resumen propio del productor */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Ventas (mis pedidos)
            </p>
            <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
              {formatCurrency(ventasTotal, currency)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {totalPedidos} pedido{totalPedidos === 1 ? "" : "s"} · {userCurrencyInfo.name}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Lotes activos
            </p>
            <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
              {activeLots.length}
            </p>
            <p className="mt-1 text-xs text-muted">
              {myLots.length} totales en tu portafolio
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Pedidos pendientes
            </p>
            <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
              {pedidosPendientes.length}
            </p>
            <p className="mt-1 text-xs text-muted">esperando tu confirmación</p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Hectáreas
            </p>
            <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
              {user.hectareas ?? 0}
              <span className="text-sm text-muted ml-1">ha</span>
            </p>
            <p className="mt-1 text-xs text-muted">{country.flag} {country.name}</p>
          </div>
        </div>

        {/* Live KPIs por país (sensores) — informativos, no exponen datos de otros productores */}
        <LiveKpiCards />

        {isEmpty ? (
          <section className="rounded-2xl border border-dashed border-border-soft bg-surface p-12 text-center mb-8">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">
              <Sprout size={28} />
            </div>
            <p className="mt-5 text-ink font-medium">
              Aún no tienes lotes ni pedidos
            </p>
            <p className="mt-1 text-sm text-muted">
              Crea tu primer lote para empezar a vender en el marketplace de
              AgroPulse.
            </p>
            <Link
              href="/dashboard/lotes/nuevo"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand text-white text-sm font-medium px-5 py-2.5 hover:bg-brand-dark"
            >
              Crear mi primer lote <ArrowUpRight size={14} />
            </Link>
          </section>
        ) : (
          <>
            {/* Charts */}
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 mb-8">
              <section className="rounded-2xl border border-border-soft bg-surface p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-ink">Ventas mensuales</h3>
                    <p className="text-xs text-muted">
                      Últimos 12 meses ({userCurrencyInfo.name})
                    </p>
                  </div>
                  <Badge variant="success">+14% vs prom. anual</Badge>
                </div>
                <ProductorSalesChart
                  currency={currency}
                  seed={strHash(user.id)}
                />
              </section>

              <section className="rounded-2xl border border-border-soft bg-surface p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-ink">
                      Mermas históricas
                    </h3>
                    <p className="text-xs text-muted">% sobre cosecha total</p>
                  </div>
                  <Badge variant="success">Objetivo alcanzado</Badge>
                </div>
                <ProductorMermasChart seed={strHash(user.id + "mermas")} />
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
                {alertasProductor.length > 0 ? (
                  <AlertList alertas={alertasProductor} />
                ) : (
                  <p className="text-sm text-muted text-center py-8">
                    Sin alertas activas. Todo en orden.
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-border-soft bg-surface p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-ink">
                      Próximas cosechas
                    </h3>
                    <p className="text-xs text-muted">
                      Tus lotes próximos a expirar
                    </p>
                  </div>
                  <Link
                    href="/dashboard/lotes"
                    className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
                  >
                    Ver lotes <ArrowUpRight size={12} />
                  </Link>
                </div>
                {proximas.length > 0 ? (
                  <ul className="space-y-3">
                    {proximas.map((c, i) => {
                      const diasRestantes = Math.max(
                        0,
                        Math.floor(
                          (new Date(c.fecha).getTime() - REFERENCE_NOW) /
                            (1000 * 60 * 60 * 24),
                        ),
                      );
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface-2/40 border border-border-soft"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink truncate">
                              {c.productName}
                            </p>
                            <p className="text-xs text-muted truncate">
                              {c.region} · {c.cooperativa}
                            </p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="text-sm font-semibold text-ink tabular-nums">
                              {formatCurrency(c.valorEstimado, currency)}
                            </p>
                            <p className="text-xs text-muted">
                              {diasRestantes}d ·{" "}
                              {new Date(c.fecha).toLocaleDateString(
                                country.locale,
                                {
                                  day: "2-digit",
                                  month: "short",
                                },
                              )}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <Sprout size={24} className="mx-auto text-muted mb-2" />
                    <p className="text-sm text-muted mb-3">
                      Aún no tienes lotes activos.
                    </p>
                    <Link
                      href="/dashboard/lotes/nuevo"
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      Crea tu primer lote →
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        {/* Mis pedidos recientes */}
        <section className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-ink">Mis pedidos recientes</h3>
              <p className="text-xs text-muted">
                Últimas órdenes con tus productos
              </p>
            </div>
            <Link
              href="/pedidos"
              className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
            >
              Ver todos <ArrowUpRight size={12} />
            </Link>
          </div>
          {myOrders.length === 0 ? (
            <div className="px-6 pb-8 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-muted">
                <Inbox size={20} />
              </div>
              <p className="mt-3 text-sm text-ink font-medium">
                Aún no tienes pedidos
              </p>
              <p className="text-xs text-muted">
                Cuando un cliente compre tus productos aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-y border-border-soft bg-surface-2/30">
                  <tr className="text-left text-xs uppercase tracking-wider text-muted">
                    <th className="px-6 py-3 font-medium">Folio</th>
                    <th className="px-6 py-3 font-medium">Fecha</th>
                    <th className="px-6 py-3 font-medium">Comprador</th>
                    <th className="px-6 py-3 font-medium">Items</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.slice(0, 6).map((o) => {
                    const orderCurrency =
                      (o.currency as keyof typeof CURRENCIES) ??
                      COUNTRY_TO_CURRENCY[o.country];
                    const myItemsTotal = o.items
                      .filter((i) => i.productorId === user.id)
                      .reduce((s, i) => s + i.subtotal, 0);
                    const totalConvertido = convertCurrency(
                      myItemsTotal,
                      orderCurrency,
                      currency,
                    );
                    return (
                      <tr
                        key={o.id}
                        className="border-b border-border-soft last:border-0"
                      >
                        <td className="px-6 py-3 font-mono text-xs text-ink">
                          <Link
                            href={`/pedidos/${o.id}`}
                            className="hover:text-brand"
                          >
                            {o.shortCode}
                          </Link>
                        </td>
                        <td className="px-6 py-3 text-muted">
                          {new Date(o.createdAt).toLocaleDateString(
                            country.locale,
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </td>
                        <td className="px-6 py-3 text-ink">
                          {o.customerInfo.name}
                        </td>
                        <td className="px-6 py-3 text-muted text-xs">
                          {o.items
                            .filter((i) => i.productorId === user.id)
                            .map((i) => i.productName)
                            .join(", ")}
                        </td>
                        <td className="px-6 py-3 text-right font-semibold text-ink tabular-nums">
                          {formatCurrency(totalConvertido, currency)}
                        </td>
                        <td className="px-6 py-3">
                          <Badge
                            variant={
                              o.status === "entregado"
                                ? "success"
                                : o.status === "cancelado"
                                  ? "danger"
                                  : o.status === "en_transito" ||
                                      o.status === "ultima_milla"
                                    ? "brand"
                                    : "info"
                            }
                          >
                            {o.status.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
