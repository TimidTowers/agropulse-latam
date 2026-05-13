"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Truck,
  Loader2,
  PackageCheck,
  Hammer,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { OrderStatus, UserRole } from "@/lib/db/types";
import { ORDER_STATUS_FLOW } from "@/lib/db/types";

interface OrderActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
  userRole: UserRole;
  userId: string;
  productorIds: string[];
  logisticaUserId?: string;
}

const STATUS_NEXT_LABEL: Record<OrderStatus, string> = {
  recibido: "Confirmar pedido",
  confirmado_productor: "Marcar como preparando",
  preparando: "Marcar como empacado",
  empacado: "Marcar en tránsito",
  en_transito: "Marcar última milla",
  ultima_milla: "Marcar como entregado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function nextStatus(s: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(s);
  if (idx < 0 || idx >= ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}

const PRODUCTOR_ALLOWED: OrderStatus[] = [
  "confirmado_productor",
  "preparando",
  "empacado",
];
const LOGISTICA_ALLOWED: OrderStatus[] = [
  "en_transito",
  "ultima_milla",
  "entregado",
];

export function OrderActions({
  orderId,
  currentStatus,
  userRole,
  userId,
  productorIds,
  logisticaUserId,
}: OrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function patch(body: Record<string, unknown>, key: string) {
    setLoading(key);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? data.error ?? "Error al actualizar");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(null);
    }
  }

  const next = nextStatus(currentStatus);
  const isClienteAndCancellable =
    userRole === "cliente" && currentStatus === "recibido";
  const isProductor = userRole === "productor" && productorIds.includes(userId);
  const productorCanAdvance =
    isProductor && next !== null && PRODUCTOR_ALLOWED.includes(next);
  const logisticaAssigned =
    userRole === "logistica" && logisticaUserId === userId;
  const logisticaCanAdvance =
    logisticaAssigned && next !== null && LOGISTICA_ALLOWED.includes(next);
  const logisticaCanAssign =
    userRole === "logistica" &&
    !logisticaUserId &&
    (currentStatus === "empacado" || currentStatus === "en_transito");
  const isAdmin = userRole === "admin";

  const hasAnyAction =
    isClienteAndCancellable ||
    productorCanAdvance ||
    logisticaCanAdvance ||
    logisticaCanAssign ||
    (isAdmin && next);

  if (!hasAnyAction && currentStatus !== "cancelado" && currentStatus !== "entregado") {
    return (
      <div className="rounded-2xl border border-border-soft bg-surface p-5">
        <p className="text-xs text-muted">
          Esperando acción de{" "}
          {next && PRODUCTOR_ALLOWED.includes(next)
            ? "el productor"
            : next && LOGISTICA_ALLOWED.includes(next)
              ? "logística"
              : "otro participante"}
          .
        </p>
      </div>
    );
  }

  if (!hasAnyAction) return null;

  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5 space-y-3">
      <p className="text-xs uppercase tracking-wider text-muted">Acciones</p>

      {error && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </p>
      )}

      {/* Productor */}
      {productorCanAdvance && next && (
        <Button
          type="button"
          className="w-full"
          disabled={loading !== null}
          onClick={() => patch({ status: next }, "advance")}
        >
          {loading === "advance" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          {STATUS_NEXT_LABEL[currentStatus]}
        </Button>
      )}

      {/* Logística asignar */}
      {logisticaCanAssign && (
        <Button
          type="button"
          variant="primary"
          className="w-full"
          disabled={loading !== null}
          onClick={() => patch({ logisticaUserId: userId }, "assign")}
        >
          {loading === "assign" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Truck size={16} />
          )}
          Asignarme este envío
        </Button>
      )}

      {/* Logística avanzar */}
      {logisticaCanAdvance && next && (
        <Button
          type="button"
          className="w-full"
          disabled={loading !== null}
          onClick={() => patch({ status: next }, "advance")}
        >
          {loading === "advance" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : next === "entregado" ? (
            <PackageCheck size={16} />
          ) : (
            <Truck size={16} />
          )}
          {STATUS_NEXT_LABEL[currentStatus]}
        </Button>
      )}

      {/* Admin */}
      {isAdmin && next && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={loading !== null}
          onClick={() => patch({ status: next }, "admin-advance")}
        >
          {loading === "admin-advance" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Hammer size={16} />
          )}
          Avanzar (admin) → {next}
        </Button>
      )}

      {/* Cliente cancelar */}
      {isClienteAndCancellable && (
        <Button
          type="button"
          variant="danger"
          className="w-full"
          disabled={loading !== null}
          onClick={() => {
            if (confirm("¿Cancelar este pedido? No se podrá revertir.")) {
              patch({ status: "cancelado", note: "Cancelado por el cliente" }, "cancel");
            }
          }}
        >
          {loading === "cancel" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <XCircle size={16} />
          )}
          Cancelar pedido
        </Button>
      )}
    </div>
  );
}
