"use client";

import { motion } from "framer-motion";
import {
  usePlansCurrencyStore,
  type BillingPeriod,
} from "@/lib/stores/plans-currency-store";

const OPTIONS: { value: BillingPeriod; label: string }[] = [
  { value: "mensual", label: "Mensual" },
  { value: "anual", label: "Anual" },
];

export function BillingToggle() {
  const billing = usePlansCurrencyStore((s) => s.billing);
  const setBilling = usePlansCurrencyStore((s) => s.setBilling);

  return (
    <div className="inline-flex items-center gap-3">
      <div
        role="tablist"
        aria-label="Periodicidad de facturación"
        className="relative inline-flex rounded-xl border border-border-soft bg-surface p-1 shadow-sm"
      >
        {OPTIONS.map((opt) => {
          const active = billing === opt.value;
          return (
            <button
              key={opt.value}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setBilling(opt.value)}
              className="relative z-10 inline-flex items-center justify-center rounded-lg px-4 h-9 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 min-w-[80px]"
            >
              {active && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-lg bg-brand shadow-sm"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative z-10 ${
                  active ? "text-white" : "text-ink"
                }`}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
      <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold">
        Ahorra hasta 17%
      </span>
    </div>
  );
}
