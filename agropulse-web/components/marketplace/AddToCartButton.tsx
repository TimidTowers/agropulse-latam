"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState(false);

  function handle() {
    add({
      productId: product.id,
      nombre: product.nombre,
      productor: product.productor.nombre,
      precio: product.precio,
      unidad: product.unidad,
      cantidad: 10,
      imagen: product.imagen,
      country: product.country,
    });
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
            <ShoppingCart size={16} /> Agregar al carrito (simulado)
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
