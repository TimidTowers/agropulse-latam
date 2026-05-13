import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sprout, Plus, Edit3, ArrowRight, Calendar, Package, AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth-helpers";
import { lotsDb } from "@/lib/db/store";
import { formatPriceByCode, getCountry } from "@/lib/countries";
import type { Lot } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "Mis lotes — AgroPulse Dashboard",
};

function urgenciaBadge(u: Lot["urgencia"]) {
  switch (u) {
    case "alta":
      return { variant: "danger" as const, label: "Alta" };
    case "media":
      return { variant: "warning" as const, label: "Media" };
    default:
      return { variant: "success" as const, label: "Baja" };
  }
}

function statusBadge(s: Lot["status"]) {
  switch (s) {
    case "activo":
      return { variant: "success" as const, label: "Activo" };
    case "borrador":
      return { variant: "default" as const, label: "Borrador" };
    case "agotado":
      return { variant: "warning" as const, label: "Agotado" };
    case "expirado":
      return { variant: "danger" as const, label: "Expirado" };
    case "retirado":
      return { variant: "default" as const, label: "Retirado" };
  }
}

export default async function LotesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/dashboard/lotes");
  if (user.role !== "productor" && user.role !== "admin") {
    redirect("/dashboard");
  }

  const lots =
    user.role === "admin" ? lotsDb.listAll() : lotsDb.listByProductor(user.id);

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
            Dashboard productor
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Mis lotes
          </h1>
          <p className="mt-2 text-muted">
            {lots.length} lote{lots.length !== 1 && "s"} en tu portafolio
            {user.role === "admin" && " (vista admin — todos los productores)"}.
          </p>
        </div>
        <Link href="/dashboard/lotes/nuevo">
          <Button size="lg">
            <Plus size={16} />
            Crear nuevo lote
          </Button>
        </Link>
      </div>

      {lots.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-soft bg-surface p-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">
            <Sprout size={28} />
          </div>
          <p className="mt-5 text-ink font-medium">Aún no has publicado lotes</p>
          <p className="mt-1 text-sm text-muted">
            Crea tu primer lote para comenzar a vender en el marketplace de AgroPulse.
          </p>
          <Link href="/dashboard/lotes/nuevo" className="mt-6 inline-block">
            <Button size="lg">
              <Plus size={16} /> Crear primer lote
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-3 px-5 py-3 border-b border-border-soft bg-surface-2 text-[11px] uppercase tracking-wider text-muted font-semibold">
            <span>Producto</span>
            <span>Stock</span>
            <span>Precio</span>
            <span>Urgencia</span>
            <span>Status</span>
            <span></span>
          </div>
          <ul>
            {lots.map((lot) => {
              const u = urgenciaBadge(lot.urgencia);
              const s = statusBadge(lot.status);
              const country = getCountry(lot.country);
              const daysToExp = Math.floor(
                (new Date(lot.expirationDate).getTime() - Date.now()) / 86_400_000,
              );
              return (
                <li
                  key={lot.id}
                  className="grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-3 px-5 py-4 border-b border-border-soft last:border-b-0 hover:bg-surface-2/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lot.images[0] ?? ""}
                        alt={lot.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-ink truncate">{lot.productName}</p>
                      <p className="text-xs text-muted truncate">
                        {lot.category} · {country.flag} {lot.region}
                      </p>
                    </div>
                  </div>
                  <div className="flex md:block items-center gap-2">
                    <span className="md:hidden text-[10px] uppercase text-muted">
                      Stock:
                    </span>
                    <p className="text-sm text-ink flex items-center gap-1.5">
                      <Package size={12} className="text-muted" />
                      {lot.quantity.toLocaleString(country.locale)} {lot.unit}
                    </p>
                  </div>
                  <div className="flex md:block items-center gap-2">
                    <span className="md:hidden text-[10px] uppercase text-muted">
                      Precio:
                    </span>
                    <p className="text-sm font-medium text-ink tabular-nums">
                      {formatPriceByCode(lot.pricePerUnit, lot.country)}
                    </p>
                    <p className="text-[10px] text-muted">por {lot.unit}</p>
                  </div>
                  <div className="flex md:block items-center gap-2">
                    <Badge variant={u.variant}>{u.label}</Badge>
                    {daysToExp >= 0 && daysToExp < 7 && (
                      <p className="text-[10px] text-amber-700 flex items-center gap-1 mt-1">
                        <AlertTriangle size={10} />
                        Expira en {daysToExp}d
                      </p>
                    )}
                  </div>
                  <div className="flex md:block items-center gap-2">
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/lotes/${lot.id}`}
                      className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-dark"
                    >
                      <Edit3 size={13} />
                      Editar
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/5 p-5 flex items-start gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white flex-shrink-0">
          <Calendar size={18} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-ink">¿Vendes nuevos productos cada temporada?</p>
          <p className="text-sm text-muted mt-1">
            Cada lote es independiente — sube uno por cosecha o variedad para que tus clientes vean lo más fresco.
          </p>
        </div>
        <Link href="/dashboard/lotes/nuevo" className="flex-shrink-0">
          <Button size="sm" variant="outline">
            Publicar <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </Container>
  );
}
