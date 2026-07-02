"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  Snowflake,
  PackageCheck,
  CreditCard,
  StickyNote,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Tag,
  BadgePercent,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useCartStore } from "@/lib/stores/cart-store";
import { getCountry, formatPriceByCode } from "@/lib/countries";
import { computeDiscounts, PRODUCER_DISCOUNT_PCT } from "@/lib/commerce/discounts";
import {
  requestCouponValidation,
  toCoupon,
  type AppliedCoupon,
} from "@/components/carrito/coupon-client";
import type { PublicUser, PaymentMethod } from "@/lib/db/types";

interface CheckoutFormProps {
  user: PublicUser;
  paymentMethods: PaymentMethod[];
}

const SHIPPING_METHODS = [
  {
    id: "cold-chain",
    name: "Cadena de frío 24-48h",
    description: "Camión refrigerado · seguro incluido",
    icon: Snowflake,
    feeFactor: 0.06, // 6% del subtotal
    flatMin: 800,
  },
  {
    id: "standard",
    name: "Estándar 48-72h",
    description: "Logística tradicional con seguimiento",
    icon: Truck,
    feeFactor: 0.035,
    flatMin: 400,
  },
  {
    id: "pickup",
    name: "Recogida en finca",
    description: "Coordina retiro directo con el productor",
    icon: PackageCheck,
    feeFactor: 0,
    flatMin: 0,
  },
] as const;

