"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { EventoTrazabilidad } from "@/lib/types";

// Fix default icon path issues in webpack/SSR builds.
const defaultIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44"><path d="M16 0C7.16 0 0 7.16 0 16c0 11 16 28 16 28s16-17 16-28C32 7.16 24.84 0 16 0z" fill="#15803D"/><circle cx="16" cy="16" r="6" fill="white"/></svg>`,
    ),
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -32],
});

interface MapViewProps {
  eventos: EventoTrazabilidad[];
}

function MapViewInner({ eventos }: MapViewProps) {
  useEffect(() => {
    // Make sure leaflet uses our icon
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  if (eventos.length === 0) return null;
  const positions = eventos.map((e) => e.coordenadas);
  const center = positions[Math.floor(positions.length / 2)];

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: 16 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={positions} pathOptions={{ color: "#15803D", weight: 3, dashArray: "6" }} />
      {eventos.map((e) => (
        <Marker key={e.id} position={e.coordenadas} icon={defaultIcon}>
          <Popup>
            <strong className="capitalize">{e.tipo}</strong>
            <br />
            {e.ubicacion}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapViewInner;
