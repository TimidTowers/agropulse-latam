"use client";

/**
 * LiveStock — stock efectivo en vivo para la página de detalle.
 *
 * Polling ligero cada 10s a /api/stock?ids=<productId>. Si otro comprador
 * reserva unidades (carrito, TTL 2h) o se confirma una compra, el número
 * baja en vivo; si una reserva expira, se reintegra.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveStockProps {
  productId: string;
  unit: string;
  /** stock base mostrado hasta la primera lectura en vivo */
  initialStock: number;
  locale?: string;
}

const POLL_MS = 10_000;

export function LiveStock({
  productId,
  unit,
  initialStock,
  locale = "es-MX",
}: LiveStockProps) {
  const [stock, setStock] = useState<number>(initialStock);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(
          `/api/stock?ids=${encodeURIComponent(productId)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = await res.json();
        const v = data?.stocks?.[productId];
        if (!cancelled && typeof v === "number") {
          setStock(v);
          setLive(true);
        }
      } catch {
        /* silencioso — se reintenta en el próximo tick */
      }
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [productId]);

  const agotado = stock <= 0;

  return (
    <p className="text-sm text-muted flex items-center gap-2 flex-wrap">
      {agotado ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-700">
          Agotado — reservado por otros compradores
        </span>
      ) : (
        <>
          <span>Stock disponible:</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.strong
              key={stock}
              initial={{ opacity: 0, y: -6, scale: 1.06 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className="text-ink"
            >
              {stock.toLocaleString(locale)} {unit}
            </motion.strong>
          </AnimatePresence>
        </>
      )}
      {live && (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          en vivo
        </span>
      )}
    </p>
  );
}
