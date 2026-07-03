/**
 * Stripe en MODO TEST — helpers server-only.
 *
 * DECISIÓN: se usa la API REST de Stripe directamente con fetch (form-urlencoded)
 * en lugar del SDK `stripe` para NO añadir dependencias al proyecto.
 *
 * DECISIÓN (demo académica): la confirmación del pago se hace por REDIRECT
 * (success_url → /api/stripe/confirm?session_id=…) consultando la Checkout
 * Session con la clave secreta, en lugar de un webhook firmado. En producción
 * el webhook `checkout.session.completed` sería la fuente de verdad — el
 * scaffold queda en app/api/stripe/webhook/route.ts (501).
 *
 * Habilitación: define STRIPE_SECRET_KEY (sk_test_…) en .env.local.
 * NUNCA importar este módulo desde client components.
 */

const STRIPE_API_BASE = "https://api.stripe.com/v1";

/** Stripe está habilitado si existe la clave secreta en el entorno. */
export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Monedas zero-decimal según Stripe (el monto se envía tal cual, SIN ×100):
 * https://docs.stripe.com/currencies#zero-decimal
 * De las monedas de AgroPulse solo CLP es zero-decimal; el resto
 * (USD, MXN, CRC, COP, ARS, PEN, UYU, GTQ, BRL) se multiplica ×100.
 */
const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA",
  "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
]);

/** Convierte un monto en unidades de la moneda al `unit_amount` de Stripe. */
export function toStripeAmount(amount: number, currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase())
    ? Math.round(amount)
    : Math.round(amount * 100);
}

export interface StripeLineItem {
  /** nombre visible en el checkout de Stripe (product_data.name) */
  name: string;
  /** monto en unidades de la moneda del pedido (se convierte a unit_amount) */
  amount: number;
  quantity: number;
}

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  /** "paid" | "unpaid" | "no_payment_required" */
  payment_status?: string;
  status?: string;
  metadata?: Record<string, string>;
}

interface StripeErrorBody {
  error?: { message?: string; type?: string };
}

function authHeaders(): Record<string, string> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY no está configurada");
  return { Authorization: `Bearer ${key}` };
}

/**
 * Crea una Checkout Session (mode=payment) vía POST form-urlencoded.
 * Los montos vienen en unidades de la moneda del pedido; aquí se convierten
 * a centavos salvo monedas zero-decimal (CLP).
 */
export async function createCheckoutSession(opts: {
  orderId: string;
  shortCode?: string;
  /** moneda ISO del pedido (ej. "CRC") — se envía en minúsculas */
  currency: string;
  lineItems: StripeLineItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}): Promise<StripeCheckoutSession> {
  const currency = opts.currency.toLowerCase();
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", opts.successUrl);
  body.set("cancel_url", opts.cancelUrl);
  body.set("metadata[orderId]", opts.orderId);
  if (opts.shortCode) body.set("metadata[shortCode]", opts.shortCode);
  if (opts.customerEmail) body.set("customer_email", opts.customerEmail);

  opts.lineItems.forEach((li, i) => {
    body.set(`line_items[${i}][quantity]`, String(li.quantity));
    body.set(`line_items[${i}][price_data][currency]`, currency);
    body.set(
      `line_items[${i}][price_data][unit_amount]`,
      String(toStripeAmount(li.amount, currency)),
    );
    body.set(
      `line_items[${i}][price_data][product_data][name]`,
      li.name.slice(0, 250),
    );
  });

  const res = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  const data = (await res.json()) as StripeCheckoutSession & StripeErrorBody;
  if (!res.ok) {
    throw new Error(
      data.error?.message ?? `Stripe respondió ${res.status} al crear la sesión`,
    );
  }
  return data;
}

/** Consulta una Checkout Session existente (para la confirmación por redirect). */
export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<StripeCheckoutSession> {
  const res = await fetch(
    `${STRIPE_API_BASE}/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: authHeaders(), cache: "no-store" },
  );
  const data = (await res.json()) as StripeCheckoutSession & StripeErrorBody;
  if (!res.ok) {
    throw new Error(
      data.error?.message ?? `Stripe respondió ${res.status} al consultar la sesión`,
    );
  }
  return data;
}