export function CheckoutForm({ user, paymentMethods }: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clear = useCartStore((s) => s.clear);
  const couponCode = useCartStore((s) => s.couponCode);
  const setCoupon = useCartStore((s) => s.setCoupon);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cupón aplicado en el carrito — se re-valida al montar (pudo expirar o
  // el carrito pudo cambiar de categorías desde que se aplicó).
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  useEffect(() => {
    if (!mounted) return;
    if (!couponCode || items.length === 0) {
      setAppliedCoupon(null);
      return;
    }
    let cancelled = false;
    requestCouponValidation(couponCode, items).then((res) => {
      if (cancelled) return;
      if (res.ok && res.coupon) {
        setAppliedCoupon(res.coupon);
      } else {
        // Cupón ya no válido: se descarta silenciosamente del pedido
        setAppliedCoupon(null);
        setCoupon(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mounted, couponCode, items, setCoupon]);

  const [shippingId, setShippingId] = useState<string>("cold-chain");
  const [paymentMethodId, setPaymentMethodId] = useState<string>(
    paymentMethods[0]?.id ?? "",
  );
  const [notes, setNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const country = getCountry(user.country);

  // Verificar profile completeness
  const profileMissing: string[] = [];
  if (!user.phone) profileMissing.push("teléfono");
  if (!user.address?.line1) profileMissing.push("dirección");
  if (!user.address?.city) profileMissing.push("ciudad");
  if (!user.address?.state) profileMissing.push("estado/provincia");

  // Validar carrito
  const cartCountries = useMemo(() => Array.from(new Set(items.map((i) => i.country))), [items]);
  const cartCountry = cartCountries[0];
  const mixedCountries = cartCountries.length > 1;
  const wrongCountry = cartCountry && cartCountry !== user.country;
  const cartEmpty = items.length === 0;

  const blocked =
    profileMissing.length > 0 || cartEmpty || mixedCountries || wrongCountry;

  // Cálculos
  const subtotal = getSubtotal();
  const shipping = SHIPPING_METHODS.find((s) => s.id === shippingId) ?? SHIPPING_METHODS[0];
  const baseShippingFee = Math.max(
    shipping.flatMin,
    Math.round(subtotal * shipping.feeFactor),
  );

  // Descuentos (cupón + 8% automático de productor). Mismo motor que el
  // server: computeDiscounts de lib/commerce/discounts.
  const discounts = computeDiscounts({
    items: items.map((i) => ({
      productId: i.productId,
      productName: i.name,
      category: i.category,
      subtotal: i.pricePerUnit * i.quantity,
    })),
    subtotal,
    shippingFee: baseShippingFee,
    coupon: appliedCoupon ? toCoupon(appliedCoupon) : null,
    buyerRole: user.role,
  });
  const discountTotal = discounts.discountTotal;
  // Envío ajustado (0 si el cupón es de delivery con envío gratis)
  const shippingFee = discounts.shippingFee;

  // DECISIÓN: comisión 4% y fee del método de pago se recalculan sobre
  // (subtotal − descuentos) — igual que el cálculo autoritativo de
  // POST /api/orders — para que este resumen cuadre con el pedido creado.
  const discountedSubtotal = Math.max(0, subtotal - discountTotal);
  const commissionFee = Math.round(discountedSubtotal * 0.04);

  const selectedPm = paymentMethods.find((p) => p.id === paymentMethodId);
  const paymentFee = selectedPm?.feePct
    ? Math.round((discountedSubtotal * selectedPm.feePct) / 100)
    : 0;

  const total = discountedSubtotal + commissionFee + shippingFee + paymentFee;

  const allReady =
    !blocked &&
    acceptTerms &&
    !!paymentMethodId &&
    !!shippingId;

  async function handleConfirm() {
    if (!allReady || !mounted) return;
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          productSlug: i.productSlug,
          productName: i.name,
          productImage: i.image,
          productorId: i.productorId,
          productorName: i.productorName,
          country: i.country,
          quantity: i.quantity,
          unit: i.unit,
          unitPrice: i.pricePerUnit,
          category: i.category,
        })),
        // Se envía el fee base del método; si hay cupón de envío gratis el
        // server lo ajusta a 0 con computeDiscounts (cálculo autoritativo).
        shippingFee: baseShippingFee,
        shippingMethod: shipping.name,
        paymentMethodId,
        customerInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          address: user.address!,
          country: user.country,
        },
        notes: notes.trim() || undefined,
        acceptTerms,
        couponCode: appliedCoupon?.code,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? data.error ?? "Error al crear el pedido");
      }

      setConfirmedOrderId(data.order.id);
      clear();
      // Redirige tras animación breve
      setTimeout(() => {
        router.push(`/pedidos/${data.order.id}`);
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <Container className="py-20">
        <p className="text-muted">Cargando checkout…</p>
      </Container>
    );
  }

  if (confirmedOrderId) {
    return (
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="max-w-xl mx-auto text-center rounded-3xl border border-brand/30 bg-surface p-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 8, -6, 0] }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-white"
          >
            <CheckCircle2 size={42} />
          </motion.div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
            ¡Pedido confirmado!
          </h2>
          <p className="mt-2 text-muted">
            Redirigiendo a tu seguimiento…
          </p>
        </motion.div>
      </Container>
    );
  }

  if (cartEmpty) {
    return (
      <Container className="py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-muted">
            <AlertCircle size={32} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
            Tu carrito está vacío
          </h1>
          <p className="mt-2 text-muted">
            Agrega productos al carrito antes de continuar al checkout.
          </p>
          <Link href="/marketplace" className="mt-6 inline-block">
            <Button size="lg">Ir al marketplace</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
        Checkout seguro
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
        Confirma tu pedido
      </h1>
      <p className="mt-2 text-muted">
        Última revisión antes de enviar tu solicitud a los productores.
      </p>

      <div className="mt-10 grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* PASO 1 — Cliente */}
          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white text-xs font-semibold">
                  1
                </span>
                <h2 className="font-semibold text-ink">Información del cliente</h2>
              </div>
              <Link
                href="/perfil"
                className="text-xs font-medium text-brand hover:text-brand-dark"
              >
                Editar en mi perfil →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <ProfileField icon={User} label="Nombre" value={user.name} />
              <ProfileField icon={Mail} label="Email" value={user.email} />
              <ProfileField
                icon={Phone}
                label="Teléfono"
                value={user.phone ?? "—"}
                missing={!user.phone}
              />
              <ProfileField
                icon={MapPin}
                label="Ciudad"
                value={user.address?.city ?? "—"}
                missing={!user.address?.city}
              />
              <div className="sm:col-span-2">
                <ProfileField
                  icon={MapPin}
                  label="Dirección"
                  value={
                    user.address
                      ? `${user.address.line1}${user.address.line2 ? ", " + user.address.line2 : ""}, ${user.address.state}, ${user.address.postalCode}`
                      : "—"
                  }
                  missing={!user.address?.line1}
                />
              </div>
            </div>

            {profileMissing.length > 0 && (
              <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900">
                  Faltan datos en tu perfil: <strong>{profileMissing.join(", ")}</strong>.{" "}
                  <Link href="/perfil" className="underline">
                    Complétalos para continuar
                  </Link>
                  .
                </p>
              </div>
            )}
          </section>

          {/* PASO 2 — Envío */}
          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white text-xs font-semibold">
                2
              </span>
              <h2 className="font-semibold text-ink">Método de envío</h2>
            </div>
            <div className="space-y-3">
              {SHIPPING_METHODS.map((m) => {
                const Icon = m.icon;
                const active = shippingId === m.id;
                const fee = Math.max(m.flatMin, Math.round(subtotal * m.feeFactor));
                return (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                      active
                        ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                        : "border-border-soft hover:bg-surface-2"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={m.id}
                      checked={active}
                      onChange={() => setShippingId(m.id)}
                      className="accent-brand"
                    />
                    <Icon size={20} className={active ? "text-brand" : "text-muted"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">{m.name}</p>
                      <p className="text-xs text-muted">{m.description}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink tabular-nums">
                      {fee === 0
                        ? "Gratis"
                        : formatPriceByCode(fee, user.country)}
                    </p>
                  </label>
                );
              })}
            </div>
          </section>

          {/* PASO 3 — Pago */}
          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white text-xs font-semibold">
                3
              </span>
              <h2 className="font-semibold text-ink">Método de pago</h2>
            </div>
            <p className="text-xs text-muted mb-4">
              Disponibles en {country.flag} {country.name}
            </p>

            {paymentMethods.length === 0 ? (
              <p className="text-sm text-muted">
                No hay métodos de pago disponibles para tu país.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {paymentMethods.map((m) => {
                  const active = paymentMethodId === m.id;
                  return (
                    <label
                      key={m.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                        active
                          ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                          : "border-border-soft hover:bg-surface-2"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={active}
                        onChange={() => setPaymentMethodId(m.id)}
                        className="accent-brand mt-0.5"
                      />
                      <span className="text-xl leading-none flex-shrink-0">
                        {m.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink">{m.name}</p>
                        <p className="text-[11px] text-muted leading-relaxed">
                          {m.description}
                        </p>
                        {m.feePct ? (
                          <p className="text-[10px] text-muted mt-1">
                            +{m.feePct}% comisión
                          </p>
                        ) : null}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </section>

          {/* PASO 4 — Notas */}
          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white text-xs font-semibold">
                4
              </span>
              <h2 className="font-semibold text-ink">Notas adicionales</h2>
              <StickyNote size={14} className="text-muted ml-auto" />
            </div>
            <Textarea
              placeholder="Instrucciones especiales para el productor o el transportista (opcional)…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </section>

          {/* Términos */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 accent-brand"
            />
            <span className="text-sm text-muted">
              He leído y acepto los{" "}
              <Link
                href="/legal/terminos"
                className="text-brand hover:text-brand-dark underline"
              >
                términos y condiciones
              </Link>{" "}
              de AgroPulse, así como la política de devoluciones para productos perecederos.
            </span>
          </label>
        </div>

        {/* Columna derecha — Resumen */}
        <aside className="rounded-2xl border border-border-soft bg-surface p-6 h-fit lg:sticky lg:top-20">
          <h2 className="font-semibold text-ink mb-4">Resumen del pedido</h2>

          <ul className="space-y-3 border-b border-border-soft pb-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink truncate">{item.name}</p>
                  <p className="text-[11px] text-muted">
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <p className="text-xs font-semibold text-ink tabular-nums">
                  {formatPriceByCode(item.pricePerUnit * item.quantity, item.country)}
                </p>
              </li>
            ))}
          </ul>

          {user.role === "productor" && (
            <div className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-3 flex items-start gap-2">
              <BadgePercent size={14} className="text-brand flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink">
                Como productor tienes{" "}
                <strong>{PRODUCER_DISCOUNT_PCT}% de descuento automático</strong>{" "}
                en tus compras.
              </p>
            </div>
          )}

          {appliedCoupon && (
            <div className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-3 flex items-start gap-2">
              <Tag size={14} className="text-brand flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink">
                Cupón <strong>{appliedCoupon.code}</strong> aplicado ·{" "}
                {appliedCoupon.description}
              </p>
            </div>
          )}

          <ul className="space-y-2 text-sm pt-4">
            <li className="flex items-center justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-ink tabular-nums">
                {formatPriceByCode(subtotal, user.country)}
              </span>
            </li>
            {discounts.lines.map((line) => (
              <li
                key={line.label}
                className="flex items-center justify-between"
              >
                <span className="text-brand">{line.label}</span>
                <span className="text-brand tabular-nums font-medium">
                  {line.amount > 0
                    ? `−${formatPriceByCode(line.amount, user.country)}`
                    : "Gratis"}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between">
              <span className="text-muted">Comisión AgroPulse (4%)</span>
              <span className="text-ink tabular-nums">
                {formatPriceByCode(commissionFee, user.country)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted">
                Envío
                {appliedCoupon?.freeShipping && baseShippingFee > 0 && (
                  <span className="text-brand"> (cupón)</span>
                )}
              </span>
              <span className="text-ink tabular-nums">
                {shippingFee === 0 ? "Gratis" : formatPriceByCode(shippingFee, user.country)}
              </span>
            </li>
            {paymentFee > 0 && (
              <li className="flex items-center justify-between">
                <span className="text-muted">Comisión {selectedPm?.name}</span>
                <span className="text-ink tabular-nums">
                  {formatPriceByCode(paymentFee, user.country)}
                </span>
              </li>
            )}
          </ul>

          <div className="border-t border-border-soft mt-4 pt-4 flex items-center justify-between">
            <span className="font-semibold text-ink">Total</span>
            <span className="text-xl font-semibold text-ink tabular-nums">
              {formatPriceByCode(total, user.country)}
            </span>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-900 flex items-start gap-2"
              >
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="button"
            size="lg"
            disabled={!allReady || submitting}
            onClick={handleConfirm}
            className="w-full mt-6"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Procesando…
              </>
            ) : (
              <>
                Confirmar pedido
                <ArrowRight size={16} />
              </>
            )}
          </Button>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            <ShieldCheck size={11} className="text-brand" />
            Tus datos se procesan de forma segura. Recibirás un correo de
            confirmación.
          </div>
        </aside>
      </div>
    </Container>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
  missing,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  missing?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${missing ? "border-amber-300 bg-amber-50/60" : "border-border-soft bg-surface-2/40"}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] text-muted">
        <Icon size={11} />
        {label}
      </div>
      <p className={`mt-1 text-sm ${missing ? "text-amber-900" : "text-ink"} truncate`}>
        {value}
      </p>
    </div>
  );
}
