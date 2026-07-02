/**
 * POST   /api/stock/reserve — upsert de reserva temporal de stock (TTL 2h).
 *          body: { productId, quantity >= 0, unit }
 *          quantity = 0 → libera la reserva del usuario para ese producto.
 * DELETE /api/stock/reserve — libera TODAS las reservas activas del usuario.
 *
 * Requiere sesión. Sin sesión responde 401 { ok: false } y el cliente lo
 * ignora (la reserva es una mejora, no un requisito del carrito).
 */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { reservationsDb, auditDb } from "@/lib/db/store";
import { getEffectiveStockFor } from "@/lib/stock-utils";

export const dynamic = "force-dynamic";

const reserveSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().min(0),
  unit: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = reserveSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { productId, quantity, unit } = parsed.data;

  reservationsDb.upsert(session.user.id, productId, quantity, unit);

  auditDb.add({
    userId: session.user.id,
    userEmail: session.user.email ?? undefined,
    userRole: session.user.role,
    action: quantity > 0 ? "stock.reserve" : "stock.release",
    resource: productId,
    success: true,
    message:
      quantity > 0
        ? `Reserva de stock: ${quantity} ${unit} de ${productId} (TTL 2h)`
        : `Reserva liberada para ${productId}`,
    metadata: { quantity, unit },
  });

  const effectiveStock = getEffectiveStockFor(productId) ?? 0;
  return Response.json({ ok: true, effectiveStock });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  reservationsDb.releaseAllByUser(session.user.id);

  auditDb.add({
    userId: session.user.id,
    userEmail: session.user.email ?? undefined,
    userRole: session.user.role,
    action: "stock.release",
    resource: "all",
    success: true,
    message: "Todas las reservas de stock del usuario fueron liberadas",
  });

  return Response.json({ ok: true });
}
