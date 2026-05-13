"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Loader2,
  PackageX,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useSSE } from "@/lib/realtime/useSSE";
import {
  ORDER_STATUS_FLOW,
  type OrderExtended,
  type OrderStatus,
  type OrderStatusHistoryEntry,
} from "@/lib/db/types";
import { cn } from "@/lib/utils";

interface OrderTick {
  ts: string;
  order: OrderExtended | null;
  notFound?: boolean;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  recibido: "Pedido recibido",
  confirmado_productor: "Confirmado por el productor",
  preparando: "Preparando empaque",
  empacado: "Empacado listo",
  en_transito: "En tránsito",
  ultima_milla: "Última milla",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  recibido: "Tu pedido fue recibido y está en cola de revisión.",
  confirmado_productor: "El productor confirmó tu pedido.",
  preparando: "El productor está preparando los productos.",
  empacado: "Tu pedido está empacado y listo para recogida.",
  en_transito: "El pedido sale hacia tu dirección.",
  ultima_milla: "El repartidor está cerca de tu dirección.",
  entregado: "Tu pedido fue entregado.",
  cancelado: "Este pedido fue cancelado.",
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export interface OrderStatusStreamProps {
  orderId: string;
  /** Fallback initial status (avoids flicker before SSE connects). */
  currentStatus?: OrderStatus;
  /** Optional initial history for SSR / fallback render. */
  history?: OrderStatusHistoryEntry[];
  /** Optional initial order payload for SSR. */
  initialOrder?: OrderExtended | null;
  className?: string;
}

export function OrderStatusStream({
  orderId,
  currentStatus,
  history: initialHistory,
  initialOrder,
  className,
}: OrderStatusStreamProps) {
  const { data, connected } = useSSE<OrderTick>(
    `/api/stream/orders/${encodeURIComponent(orderId)}`,
    "tick",
  );

  const order = data?.order ?? initialOrder ?? null;
  const notFound = data?.notFound;
  const lastTs = data?.ts;

  // Build effective view-model that survives reconnects / initial load.
  const effectiveStatus: OrderStatus | undefined =
    order?.status ?? currentStatus;
  const effectiveHistory = order?.statusHistory ?? initialHistory ?? [];
  const shortCode = order?.shortCode ?? orderId;

  if (notFound) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border-soft bg-surface p-6 flex items-center gap-3",
          className,
        )}
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600">
          <PackageX size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Pedido no encontrado</p>
          <p className="text-xs text-muted">
            El folio <span className="font-mono">{orderId}</span> no existe.
          </p>
        </div>
      </div>
    );
  }

  if (!effectiveStatus) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border-soft bg-surface p-6 flex items-center gap-3",
          className,
        )}
      >
        <Loader2 size={18} className="animate-spin text-muted" />
        <p className="text-sm text-muted">Conectando al stream de tracking…</p>
      </div>
    );
  }

  const currentIdx =
    effectiveStatus === "cancelado"
      ? -1
      : ORDER_STATUS_FLOW.indexOf(effectiveStatus);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border-soft bg-surface p-6",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted font-semibold">
            Estado del pedido
          </p>
          <h3 className="text-lg font-semibold text-ink tracking-tight font-mono">
            {shortCode}
          </h3>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={effectiveStatus}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-muted mt-1"
            >
              {STATUS_DESCRIPTIONS[effectiveStatus]}
            </motion.p>
          </AnimatePresence>
        </div>
        {connected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Wifi size={12} />
            Conectado en vivo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <WifiOff size={12} />
            Desconectado · reintentando
          </span>
        )}
      </div>

      {/* Timeline */}
      {effectiveStatus === "cancelado" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-red-100 text-red-700">
            <PackageX size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold text-red-800">
              Pedido cancelado
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              Este pedido fue cancelado y no se entregará.
            </p>
          </div>
        </div>
      ) : (
        <ol className="relative space-y-3">
          {ORDER_STATUS_FLOW.map((step, i) => {
            const isPast = i < currentIdx;
            const isCurrent = i === currentIdx;
            const isFuture = i > currentIdx;
            const entry = effectiveHistory.find((h) => h.status === step);
            return (
              <li key={step} className="flex items-start gap-3">
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full border-2",
                      isPast && "bg-emerald-500 border-emerald-500 text-white",
                      isCurrent &&
                        "bg-white border-emerald-500 text-emerald-600",
                      isFuture && "bg-surface-2 border-border-soft text-muted",
                    )}
                  >
                    {isPast ? (
                      <CheckCircle2 size={16} />
                    ) : isCurrent ? (
                      <span className="relative inline-flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                      </span>
                    ) : (
                      <Circle size={12} />
                    )}
                  </motion.div>
                  {i < ORDER_STATUS_FLOW.length - 1 && (
                    <span
                      className={cn(
                        "w-[2px] flex-1 min-h-6 my-1",
                        isPast || isCurrent
                          ? "bg-emerald-300"
                          : "bg-border-soft",
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isPast && "text-ink",
                      isCurrent && "text-emerald-700",
                      isFuture && "text-muted",
                    )}
                  >
                    {STATUS_LABELS[step]}
                  </p>
                  {entry?.timestamp && (
                    <p className="text-[11px] text-muted mt-0.5 tabular-nums">
                      {new Date(entry.timestamp).toLocaleString("es-MX", {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {entry.note && <span> · {entry.note}</span>}
                    </p>
                  )}
                  {isCurrent && !entry && (
                    <p className="text-[11px] text-muted mt-0.5">
                      En proceso…
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border-soft flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          Folio:{" "}
          <span className="font-mono text-ink">{shortCode}</span>
        </span>
        {lastTs && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Última actualización: {fmtTime(lastTs)}
          </span>
        )}
      </div>
    </div>
  );
}

export default OrderStatusStream;
