"use client";

/**
 * Mapa de ruta EN VIVO del pedido (react-leaflet — SOLO via dynamic import
 * ssr:false, ver OrderRouteMap.tsx).
 *
 * - Polyline origen → destino.
 * - Origen: capital del país del productor + offset determinístico (hash del
 *   nombre del productor, ±0.5°) para que no todas las fincas salgan del
 *   mismo punto.
 * - Destino: capital del país del cliente + offset determinístico por hash
 *   de la ciudad del cliente.
 * - Camión interpolado linealmente según computeRouteProgress(order) —
 *   función pura del reloj, se recalcula localmente cada 2s para movimiento
 *   suave entre eventos SSE.
 * - Se suscribe al SSE /api/stream/orders/{id} (mismo patrón que
 *   OrderStatusStream) para recibir cambios de estado en vivo.
 */
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle2 } from "lucide-react";
import { getCountry, type CountryCode } from "@/lib/countries";
import { computeRouteProgress } from "@/lib/orders/progression";
import { useSSE } from "@/lib/realtime/useSSE";
import { ORDER_STATUS_FLOW, type OrderExtended } from "@/lib/db/types";

interface OrderTick {
  ts: string;
  order: OrderExtended | null;
  notFound?: boolean;
}

export interface OrderRouteMapProps {
  /** Pedido serializado desde el server (estado inicial pre-SSE). */
  initialOrder: OrderExtended;
  /** País del productor (origen de la ruta). */
  originCountry: CountryCode;
  /** Nombre del productor — semilla del offset determinístico del origen. */
  productorName: string;
}

// ── Offsets determinísticos ─────────────────────────────────────────────────

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/** Offset [-0.5, 0.5]° estable para un mismo string (finca/ciudad). */
function offsetFor(seed: string): [number, number] {
  const h = hashString(seed);
  const latOff = (h % 1000) / 1000 - 0.5;
  const lngOff = ((h >>> 10) % 1000) / 1000 - 0.5;
  return [latOff, lngOff];
}

// ── Iconos divIcon con emoji ────────────────────────────────────────────────

function emojiIcon(emoji: string, bg: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="display:grid;place-items:center;width:34px;height:34px;border-radius:9999px;background:${bg};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);font-size:16px;line-height:1;">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

const fincaIcon = emojiIcon("🌾", "#15803D"); // origen — finca (verde)
const casaIcon = emojiIcon("🏠", "#0284C7"); // destino — casa (azul)
const camionIcon = emojiIcon("🚚", "#F59E0B"); // camión en ruta

// ── fitBounds a los dos puntos ──────────────────────────────────────────────

function FitBounds({ from, to }: { from: [number, number]; to: [number, number] }) {
  const map = useMap();
  const [fromLat, fromLng] = from;
  const [toLat, toLng] = to;
  useEffect(() => {
    map.fitBounds(
      L.latLngBounds([fromLat, fromLng], [toLat, toLng]),
      { padding: [45, 45] },
    );
  }, [map, fromLat, fromLng, toLat, toLng]);
  return null;
}

// ── Componente principal ────────────────────────────────────────────────────

const TRANSIT_IDX = ORDER_STATUS_FLOW.indexOf("en_transito");

function OrderRouteMapView({
  initialOrder,
  originCountry,
  productorName,
}: OrderRouteMapProps) {
  // SSE en vivo (auto-reconnect, mismo endpoint que OrderStatusStream).
  const { data } = useSSE<OrderTick>(
    `/api/stream/orders/${encodeURIComponent(initialOrder.id)}`,
    "tick",
  );
  const order = data?.order ?? initialOrder;

  // Progreso 0..1 — recalculado localmente cada 2s (computeRouteProgress es
  // función pura del reloj) para movimiento suave entre eventos SSE.
  const [progress, setProgress] = useState(() => computeRouteProgress(initialOrder));
  useEffect(() => {
    setProgress(computeRouteProgress(order));
    const timer = setInterval(() => {
      setProgress(computeRouteProgress(order));
    }, 2000);
    return () => clearInterval(timer);
  }, [order]);

  const destCountry = order.customerInfo.country;
  const destCity = order.customerInfo.address.city;

  const origin = useMemo<[number, number]>(() => {
    const base = getCountry(originCountry).capitalCoords;
    const [dLat, dLng] = offsetFor(productorName);
    return [base[0] + dLat, base[1] + dLng];
  }, [originCountry, productorName]);

  const dest = useMemo<[number, number]>(() => {
    const base = getCountry(destCountry).capitalCoords;
    const [dLat, dLng] = offsetFor(destCity);
    return [base[0] + dLat, base[1] + dLng];
  }, [destCountry, destCity]);

  const truckPos: [number, number] = [
    origin[0] + (dest[0] - origin[0]) * progress,
    origin[1] + (dest[1] - origin[1]) * progress,
  ];

  const statusIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  const pct = Math.round(progress * 100);

  const isCancelled = order.status === "cancelado";
  const isDelivered = order.status === "entregado";

  let statusText: string;
  if (isCancelled) statusText = "Pedido cancelado — la ruta quedó sin efecto";
  else if (isDelivered) statusText = "Entregado";
  else if (order.status === "ultima_milla") statusText = "En reparto local";
  else if (order.status === "en_transito")
    statusText = `En camino — ${pct}% de la ruta recorrida`;
  else statusText = "Preparando en finca — el envío aún no sale";

  return (
    <div>
      <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border-soft relative z-0">
        <MapContainer
          center={origin}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds from={origin} to={dest} />
          <Polyline
            positions={[origin, dest]}
            pathOptions={{
              color: isCancelled ? "#DC2626" : "#15803D",
              weight: 3,
              dashArray: "8 6",
              opacity: 0.8,
            }}
          />
          <Marker position={origin} icon={fincaIcon} title={`Finca de ${productorName}`} />
          <Marker position={dest} icon={casaIcon} title={`Destino: ${destCity}`} />
          {!isCancelled && (
            <Marker position={truckPos} icon={camionIcon} title="Envío en ruta" />
          )}
        </MapContainer>
      </div>

      {/* Barra de progreso + texto según estado */}
      <div className="mt-4">
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            className={
              isCancelled
                ? "h-full rounded-full bg-red-400 transition-all duration-700"
                : "h-full rounded-full bg-emerald-500 transition-all duration-700"
            }
            style={{ width: `${isCancelled ? 100 : pct}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-ink inline-flex items-center gap-1.5">
            {isDelivered && (
              <CheckCircle2 size={15} className="text-emerald-600" />
            )}
            {statusText}
          </p>
          {!isCancelled && !isDelivered && statusIdx >= TRANSIT_IDX && (
            <span className="text-xs text-muted tabular-nums">{pct}%</span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted">
          {getCountry(originCountry).flag} Finca de {productorName} →{" "}
          {getCountry(destCountry).flag} {destCity}
        </p>
      </div>
    </div>
  );
}

export default OrderRouteMapView;
