/**
 * POST /api/stripe/checkout — crea una Checkout Session de Stripe (modo TEST)
 * para un pedido ya creado vía POST /api/orders.
 *
 * Body: { orderId }
 * Respuesta: { ok: true, url } → el cliente redirige a la página de pago de
 * Stripe. Si STRIPE_SECRET_KEY no está configurada: { ok: false, reason:
 * "stripe_disabled" }.
 *
 * El pago NO modifica el flujo de creación del pedido: el pedido nace con
 * paymentStatus "pendiente" y la confirmación por redirect
 * (/api/stripe/confirm) lo pasa a "pagado".
 */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { ordersDb } from "@/lib/db/store";
import { createCheckoutSession, isStripeEnabled } from "@/lib/stripe";

const bodySchema = z.object({ orderId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  if (!isStripeEnabled()) {
    return Response.json({ ok: false, reason: "stripe_disabled" });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const order = await ordersDb.findById(parsed.data.orderId);
  if (!order) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  // Solo el comprador del pedido puede iniciar su pago.
  if (order.customerId !== session.user.id) {
    return Response.json(
      { ok: false, error: "forbidden", message: "Este pedido no es tuyo." },
      { status: 403 },
    );
  }
  if (order.paymentStatus === "pagado") {
    return Response.json(
      { ok: false, error: "already_paid", message: "El pedido ya está pagado." },
      { status: 400 },
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  // Confirmación por redirect (sin webhook, ver lib/stripe.ts): Stripe
  // sustituye {CHECKOUT_SESSION_ID} y /api/stripe/confirm valida el pago y
  // termina redirigiendo a /pedidos/{id}?pago=ok.
  const successUrl = `${origin}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/pedidos/${order.id}?pago=cancelado`;

  // Line items: una línea por producto (cantidades pueden ser fraccionarias
  // —kg— así que quantity=1 y el subtotal del item como monto) + una línea de
  // envío/comisiones netas de descuentos. Si los descuentos superan los fees
  // (ajuste negativo, Stripe no acepta montos negativos) se colapsa todo en
  // una sola línea con el total del pedido.
  const itemsSum = order.items.reduce((a, b) => a + b.subtotal, 0);
  const adjustment = order.total - itemsSum;
  const lineItems =
    adjustment >= 0
      ? [
          ...order.items.map((it) => ({
            name: `${it.productName} (${it.quantity} ${it.unit})`,
            amount: it.subtotal,
            quantity: 1,
          })),
          ...(adjustment > 0
            ? [
                {
                  name: "Envío y comisiones AgroPulse (neto de descuentos)",
                  amount: adjustment,
                  quantity: 1,
                },
              ]
            : []),
        ]
      : [
          {
            name: `Pedido ${order.shortCode} — AgroPulse (${order.items.length} producto${order.items.length === 1 ? "" : "s"})`,
            amount: order.total,
            quantity: 1,
          },
        ];

  try {
    const checkout = await createCheckoutSession({
      orderId: order.id,
      shortCode: order.shortCode,
      currency: order.currency,
      lineItems,
      successUrl,
      cancelUrl,
      customerEmail: order.customerInfo.email,
    });
    if (!checkout.url) {
      throw new Error("Stripe no devolvió URL de checkout");
    }
    return Response.json({ ok: true, url: checkout.url, sessionId: checkout.id });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error: "stripe_error",
        message: err instanceof Error ? err.message : "Error al crear la sesión de pago",
      },
      { status: 502 },
    );
  }
}
