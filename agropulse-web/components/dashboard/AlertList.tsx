import { AlertTriangle, Thermometer, Droplets, Clock, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alerta } from "@/lib/types";

interface AlertListProps {
  alertas: Alerta[];
}

function tipoIcon(tipo: Alerta["tipo"]) {
  switch (tipo) {
    case "temperatura":
      return Thermometer;
    case "humedad":
      return Droplets;
    case "vida útil":
      return Clock;
    case "sistema":
    default:
      return Cpu;
  }
}

function severidadStyle(s: Alerta["severidad"]) {
  switch (s) {
    case "crítica":
      return "bg-red-50 text-red-700 border-red-200";
    case "alta":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "media":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "baja":
    default:
      return "bg-surface-2 text-muted border-border-soft";
  }
}

export function AlertList({ alertas }: AlertListProps) {
  if (alertas.length === 0) {
    return (
      <div className="rounded-xl border border-border-soft bg-surface-2/30 p-6 text-sm text-muted text-center">
        Sin alertas activas. Todo en orden.
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {alertas.map((a) => {
        const Icon = tipoIcon(a.tipo);
        return (
          <li
            key={a.id}
            className={cn(
              "rounded-xl border p-4 flex items-start gap-3",
              severidadStyle(a.severidad),
            )}
          >
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/70 flex-shrink-0">
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {a.severidad}
                </span>
                <span className="text-[10px] opacity-70">·</span>
                <span className="text-[10px] capitalize opacity-70">
                  {a.tipo}
                </span>
              </div>
              <p className="text-sm">{a.mensaje}</p>
              <p className="mt-1 text-[11px] opacity-60">
                {new Date(a.timestamp).toLocaleString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <AlertTriangle size={14} className="opacity-50 mt-1" />
          </li>
        );
      })}
    </ul>
  );
}
