/**
 * GET   /api/orders  — lista pedidos del user (filtrado por rol)
 * POST  /api/orders  — crea pedido (roles: cliente, productor, admin)
 *
 * Los productores compran con 8% de descuento automático (PRODUCER_DISCOUNT_PCT).
 * El cálculo de cupones/descuentos/comisión es AUTORITATIVO aquí — nunca se
 * confía en los totales del cliente.
 */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  ordersDb,
  usersDb,
  paymentMethodsDb,
  auditDb,
  couponsDb,
  reservationsDb,
  stockDb,
} from "@/lib/db/store";
import { validateCoupon, computeDiscounts } from "@/lib/commerce/discounts";
import { COUNTRIES, type CountryCode } from "@/lib/countries";
import type { Coupon, OrderExtended, OrderItem, UserAddress, UserRole } from "@/lib/db/types";
import { sendEmail, AGROPULSE_INBOX } from "@/lib/notifications/email";
import { orderConfirmationEmail } from "@/lib/notifications/templates";

/** Roles que pueden comprar en el marketplace. */
const BUYER_ROLES: UserRole[] = ["cliente", "productor", "admin"];

const addressSchema = z.object({
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.enum(COUNTRIES.map((c) => c.code) as [CountryCode, ...CountryCode[]]),
});

const orderItemSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  productImage: z.string().min(1),
  productorId: z.string().min(1),
  productorName: z.string().min(1),
  country: z.enum(COUNTRIES.map((c) => c.code) as [CountryCode, ...CountryCode[]]),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  /** categoría del producto — necesaria para cupones por categoría (FRUTAS15…) */
  category: z.string().optional(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingFee: z.number().nonnegative(),
  shippingMethod: z.string().min(1),
  paymentMethodId: z.string().min(1),
  customerInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(3),
    address: addressSchema,
    country: z.enum(COUNTRIES.map((c) => c.code) as [CountryCode, ...CountryCode[]]),
  }),
  notes: z.string().optional(),
  acceptTerms: z.boolean(),
  /** código de cupón aplicado en el carrito (se re-valida server-side) */
  couponCode: z.string().min(1).max(40).optional(),
});

