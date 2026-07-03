/**
 * GET /api/stripe/confirm?session_id=… — confirmación de pago por REDIRECT.
 *
 * Stripe redirige aquí como success_url tras el pago. Se consulta la Checkout
 * Session con la clave secreta (server-to-server, no se confía en el browser)
 * y si payment_status === "paid" el pedido pasa a paymentStatus "pagado" con
 * su entrada de auditoría. Finalmente redirige a /pedidos/{id}?pago=ok.
 *
 * DECISIÓN (demo): confirmación por redirect en lugar de webhook — ver
 * lib/stripe.ts y app/api/stripe/webhook/route.ts. Es idempotente: si el
 * pedido ya está pagado solo redirige.
 *
 * No exige sesión NextAuth: la autoridad es la verificación server-side de la
 * sesión de Stripe (un session_id inválido no marca nada).
 */
import type { NextRequest } from "next/server";
import { auditDb, ordersDb, usersDb } from "@/lib/db/store";
import { isStripeEnabled, retrieveCheckoutSession } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const redirectTo = (path: string) =>
    Response.redirect(new URL(path, origin), 303);

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!isStripeEnabled() || !sessionId) {
    return redirectTo("/pedidos?pago=error");
  }

  try {
    const checkout = await retrieveCheckoutSession(sessionId);
    const orderId = checkout.metadata?.orderId;
    if (!orderId) return redirectTo("/pedidos?pago=error");

    const order = await ordersDb.findById(orderId);
    if (!order) return redirectTo("/pedidos?pago=error");

    if (checkout.payment_status !== "paid") {
      // Sesión sin pagar (canceló o falló el cobro) — vuelve al pedido.
      return redirectTo(`/pedidos/${order.id}?pago=cancelado`);
    }

    if (order.paymentStatus !== "pagado") {
      await ordersDb.update(order.id, { paymentStatus: "pagado" });

      const customer = await usersDb.findById(order.customerId);
      await auditDb.add({
        userId: order.customerId,
        userEmail: customer?.email ?? order.customerInfo.email,
        userRole: customer?.role ?? "cliente",
        // AuditAction es un union cerrado (lib/db/types.ts, fuera de mi
        // ownership) — se reutiliza order.status_change para el cambio de
        // paymentStatus.
        action: "order.status_change",
        resource: order.id,
        success: true,
        message: `Pago con tarjeta (Stripe test) confirmado — pedido ${order.shortCode} pasa a "pagado" (${order.total} ${order.currency})`,
        metadata: {
          shortCode: order.shortCode,
          paymentStatus: "pagado",
          stripeSessionId: checkout.id,
          total: order.total,
          currency: order.currency,
        },
      });
    }

    return redirectTo(`/pedidos/${order.id}?pago=ok`);
  } catch {
    return redirectTo("/pedidos?pago=error");
  }
}
