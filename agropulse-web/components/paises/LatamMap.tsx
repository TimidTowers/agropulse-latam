"use client";

import dynamic from "next/dynamic";

const LatamMapView = dynamic(() => import("./LatamMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center bg-surface-2 rounded-2xl text-sm text-muted">
      Cargando mapa LATAM…
    </div>
  ),
});

export function LatamMap() {
  return <LatamMapView />;
}
