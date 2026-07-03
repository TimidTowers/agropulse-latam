/**
 * GET   /api/orders/[id]  — devuelve order si el user tiene acceso
 * PATCH /api/orders/[id]  — cambia status / asigna logística (según rol)
 */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { ordersDb, usersDb, auditDb } from "@/lib/db/store";
import { ORDER_STATUS_FLOW, type OrderStatus } from "@/lib/db/types";
import { ensureProgress } from "@/lib/orders/progression-server";
import { sendEmail } from "@/lib/notifications/email";
import { orderStatusEmail } from "@/lib/notifications/templates";

function canView(
  order: { customerId: string; items: { productorId: string }[]; logisticaUserId?: string },
  user: { id: string; role: string },
): boolean {
  if (user.role === "admin") return true;
  if (user.role === "cliente" && order.customerId === user.id) return true;
  if (user.role === "productor" && order.items.some((i) => i.productorId === user.id)) return true;
  if (user.role === "logistica" && order.logisticaUserId === user.id) return true;
  return false;
}

const patchSchema = z.object({
  status: z
    .enum([
      "recibido",
      "confirmado_productor",
      "preparando",
      "empacado",
      "en_transito",
      "ultima_milla",
      "entregado",
      "cancelado",
    ])
    .optional(),
  note: z.string().optional(),
  logisticaUserId: z.string().optional(),
});

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

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const found = await ordersDb.findById(id);
  // Avance determinístico ANTES de evaluar permisos/responder — el estado
  // devuelto siempre refleja el tiempo transcurrido (monótono).
  const order = found ? await ensureProgress(found) : undefined;
  // Defensa en profundidad: no exponer si existe o no cuando el usuario
  // no tiene permisos — siempre devolver el mismo 404.
  if (!order || !canView(order, session.user)) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return Response.json({ ok: true, order });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const order = await ordersDb.findById(id);
  // Defensa en profundidad: 404 plano si no existe O no tiene permisos.
  if (!order || !canView(order, session.user)) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { status, note, logisticaUserId } = parsed.data;
  const userRole = session.user.role;

  // 1. Asignación logística (solo logistica o admin)
  if (logisticaUserId !== undefined) {
    if (userRole !== "logistica" && userRole !== "admin") {
      return Response.json(
        { ok: false, error: "forbidden", message: "Solo logística puede asignarse." },
        { status: 403 },
      );
    }
    // logística solo puede asignarse a sí misma
    if (userRole === "logistica" && logisticaUserId !== session.user.id) {
      return Response.json(
        { ok: false, error: "forbidden", message: "Solo puedes asignarte a ti mismo." },
        { status: 403 },
      );
    }
    const logUser = await usersDb.findById(logisticaUserId);
    if (!logUser || logUser.role !== "logistica") {
      return Response.json(
        { ok: false, error: "invalid_logistica_user" },
        { status: 400 },
      );
    }
    await ordersDb.update(order.id, { logisticaUserId });
  }

  // 2. Cambio de estado
  if (status) {
    const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
    const nextIdx = ORDER_STATUS_FLOW.indexOf(status);

    // permisos
    if (userRole === "cliente") {
      if (status !== "cancelado" || order.status !== "recibido") {
        return Response.json(
          {
            ok: false,
            error: "forbidden",
            message: "Solo puedes cancelar un pedido recién creado.",
          },
          { status: 403 },
        );
      }
    } else if (userRole === "productor") {
      if (!PRODUCTOR_ALLOWED.includes(status)) {
        return Response.json(
          { ok: false, error: "forbidden", message: "Estado no permitido para productor." },
          { status: 403 },
        );
      }
      // validación: el productor está en items
      if (!order.items.some((i) => i.productorId === session.user.id)) {
        return Response.json(
          { ok: false, error: "forbidden", message: "No eres productor de este pedido." },
          { status: 403 },
        );
      }
    } else if (userRole === "logistica") {
      if (!LOGISTICA_ALLOWED.includes(status)) {
        return Response.json(
          { ok: false, error: "forbidden", message: "Estado no permitido para logística." },
          { status: 403 },
        );
      }
      const finalLogId = logisticaUserId ?? order.logisticaUserId;
      if (finalLogId !== session.user.id) {
        return Response.json(
          { ok: false, error: "forbidden", message: "Este pedido no está asignado a ti." },
          { status: 403 },
        );
      }
    } else if (userRole !== "admin") {
      return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
    }

    // flujo lineal (salvo cancelación)
    if (status !== "cancelado" && nextIdx >= 0 && nextIdx < currentIdx) {
      return Response.json(
        {
          ok: false,
          error: "invalid_transition",
          message: "No puedes retroceder el estado del pedido.",
        },
        { status: 400 },
      );
    }

    await ordersDb.updateStatus(order.id, status, note, session.user.id, userRole);

    await auditDb.add({
      userId: session.user.id,
      userEmail: session.user.email,
      userRole: userRole,
      action: status === "cancelado" ? "order.cancel" : "order.status_change",
      resource: order.id,
      success: true,
      message: `Pedido ${order.shortCode} → ${status}${note ? ` (${note})` : ""}`,
      metadata: { from: order.status, to: status, note },
    });

    // Notificar al cliente con la plantilla de cambio de estado.
    const fresh = await ordersDb.findById(order.id);
    if (fresh) {
      const tpl = orderStatusEmail({
        order: fresh,
        newStatus: status,
        note,
      });
      void sendEmail({
        to: fresh.customerInfo.email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
        templateId: "order.status_change",
        metadata: {
          orderId: fresh.id,
          shortCode: fresh.shortCode,
          newStatus: status,
        },
      });
    }
  }

  const updated = await ordersDb.findById(order.id);
  return Response.json({ ok: true, order: updated });
}
