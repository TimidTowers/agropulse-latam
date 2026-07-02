"use client";

/**
 * Wrapper client del mapa de ruta en vivo.
 * react-leaflet toca `window` — SIEMPRE dynamic import con ssr:false.
 */
import dynamic from "next/dynamic";
import type { OrderRouteMapProps } from "./OrderRouteMapView";

const OrderRouteMapView = dynamic(() => import("./OrderRouteMapView"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] rounded-xl border border-border-soft bg-surface-2 grid place-items-center">
      <p className="text-sm text-muted animate-pulse">Cargando mapa de ruta…</p>
    </div>
  ),
});

export function OrderRouteMap(props: OrderRouteMapProps) {
  return <OrderRouteMapView {...props} />;
}

export default OrderRouteMap;
