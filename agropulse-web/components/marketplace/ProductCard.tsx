"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { MapPin, Clock, Package, Lock, AlertTriangle, ShoppingCart, Check, Sprout, PackageX } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { formatPriceByCode, getCountry } from "@/lib/countries";
import { useCartStore } from "@/lib/stores/cart-store";
import { ProductImage } from "@/components/marketplace/ProductImage";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  /** marca lotes recién publicados desde la store dinámica */
  freshBadge?: boolean;
  /**
   * Stock efectivo en vivo (SSE). Si llega, reemplaza a product.stock:
   * baja cuando otros compradores reservan y sube cuando expiran reservas.
   */
  liveStock?: number;
}

function urgenciaToBadge(u: Product["urgencia"]) {
  switch (u) {
    case "alta":
      return { variant: "danger" as const, label: "Vida útil corta" };
    case "media":
      return { variant: "warning" as const, label: "Vender pronto" };
    case "baja":
    default:
      return { variant: "success" as const, label: "Stock fresco" };
  }
}

export function ProductCard({ product, freshBadge, liveStock }: ProductCardProps) {
  const badge = urgenciaToBadge(product.urgencia);
  const country = getCountry(product.country);
  const { data: session, status } = useSession();
  const authed = status === "authenticated" && !!session?.user;
  const userCountry = session?.user?.country;
  const sameCountry = !userCountry || userCountry === product.country;

  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  // Stock mostrado: el valor en vivo (SSE) si existe, si no el estático.
  const displayStock = liveStock ?? product.stock;
  const agotado = liveStock !== undefined && liveStock <= 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!authed || !sameCountry || agotado) return;
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
        currency: country.currency,
        maxStock: liveStock ?? product.stock,
        category: product.categoria,
      },
      1,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const blockedReason = agotado
    ? "Agotado — reservado por otros compradores"
    : !authed
      ? "Inicia sesión para comprar"
      : !sameCountry
        ? `Solo disponible para clientes en ${country.name}`
        : null;

  return (
    <div className="group rounded-2xl overflow-hidden border border-border-soft bg-surface shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-brand/30 transition-all flex flex-col">
      <Link
        href={`/marketplace/${product.id}`}
        className="relative aspect-[4/3] overflow-hidden bg-surface-2 block"
      >
        <ProductImage
          src={product.imagen}
          alt={`${product.nombre} — ${product.productor.nombre}`}
          productKey={product.id}
          className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {agotado ? (
            <Badge variant="danger">
              <PackageX size={11} /> Agotado
            </Badge>
          ) : (
            <Badge variant={badge.variant}>{badge.label}</Badge>
          )}
          {freshBadge && (
            <Badge variant="brand" className="bg-brand text-white">
              <Sprout size={11} /> Recién publicado
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <Badge variant="default" className="bg-white/90 backdrop-blur">
            {product.categoria}
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur border border-border-soft px-2 py-0.5 text-[10px] font-medium text-ink">
            <span aria-hidden="true">{country.flag}</span>
            {country.code}
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="font-semibold text-ink tracking-tight">
            {product.nombre}
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            {product.productor.nombre}
          </p>
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} className="text-brand" />
            {product.productor.estado}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} className="text-brand" />
            {product.vidaUtilDias} días vida útil
          </span>
          <span className="inline-flex items-center gap-1">
            <Package size={12} className="text-brand" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={displayStock}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25 }}
                className={agotado ? "text-red-600 font-medium" : undefined}
              >
                {displayStock.toLocaleString(country.locale)} {product.unidad}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            ★ {product.productor.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between pt-4 border-t border-border-soft">
          <div>
            <p className="text-xl font-semibold text-ink tracking-tight">
              {formatPriceByCode(product.precio, product.country)}
            </p>
            <p className="text-xs text-muted">por {product.unidad}</p>
          </div>
          <Link
            href={`/marketplace/${product.id}`}
            className="text-sm font-medium text-brand group-hover:underline"
          >
            Ver lote →
          </Link>
        </div>

        {/* CTA Add-to-cart con gate */}
        <div className="mt-3">
          {blockedReason ? (
            <div
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-soft bg-surface-2 px-3 py-2 text-xs text-muted cursor-not-allowed"
              title={blockedReason}
            >
              {agotado ? (
                <PackageX size={12} />
              ) : !authed ? (
                <Lock size={12} />
              ) : (
                <AlertTriangle size={12} />
              )}
              <span className="truncate">{blockedReason}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand text-white px-3 py-2 text-xs font-medium hover:bg-brand-dark transition-colors"
            >
              {added ? (
                <>
                  <Check size={12} /> Agregado
                </>
              ) : (
                <>
                  <ShoppingCart size={12} /> Agregar al carrito
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
