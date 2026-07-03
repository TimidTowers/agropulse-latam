"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import "./globals.css";

/**
 * Error boundary GLOBAL — reemplaza al root layout completo cuando falla,
 * por eso debe declarar sus propios <html> y <body> (requisito de Next.js).
 * Importa globals.css directamente porque el layout raíz ya no se renderiza.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AgroPulse] Error global capturado:", error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main className="min-h-screen grid place-items-center px-6 py-24">
          <div className="w-full max-w-md rounded-3xl border border-border-soft bg-surface p-10 text-center shadow-sm">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
              <AlertTriangle size={28} aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">
              Algo salió mal
            </h1>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Ocurrió un error inesperado en AgroPulse. Nuestro equipo fue
              notificado. Intenta de nuevo o vuelve más tarde.
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
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
              >
                <RotateCcw size={15} aria-hidden="true" />
                Reintentar
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors"
              >
                Ir al inicio
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
