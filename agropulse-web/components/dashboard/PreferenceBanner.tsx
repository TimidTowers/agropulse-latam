"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CountryCode } from "@/lib/countries";
import { COUNTRY_TO_CURRENCY, CURRENCIES } from "@/lib/currency/rates";

interface BannerState {
  dismissed: boolean;
  dismiss(): void;
}

// Zustand con persist en localStorage. Una sola key compartida.
const useBannerStore = create<BannerState>()(
  persist(
    (set) => ({
      dismissed: false,
      dismiss: () => set({ dismissed: true }),
    }),
    { name: "agropulse:pref-banner-dismissed" },
  ),
);

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

interface Props {
  userCountry: CountryCode;
  /** ya tiene `preferredCurrency` configurada */
  hasPreference: boolean;
}

export function PreferenceBanner({ userCountry, hasPreference }: Props) {
  const mounted = useMounted();
  const dismissed = useBannerStore((s) => s.dismissed);
  const dismiss = useBannerStore((s) => s.dismiss);

  // Si el usuario ya configuró su moneda, no mostramos el banner
  // (y persistimos dismiss para que no aparezca en el futuro).
  useEffect(() => {
    if (hasPreference && !dismissed) dismiss();
  }, [hasPreference, dismissed, dismiss]);

  const visible = mounted && !dismissed && !hasPreference;

  const officialCurrency = COUNTRY_TO_CURRENCY[userCountry];
  const usd = CURRENCIES.USD;
  const official = CURRENCIES[officialCurrency];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -20, opacity: 0, height: 0 }}
          animate={{ y: 0, opacity: 1, height: "auto" }}
          exit={{ y: -20, opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-5 overflow-hidden"
        >
          <div className="rounded-2xl border border-brand/20 bg-gradient-to-r from-brand/5 via-emerald-50 to-sky-50 p-4 flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white flex-shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">
                ¿Sabías que puedes ver tus números en {usd.flag} {usd.code}?
              </p>
              <p className="text-xs text-muted mt-0.5">
                Ahora muestras todo en {official.flag} {official.name}. Cámbialo
                en cualquier momento desde tu perfil → preferencias de moneda.
              </p>
              <Link
                href="/perfil#currency"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
              >
                Ir a preferencias →
              </Link>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Descartar aviso"
              className="text-muted hover:text-ink p-1 rounded-md hover:bg-surface-2"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
