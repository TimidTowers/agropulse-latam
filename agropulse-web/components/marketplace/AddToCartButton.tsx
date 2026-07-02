"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/stores/cart-store";
import { getCountry } from "@/lib/countries";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

export function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
  const { data: session, status } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const canAdd = useCartStore((s) => s.canAdd);
  const [added, setAdded] = useState(false);
  const pathname = usePathname();

  const authed = status === "authenticated" && !!session?.user;
  const userCountry = session?.user?.country;
  const productCountryName = getCountry(product.country).name;

  // Caso 1: no logueado → CTA hacia login
  if (!authed) {
    const from = pathname ?? `/marketplace/${product.id}`;
    return (
      <Link
        href={`/login?from=${encodeURIComponent(from)}`}
        className="flex-1 min-w-[220px]"
      >
        <Button type="button" size="xl" variant="outline" className="w-full">
          <Lock size={16} /> Inicia sesión para comprar
        </Button>
      </Link>
    );
  }

  // Caso 2: país no coincide → deshabilitado
  if (userCountry && !canAdd(userCountry, product.country)) {
    return (
      <div className="flex-1 min-w-[220px]">
        <Button
          type="button"
          size="xl"
          variant="outline"
          disabled
          className="w-full cursor-not-allowed"
          title={`Solo disponible para clientes en ${productCountryName}`}
        >
          <AlertTriangle size={16} />
          Solo disponible en {productCountryName}
        </Button>
        <p className="mt-2 text-xs text-muted leading-relaxed">
          Por logística y cadena de frío, los pedidos se restringen al país del cliente.
        </p>
      </div>
    );
  }

  // Caso 3: country match → permitir agregar
  function handle() {
    addItem(
      {
        productId: product.id,
        productSlug: product.slug,
        name: product.nombre,
        image: product.imagen,
        productorId: product.productor.id,
        productorName: product.productor.nombre,
        country: product.country,
        unit: product.unidad,
        pricePerUnit: product.precio,
        currency: getCountry(product.country).currency,
        maxStock: product.stock,
        category: product.categoria,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button
      type="button"
      size="xl"
      onClick={handle}
      className="flex-1 min-w-[220px] relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="inline-flex items-center gap-2"
          >
            <Check size={16} /> Agregado al carrito
          </motion.span>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="inline-flex items-center gap-2"
          >
            <ShoppingCart size={16} /> Agregar al carrito
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
