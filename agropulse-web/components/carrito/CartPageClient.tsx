"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShoppingBag,
  AlertTriangle,
  Lock,
  PackageCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPriceByCode, getCountry } from "@/lib/countries";
import { QuantityInput } from "./QuantityInput";

interface ToastMsg {
  id: string;
  text: string;
}

export function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getCommission = useCartStore((s) => s.getCommission);
  const getShipping = useCartStore((s) => s.getShipping);
  const getTotal = useCartStore((s) => s.getTotal);
  const getCountrySet = useCartStore((s) => s.getCountrySet);
  const getTotalUnits = useCartStore((s) => s.getTotalUnits);

  const { data: session, status } = useSession();
  const authed = status === "authenticated" && !!session?.user;
  const userCountry = session?.user?.country;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Toast simple inline
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const pushToast = useCallback((text: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => {
      setToasts((t) => t.filter((m) => m.id !== id));
    }, 2800);
  }, []);

  if (!mounted) {
    return (
      <Container className="py-20">
        <div className="text-sm text-muted">Cargando carrito…</div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-muted">
            <ShoppingBag size={32} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
            Tu carrito está vacío
          </h1>
          <p className="mt-2 text-muted">
            Explora el marketplace y agrega lotes de productores verificados en
            10 países LATAM.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/marketplace">
              <Button size="lg">
                Ir al marketplace
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/paises">
              <Button size="lg" variant="outline">
                Ver países
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const countrySet = getCountrySet();
  const hasMixedCountries = countrySet.length > 1;
  const cartCountry = countrySet[0];
  const wrongCountry =
    authed && userCountry && countrySet.length === 1 && userCountry !== cartCountry;

  const subtotal = getSubtotal();
  const commission = getCommission();
  const shipping = getShipping();
  const total = getTotal();
  const totalUnits = getTotalUnits();
  const currencyCode = cartCountry ?? "CR";

  // Defensa adicional: si algún item supera stock, deshabilita checkout
  const hasOverstock = items.some((i) => i.quantity > i.maxStock);

  const checkoutDisabled =
    items.length === 0 ||
    hasMixedCountries ||
    wrongCountry ||
    !authed ||
    hasOverstock;

  return (
    <Container className="py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-2">
            Pedido B2B
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Tu carrito
          </h1>
          <p className="mt-1 text-muted">
            {items.length} lote{items.length !== 1 && "s"} en tu pedido.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-danger transition-colors"
        >
          <Trash2 size={14} /> Vaciar carrito
        </button>
      </div>

      {/* Alerta país mixto */}
      <AnimatePresence>
        {hasMixedCountries && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3"
            role="alert"
          >
            <AlertTriangle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-900">
                Solo puedes comprar productos de tu mismo país en un mismo pedido
              </p>
              <p className="text-sm text-amber-800 mt-1">
                Tu carrito tiene productos de{" "}
                {countrySet.map((c) => getCountry(c).name).join(", ")}. Crea pedidos
                separados o limpia el carrito.
              </p>
            </div>
            <button
              type="button"
              onClick={clear}
              className="text-sm font-medium text-amber-900 hover:text-amber-700 underline whitespace-nowrap"
            >
              Limpiar carrito
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerta país distinto al user */}
      <AnimatePresence>
        {wrongCountry && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 flex items-start gap-3"
            role="alert"
          >
            <AlertTriangle size={18} className="text-red-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-900">
                Estos productos no están disponibles para tu país
              </p>
              <p className="text-sm text-red-800 mt-1">
                Tu cuenta está registrada en{" "}
                {userCountry && getCountry(userCountry).name}, pero el carrito contiene
                productos de {cartCountry && getCountry(cartCountry).name}.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item) => {
              const c = getCountry(item.country);
              const lineTotal = item.pricePerUnit * item.quantity;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl border border-border-soft bg-surface p-4 flex gap-4 items-start"
                >
                  <div className="h-20 w-20 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-ink truncate">
                        {item.name}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
                        <span aria-hidden="true">{c.flag}</span>
                        {c.code}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate">
                      {item.productorName}
                    </p>
                    <p className="mt-1 text-sm text-ink">
                      {formatPriceByCode(item.pricePerUnit, item.country)} ·{" "}
                      por {item.unit}
                    </p>
                    <div className="mt-3 max-w-md">
                      <QuantityInput
                        value={item.quantity}
                        unit={item.unit}
                        maxStock={item.maxStock}
                        productName={item.name}
                        onChange={(qty) => updateQuantity(item.productId, qty)}
                        onExceedStock={(max, unit) =>
                          pushToast(
                            `Stock máximo: ${max.toLocaleString("es-CR")} ${unit}`,
                          )
                        }
                        onRequestRemove={() => removeItem(item.productId)}
                      />
                    </div>
                    {item.quantity > item.maxStock && (
                      <p className="mt-1.5 text-[11px] text-red-600 font-medium">
                        Cantidad excede el stock disponible.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label="Eliminar"
                      className="grid h-8 w-8 place-items-center text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="text-right min-w-[100px]">
                      <motion.p
                        key={lineTotal}
                        initial={{ opacity: 0.4, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="text-sm font-semibold text-ink tabular-nums"
                      >
                        {formatPriceByCode(lineTotal, item.country)}
                      </motion.p>
                      <p className="text-[11px] text-muted">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <aside className="rounded-2xl border border-border-soft bg-surface p-5 h-fit lg:sticky lg:top-20">
          <h2 className="font-semibold text-ink mb-4">Resumen</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-ink tabular-nums">
                {formatPriceByCode(subtotal, currencyCode)}
              </span>
            </li>
            <li className="text-[11px] text-muted -mt-1 inline-flex items-center gap-1">
              <PackageCheck size={11} className="text-brand" />
              {items.length} producto{items.length !== 1 && "s"} ·{" "}
              <span className="tabular-nums">
                {totalUnits.toLocaleString("es-CR", {
                  maximumFractionDigits: 1,
                })}
              </span>{" "}
              en total
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted">Comisión AgroPulse (4%)</span>
              <span className="text-ink tabular-nums">
                {formatPriceByCode(commission, currencyCode)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted">Envío estimado</span>
              <span className="text-muted tabular-nums">
                {shipping === 0
                  ? "Se calcula en checkout"
                  : formatPriceByCode(shipping, currencyCode)}
              </span>
            </li>
          </ul>
          <div className="border-t border-border-soft mt-4 pt-4 flex items-center justify-between">
            <span className="font-semibold text-ink">Total</span>
            <span className="text-lg font-semibold text-ink tabular-nums">
              {formatPriceByCode(total, currencyCode)}
            </span>
          </div>
          {!authed && (
            <Link href={`/login?from=/carrito`} className="block mt-5">
              <Button size="lg" className="w-full" variant="outline">
                <Lock size={16} /> Inicia sesión para continuar
              </Button>
            </Link>
          )}
          {authed && (
            <>
              <Link
                href={checkoutDisabled ? "#" : "/checkout"}
                aria-disabled={checkoutDisabled}
                onClick={(e) => {
                  if (checkoutDisabled) e.preventDefault();
                }}
                className="block mt-5"
              >
                <Button
                  type="button"
                  size="lg"
                  disabled={checkoutDisabled}
                  className="w-full"
                >
                  Continuar al checkout
                  <ArrowRight size={16} />
                </Button>
              </Link>
              {hasMixedCountries && (
                <p className="mt-2 text-xs text-amber-700 text-center">
                  Resuelve el conflicto de países para continuar.
                </p>
              )}
              {hasOverstock && (
                <p className="mt-2 text-xs text-red-700 text-center">
                  Algún producto excede el stock disponible.
                </p>
              )}
            </>
          )}
          <Link
            href="/marketplace"
            className="mt-4 inline-flex w-full justify-center items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark"
          >
            <ShoppingCart size={14} /> Seguir comprando
          </Link>
        </aside>
      </div>

      {/* Toast stack */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 24, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto rounded-xl bg-ink text-white px-4 py-3 text-sm shadow-xl flex items-center gap-2 max-w-xs"
              role="status"
            >
              <AlertTriangle size={14} className="text-amber-300 flex-shrink-0" />
              <span>{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Container>
  );
}
