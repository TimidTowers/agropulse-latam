"use client";

/**
 * Store de idioma (client-side) con persistencia en localStorage.
 *
 * HYDRATION-SAFE: el HTML del servidor siempre se renderiza en ES (default).
 * `useHydrated` usa useSyncExternalStore con snapshot de servidor `false`,
 * así el primer render del cliente coincide con el SSR (ES) y el idioma
 * persistido se aplica en un re-render inmediato post-hidratación, sin
 * warnings de mismatch.
 */

import { useCallback, useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_LOCALE,
  translate,
  type Dictionary,
  type Locale,
  type Section,
} from "./dictionaries";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "agropulse:locale",
    },
  ),
);

const emptySubscribe = () => () => {};

/** true solo después de hidratar en el cliente; false durante SSR/hidratación. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/** Hook principal: locale actual (ES hasta hidratar) + setter. */
export function useLocale(): {
  locale: Locale;
  setLocale: (locale: Locale) => void;
} {
  const stored = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const hydrated = useHydrated();
  return { locale: hydrated ? stored : DEFAULT_LOCALE, setLocale };
}

/**
 * Hook de traducción: `const t = useT(); t("navbar", "inicio")`.
 * Fallback automático a ES si falta la clave en el locale activo.
 */
export function useT() {
  const { locale } = useLocale();
  return useCallback(
    <S extends Section>(
      seccion: S,
      clave: keyof Dictionary[S] & string,
    ): string => translate(locale, seccion, clave),
    [locale],
  );
}
