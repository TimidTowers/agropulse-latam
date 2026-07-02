/**
 * lot-utils — conversión Lot (runtime, lotsDb) → Product (shape del catálogo).
 *
 * Server-safe y client-safe (sin dependencias de la store en memoria):
 * lo usan tanto el detalle SSR (app/marketplace/[id]/page.tsx) como el
 * marketplace client (components/marketplace/MarketplaceClient.tsx).
 */
import type { Lot } from "@/lib/db/types";
import type { Product, ProductoCategoria, Urgencia } from "@/lib/types";
import { resolveProductImage } from "@/lib/product-images";

/**
 * Validación ligera de URL de imagen (duplicada de ProductImage para no
 * importar un módulo "use client" en código server).
 */
function isUsableImageUrl(src: string | undefined | null): src is string {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.startsWith("data:image/")) return true;
  if (trimmed.startsWith("/")) return true;
  try {
    const u = new URL(trimmed);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Product + flag interno para marcar lotes recién publicados en el listado. */
export type ProductView = Product & { _isFresh?: boolean };

/** Un lote se considera "recién publicado" durante sus primeras 48 horas. */
export function isLotFresh(lot: Lot): boolean {
  return Date.now() - new Date(lot.createdAt).getTime() < 48 * 3600 * 1000;
}

/**
 * Convierte un lote dinámico al shape de Product para reutilizar
 * ProductCard, AddToCartButton y la página de detalle.
 *
 * - Imagen: usa la primera imagen válida del lote; si no hay, resuelve
 *   automáticamente por nombre + categoría (resolveProductImage).
 * - Condiciones IoT: valores por defecto razonables (los lotes runtime
 *   aún no tienen sensor con lecturas reales).
 */
export function lotToProductView(lot: Lot): ProductView {
  const daysToExpiry = Math.max(
    0,
    Math.floor(
      (new Date(lot.expirationDate).getTime() - Date.now()) / 86_400_000,
    ),
  );

  const validImages = lot.images.filter((i) => isUsableImageUrl(i));
  const imagen =
    validImages[0] ?? resolveProductImage(lot.productName, lot.category);
  const galeria =
    validImages.length > 0
      ? validImages
      : [imagen, resolveProductImage("", lot.category), imagen];

  return {
    id: lot.id,
    slug: lot.productSlug,
    nombre: lot.productName,
    categoria: lot.category as ProductoCategoria,
    country: lot.country,
    productor: {
      id: lot.productorId,
      nombre: lot.productorName,
      region: lot.region,
      estado: lot.region,
      certificaciones: lot.certifications,
      rating: 4.7,
      yearsActive: 5,
    },
    precio: lot.pricePerUnit,
    unidad: lot.unit,
    stock: lot.quantity,
    fechaCosecha: lot.harvestDate,
    vidaUtilDias: daysToExpiry,
    urgencia: lot.urgencia as Urgencia,
    imagen,
    galeria,
    certificaciones: lot.certifications,
    condicionesIoT: {
      temperaturaC: 14,
      humedadPct: 80,
      ultimaLectura: new Date().toISOString(),
      rangoOptimoTemp: [10, 18],
      rangoOptimoHumedad: [70, 90],
    },
    descripcion: lot.description,
    sensorId: lot.sensorId ?? "—",
    loteId: lot.id,
    _isFresh: isLotFresh(lot),
  };
}
