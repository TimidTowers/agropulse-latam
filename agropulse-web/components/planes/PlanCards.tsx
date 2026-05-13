"use client";

import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PLANS_V2 } from "@/lib/mock-data/plans";
import {
  convertCurrency,
  formatCurrency,
} from "@/lib/currency/rates";
import { usePlansCurrencyStore } from "@/lib/stores/plans-currency-store";
import { HEADQUARTERS } from "@/lib/countries";
import { cn } from "@/lib/utils";

export function PlanCards() {
  const currency = usePlansCurrencyStore((s) => s.currency);
  const billing = usePlansCurrencyStore((s) => s.billing);

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {PLANS_V2.map((p) => {
        const isPro = p.destacado;
        return (
          <div
            key={p.id}
            className={cn(
              "relative rounded-2xl border p-8 flex flex-col",
              isPro
                ? "border-brand shadow-lg ring-1 ring-brand/20 bg-emerald-50/40"
                : "border-border-soft shadow-sm bg-surface",
            )}
          >
            {isPro && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand text-white text-xs font-semibold tracking-wide uppercase px-3 py-1 shadow-md">
                Más popular
              </span>
            )}

            <h2 className="text-xl font-semibold text-ink tracking-tight">
              {p.nombre}
            </h2>
            <p className="text-sm text-muted mt-1">{p.sensores}</p>

            <div className="mt-6 min-h-[90px]">
              {p.pricing === null ? (
                <p>
                  <span className="text-4xl font-semibold text-ink tracking-tight">
                    A cotizar
                  </span>
                  <span className="ml-2 text-sm text-muted">
                    según volumen
                  </span>
                </p>
              ) : (
                <PriceBlock
                  monthlyUsd={p.pricing.monthlyUsd}
                  annualUsd={p.pricing.annualUsd}
                  annualDiscountPct={p.pricing.annualDiscountPct}
                  currency={currency}
                  billing={billing}
                />
              )}
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {p.descripcion}
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 flex-1">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-ink/85"
                >
                  <Check
                    size={14}
                    className="mt-1 text-brand flex-shrink-0"
                  />
                  {f}
                </li>
              ))}
            </ul>

            {p.id === "enterprise" ? (
              <a
                href={HEADQUARTERS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8"
              >
                <Button className="w-full" variant="outline" size="lg">
                  <MessageCircle size={16} />
                  {p.cta}
                </Button>
              </a>
            ) : (
              <Link href="/contacto" className="mt-8">
                <Button
                  className="w-full"
                  variant={isPro ? "primary" : "outline"}
                  size="lg"
                >
                  {p.cta}
                </Button>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PriceBlock({
  monthlyUsd,
  annualUsd,
  annualDiscountPct,
  currency,
  billing,
}: {
  monthlyUsd: number;
  annualUsd: number;
  annualDiscountPct: number;
  currency: ReturnType<typeof usePlansCurrencyStore.getState>["currency"];
  billing: ReturnType<typeof usePlansCurrencyStore.getState>["billing"];
}) {
  if (billing === "anual") {
    const annualLocal = convertCurrency(annualUsd, "USD", currency);
    const monthlyEquivLocal = annualLocal / 12;
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`anual-${currency}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-4xl font-semibold text-ink tracking-tight tabular-nums">
              {formatCurrency(annualLocal, currency)}
            </span>
            <span className="text-sm text-muted">/año</span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ml-1">
              Ahorras {annualDiscountPct}%
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted tabular-nums">
            equivale a ~{formatCurrency(monthlyEquivLocal, currency)}/mes
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  const monthlyLocal = convertCurrency(monthlyUsd, "USD", currency);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`mensual-${currency}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
      >
        <p className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-ink tracking-tight tabular-nums">
            {formatCurrency(monthlyLocal, currency)}
          </span>
          <span className="text-sm text-muted">/mes</span>
        </p>
        <p className="mt-1.5 text-xs text-muted">
          Facturado mensualmente · sin permanencia
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
