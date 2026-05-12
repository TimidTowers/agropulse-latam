"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CountryCode } from "@/lib/countries";

export interface CartItem {
  id: string;
  productId: string;
  nombre: string;
  productor: string;
  precio: number;
  unidad: string;
  cantidad: number;
  imagen: string;
  country: CountryCode;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (productId: string) => void;
  setCantidad: (productId: string, cantidad: number) => void;
  clear: () => void;
  totalUnits: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, cantidad: i.cantidad + item.cantidad }
                : i,
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              { ...item, id: `${item.productId}-${Date.now()}` },
            ],
          });
        }
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setCantidad: (productId, cantidad) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, cantidad: Math.max(1, cantidad) }
              : i,
          ),
        }),
      clear: () => set({ items: [] }),
      totalUnits: () => get().items.reduce((a, i) => a + i.cantidad, 0),
    }),
    { name: "agropulse:cart" },
  ),
);
