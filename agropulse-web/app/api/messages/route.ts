/**
 * GET  /api/messages?orderId=xxx — lista los mensajes del chat de un pedido
 * POST /api/messages             — envía un mensaje al chat de un pedido
 *
 * Permisos (misma lógica que app/pedidos/[id]/page.tsx y /api/orders/[id]):
 *  - admin                → siempre
 *  - cliente              → dueño del pedido
 *  - productor            → con ítems en el pedido
 *  - logística            → asignada al pedido
 *
 * Defensa en profundidad: si el pedido no existe O el usuario no tiene
 * permisos, se responde el mismo 404 plano (no se revela existencia).
 */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { ordersDb, messagesDb } from "@/lib/db/store";

function canChat(
  order: {
    customerId: string;
    items: { productorId: string }[];
    logisticaUserId?: string;
  },
  user: { id: string; role: string },
): boolean {
  if (user.role === "admin") return true;
  if (user.role === "cliente" && order.customerId === user.id) return true;
  if (
    user.role === "productor" &&
    order.items.some((i) => i.productorId === user.id)
  )
    return true;
  if (user.role === "logistica" && order.logisticaUserId === user.id)
    return true;
  return false;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json(
      { ok: false, error: "unauthenticated" },
      { status: 401 },
    );
  }

  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return Response.json(
      { ok: false, error: "missing_order_id" },
      { status: 400 },
    );
  }

  const order = await ordersDb.findById(orderId);
  if (!order || !canChat(order, session.user)) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const messages = await messagesDb.listByOrder(orderId);
  return Response.json({ ok: true, messages });
}

const postSchema = z.object({
  orderId: z.string().min(1),
  body: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json(
      { ok: false, error: "unauthenticated" },
      { status: 401 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Sanitización: trim — el render escapa el contenido vía React.
  const body = parsed.data.body.trim();
  if (!body) {
    return Response.json({ ok: false, error: "empty_body" }, { status: 400 });
  }

  const order = await ordersDb.findById(parsed.data.orderId);
  if (!order || !canChat(order, session.user)) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const message = await messagesDb.add({
    orderId: order.id,
    senderId: session.user.id,
    senderName: session.user.name,
    senderRole: session.user.role,
    body,
  });

  return Response.json({ ok: true, message });
}
