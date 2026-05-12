"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { CountrySwitcher } from "@/components/country/CountrySwitcher";
import { COUNTRIES } from "@/lib/countries";
import { useCountryStore } from "@/lib/stores/country-store";

export function DashboardCountryBadge() {
  const { country } = useCountryStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];
  const display = mounted ? current : COUNTRIES[0];

  return (
    <div className="hidden sm:flex items-center gap-2 mr-3 pl-3 border-l border-border-soft">
      <Globe size={14} className="text-muted" />
      <span className="text-xs text-muted">Datos de:</span>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-ink">
        <span aria-hidden="true">{display.flag}</span>
        {display.name}
      </span>
      <CountrySwitcher compact />
    </div>
  );
}
