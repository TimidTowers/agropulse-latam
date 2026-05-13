"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ConsentCategories {
  essential: true; // siempre true
  analytics: boolean;
  marketing: boolean;
}

interface ConsentState {
  decided: boolean;
  categories: ConsentCategories;
  acceptAll: () => void;
  acceptEssential: () => void;
  setCategories: (c: Partial<ConsentCategories>) => void;
  reset: () => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      decided: false,
      categories: { essential: true, analytics: false, marketing: false },
      acceptAll: () =>
        set({
          decided: true,
          categories: { essential: true, analytics: true, marketing: true },
        }),
      acceptEssential: () =>
        set({
          decided: true,
          categories: { essential: true, analytics: false, marketing: false },
        }),
      setCategories: (c) =>
        set((s) => ({
          decided: true,
          categories: { ...s.categories, ...c, essential: true },
        })),
      reset: () =>
        set({
          decided: false,
          categories: { essential: true, analytics: false, marketing: false },
        }),
    }),
    { name: "agropulse:consent" },
  ),
);
