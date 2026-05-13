"use client";

import { useState } from "react";

/** SVG placeholder en /public (servido como /placeholder-product.svg). */
export const PRODUCT_PLACEHOLDER = "/placeholder-product.svg";

/**
 * Valida que una URL sea apta para usarse como src de imagen.
 * Acepta:
 *   - http(s)://...
 *   - rutas absolutas que empiezan con "/"
 *   - data: URLs (data:image/...)
 * Rechaza:
 *   - vacías o sólo espacios
 *   - protocolos peligrosos (javascript:, vbscript:, file:)
 *   - URLs malformadas
 */
export function isValidImageUrl(src: string | undefined | null): boolean {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (trimmed.length === 0) return false;
  // data: URL de imagen
  if (trimmed.startsWith("data:image/")) return true;
  // ruta absoluta del sitio
  if (trimmed.startsWith("/")) return true;
  // URL http(s)
  try {
    const u = new URL(trimmed);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

interface ProductImageProps {
  /** URL de la imagen. Si es inválida o el load falla, se usa el placeholder. */
  src: string | undefined | null;
  /** Texto alternativo. Obligatorio para accesibilidad. */
  alt: string;
  /** Identificador único del producto (SKU/slug/id). Usado para sembrar variaciones. */
  productKey?: string;
  className?: string;
  /** Lazy por defecto. Pasa 'eager' solo para LCP/above-the-fold. */
  loading?: "lazy" | "eager";
  /** Hint del navegador para priorización. */
  fetchPriority?: "high" | "low" | "auto";
  /** Tamaño aproximado para el navegador (responsive). */
  sizes?: string;
  /** Atributos width/height en píxeles para evitar CLS. */
  width?: number;
  height?: number;
  /** Decode hint (async permite que la imagen no bloquee). */
  decoding?: "async" | "sync" | "auto";
  /** onError handler opcional adicional (después del fallback al placeholder). */
  onLoadError?: () => void;
}

/**
 * Imagen de producto con:
 *   - Validación de URL antes de intentar cargar
 *   - Fallback automático al placeholder en error de red/404
 *   - Lazy loading por defecto
 *   - decoding=async para no bloquear el render
 *
 * Nota: en sitios académicos / demo, evitamos `next/image` porque requiere
 * configurar remotePatterns para cada hostname y rompe en producción al
 * sumar nuevos dominios. <img> con loading="lazy" da rendimiento similar
 * para nuestro caso (imágenes externas de Unsplash + placeholders).
 */
export function ProductImage({
  src,
  alt,
  productKey: _productKey,
  className = "",
  loading = "lazy",
  fetchPriority,
  sizes,
  width,
  height,
  decoding = "async",
  onLoadError,
}: ProductImageProps) {
  void _productKey;
  const initialSrc = isValidImageUrl(src) ? (src as string) : PRODUCT_PLACEHOLDER;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);

  function handleError() {
    if (currentSrc !== PRODUCT_PLACEHOLDER) {
      setCurrentSrc(PRODUCT_PLACEHOLDER);
      onLoadError?.();
    }
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      sizes={sizes}
      width={width}
      height={height}
      onError={handleError}
    />
  );
}