async function nextShortCode(): Promise<string> {
  // genera secuencial AP-2026-XXXX desde ordersDb.count
  const seq = (await ordersDb.count()) + 1;
  const padded = String(seq).padStart(4, "0");
  return `AP-2026-${padded}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  const role = session.user.role;
  const uid = session.user.id;
  let orders: OrderExtended[];
  if (role === "admin") orders = await ordersDb.listAll();
  else if (role === "cliente") orders = await ordersDb.listByCustomer(uid);
  else if (role === "productor") {
    // Un productor ve los pedidos que VENDE y también los que COMPRA
    // (los productores pueden comprar con descuento automático del 8%).
    const merged = new Map<string, OrderExtended>();
    for (const o of await ordersDb.listByProductor(uid)) merged.set(o.id, o);
    for (const o of await ordersDb.listByCustomer(uid)) merged.set(o.id, o);
    orders = Array.from(merged.values());
  } else if (role === "logistica") orders = await ordersDb.listByLogistica(uid);
  else orders = [];

  return Response.json({ ok: true, orders });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  if (!BUYER_ROLES.includes(session.user.role)) {
    return Response.json(
      {
        ok: false,
        error: "forbidden",
        message: "Solo clientes y productores pueden crear pedidos.",
      },
      { status: 403 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const body = parsed.data;

  if (!body.acceptTerms) {
    return Response.json(
      { ok: false, error: "terms_required" },
      { status: 400 },
    );
  }

  // Validar país: todos los items y el cliente deben coincidir
  const user = await usersDb.findById(session.user.id);
  if (!user) {
    return Response.json({ ok: false, error: "user_not_found" }, { status: 401 });
  }

  const orderCountry = body.customerInfo.country;
  if (orderCountry !== user.country) {
    return Response.json(
      {
        ok: false,
        error: "country_mismatch",
        message: "El pedido debe ser del mismo país que tu cuenta.",
      },
      { status: 400 },
    );
  }

  for (const it of body.items) {
    if (it.country !== orderCountry) {
      return Response.json(
        {
          ok: false,
          error: "country_mismatch_item",
          message: `Solo puedes comprar productos de ${orderCountry}.`,
        },
        { status: 400 },
      );
    }
  }

  // Verificar método de pago disponible para el país
  const pm = await paymentMethodsDb.findById(body.paymentMethodId);
  if (!pm || !pm.countries.includes(orderCountry) || !pm.enabled) {
    return Response.json(
      { ok: false, error: "invalid_payment_method" },
      { status: 400 },
    );
  }

  // Compute totals
  const items: OrderItem[] = body.items.map((it) => ({
    productId: it.productId,
    productSlug: it.productSlug,
    productName: it.productName,
    productImage: it.productImage,
    productorId: it.productorId,
    productorName: it.productorName,
    quantity: it.quantity,
    unit: it.unit,
    unitPrice: it.unitPrice,
    subtotal: Math.round(it.unitPrice * it.quantity),
    category: it.category,
  }));

  const subtotal = items.reduce((a, b) => a + b.subtotal, 0);

  // Cupón (opcional) — validación AUTORITATIVA server-side, nunca se confía
  // en lo que validó el cliente en /api/coupons/validate.
  let coupon: Coupon | null = null;
  if (body.couponCode) {
    const found = await couponsDb.findByCode(body.couponCode);
    const categories = Array.from(
      new Set(items.map((i) => i.category).filter((c): c is string => !!c)),
    );
    const productIds = items.map((i) => i.productId);
    const validation = validateCoupon(found, {
      role: user.role,
      country: user.country,
      categories,
      productIds,
    });
    if (!found || !validation.ok) {
      return Response.json(
        {
          ok: false,
          error: "invalid_coupon",
          message: validation.reason ?? "Cupón no válido",
        },
        { status: 400 },
      );
    }
    coupon = found;
  }

  // Descuentos: cupón + 8% automático si el comprador es productor.
  const discounts = computeDiscounts({
    items,
    subtotal,
    shippingFee: body.shippingFee,
    coupon,
    buyerRole: user.role,
  });
  const discountTotal = discounts.discountTotal;
  // shippingFee ajustado (0 si el cupón es de delivery con envío gratis)
  const shippingFee = discounts.shippingFee;

  // DECISIÓN: la comisión AgroPulse (4%) y el fee del método de pago se
  // calculan sobre (subtotal − descuentos) — el monto realmente cobrado —
  // igual que el preview del carrito/checkout, para que ambos cuadren.
  const discountedSubtotal = Math.max(0, subtotal - discountTotal);
  const commissionFee = Math.round(discountedSubtotal * 0.04);
  const paymentFee = pm.feePct
    ? Math.round((discountedSubtotal * pm.feePct) / 100)
    : 0;
  const total = discountedSubtotal + commissionFee + shippingFee + paymentFee;
  const country = COUNTRIES.find((c) => c.code === orderCountry)!;

  const id = `o-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const shortCode = await nextShortCode();
  const now = new Date().toISOString();
  // estimación: 48h
  const estimated = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

  const order: OrderExtended = {
    id,
    shortCode,
    customerId: user.id,
    customerInfo: {
      name: body.customerInfo.name,
      email: body.customerInfo.email,
      phone: body.customerInfo.phone,
      address: body.customerInfo.address as UserAddress,
      country: body.customerInfo.country,
    },
    items,
    currency: country.currency,
    subtotal,
    commissionFee,
    shippingFee,
    total,
    paymentMethodId: pm.id,
    paymentMethodLabel: pm.name,
    paymentStatus: "pendiente",
    status: "recibido",
    statusHistory: [
      {
        status: "recibido",
        timestamp: now,
        note: `Pedido creado vía web (${body.shippingMethod})`,
        by: user.id,
        byRole: user.role,
      },
    ],
    estimatedDelivery: estimated,
    notes: body.notes,
    createdAt: now,
    country: orderCountry,
    // Pedidos creados en runtime avanzan solos (lib/orders/progression.ts)
    autoProgress: true,
    couponCode: coupon?.code,
    discountLines: discounts.lines.length > 0 ? discounts.lines : undefined,
    discountTotal: discountTotal > 0 ? discountTotal : undefined,
  };

  await ordersDb.create(order);

  // Confirmación definitiva de stock: la reserva temporal (TTL 2h) pasa a
  // "confirmada" y las unidades se registran como vendidas — el stock
  // efectivo del marketplace baja de inmediato ("hay 10kg de uva menos").
  for (const it of items) {
    await reservationsDb.confirmByUserProduct(user.id, it.productId, order.id);
    await stockDb.addSold(it.productId, it.quantity);
  }

  if (coupon) {
    await couponsDb.incrementUse(coupon.code);
    await auditDb.add({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "coupon.apply",
      resource: coupon.code,
      success: true,
      message: `Cupón ${coupon.code} aplicado al pedido ${shortCode} (−${discountTotal} ${country.currency} en descuentos)`,
      metadata: { orderId: order.id, shortCode, couponCode: coupon.code, discountTotal },
    });
  }

  await auditDb.add({
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: "order.create",
    resource: order.id,
    success: true,
    message: `Pedido ${shortCode} creado (${items.length} items, total ${total} ${country.currency})`,
    metadata: { shortCode, total, currency: country.currency, items: items.length },
  });

  // Notificar al cliente y a los productores únicos
  const productorIds = Array.from(new Set(items.map((i) => i.productorId)));
  const productorEmails: string[] = [];
  for (const pid of productorIds) {
    const p = await usersDb.findById(pid);
    if (p?.email) productorEmails.push(p.email);
  }

  // Email al cliente
  const clienteTpl = orderConfirmationEmail({
    order,
    recipientRole: "cliente",
  });
  await sendEmail({
    to: user.email,
    subject: clienteTpl.subject,
    html: clienteTpl.html,
    text: clienteTpl.text,
    templateId: "order.created",
    metadata: { orderId: id, shortCode },
  });

  // Email a los productores
  if (productorEmails.length > 0) {
    const productorTpl = orderConfirmationEmail({
      order,
      recipientRole: "productor",
    });
    await sendEmail({
      to: productorEmails,
      subject: productorTpl.subject,
      html: productorTpl.html,
      text: productorTpl.text,
      templateId: "order.created.productor",
      metadata: { orderId: id, shortCode },
    });
  }

  // Email a AgroPulse (interno, copia del template del cliente)
  await sendEmail({
    to: AGROPULSE_INBOX,
    subject: `[AgroPulse] Nuevo pedido ${shortCode}`,
    html: clienteTpl.html,
    text: `Nuevo pedido creado: ${shortCode} — Total ${total} ${country.currency}`,
    templateId: "order.created.internal",
    metadata: { orderId: id, shortCode },
  });

  return Response.json({ ok: true, order }, { status: 201 });
}
