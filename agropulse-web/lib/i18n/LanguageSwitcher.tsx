"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { LOCALES, type Locale } from "./dictionaries";
import { useLocale, useT } from "./store";

interface LanguageSwitcherProps {
  compact?: boolean;
}

/**
 * Selector de idioma ES/EN/PT. Mismo patrón visual y de accesibilidad que
 * CountrySwitcher (dropdown framer-motion, cierre por clic externo,
 * mounted-safe: muestra ES hasta hidratar — useLocale ya lo garantiza).
 */
export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

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

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  function pick(code: Locale) {
    setLocale(code);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t("navbar", "idioma")}: ${current.name}. ${t("navbar", "cambiarIdioma")}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft bg-surface px-2.5 py-1.5 text-sm hover:bg-surface-2 hover:border-brand/30 transition-colors"
      >
        <span className="text-base leading-none" aria-hidden="true">
          {current.flag}
        </span>
        {!compact && (
          <span className="font-medium text-ink text-xs">{current.label}</span>
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
            aria-label={t("navbar", "seleccionaIdioma")}
            className="absolute right-0 mt-2 w-44 rounded-2xl border border-border-soft bg-surface shadow-xl p-2 z-50"
          >
            <p className="px-2 pb-1.5 pt-0.5 text-[10px] font-semibold tracking-widest uppercase text-muted">
              {t("navbar", "seleccionaIdioma")}
            </p>
            <div className="flex flex-col gap-1">
              {LOCALES.map((l) => {
                const active = l.code === locale;
                return (
                  <button
                    key={l.code}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(l.code)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-left transition-colors ${
                      active
                        ? "bg-brand/10 text-brand-dark border border-brand/30"
                        : "hover:bg-surface-2 border border-transparent"
                    }`}
                  >
                    <span className="text-lg leading-none" aria-hidden="true">
                      {l.flag}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium text-ink truncate">
                        {l.name}
                      </span>
                      <span className="block text-[10px] text-muted">
                        {l.label}
                      </span>
                    </span>
                    {active && (
                      <Check size={14} className="text-brand shrink-0" />
                    )}
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
