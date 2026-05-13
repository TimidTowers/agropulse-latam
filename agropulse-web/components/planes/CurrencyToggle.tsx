"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency/rates";
import { usePlansCurrencyStore } from "@/lib/stores/plans-currency-store";

interface CurrencyToggleProps {
  defaultCurrency?: CurrencyCode;
}

export function CurrencyToggle({ defaultCurrency }: CurrencyToggleProps) {
  const currency = usePlansCurrencyStore((s) => s.currency);
  const setCurrency = usePlansCurrencyStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Set default once (después del mount, para no romper SSR)
  useEffect(() => {
    if (!initialized && defaultCurrency && defaultCurrency !== currency) {
      setCurrency(defaultCurrency);
    }
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCurrency]);

  // Cerrar al click fuera
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const info = CURRENCIES[currency];
  const items = Object.values(CURRENCIES);

  return (
    <div ref={wrapperRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Moneda actual: ${info.name}. Cambiar moneda.`}
        className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-4 h-11 text-sm font-medium text-ink hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        <span aria-hidden="true" className="text-base leading-none">
          {info.flag}
        </span>
        <span className="font-semibold">{info.code}</span>
        <span className="text-muted text-xs hidden sm:inline">
          · {info.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Selector de moneda"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute z-30 mt-2 w-64 rounded-2xl border border-border-soft bg-surface shadow-xl p-1.5 max-h-80 overflow-y-auto"
          >
            {items.map((c) => {
              const active = c.code === currency;
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setCurrency(c.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-brand/10 text-brand-dark"
                        : "text-ink hover:bg-surface-2"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span aria-hidden="true" className="text-base">
                        {c.flag}
                      </span>
                      <span className="font-medium">{c.code}</span>
                      <span className="text-muted text-xs truncate">
                        {c.name}
                      </span>
                    </span>
                    {active && (
                      <Check size={14} className="text-brand flex-shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
