import type { Metadata } from "next";
import { lotsDb } from "@/lib/db/store";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Lotes — Admin AgroPulse",
};

export default function AdminLotsPage() {
  const lots = lotsDb.listAll();
  return (
    <main className="p-6 lg:p-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Lotes
        </h1>
        <p className="mt-1 text-sm text-muted">
          Vista global de la oferta de productores.
        </p>
      </header>
      <section className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Lote
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Productor
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Cantidad
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Estado
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted">
                Cosecha
              </th>
            </tr>
          </thead>
          <tbody>
            {lots.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Los lotes creados por productores aparecerán aquí.
                </td>
              </tr>
            )}
            {lots.map((l) => (
              <tr key={l.id} className="border-t border-border-soft">
                <td className="px-4 py-3">
                  <p className="text-ink">{l.productName}</p>
                  <p className="text-xs text-muted">{l.category}</p>
                </td>
                <td className="px-4 py-3 text-xs">
                  <p>{l.productorName}</p>
                  <p className="text-muted">{l.cooperativa}</p>
                </td>
                <td className="px-4 py-3 text-xs">
                  {l.quantity} {l.unit}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      l.status === "activo"
                        ? "success"
                        : l.status === "agotado"
                          ? "warning"
                          : "default"
                    }
                  >
                    {l.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {new Date(l.harvestDate).toLocaleDateString("es-CR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
