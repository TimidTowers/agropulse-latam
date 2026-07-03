/**
 * POST /api/stripe/webhook — SCAFFOLD (501 Not Implemented).
 *
 * En producción este endpoint recibiría eventos firmados de Stripe
 * (`checkout.session.completed`, `payment_intent.succeeded`…), verificaría la
 * firma con STRIPE_WEBHOOK_SECRET (cabecera `stripe-signature`) y marcaría el
 * pedido como pagado de forma asíncrona y confiable.
 *
 * Para esta demo académica la confirmación se hace por REDIRECT:
 * success_url → GET /api/stripe/confirm?session_id=… consulta la sesión con la
 * clave secreta y actualiza paymentStatus. Es suficiente en modo test, pero un
 * webhook sería la fuente de verdad ante cierres de pestaña o fallos de red.
 */
export async function POST() {
  return Response.json(
    {
      ok: false,
      error: "not_implemented",
      message:
        "Webhook de Stripe no implementado en la demo — la confirmación se hace por redirect en /api/stripe/confirm. En producción: verificar stripe-signature y procesar checkout.session.completed.",
    },
    { status: 501 },
  );
}
