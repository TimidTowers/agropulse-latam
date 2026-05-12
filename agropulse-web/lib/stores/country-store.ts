"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_COUNTRY, type CountryCode } from "@/lib/countries";

interface CountryState {
  country: CountryCode;
  hasSelected: boolean;
  setCountry: (code: CountryCode) => void;
  markSelected: () => void;
  reset: () => void;
}

export const useCountryStore = create<CountryState>()(
  persist(
    (set) => ({
      country: DEFAULT_COUNTRY,
      hasSelected: false,
      setCountry: (code) => set({ country: code }),
      markSelected: () => set({ hasSelected: true }),
      reset: () => set({ country: DEFAULT_COUNTRY, hasSelected: false }),
    }),
    {
      name: "agropulse:country",
    },
  ),
);
