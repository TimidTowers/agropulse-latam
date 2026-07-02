"use client";

/**
 * Cliente de reservas de stock — llamado por el cart store en cada cambio.
 *
 * Semántica: POST /api/stock/reserve con { productId, quantity, unit } hace
 * upsert de la reserva del usuario autenticado para ese producto (renueva el
 * TTL de 2h). quantity=0 libera la reserva.
 *
 * Fire-and-forget: si el usuario no está autenticado (401) o la red falla,
 * el carrito sigue funcionando — la reserva es una mejora, no un requisito.
 */

export function syncReservation(productId: string, quantity: number, unit: string): void {
  try {
    void fetch("/api/stock/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, unit }),
    }).catch(() => {
      /* silencioso — guest o red caída */
    });
  } catch {
    /* entorno sin fetch (SSR) — noop */
  }
}

/** Libera todas las reservas del usuario (carrito vaciado / pedido creado). */
export function releaseAllReservations(): void {
  try {
    void fetch("/api/stock/reserve", { method: "DELETE" }).catch(() => {
      /* silencioso */
    });
  } catch {
    /* noop */
  }
}
