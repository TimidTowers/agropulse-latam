"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTRIES } from "@/lib/countries";

function makeIcon(color: string) {
  return L.icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44"><path d="M16 0C7.16 0 0 7.16 0 16c0 11 16 28 16 28s16-17 16-28C32 7.16 24.84 0 16 0z" fill="${color}"/><circle cx="16" cy="16" r="6" fill="white"/></svg>`,
      ),
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -32],
  });
}

const greenIcon = makeIcon("#15803D");

function LatamMapView() {
  useEffect(() => {
    L.Marker.prototype.options.icon = greenIcon;
  }, []);

  // Center on LATAM
  const center: [number, number] = [-5, -65];

  return (
    <MapContainer
      center={center}
      zoom={3}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: 16 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {COUNTRIES.map((c) => (
        <Marker key={c.code} position={c.capitalCoords} icon={greenIcon}>
          <Popup>
            <div style={{ fontWeight: 600 }}>
              {c.flag} {c.name}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Capital: {c.capital}
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {c.productors.toLocaleString("es-MX")} productores ·{" "}
              {c.hectareas.toLocaleString("es-MX")} ha
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default LatamMapView;
