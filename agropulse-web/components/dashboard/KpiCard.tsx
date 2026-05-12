import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPI } from "@/lib/types";

interface KpiCardProps {
  kpi: KPI;
  positiveIsGood?: boolean;
}

export function KpiCard({ kpi, positiveIsGood = true }: KpiCardProps) {
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
      <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">
        {kpi.valor}
      </p>
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
