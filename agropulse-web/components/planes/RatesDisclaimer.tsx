"use client";

import { Info } from "lucide-react";
import { RATES_UPDATED_AT } from "@/lib/currency/rates";
import { usePlansCurrencyStore } from "@/lib/stores/plans-currency-store";
import { CURRENCIES } from "@/lib/currency/rates";

export function RatesDisclaimer() {
  const currency = usePlansCurrencyStore((s) => s.currency);
  const info = CURRENCIES[currency];
  const updated = new Date(RATES_UPDATED_AT);
  const fechaTxt = updated.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mt-10 rounded-2xl border border-border-soft bg-surface/60 px-5 py-4 flex items-start gap-3 text-xs text-muted">
      <Info size={14} className="text-brand mt-0.5 flex-shrink-0" />
      <p className="leading-relaxed">
        <span className="font-medium text-ink">Tipos de cambio:</span>{" "}
        Mostrando precios en {info.flag} {info.name} ({info.code}). Tasas
        referenciales actualizadas el {fechaTxt}. El cargo real puede variar
        según tu emisor y la fluctuación cambiaria del día. La facturación
        oficial se emite en USD.
      </p>
    </div>
  );
}
