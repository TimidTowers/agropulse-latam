import type { Sensor, SensorReading } from "../types";
import type { CountryCode } from "../countries";
import { COUNTRIES } from "../countries";

// Deterministic pseudo-random so SSR/client match
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Fixed reference timestamp to keep generation deterministic
const REFERENCE_NOW = new Date("2026-05-12T08:00:00Z").getTime();

function generateReadings(
  seedNum: number,
  baseTemp: number,
  baseHum: number,
  hours = 24,
): SensorReading[] {
  const rnd = seeded(seedNum);
  const readings: SensorReading[] = [];
  for (let i = hours; i >= 0; i--) {
    const t = new Date(REFERENCE_NOW - i * 60 * 60 * 1000);
    const tempVar = (rnd() - 0.5) * 2.5;
    const humVar = (rnd() - 0.5) * 5;
    readings.push({
      timestamp: t.toISOString(),
      temperatura: Number((baseTemp + tempVar).toFixed(2)),
      humedad: Number(Math.min(99, Math.max(40, baseHum + humVar)).toFixed(2)),
    });
  }
  return readings;
}

interface SensorTpl {
  nombre: string;
  ubicacion: string;
  tipo: Sensor["tipo"];
  productoIdx: number; // index of product in country list (for productoId mapping)
  estado: Sensor["estado"];
  bateria: number;
  baseTemp: number;
  baseHum: number;
  rangoTemp: [number, number];
  rangoHum: [number, number];
}

// 5 sensors per country = 50 sensors total
const templatesPerCountry: SensorTpl[] = [
  { nombre: "Cámara A", ubicacion: "Bodega Principal", tipo: "cámara frigorífica", productoIdx: 0, estado: "activo", bateria: 92, baseTemp: 8.0, baseHum: 88, rangoTemp: [7, 10], rangoHum: [85, 95] },
  { nombre: "Cámara B", ubicacion: "Centro de Empaque", tipo: "cámara frigorífica", productoIdx: 1, estado: "alerta", bateria: 67, baseTemp: 6.5, baseHum: 84, rangoTemp: [5, 8], rangoHum: [80, 90] },
  { nombre: "Almacén Granel", ubicacion: "Silo Regional", tipo: "almacén", productoIdx: 2, estado: "activo", bateria: 88, baseTemp: 12.0, baseHum: 60, rangoTemp: [10, 15], rangoHum: [55, 65] },
  { nombre: "Transporte Refrigerado", ubicacion: "Tráiler frigorífico TX-1", tipo: "transporte", productoIdx: 3, estado: "activo", bateria: 73, baseTemp: 4.0, baseHum: 88, rangoTemp: [2, 6], rangoHum: [85, 95] },
  { nombre: "Cámara Frutas", ubicacion: "Bodega Frutas Frescas", tipo: "cámara frigorífica", productoIdx: 4, estado: "activo", bateria: 81, baseTemp: 2.0, baseHum: 92, rangoTemp: [0, 4], rangoHum: [90, 95] },
];

let seedCounter = 1000;

function buildSensorsForCountry(country: CountryCode): Sensor[] {
  // We use deterministic indices: sensors per country range matches products
  return templatesPerCountry.map((tpl, i) => {
    const idx = String(i + 1).padStart(2, "0");
    seedCounter += 1;
    return {
      id: `S-${country}-${idx}`,
      nombre: `${tpl.nombre} ${country}`,
      ubicacion: `${tpl.ubicacion} · ${COUNTRIES.find((c) => c.code === country)?.capital ?? country}`,
      country,
      tipo: tpl.tipo,
      productoId: undefined, // optional cross-link, kept undefined to avoid mismatches
      estado: tpl.estado,
      bateria: tpl.bateria,
      rangoOptimo: { temperatura: tpl.rangoTemp, humedad: tpl.rangoHum },
      lecturas: generateReadings(seedCounter, tpl.baseTemp, tpl.baseHum),
    } satisfies Sensor;
  });
}

export const sensors: Sensor[] = COUNTRIES.flatMap((c) =>
  buildSensorsForCountry(c.code),
);

export function getSensorById(id: string): Sensor | undefined {
  return sensors.find((s) => s.id === id);
}

export function getSensorsByCountry(country: CountryCode): Sensor[] {
  return sensors.filter((s) => s.country === country);
}

export function getRecentReadings(sensorId: string, n: number): SensorReading[] {
  const s = getSensorById(sensorId);
  if (!s) return [];
  return s.lecturas.slice(-n);
}
