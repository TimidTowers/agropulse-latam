"use client";

/**
 * Store local (sin persist) para la página de planes.
 * Comparte el estado entre `<CurrencyToggle/>`, `<BillingToggle/>` y los
 * cards de plan. Solo dura mientras el usuario está en la página.
 */
import { create } from "zustand";
import type { CurrencyCode } from "@/lib/currency/rates";

export type BillingPeriod = "mensual" | "anual";

interface PlansCurrencyState {
  currency: CurrencyCode;
  billing: BillingPeriod;
  setCurrency: (c: CurrencyCode) => void;
  setBilling: (b: BillingPeriod) => void;
}

export const usePlansCurrencyStore = create<PlansCurrencyState>((set) => ({
  currency: "USD",
  billing: "mensual",
  setCurrency: (c) => set({ currency: c }),
  setBilling: (b) => set({ billing: b }),
}));
