"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CountryCode } from "@/lib/countries";

/**
 * AgroPulse cart store — versión mejorada con peso/cantidad granular,
 * comisión 4%, envío estimado y verificación país.
 */

export interface CartItem {
  /** ID estable del item en el carrito (usa productId como base) */
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  productorId: string;
  productorName: string;
  country: CountryCode;
  unit: string;
  pricePerUnit: number;
  currency: string;
  quantity: number;
  maxStock: number;
}

export interface CartProductInput {
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  productorId: string;
  productorName: string;
  country: CountryCode;
  unit: string;
  pricePerUnit: number;
  currency: string;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: CartProductInput, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  getSubtotal: () => number;
  getCommission: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getCountrySet: () => CountryCode[];
  getTotalUnits: () => number;
  canAdd: (userCountry: CountryCode, productCountry: CountryCode) => boolean;
  // legacy compat para componentes existentes
  add: (item: {
    productId: string;
    nombre: string;
    productor: string;
    precio: number;
    unidad: string;
    cantidad: number;
    imagen: string;
    country: CountryCode;
    productSlug?: string;
    productorId?: string;
    maxStock?: number;
    currency?: string;
  }) => void;
  remove: (productId: string) => void;
  setCantidad: (productId: string, cantidad: number) => void;
  totalUnits: () => number;
}

const COMMISSION_PCT = 0.04;
const SHIPPING_FLAT = 0; // calculado en checkout según método

function safeQty(q: number, max: number): number {
  if (Number.isNaN(q) || q <= 0) return 0;
  return Math.min(q, max);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) => {
        const qty = Math.max(0, quantity);
        if (qty <= 0) return;
        const existing = get().items.find((i) => i.productId === product.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === product.productId
                ? {
                    ...i,
                    quantity: safeQty(i.quantity + qty, product.maxStock),
                  }
                : i,
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                id: product.productId,
                ...product,
                quantity: safeQty(qty, product.maxStock),
              },
            ],
          });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQuantity: (productId, qty) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: safeQty(qty, i.maxStock) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        }),

      clear: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.pricePerUnit * i.quantity, 0),

      getCommission: () => Math.round(get().getSubtotal() * COMMISSION_PCT),

      getShipping: () => SHIPPING_FLAT,

      getTotal: () =>
        get().getSubtotal() + get().getCommission() + get().getShipping(),

      getCountrySet: () => {
        const set = new Set<CountryCode>();
        for (const i of get().items) set.add(i.country);
        return Array.from(set);
      },

      getTotalUnits: () => get().items.reduce((a, i) => a + i.quantity, 0),

      canAdd: (userCountry, productCountry) => userCountry === productCountry,

      // ============================================================
      // Legacy API mantenida para no romper otros componentes
      // ============================================================
      add: (item) => {
        const input: CartProductInput = {
          productId: item.productId,
          productSlug: item.productSlug ?? item.productId,
          name: item.nombre,
          image: item.imagen,
          productorId: item.productorId ?? item.productId,
          productorName: item.productor,
          country: item.country,
          unit: item.unidad,
          pricePerUnit: item.precio,
          currency: item.currency ?? "USD",
          maxStock: item.maxStock ?? 9999,
        };
        get().addItem(input, item.cantidad);
      },
      remove: (productId) => get().removeItem(productId),
      setCantidad: (productId, cantidad) => get().updateQuantity(productId, cantidad),
      totalUnits: () => get().getTotalUnits(),
    }),
    { name: "agropulse:cart" },
  ),
);
