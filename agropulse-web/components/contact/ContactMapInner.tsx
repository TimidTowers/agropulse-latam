"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44"><path d="M16 0C7.16 0 0 7.16 0 16c0 11 16 28 16 28s16-17 16-28C32 7.16 24.84 0 16 0z" fill="#15803D"/><circle cx="16" cy="16" r="6" fill="white"/></svg>`,
    ),
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -32],
});

// Oficina en Querétaro (Centro Histórico, aprox.)
const QRO: [number, number] = [20.5888, -100.3899];

export default function ContactMapInner() {
  return (
    <MapContainer
      center={QRO}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: 16 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={QRO} icon={icon}>
        <Popup>
          <strong>AgroPulse HQ</strong>
          <br />
          Centro Histórico, Querétaro
        </Popup>
      </Marker>
    </MapContainer>
  );
}
