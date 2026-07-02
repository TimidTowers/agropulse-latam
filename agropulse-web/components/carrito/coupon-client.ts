"use client";

/**
 * Helper cliente de cupones — compartido por CartPageClient y CheckoutForm.
 *
 * - AppliedCoupon: forma pública del cupón que devuelve POST /api/coupons/validate
 *   (nunca exponemos maxUses/usedCount/vigencia al cliente).
 * - toCoupon(): reconstruye un objeto Coupon completo para poder reutilizar
 *   computeDiscounts() de "@/lib/commerce/discounts" en el cliente. Los campos
 *   de vigencia/usos se rellenan con placeholders porque la validación real ya
 *   ocurrió server-side (y se repite de forma autoritativa en POST /api/orders).
 */
import type { Coupon, CouponType } from "@/lib/db/types";

export interface AppliedCoupon {
  code: string;
  type: CouponType;
  description: string;
  discountPct?: number;
  freeShipping?: boolean;
  category?: string;
  productId?: string;
}

export interface ValidateCouponResponse {
  ok: boolean;
  coupon?: AppliedCoupon;
  reason?: string;
}

export function toCoupon(a: AppliedCoupon): Coupon {
  return {
    ...a,
    validFrom: "1970-01-01T00:00:00Z",
    validUntil: "2999-12-31T23:59:59Z",
    usedCount: 0,
    enabled: true,
  };
}

interface CouponCartItem {
  productId: string;
  category?: string;
}

/** Llama a POST /api/coupons/validate con el contexto (categorías/productos) del carrito. */
export async function requestCouponValidation(
  code: string,
  items: CouponCartItem[],
): Promise<ValidateCouponResponse> {
  const categories = Array.from(
    new Set(items.map((i) => i.category).filter((c): c is string => !!c)),
  );
  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  try {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, categories, productIds }),
    });
    const data = (await res.json()) as ValidateCouponResponse;
    if (!data.ok && !data.reason) {
      return {
        ok: false,
        reason:
          res.status === 401
            ? "Inicia sesión para aplicar cupones"
            : "No se pudo validar el cupón",
      };
    }
    return data;
  } catch {
    return { ok: false, reason: "Error de red al validar el cupón" };
  }
}
