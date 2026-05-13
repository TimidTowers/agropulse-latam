"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { COUNTRIES, type CountryCode } from "@/lib/countries";
import { useCountryStore } from "@/lib/stores/country-store";

export function CountrySelectorModal() {
  const { hasSelected, setCountry, markSelected } = useCountryStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hasSelected) {
      const t = setTimeout(() => setOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, [mounted, hasSelected]);

  function handlePick(code: CountryCode) {
    setCountry(code);
    markSelected();
    setOpen(false);
  }

  function skip() {
    markSelected();
    setOpen(false);
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] grid place-items-center p-4 bg-ink/40 backdrop-blur-sm"
          onClick={skip}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-4xl rounded-3xl bg-surface shadow-2xl border border-border-soft overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="country-modal-title"
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={skip}
              className="absolute top-4 right-4 z-10 h-9 w-9 grid place-items-center rounded-full hover:bg-surface-2 text-muted hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>

            <div className="relative px-8 pt-10 pb-6 bg-gradient-to-br from-brand/10 via-accent/5 to-transparent">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-brand mb-3">
                <MapPin size={13} />
                Hecho en Costa Rica · Operamos en LATAM
              </div>
              <h2
                id="country-modal-title"
                className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink"
              >
                Bienvenido a AgroPulse 🇨🇷
              </h2>
              <p className="mt-2 text-muted max-w-xl">
                Somos una empresa costarricense con sede en San José. Selecciona
                tu país para ver productores, precios y disponibilidad locales.
                Podrás cambiarlo después desde el menú superior.
              </p>
            </div>

            <div className="px-8 py-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {COUNTRIES.map((c, i) => {
                  const isOrigin = c.isOrigin === true;
                  return (
                    <motion.button
                      key={c.code}
                      type="button"
                      onClick={() => handlePick(c.code)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.03, duration: 0.25 }}
                      whileHover={{ y: -4, scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                        isOrigin
                          ? "border-brand bg-brand/5 hover:border-brand hover:shadow-lg hover:bg-brand/10 ring-2 ring-brand/20"
                          : "border-border-soft bg-surface hover:border-brand/40 hover:shadow-md hover:bg-brand/[0.03]"
                      }`}
                    >
                      {isOrigin && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                          🇨🇷 Mercado origen
                        </span>
                      )}
                      <span
                        className="text-4xl leading-none"
                        role="img"
                        aria-label={c.name}
                      >
                        {c.flag}
                      </span>
                      <span className="text-sm font-semibold text-ink">
                        {c.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted">
                        {c.productors.toLocaleString("es-CR")} productores
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="px-8 py-5 border-t border-border-soft bg-surface-2/40 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-muted">
                10 países · {COUNTRIES.reduce((a, c) => a + c.productors, 0).toLocaleString("es-CR")}{" "}
                productores conectados
              </p>
              <button
                onClick={skip}
                className="text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                Seleccionar después (Costa Rica por defecto)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
