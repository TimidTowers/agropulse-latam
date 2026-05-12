"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { COUNTRIES, type CountryCode } from "@/lib/countries";
import { useCountryStore } from "@/lib/stores/country-store";

interface CountrySwitcherProps {
  compact?: boolean;
}

export function CountrySwitcher({ compact = false }: CountrySwitcherProps) {
  const { country, setCountry, markSelected } = useCountryStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];
  const displayCountry = mounted ? current : COUNTRIES[0];

  function pick(code: CountryCode) {
    setCountry(code);
    markSelected();
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`País actual: ${displayCountry.name}. Cambiar país`}
        className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-surface px-2.5 py-1.5 text-sm hover:bg-surface-2 hover:border-brand/30 transition-colors"
      >
        <span className="text-base leading-none" aria-hidden="true">
          {displayCountry.flag}
        </span>
        {!compact && (
          <span className="font-medium text-ink">{displayCountry.code}</span>
        )}
        <ChevronDown
          size={14}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="listbox"
            className="absolute right-0 mt-2 w-[280px] sm:w-[340px] rounded-2xl border border-border-soft bg-surface shadow-xl p-3 z-50"
          >
            <p className="px-2 pb-2 text-[10px] font-semibold tracking-widest uppercase text-muted">
              Selecciona tu país
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {COUNTRIES.map((c) => {
                const active = c.code === country;
                return (
                  <button
                    key={c.code}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(c.code)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-left transition-colors ${
                      active
                        ? "bg-brand/10 text-brand-dark border border-brand/30"
                        : "hover:bg-surface-2 border border-transparent"
                    }`}
                  >
                    <span className="text-lg leading-none" aria-hidden="true">
                      {c.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink truncate">{c.name}</p>
                      <p className="text-[10px] text-muted truncate">
                        {c.currency}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
