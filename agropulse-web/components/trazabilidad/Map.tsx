"use client";

import dynamic from "next/dynamic";
import type { EventoTrazabilidad } from "@/lib/types";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center bg-surface-2 rounded-2xl text-sm text-muted">
      Cargando mapa…
    </div>
  ),
});

export function Map({ eventos }: { eventos: EventoTrazabilidad[] }) {
  return <MapView eventos={eventos} />;
}
