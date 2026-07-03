/**
 * Progresión determinística de pedidos.
 *
 * Problema que resuelve: antes el stream SSE avanzaba el estado con
 * probabilidad aleatoria (30% cada 4s), así que dos visitas al mismo pedido
 * podían mostrar estados distintos, y un cold start del serverless re-sembraba
 * el estado base — el pedido parecía "retroceder".
 *
 * Solución: el estado automático se DERIVA del tiempo transcurrido desde
 * createdAt con hitos fijos. Es una función pura del reloj: cualquier
 * instancia serverless calcula el mismo estado para el mismo instante, y como
 * el tiempo solo avanza, el estado nunca retrocede. "Si se entregó, entregado
 * y punto."
 *
 * - Pedidos con autoProgress === false (seeds demo) NO avanzan solos: quedan
 *   fijos en su estado salvo acción manual de productor/logística/admin.
 * - Pedidos cancelados o entregados nunca cambian.
 * - El avance manual convive con el automático: el estado efectivo es el
 *   MÁXIMO entre el almacenado y el derivado del tiempo (monotónico).
 *
 * IMPORTANTE: este archivo contiene SOLO funciones puras (sin imports de la
 * store) porque lo consumen client components (OrderRouteMapView usa
 * computeRouteProgress). La persistencia del avance (ensureProgress) vive en
 * lib/orders/progression-server.ts — server-only.
 */
import { ORDER_STATUS_FLOW, type OrderExtended, type OrderStatus } from "@/lib/db/types";

/**
 * Minutos acumulados desde createdAt para alcanzar cada etapa del flow.
 * Índices alineados con ORDER_STATUS_FLOW:
 *   0 recibido · 1 confirmado_productor · 2 preparando · 3 empacado ·
 *   4 en_transito · 5 ultima_milla · 6 entregado
 * Total: ~55 min de "vida" de un pedido demo.
 */
export const STAGE_ELAPSED_MINUTES = [0, 3, 8, 15, 25, 40, 55] as const;

export function statusIndex(s: OrderStatus): number {
  return ORDER_STATUS_FLOW.indexOf(s);
}

/** Índice de etapa alcanzado según el tiempo transcurrido desde createdAt. */
export function computeTimeIndex(createdAt: string, nowMs: number = Date.now()): number {
  const elapsedMin = (nowMs - new Date(createdAt).getTime()) / 60_000;
  let idx = 0;
  for (let i = 0; i < STAGE_ELAPSED_MINUTES.length; i++) {
    if (elapsedMin >= STAGE_ELAPSED_MINUTES[i]) idx = i;
  }
  return idx;
}

/**
 * Fracción de progreso 0..1 para animar el marcador de ruta en el mapa.
 * - 0 mientras el pedido no ha salido (antes de en_transito).
 * - Interpola suavemente entre las etapas de tránsito según el reloj.
 * - 1 cuando está entregado.
 */
export function computeRouteProgress(order: OrderExtended, nowMs: number = Date.now()): number {
  if (order.status === "entregado") return 1;
  if (order.status === "cancelado") return 0;
  const idx = statusIndex(order.status);
  const TRANSIT_START = 4; // en_transito
  if (idx < TRANSIT_START) return 0;

  // Interpolación suave dentro de la etapa actual usando el reloj.
  const stageStartMin = STAGE_ELAPSED_MINUTES[idx];
  const stageEndMin =
    idx + 1 < STAGE_ELAPSED_MINUTES.length
      ? STAGE_ELAPSED_MINUTES[idx + 1]
      : STAGE_ELAPSED_MINUTES[idx] + 15;
  const elapsedMin = (nowMs - new Date(order.createdAt).getTime()) / 60_000;
  const within = Math.min(
    1,
    Math.max(0, (elapsedMin - stageStartMin) / (stageEndMin - stageStartMin)),
  );

  // Mapear [en_transito .. entregado] al rango [0 .. 1] de la ruta.
  const TRANSIT_STAGES = ORDER_STATUS_FLOW.length - 1 - TRANSIT_START; // 2 tramos
  const base = (idx - TRANSIT_START) / TRANSIT_STAGES;
  const stageSpan = 1 / TRANSIT_STAGES;
  return Math.min(1, base + within * stageSpan);
}
