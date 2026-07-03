/**
 * POST /api/coupons/validate — valida un cupón contra el contexto del carrito.
 *
 * Auth requerida: la validez puede depender del rol (PRODUCTOR5) y del país
 * (TICO25) del usuario. El body trae las categorías y productIds del carrito
 * para cupones tipo "categoria" (FRUTAS15, CAFE20…) o "producto".
 *
 * Respuesta: { ok: true, coupon: {…} } | { ok: false, reason: string }
 * Nota: esta validación es de preview UX — POST /api/orders re-valida de
 * forma autoritativa antes de aplicar cualquier descuento.
 */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { couponsDb, usersDb } from "@/lib/db/store";
import { validateCoupon } from "@/lib/commerce/discounts";

const bodySchema = z.object({
  code: z.string().min(1).max(40),
  categories: z.array(z.string()).default([]),
  productIds: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json(
      { ok: false, reason: "Inicia sesión para aplicar cupones" },
      { status: 401 },
    );
  }
  const user = await usersDb.findById(session.user.id);
  if (!user) {
    return Response.json(
      { ok: false, reason: "Usuario no encontrado" },
      { status: 401 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "JSON inválido" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, reason: "Datos del carrito inválidos" },
      { status: 400 },
    );
  }

  const coupon = await couponsDb.findByCode(parsed.data.code);
  const result = validateCoupon(coupon, {
    role: user.role,
    country: user.country,
    categories: parsed.data.categories,
    productIds: parsed.data.productIds,
  });

  if (!coupon || !result.ok) {
    return Response.json({ ok: false, reason: result.reason ?? "Cupón no válido" });
  }

  return Response.json({
    ok: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      description: coupon.description,
      discountPct: coupon.discountPct,
      freeShipping: coupon.freeShipping,
      category: coupon.category,
      productId: coupon.productId,
    },
  });
}
