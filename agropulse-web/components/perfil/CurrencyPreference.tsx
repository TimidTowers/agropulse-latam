"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import {
  CURRENCIES,
  COUNTRY_TO_CURRENCY,
  type CurrencyCode,
} from "@/lib/currency/rates";
import type { CountryCode } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface Props {
  userCountry: CountryCode;
  initialCurrency?: CurrencyCode;
}

const CURRENCY_LIST: CurrencyCode[] = [
  "USD",
  "MXN",
  "CRC",
  "COP",
  "ARS",
  "CLP",
  "PEN",
  "UYU",
  "GTQ",
  "BRL",
];

export function CurrencyPreference({ userCountry, initialCurrency }: Props) {
  const router = useRouter();
  const recommended = COUNTRY_TO_CURRENCY[userCountry];
  const [selected, setSelected] = useState<CurrencyCode>(
    initialCurrency ?? recommended,
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  async function save(code: CurrencyCode) {
    setSelected(code);
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredCurrency: code }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setMsg({
          kind: "err",
          text: j.error ?? "No se pudo guardar la preferencia",
        });
        return;
      }
      setMsg({
        kind: "ok",
        text: `Moneda actualizada a ${CURRENCIES[code].name}`,
      });
      router.refresh();
    } catch (e) {
      setMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Error de red",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      id="currency"
      className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm scroll-mt-24"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-ink">
            Preferencias de visualización
          </h2>
          <p className="mt-1 text-xs text-muted max-w-md">
            Elige la moneda en que quieres ver tus precios, ventas y KPIs en el
            dashboard. La conversión se hace automáticamente con tasas
            actualizadas.
          </p>
        </div>
        {saving && (
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Loader2 size={12} className="animate-spin" /> Guardando…
          </span>
        )}
      </div>

      <ul className="mt-5 grid sm:grid-cols-2 gap-2">
        {CURRENCY_LIST.map((code) => {
          const info = CURRENCIES[code];
          const isSelected = selected === code;
          const isRecommended = recommended === code;
          return (
            <li key={code}>
              <button
                type="button"
                disabled={saving}
                onClick={() => save(code)}
                className={cn(
                  "w-full text-left flex items-center gap-3 rounded-xl border p-3 transition-all hover:border-brand/40",
                  isSelected
                    ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                    : "border-border-soft bg-surface",
                  saving && "opacity-60 cursor-wait",
                )}
              >
                <span className="text-2xl" aria-hidden>
                  {info.flag}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-ink">{info.name}</p>
                    {isRecommended && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 text-brand-dark text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5">
                        <Sparkles size={9} /> Recomendada
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted font-mono">
                    {info.symbol} · {code}
                  </p>
                </div>
                {isSelected && (
                  <Check size={16} className="text-brand flex-shrink-0" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {msg && (
        <div
          role="alert"
          className={cn(
            "mt-4 rounded-lg px-3 py-2 text-xs",
            msg.kind === "ok"
              ? "bg-brand/10 text-brand-dark"
              : "bg-danger/10 text-danger",
          )}
        >
          {msg.text}
        </div>
      )}
    </section>
  );
}
