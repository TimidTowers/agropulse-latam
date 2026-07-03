"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

/**
 * Error boundary de segmento — captura errores de render/servidor en
 * cualquier ruta y ofrece reintentar sin recargar toda la app.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log para diagnóstico (en producción iría a un servicio de monitoreo)
    console.error("[AgroPulse] Error capturado por boundary:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] grid place-items-center bg-background px-6 py-24">
      <div className="w-full max-w-md rounded-3xl border border-border-soft bg-surface p-10 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
          <AlertTriangle size={28} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">
          Algo salió mal
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Ocurrió un error inesperado al cargar esta sección. Puedes
          reintentar o volver al inicio; tu carrito y sesión siguen a salvo.
        </p>
        {error.digest && (
          <p className="mt-2 text-[11px] text-muted font-mono">
            Código de referencia: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors"
          >
            <Home size={15} aria-hidden="true" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
