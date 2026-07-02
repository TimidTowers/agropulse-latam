"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CountryCode } from "@/lib/countries";
import {
  syncReservation,
  releaseAllReservations,
} from "@/lib/commerce/reservations-client";

/**
 * AgroPulse cart store — peso/cantidad granular, comisión 4%, verificación
 * país, categoría (para cupones) y sincronización de reservas de stock:
 * cada cambio de cantidad reserva/libera stock en el servidor (TTL 2h).
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
  /** categoría del producto — usada por cupones por categoría */
  category?: string;
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
  category?: string;
}

interface CartState {
  items: CartItem[];
  /** código de cupón aplicado (solo persistencia UI; el server re-valida) */
  couponCode: string | null;
  addItem: (product: CartProductInput, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
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
    categoria?: string;
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
      couponCode: null,

      addItem: (product, quantity) => {
        const qty = Math.max(0, quantity);
        if (qty <= 0) return;
        const existing = get().items.find((i) => i.productId === product.productId);
        let newQty: number;
        if (existing) {
          newQty = safeQty(existing.quantity + qty, product.maxStock);
          set({
            items: get().items.map((i) =>
              i.productId === product.productId ? { ...i, quantity: newQty } : i,
            ),
          });
        } else {
          newQty = safeQty(qty, product.maxStock);
          set({
            items: [
              ...get().items,
              {
                id: product.productId,
                ...product,
                quantity: newQty,
              },
            ],
          });
        }
        // Reserva de stock en vivo (fire-and-forget, requiere sesión)
        syncReservation(product.productId, newQty, product.unit);
      },

      removeItem: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        set({ items: get().items.filter((i) => i.productId !== productId) });
        if (item) syncReservation(productId, 0, item.unit);
      },

      updateQuantity: (productId, qty) => {
        const item = get().items.find((i) => i.productId === productId);
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: safeQty(qty, i.maxStock) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        });
        if (item) {
          syncReservation(productId, safeQty(qty, item.maxStock), item.unit);
        }
      },

      clear: () => {
        set({ items: [], couponCode: null });
        releaseAllReservations();
      },

      setCoupon: (code) =>
        set({ couponCode: code ? code.trim().toUpperCase() : null }),

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
          category: item.categoria,
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
