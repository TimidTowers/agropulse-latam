/**
 * GET /api/stripe/status — indica si el pago con tarjeta vía Stripe (test)
 * está habilitado (STRIPE_SECRET_KEY presente). No expone secretos.
 */
import { isStripeEnabled } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ enabled: isStripeEnabled() });
}
