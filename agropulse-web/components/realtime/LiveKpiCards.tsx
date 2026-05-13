"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useSSE } from "@/lib/realtime/useSSE";
import { useCountryStore } from "@/lib/stores/country-store";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { kpis as BASE_KPIS } from "@/lib/mock-data/kpis";

/**
 * `useMounted` — returns true only on the client after hydration.
 * Uses `useSyncExternalStore` (recommended by React 19) instead of
 * `useEffect(() => setMounted(true))`, which the new lint rule flags.
 */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

interface KpiSnapshot {
  id: string;
  etiqueta: string;
  numericValue: number;
  display: string;
  cambioPct: number;
  tendencia: "up" | "down" | "flat";
  descripcion: string;
}

interface DashboardTick {
  ts: string;
  country: string | null;
  kpis: KpiSnapshot[];
  alertasActivas: number;
  sensoresOnline: number;
  sensoresAlerta: number;
}

// Fallback KPIs derived from base mock data so the cards render before SSE
// connects (or while it reconnects).
function fallbackKpis(): KpiSnapshot[] {
  return BASE_KPIS.map((k) => ({
    id: k.id,
    etiqueta: k.etiqueta,
    numericValue: 0,
    display: k.valor,
    cambioPct: k.cambioPct,
    tendencia: k.tendencia,
    descripcion: k.descripcion,
  }));
}

function KpiCardLive({
  kpi,
  positiveIsGood,
}: {
  kpi: KpiSnapshot;
  positiveIsGood: boolean;
}) {
  const Icon =
    kpi.tendencia === "up"
      ? TrendingUp
      : kpi.tendencia === "down"
        ? TrendingDown
        : Minus;

  const good =
    (kpi.tendencia === "up" && positiveIsGood) ||
    (kpi.tendencia === "down" && !positiveIsGood);

  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm">
      <p className="text-xs font-medium text-muted uppercase tracking-wider">
        {kpi.etiqueta}
      </p>
      <div className="mt-2 h-9 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={kpi.display}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="text-3xl font-semibold text-ink tracking-tight tabular-nums"
          >
            {kpi.display}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1 font-semibold",
            good ? "text-emerald-700" : "text-red-600",
          )}
        >
          <Icon size={12} />
          {kpi.cambioPct > 0 ? "+" : ""}
          {kpi.cambioPct}%
        </span>
        <span className="text-muted">{kpi.descripcion}</span>
      </div>
    </div>
  );
}

export function LiveKpiCards() {
  const { country } = useCountryStore();
  const mounted = useMounted();

  const url = mounted
    ? `/api/stream/dashboard?country=${encodeURIComponent(country)}`
    : null;
  const { data } = useSSE<DashboardTick>(url, "tick");

  const list = data?.kpis ?? fallbackKpis();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {list.map((k, i) => (
        <Reveal key={k.id} delay={i * 0.06} y={20}>
          <KpiCardLive kpi={k} positiveIsGood={k.id !== "mermas"} />
        </Reveal>
      ))}
    </div>
  );
}

export function LiveBadge() {
  const mounted = useMounted();
  const { country } = useCountryStore();
  const url = mounted
    ? `/api/stream/dashboard?country=${encodeURIComponent(country)}`
    : null;
  const { connected } = useSSE<DashboardTick>(url, "tick");

  if (!mounted) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        En vivo
      </span>
    );
  }

  return connected ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      En vivo
    </span>
  ) : (
    <span
      title="Reintentando conexión..."
      className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Reintentando
    </span>
  );
}
