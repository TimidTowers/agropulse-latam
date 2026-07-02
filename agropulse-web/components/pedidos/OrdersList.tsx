"use client";

/**
 * Lista de pedidos por secciones con filtros (client component).
 *
 * - Tabs con contador: "Pedidos activos (N)" y "Historial (M)".
 * - Orden por fecha (recientes primero por defecto, toggle a antiguos).
 * - Filtro por estado (8 estados con labels legibles) y búsqueda por código.
 * - Animaciones framer-motion al cambiar de tab/filtro y empty states por tab.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpNarrowWide,
  FilterX,
  History,
  Inbox,
  Package,
  PackageCheck,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPriceByCode, getCountry } from "@/lib/countries";
import type { OrderExtended, OrderStatus, UserRole } from "@/lib/db/types";
import { cn } from "@/lib/utils";

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

const STATUS_ORDER: OrderStatus[] = [
  "recibido",
  "confirmado_productor",
  "preparando",
  "empacado",
  "en_transito",
  "ultima_milla",
  "entregado",
  "cancelado",
];

function statusVariant(
  s: OrderStatus,
): "default" | "warning" | "brand" | "success" | "danger" | "info" {
  switch (s) {
    // Azules — etapas iniciales / preparación
    case "recibido":
    case "confirmado_productor":
    case "preparando":
    case "empacado":
      return "info";
    // Ámbar — en movimiento
    case "en_transito":
    case "ultima_milla":
      return "warning";
    // Verde — entregado
    case "entregado":
      return "success";
    // Rojo — cancelado
    case "cancelado":
      return "danger";
    default:
      return "default";
  }
}

type TabKey = "activos" | "historial";
type StatusFilter = OrderStatus | "todos";

function isHistorial(o: OrderExtended): boolean {
  return o.status === "entregado" || o.status === "cancelado";
}

export interface OrdersListProps {
  orders: OrderExtended[];
  role: UserRole;
}

export function OrdersList({ orders, role }: OrdersListProps) {
  const [tab, setTab] = useState<TabKey>("activos");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [query, setQuery] = useState("");
  const [recentFirst, setRecentFirst] = useState(true);

  const activos = useMemo(() => orders.filter((o) => !isHistorial(o)), [orders]);
  const historial = useMemo(() => orders.filter(isHistorial), [orders]);

  const base = tab === "activos" ? activos : historial;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = base.filter(
      (o) =>
        (statusFilter === "todos" || o.status === statusFilter) &&
        (q === "" || o.shortCode.toLowerCase().includes(q)),
    );
    return [...list].sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return recentFirst ? diff : -diff;
    });
  }, [base, statusFilter, query, recentFirst]);

  const hasFilters = statusFilter !== "todos" || query.trim() !== "";

  const switchTab = (t: TabKey) => {
    setTab(t);
    // El filtro de estado de un tab puede no existir en el otro — lo reseteamos.
    setStatusFilter("todos");
  };

  return (
    <div>
      {/* Tabs con contador */}
      <div
        className="inline-flex items-center gap-1 rounded-full border border-border-soft bg-surface p-1"
        role="tablist"
        aria-label="Secciones de pedidos"
      >
        {(
          [
            {
              key: "activos" as const,
              label: `Pedidos activos (${activos.length})`,
              icon: <Package size={14} />,
            },
            {
              key: "historial" as const,
              label: `Historial (${historial.length})`,
              icon: <History size={14} />,
            },
          ] satisfies { key: TabKey; label: string; icon: React.ReactNode }[]
        ).map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => switchTab(t.key)}
            className={cn(
              "relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key ? "text-white" : "text-muted hover:text-ink",
            )}
          >
            {tab === t.key && (
              <motion.span
                layoutId="pedidos-tab-pill"
                className="absolute inset-0 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {t.icon}
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código (AP-2026-…)"
            aria-label="Buscar por código de pedido"
            className="h-10 w-56 rounded-xl border border-border-soft bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          aria-label="Filtrar por estado"
          className="h-10 rounded-xl border border-border-soft bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          <option value="todos">Todos los estados</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <button
          onClick={() => setRecentFirst((v) => !v)}
          aria-label="Cambiar orden por fecha"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border-soft bg-surface px-3 text-sm text-ink hover:border-brand/30 transition-colors"
        >
          {recentFirst ? (
            <>
              <ArrowDownWideNarrow size={14} className="text-muted" />
              Más recientes
            </>
          ) : (
            <>
              <ArrowUpNarrowWide size={14} className="text-muted" />
              Más antiguos
            </>
          )}
        </button>

        {hasFilters && (
          <button
            onClick={() => {
              setStatusFilter("todos");
              setQuery("");
            }}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-muted hover:text-ink transition-colors"
          >
            <FilterX size={14} />
            Limpiar filtros
          </button>
        )}

        <span className="ml-auto text-xs text-muted tabular-nums">
          {filtered.length} resultado{filtered.length !== 1 && "s"}
        </span>
      </div>

      {/* Lista */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key={`empty-${tab}-${hasFilters}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-dashed border-border-soft bg-surface p-16 text-center"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
                {tab === "historial" ? <PackageCheck size={28} /> : <Inbox size={28} />}
              </div>
              {hasFilters ? (
                <>
                  <p className="mt-5 text-ink font-medium">
                    Sin resultados con los filtros actuales
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Prueba con otro estado o revisa el código del pedido.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setStatusFilter("todos");
                      setQuery("");
                    }}
                  >
                    <FilterX size={14} /> Limpiar filtros
                  </Button>
                </>
              ) : tab === "activos" ? (
                <>
                  <p className="mt-5 text-ink font-medium">
                    No tienes pedidos activos
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {role === "cliente"
                      ? "Explora el marketplace y crea tu próximo pedido B2B."
                      : "Cuando llegue un pedido en curso aparecerá aquí."}
                  </p>
                  {role === "cliente" && (
                    <Link href="/marketplace" className="mt-6 inline-block">
                      <Button size="lg">
                        Ir al marketplace <ArrowRight size={16} />
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-5 text-ink font-medium">
                    Aún no hay pedidos en el historial
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Los pedidos entregados o cancelados se archivan aquí.
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.ul
              key={`${tab}-${statusFilter}-${recentFirst}`}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.045 } },
              }}
              className="space-y-3"
            >
              {filtered.map((o) => {
                const country = getCountry(o.country);
                return (
                  <motion.li
                    key={o.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.25 }}
                  >
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
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OrdersList;
