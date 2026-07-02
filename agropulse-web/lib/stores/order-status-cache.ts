/**
 * Guard monotónico client-side del progreso de pedidos.
 *
 * Defensa contra cold starts del serverless: si la lambda se re-siembra y el
 * server reporta un estado ANTERIOR al que el usuario ya vio, el cliente
 * conserva el índice máximo alcanzado en localStorage y muestra ese.
 * "Si se entregó, entregado y punto."
 *
 * Funciones puras sobre localStorage (sin zustand). Todo va envuelto en
 * try/catch por si localStorage no está disponible (SSR, Safari privado,
 * cuotas llenas) — en ese caso degrada silenciosamente a no-cache.
 */

const STORAGE_KEY = "agropulse:order-progress";

type ProgressMap = Record<string, number>;

function readMap(): ProgressMap {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as ProgressMap;
  } catch {
    return {};
  }
}

/**
 * Índice de estado (posición en ORDER_STATUS_FLOW) más alto visto para este
 * pedido en este navegador. -1 si no hay registro.
 */
export function getCachedStatusIndex(orderId: string): number {
  try {
    const value = readMap()[orderId];
    return typeof value === "number" && Number.isFinite(value) && value >= 0
      ? Math.floor(value)
      : -1;
  } catch {
    return -1;
  }
}

/**
 * Guarda el índice SOLO si es mayor que el actual (monotónico — nunca
 * retrocede). Índices negativos se ignoran.
 */
export function bumpStatusIndex(orderId: string, idx: number): void {
  try {
    if (typeof window === "undefined") return;
    if (!Number.isFinite(idx) || idx < 0) return;
    const map = readMap();
    const current = typeof map[orderId] === "number" ? map[orderId] : -1;
    if (idx <= current) return;
    map[orderId] = Math.floor(idx);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* localStorage no disponible — degradar en silencio */
  }
}
