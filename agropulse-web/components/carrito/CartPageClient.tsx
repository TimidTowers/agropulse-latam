"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPriceByCode, getCountry } from "@/lib/countries";

export function CartPageClient() {
  const { items, remove, setCantidad, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{
    folio: string;
    total: number;
  } | null>(null);

  useEffect(() => setMounted(true), []);

  // Group totals per currency since items can be in mixed countries
  const totalsByCountry = items.reduce<
    Record<string, { country: ReturnType<typeof getCountry>; total: number }>
  >((acc, item) => {
    const c = getCountry(item.country);
    const k = c.code;
    if (!acc[k]) acc[k] = { country: c, total: 0 };
    acc[k].total += item.precio * item.cantidad;
    return acc;
  }, {});

  async function confirmOrder() {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      // Use the first item as representative for the API mock
      const head = items[0];
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productoId: head.productId,
          cantidad: items.reduce((a, i) => a + i.cantidad, 0),
          comprador: "Cliente B2B",
        }),
      });
      const data = await res.json();
      const totalAll = items.reduce((a, i) => a + i.precio * i.cantidad, 0);
      setConfirmed({ folio: data?.order?.id ?? "OR-SIM", total: totalAll });
      clear();
    } catch {
      setConfirmed({
        folio: "OR-SIM-" + Math.floor(Math.random() * 9999),
        total: items.reduce((a, i) => a + i.precio * i.cantidad, 0),
      });
      clear();
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <Container className="py-20">
        <div className="text-sm text-muted">Cargando carrito…</div>
      </Container>
    );
  }

  if (confirmed) {
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
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-white"
          >
            <Check size={42} />
          </motion.div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
            Pedido confirmado
          </h2>
          <p className="mt-2 text-muted">
            Folio{" "}
            <span className="font-mono text-ink">{confirmed.folio}</span>. El
            productor recibirá tu solicitud y confirmará disponibilidad en
            menos de 24 horas.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/marketplace">
              <Button size="lg">Seguir comprando</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Ver dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
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

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item) => {
              const c = getCountry(item.country);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl border border-border-soft bg-surface p-4 flex gap-4 items-center"
                >
                  <div className="h-20 w-20 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-ink truncate">
                        {item.nombre}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
                        <span aria-hidden="true">{c.flag}</span>
                        {c.code}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate">
                      {item.productor}
                    </p>
                    <p className="mt-1 text-sm text-ink">
                      {formatPriceByCode(item.precio, item.country)} ·{" "}
                      {item.unidad}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center rounded-lg border border-border-soft">
                      <button
                        type="button"
                        onClick={() =>
                          setCantidad(item.productId, item.cantidad - 1)
                        }
                        aria-label="Restar"
                        className="grid h-8 w-8 place-items-center hover:bg-surface-2 rounded-l-lg"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-sm font-medium tabular-nums min-w-[44px] text-center">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCantidad(item.productId, item.cantidad + 1)
                        }
                        aria-label="Sumar"
                        className="grid h-8 w-8 place-items-center hover:bg-surface-2 rounded-r-lg"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      aria-label="Eliminar"
                      className="grid h-8 w-8 place-items-center text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="hidden md:block text-right min-w-[110px]">
                    <p className="text-sm font-semibold text-ink tabular-nums">
                      {formatPriceByCode(
                        item.precio * item.cantidad,
                        item.country,
                      )}
                    </p>
                    <p className="text-xs text-muted">
                      {item.cantidad} {item.unidad}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <aside className="rounded-2xl border border-border-soft bg-surface p-5 h-fit lg:sticky lg:top-20">
          <h2 className="font-semibold text-ink mb-4">Resumen</h2>
          <ul className="space-y-3 border-b border-border-soft pb-4">
            {Object.values(totalsByCountry).map(({ country, total }) => (
              <li
                key={country.code}
                className="flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-2 text-sm text-muted">
                  <span aria-hidden="true">{country.flag}</span>
                  Subtotal {country.name}
                </span>
                <span className="text-sm font-semibold text-ink tabular-nums">
                  {formatPriceByCode(total, country.code)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted">Comisión 4%</span>
            <span className="text-muted">incluida</span>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={confirmOrder}
            disabled={submitting}
            className="w-full mt-6"
          >
            {submitting ? "Procesando..." : "Confirmar pedido"}
            {!submitting && <ArrowRight size={16} />}
          </Button>
          <p className="mt-3 text-xs text-muted leading-relaxed">
            Pedido simulado — no se realizará ningún cargo. El productor
            confirmará disponibilidad por email.
          </p>
          <Link
            href="/marketplace"
            className="mt-4 inline-flex w-full justify-center items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark"
          >
            <ShoppingCart size={14} /> Seguir comprando
          </Link>
        </aside>
      </div>
    </Container>
  );
}
