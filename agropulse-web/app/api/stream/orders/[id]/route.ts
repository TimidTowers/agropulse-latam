/**
 * SSE: live order tracking.
 *
 * Streams the current state of an order. For demo flow, every ~4s there is a
 * 30% chance to advance the status to the next step in ORDER_STATUS_FLOW
 * (unless the order is already `entregado` or `cancelado`).
 *
 * Emits:
 *   - `tick`      → full order payload on every update or 3s heartbeat
 */
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { ordersDb } from "@/lib/db/store";
import { ORDER_STATUS_FLOW, type OrderExtended, type OrderStatus } from "@/lib/db/types";
import { createSseStream, sleep } from "@/lib/realtime/sse";

export const dynamic = "force-dynamic";

interface OrderTick {
  ts: string;
  order: OrderExtended | null;
  notFound?: boolean;
}

function nextStatus(current: OrderStatus): OrderStatus | null {
  if (current === "entregado" || current === "cancelado") return null;
  const idx = ORDER_STATUS_FLOW.indexOf(current);
  if (idx < 0 || idx >= ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
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
    const initial = ordersDb.findById(id);
    if (!initial) {
      send("tick", {
        ts: new Date().toISOString(),
        order: null,
        notFound: true,
      });
      close();
      return;
    }

    // Send initial state
    let lastStatus: OrderStatus = initial.status;
    send("tick", { ts: new Date().toISOString(), order: initial });

    // Tick loop: every ~1500ms re-read; every ~4s try to advance status.
    const startedAt = Date.now();
    let elapsedSinceAdvance = 0;
    while (Date.now() - startedAt < 8500) {
      await sleep(1500);
      elapsedSinceAdvance += 1500;

      let current = ordersDb.findById(id);
      if (!current) {
        send("tick", { ts: new Date().toISOString(), order: null, notFound: true });
        break;
      }

      if (elapsedSinceAdvance >= 4000) {
        elapsedSinceAdvance = 0;
        const nxt = nextStatus(current.status);
        if (nxt && Math.random() < 0.3) {
          const updated = ordersDb.updateStatus(
            id,
            nxt,
            "Actualización automática",
            "system",
            "admin",
          );
          if (updated) current = updated;
        }
      }

      if (current.status !== lastStatus) {
        lastStatus = current.status;
        send("tick", { ts: new Date().toISOString(), order: current });
      } else {
        // Heartbeat / live indicator with the same payload so the UI clock
        // updates.
        send("tick", { ts: new Date().toISOString(), order: current });
      }
    }
  });
}
