/**
 * SSE: live order tracking (progresión DETERMINÍSTICA).
 *
 * Antes: cada ~4s había 30% de probabilidad de avanzar el estado — dos visitas
 * al mismo pedido mostraban estados distintos y un cold start lo "retrocedía".
 *
 * Ahora: en cada tick se relee el pedido y se aplica ensureProgress()
 * (lib/orders/progression.ts). El estado se DERIVA del tiempo transcurrido
 * desde createdAt con hitos fijos: es una función pura del reloj, monótona,
 * y nunca retrocede. Los pedidos seed (autoProgress: false) quedan estables.
 *
 * Emits:
 *   - `tick` → full order payload en cada latido (~1.5s), mismo shape que antes.
 */
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { ordersDb } from "@/lib/db/store";
import type { OrderExtended } from "@/lib/db/types";
import { ensureProgress } from "@/lib/orders/progression-server";
import { createSseStream, sleep } from "@/lib/realtime/sse";

export const dynamic = "force-dynamic";

interface OrderTick {
  ts: string;
  order: OrderExtended | null;
  notFound?: boolean;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new Response(
      JSON.stringify({ ok: false, error: "unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }
  void req;

  const { id } = await ctx.params;

  return createSseStream<OrderTick>(async (send, close) => {
    const initial = await ordersDb.findById(id);
    if (!initial) {
      send("tick", {
        ts: new Date().toISOString(),
        order: null,
        notFound: true,
      });
      close();
      return;
    }

    // Estado inicial con avance determinístico aplicado.
    send("tick", { ts: new Date().toISOString(), order: await ensureProgress(initial) });

    // Tick loop: cada ~1500ms re-lee, aplica ensureProgress (monótono, según
    // reloj) y emite. El stream cierra a ~9s y el cliente reconecta
    // (patrón Vercel-safe).
    const startedAt = Date.now();
    while (Date.now() - startedAt < 8500) {
      await sleep(1500);

      const current = await ordersDb.findById(id);
      if (!current) {
        send("tick", { ts: new Date().toISOString(), order: null, notFound: true });
        break;
      }

      // Avance derivado del tiempo transcurrido — nunca aleatorio, nunca
      // retrocede. Mismo payload en heartbeat para que el reloj de la UI
      // se actualice.
      send("tick", { ts: new Date().toISOString(), order: await ensureProgress(current) });
    }
  });
}
