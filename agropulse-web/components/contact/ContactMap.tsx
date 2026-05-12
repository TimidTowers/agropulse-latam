"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./ContactMapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center bg-surface-2 rounded-2xl text-sm text-muted">
      Cargando mapa…
    </div>
  ),
});

export function ContactMap() {
  return <Inner />;
}
