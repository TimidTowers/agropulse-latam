import {
  Sprout,
  Tractor,
  Warehouse,
  Truck,
  Store,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { EventoTrazabilidad } from "@/lib/types";

const tipoVisual: Record<
  EventoTrazabilidad["tipo"],
  { icon: typeof Sprout; bg: string }
> = {
  siembra: { icon: Sprout, bg: "bg-emerald-100 text-emerald-700" },
  cosecha: { icon: Tractor, bg: "bg-amber-100 text-amber-700" },
  almacén: { icon: Warehouse, bg: "bg-sky-100 text-sky-700" },
  transporte: { icon: Truck, bg: "bg-indigo-100 text-indigo-700" },
  "punto de venta": { icon: Store, bg: "bg-brand/10 text-brand-dark" },
};

interface TimelineProps {
  eventos: EventoTrazabilidad[];
}

export function Timeline({ eventos }: TimelineProps) {
  return (
    <ol className="relative space-y-6">
      <span
        className="absolute left-5 top-2 bottom-2 w-px bg-border-soft"
        aria-hidden="true"
      />
      {eventos.map((e) => {
        const v = tipoVisual[e.tipo];
        const Icon = v.icon;
        return (
          <li key={e.id} className="relative pl-14">
            <span
              className={`absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-surface ${v.bg}`}
            >
              <Icon size={18} />
            </span>
            <div className="rounded-xl border border-border-soft bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-ink capitalize">
                  {e.tipo}
                </h3>
                <span className="text-xs text-muted">{formatDate(e.fecha)}</span>
              </div>
              <p className="text-sm text-ink/85">{e.notas}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
                <span>
                  <strong className="text-ink/80">Ubicación:</strong>{" "}
                  {e.ubicacion}
                </span>
                <span>
                  <strong className="text-ink/80">Responsable:</strong>{" "}
                  {e.responsable}
                </span>
              </div>
              {e.hashBlockchain && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-mono text-muted">
                  <ShieldCheck size={11} className="text-brand" />
                  Hash: {e.hashBlockchain}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
