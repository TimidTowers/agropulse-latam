import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Boxes, PackageCheck, PackageX, Plus, Sprout } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { formatDate, cn } from "@/lib/utils";
import { requireProductorDashboard } from "@/lib/dashboard-guard";
import { lotsDb } from "@/lib/db/store";
import {
  CURRENCIES,
  COUNTRY_TO_CURRENCY,
  convertCurrency,
  formatCurrency,
  resolveUserCurrency,
} from "@/lib/currency/rates";

export const metadata: Metadata = {
  title: "Inventario — AgroPulse",
};

const REFERENCE_NOW = new Date("2026-05-12T08:00:00Z").getTime();

export default async function InventarioPage() {
  const user = await requireProductorDashboard("/dashboard/inventario");
  const currency = resolveUserCurrency(user.preferredCurrency, user.country);
  const info = CURRENCIES[currency];

  // Sólo lotes del productor (admin ve todos)
  const allLots =
    user.role === "admin" ? lotsDb.listAll() : lotsDb.listByProductor(user.id);
  const activeLots = allLots.filter((l) => l.status !== "retirado");

  const lotes = activeLots.map((l) => {
    const cosechada = new Date(l.harvestDate).getTime();
    const expira = new Date(l.expirationDate).getTime();
    const vidaUtilDias = Math.max(
      1,
      Math.floor((expira - cosechada) / (1000 * 60 * 60 * 24)),
    );
    const diasTrans = Math.max(
      0,
      Math.floor((REFERENCE_NOW - cosechada) / (1000 * 60 * 60 * 24)),
    );
    const diasRestantes = Math.max(0, vidaUtilDias - diasTrans);
    const pct = (diasRestantes / vidaUtilDias) * 100;
    const lotCurrency =
      (l.currency as keyof typeof CURRENCIES) ?? COUNTRY_TO_CURRENCY[l.country];
    const precioConv = convertCurrency(l.pricePerUnit, lotCurrency, currency);
    return { ...l, diasRestantes, pct, precioConv, lotCurrency };
  });

  const totalKg = lotes.reduce((sum, l) => sum + l.quantity, 0);
  const urgentes = lotes.filter((l) => l.diasRestantes <= 3).length;
  const valor = lotes.reduce(
    (sum, l) =>
      sum + convertCurrency(l.quantity * l.pricePerUnit, l.lotCurrency, currency),
    0,
  );

  return (
    <main className="bg-background min-h-screen">
      <header className="h-16 border-b border-border-soft bg-surface flex items-center px-6 sticky top-0 z-30">
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-ink">Inventario</h1>
          <p className="text-xs text-muted">
            {user.cooperativa ?? "Productor"} · {lotes.length} lote
            {lotes.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/perfil#currency"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink border border-border-soft rounded-lg px-2.5 py-1 hover:bg-surface-2 mr-3"
          title="Cambiar moneda preferida"
        >
          <span aria-hidden>{info.flag}</span>
          <span className="font-mono">{currency}</span>
        </Link>
        <Link href="/dashboard/lotes/nuevo">
          <Button size="sm">
            <Plus size={14} /> Nuevo lote
          </Button>
        </Link>
        <button
          aria-label="Notificaciones"
          className="relative h-9 w-9 ml-3 grid place-items-center rounded-lg border border-border-soft hover:bg-surface-2"
        >
          <Bell size={16} />
        </button>
      </header>

      <Container size="wide" className="py-8">
        {lotes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface p-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">
              <Sprout size={28} />
            </div>
            <p className="mt-5 text-ink font-medium">Aún no tienes lotes en bodega</p>
            <p className="mt-1 text-sm text-muted">
              Crea tu primer lote para empezar a vender.
            </p>
            <Link href="/dashboard/lotes/nuevo" className="mt-6 inline-block">
              <Button size="lg">
                <Plus size={16} /> Crear primer lote
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl border border-border-soft bg-surface p-5">
                <Boxes size={18} className="text-brand" />
                <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                  Lotes activos
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {lotes.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border-soft bg-surface p-5">
                <PackageCheck size={18} className="text-emerald-700" />
                <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                  Volumen total
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {totalKg.toLocaleString(info.locale)}
                  <span className="ml-1 text-sm text-muted">kg/L</span>
                </p>
              </div>
              <div className="rounded-2xl border border-border-soft bg-surface p-5">
                <PackageX size={18} className="text-red-600" />
                <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                  Vida útil ≤3 días
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">{urgentes}</p>
              </div>
              <div className="rounded-2xl border border-border-soft bg-surface p-5">
                <Boxes size={18} className="text-info" />
                <p className="mt-3 text-xs uppercase tracking-wider text-muted">
                  Valor inventario
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink tabular-nums">
                  {formatCurrency(valor, currency)}
                </p>
              </div>
            </div>

            {/* Table */}
            <section className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
              <div className="p-5 border-b border-border-soft flex items-center justify-between">
                <h2 className="font-semibold text-ink">Tus lotes en bodega</h2>
                <p className="text-xs text-muted">
                  Precios en {info.name} ({currency})
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border-soft bg-surface-2/30">
                    <tr className="text-left text-xs uppercase tracking-wider text-muted">
                      <th className="px-5 py-3 font-medium">Lote</th>
                      <th className="px-5 py-3 font-medium">Producto</th>
                      <th className="px-5 py-3 font-medium">Cosecha</th>
                      <th className="px-5 py-3 font-medium text-right">Stock</th>
                      <th className="px-5 py-3 font-medium text-right">Precio</th>
                      <th className="px-5 py-3 font-medium">Vida útil restante</th>
                      <th className="px-5 py-3 font-medium">Sensor</th>
                      <th className="px-5 py-3 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotes.map((l) => {
                      const color =
                        l.pct > 60
                          ? "bg-emerald-500"
                          : l.pct > 30
                            ? "bg-amber-500"
                            : "bg-red-500";
                      const textColor =
                        l.pct > 60
                          ? "text-emerald-700"
                          : l.pct > 30
                            ? "text-amber-700"
                            : "text-red-600";
                      return (
                        <tr
                          key={l.id}
                          className="border-b border-border-soft last:border-0 hover:bg-surface-2/30 transition-colors"
                        >
                          <td className="px-5 py-3 font-mono text-xs text-ink">
                            {l.id}
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-ink font-medium">{l.productName}</p>
                            <p className="text-xs text-muted">{l.category}</p>
                          </td>
                          <td className="px-5 py-3 text-muted">
                            {formatDate(l.harvestDate)}
                          </td>
                          <td className="px-5 py-3 text-right font-medium text-ink">
                            {l.quantity.toLocaleString(info.locale)}{" "}
                            <span className="text-xs text-muted">{l.unit}</span>
                          </td>
                          <td className="px-5 py-3 text-right text-ink tabular-nums">
                            {formatCurrency(l.precioConv, currency)}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3 min-w-[160px]">
                              <span
                                className={cn(
                                  "text-xs font-semibold tabular-nums",
                                  textColor,
                                )}
                              >
                                {l.diasRestantes}d
                              </span>
                              <span className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                                <span
                                  className={cn("block h-full", color)}
                                  style={{ width: `${Math.min(100, l.pct)}%` }}
                                />
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-muted">
                            {l.sensorId ?? "—"}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              href={`/dashboard/lotes/${l.id}`}
                              className="text-xs font-medium text-brand hover:underline"
                            >
                              Editar →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="mt-5 text-xs text-muted">
              <strong className="text-ink">Tip:</strong> Los lotes con barra
              roja deben priorizarse en el marketplace. AgroPulse aplica un
              descuento automático del 15% para acelerar la venta.
            </p>
          </>
        )}
      </Container>
    </main>
  );
}
