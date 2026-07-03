/**
 * ensureProgress — SERVER-ONLY (importa la store, que ahora es async/Supabase).
 * Las funciones puras (computeTimeIndex, computeRouteProgress, statusIndex)
 * viven en ./progression.ts para poder importarse desde client components.
 */
import { ORDER_STATUS_FLOW, type OrderExtended } from "@/lib/db/types";
import { ordersDb } from "@/lib/db/store";
import { statusIndex, computeTimeIndex } from "./progression";

/**
 * Aplica el avance automático pendiente a un pedido y lo persiste
 * (una entrada de historial por etapa saltada). Devuelve el pedido
 * actualizado. Idempotente: llamadas repetidas no duplican historial.
 */
export async function ensureProgress(order: OrderExtended): Promise<OrderExtended> {
  if (order.status === "cancelado" || order.status === "entregado") return order;
  if (order.autoProgress === false) return order;
  const current = statusIndex(order.status);
  const target = computeTimeIndex(order.createdAt);
  if (target <= current) return order;
  let updated: OrderExtended = order;
  for (let i = current + 1; i <= target; i++) {
    const next = await ordersDb.updateStatus(
      order.id,
      ORDER_STATUS_FLOW[i],
      "Avance automático (demo)",
      "system",
      "admin",
    );
    if (next) updated = next;
  }
  return updated;
}
