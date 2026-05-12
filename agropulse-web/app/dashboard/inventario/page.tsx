import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Boxes, PackageCheck, PackageX, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/mock-data/products";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Inventario — AgroPulse",
};

// Fixed reference timestamp to keep SSR/CSR consistent
const REFERENCE_NOW = new Date("2026-05-12T08:00:00Z").getTime();

export default function InventarioPage() {
  // Compute remaining shelf life for each lote
  const lotes = products.map((p) => {
    const cosechada = new Date(p.fechaCosecha).getTime();
    const diasTrans = Math.max(
      0,
      Math.floor((REFERENCE_NOW - cosechada) / (1000 * 60 * 60 * 24)),
    );
    const diasRestantes = Math.max(0, p.vidaUtilDias - diasTrans);
    const pct = (diasRestantes / p.vidaUtilDias) * 100;
    return { ...p, diasRestantes, pct };
  });

  const totalKg = lotes.reduce((sum, l) => sum + l.stock, 0);
  const urgentes = lotes.filter((l) => l.diasRestantes <= 3).length;
  const valor = lotes.reduce((sum, l) => sum + l.stock * l.precio, 0);

  return (
    <main className="bg-background min-h-screen">
      <header className="h-16 border-b border-border-soft bg-surface flex items-center px-6 sticky top-0 z-30">
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-ink">Inventario</h1>
          <p className="text-xs text-muted">Lotes activos en bodega</p>
        </div>
        <Button size="sm">
          <Plus size={14} /> Nuevo lote
        </Button>
        <button
          aria-label="Notificaciones"
          className="relative h-9 w-9 ml-3 grid place-items-center rounded-lg border border-border-soft hover:bg-surface-2"
        >
          <Bell size={16} />
        </button>
      </header>

      <Container size="wide" className="py-8">
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
              {totalKg.toLocaleString("es-MX")}
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
            <p className="mt-1 text-2xl font-semibold text-ink">
              {formatCurrency(valor)}
            </p>
          </div>
        </div>

        {/* Table */}
        <section className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
          <div className="p-5 border-b border-border-soft flex items-center justify-between">
            <h2 className="font-semibold text-ink">Lotes en bodega</h2>
            <p className="text-xs text-muted">
              Click en un lote para ver su detalle
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
                        {l.loteId}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-ink font-medium">{l.nombre}</p>
                        <p className="text-xs text-muted">{l.categoria}</p>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {formatDate(l.fechaCosecha)}
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-ink">
                        {l.stock.toLocaleString("es-MX")}{" "}
                        <span className="text-xs text-muted">{l.unidad}</span>
                      </td>
                      <td className="px-5 py-3 text-right text-ink">
                        {formatCurrency(l.precio)}
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
                        {l.sensorId}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/marketplace/${l.id}`}
                          className="text-xs font-medium text-brand hover:underline"
                        >
                          Ver →
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
          <strong className="text-ink">Tip:</strong> Los lotes con barra roja
          deben priorizarse en el marketplace o transferirse a procesamiento.
          AgroPulse aplica un descuento automático del 15% para acelerar la
          venta.
        </p>
      </Container>
    </main>
  );
}
