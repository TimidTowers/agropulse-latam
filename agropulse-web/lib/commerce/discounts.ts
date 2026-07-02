/**
 * Cálculo de descuentos del pedido: cupones + descuento de productor.
 * Usado por el carrito (preview cliente) y por POST /api/orders
 * (cálculo autoritativo server-side — nunca confiar en el cliente).
 */
import type { Coupon, DiscountLine, UserRole } from "@/lib/db/types";
import type { CountryCode } from "@/lib/countries";

/** Descuento automático para compradores con rol productor. */
export const PRODUCER_DISCOUNT_PCT = 8;

export interface DiscountableItem {
  productId: string;
  productName: string;
  category?: string;
  subtotal: number;
}

export interface CouponValidationContext {
  role: UserRole;
  country: CountryCode;
  /** categorías presentes en el carrito */
  categories: string[];
  /** productIds presentes en el carrito */
  productIds: string[];
  nowMs?: number;
}

export interface CouponValidationResult {
  ok: boolean;
  /** razón legible si no aplica */
  reason?: string;
}

/** Valida si un cupón aplica al contexto del carrito. */
export function validateCoupon(
  coupon: Coupon | undefined | null,
  ctx: CouponValidationContext,
): CouponValidationResult {
  if (!coupon) return { ok: false, reason: "Cupón no encontrado" };
  if (!coupon.enabled) return { ok: false, reason: "Cupón deshabilitado" };
  const now = ctx.nowMs ?? Date.now();
  if (now < new Date(coupon.validFrom).getTime()) {
    return { ok: false, reason: "Cupón aún no vigente" };
  }
  if (now > new Date(coupon.validUntil).getTime()) {
    return { ok: false, reason: "Cupón expirado" };
  }
  if (coupon.maxUses !== undefined && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, reason: "Cupón agotado (límite de usos alcanzado)" };
  }
  if (coupon.countries && coupon.countries.length > 0 && !coupon.countries.includes(ctx.country)) {
    return { ok: false, reason: "Cupón no disponible en tu país" };
  }
  if (coupon.onlyRole && coupon.onlyRole !== ctx.role) {
    return { ok: false, reason: `Cupón exclusivo para rol ${coupon.onlyRole}` };
  }
  if (coupon.type === "categoria" && coupon.category) {
    if (!ctx.categories.includes(coupon.category)) {
      return { ok: false, reason: `El carrito no tiene productos de ${coupon.category}` };
    }
  }
  if (coupon.type === "producto" && coupon.productId) {
    if (!ctx.productIds.includes(coupon.productId)) {
      return { ok: false, reason: "El carrito no incluye el producto del cupón" };
    }
  }
  return { ok: true };
}

export interface ComputeDiscountsInput {
  items: DiscountableItem[];
  subtotal: number;
  shippingFee: number;
  coupon?: Coupon | null;
  buyerRole: UserRole;
}

export interface ComputeDiscountsResult {
  lines: DiscountLine[];
  /** suma de descuentos sobre productos (NO incluye envío gratis) */
  discountTotal: number;
  /** envío ajustado (0 si el cupón es de delivery con freeShipping) */
  shippingFee: number;
}

/**
 * Calcula todas las líneas de descuento. El cupón ya debe estar validado
 * con validateCoupon — aquí solo se computa el monto.
 * Redondeos a 2 decimales para monedas con centavos.
 */
export function computeDiscounts(input: ComputeDiscountsInput): ComputeDiscountsResult {
  const lines: DiscountLine[] = [];
  let shippingFee = input.shippingFee;

  // 1. Cupón
  if (input.coupon) {
    const c = input.coupon;
    if (c.type === "delivery" && c.freeShipping) {
      if (shippingFee > 0) {
        lines.push({ code: c.code, label: `Cupón ${c.code} — envío gratis`, amount: 0 });
      }
      shippingFee = 0;
    } else if (c.discountPct && c.discountPct > 0) {
      let eligibleSubtotal = input.subtotal;
      if (c.type === "categoria" && c.category) {
        eligibleSubtotal = input.items
          .filter((i) => i.category === c.category)
          .reduce((a, i) => a + i.subtotal, 0);
      } else if (c.type === "producto" && c.productId) {
        eligibleSubtotal = input.items
          .filter((i) => i.productId === c.productId)
          .reduce((a, i) => a + i.subtotal, 0);
      }
      const amount = round2((eligibleSubtotal * c.discountPct) / 100);
      if (amount > 0) {
        lines.push({
          code: c.code,
          label: `Cupón ${c.code} (−${c.discountPct}%${c.category ? ` en ${c.category}` : ""})`,
          amount,
        });
      }
    }
  }

  // 2. Descuento automático de productor
  if (input.buyerRole === "productor") {
    const amount = round2((input.subtotal * PRODUCER_DISCOUNT_PCT) / 100);
    if (amount > 0) {
      lines.push({
        label: `Descuento productor (−${PRODUCER_DISCOUNT_PCT}%)`,
        amount,
      });
    }
  }

  const discountTotal = round2(lines.reduce((a, l) => a + l.amount, 0));
  return { lines, discountTotal, shippingFee };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
