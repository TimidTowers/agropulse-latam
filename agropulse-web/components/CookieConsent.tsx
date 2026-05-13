"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Settings, X } from "lucide-react";
import { useConsentStore } from "@/lib/stores/consent-store";
import { Button } from "@/components/ui/Button";

export function CookieConsent() {
  const { decided, acceptAll, acceptEssential, setCategories } =
    useConsentStore();
  const [mounted, setMounted] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || decided) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl"
        role="dialog"
        aria-label="Aviso de cookies"
      >
        <div className="rounded-2xl border border-border-soft bg-surface shadow-xl p-5 sm:p-6">
          {!showConfig ? (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand shrink-0">
                <Cookie size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-ink">
                  Usamos cookies para mejorar tu experiencia
                </h2>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  AgroPulse utiliza cookies esenciales para el funcionamiento
                  del sitio, y opcionales para analítica y marketing. Puedes
                  configurarlas o aceptarlas según prefieras. Más detalle en
                  nuestra{" "}
                  <Link
                    href="/legal/cookies"
                    className="underline text-brand hover:text-brand-dark"
                  >
                    Política de cookies
                  </Link>
                  .
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={acceptAll}>
                    Aceptar todas
                  </Button>
                  <Button size="sm" variant="outline" onClick={acceptEssential}>
                    Solo esenciales
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowConfig(true)}
                  >
                    <Settings size={14} /> Configurar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink">
                  Configurar cookies
                </h2>
                <button
                  onClick={() => setShowConfig(false)}
                  aria-label="Volver"
                  className="p-1 rounded-md hover:bg-surface-2 text-muted"
                >
                  <X size={16} />
                </button>
              </div>
              <ul className="mt-4 space-y-3 text-xs">
                <li className="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-2">
                  <div>
                    <p className="font-medium text-ink">Esenciales</p>
                    <p className="text-muted">
                      Necesarias para sesión, carrito y seguridad. No se pueden
                      desactivar.
                    </p>
                  </div>
                  <span className="text-brand font-medium">Siempre activas</span>
                </li>
                <li className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border-soft">
                  <div>
                    <p className="font-medium text-ink">Analíticas</p>
                    <p className="text-muted">
                      Nos ayudan a entender qué páginas son más útiles.
                    </p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="h-4 w-4 accent-brand"
                    />
                  </label>
                </li>
                <li className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border-soft">
                  <div>
                    <p className="font-medium text-ink">Marketing</p>
                    <p className="text-muted">
                      Personalización de mensajes y campañas.
                    </p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="h-4 w-4 accent-brand"
                    />
                  </label>
                </li>
              </ul>
              <div className="mt-4 flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCategories({ analytics, marketing });
                  }}
                >
                  Guardar preferencias
                </Button>
                <Button size="sm" onClick={acceptAll}>
                  Aceptar todas
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
