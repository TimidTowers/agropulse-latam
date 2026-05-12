import type { KPI, Alerta } from "../types";

// Fixed reference timestamp to keep SSR/CSR consistent
const REFERENCE_NOW = new Date("2026-05-12T08:00:00Z").getTime();

export const kpis: KPI[] = [
  {
    id: "mermas",
    etiqueta: "Mermas del mes",
    valor: "6.4%",
    cambioPct: -28,
    tendencia: "down",
    descripcion: "vs. mes anterior",
  },
  {
    id: "ventas",
    etiqueta: "Ventas del mes",
    valor: "$412,000",
    cambioPct: 14,
    tendencia: "up",
    descripcion: "MXN, vs. mes anterior",
  },
  {
    id: "lotes",
    etiqueta: "Lotes activos",
    valor: "47",
    cambioPct: 8,
    tendencia: "up",
    descripcion: "en bodega",
  },
  {
    id: "vidaUtil",
    etiqueta: "Vida útil promedio",
    valor: "8.2 días",
    cambioPct: 12,
    tendencia: "up",
    descripcion: "óptima al ingreso",
  },
];

export const alertas: Alerta[] = [
  {
    id: "a-001",
    tipo: "temperatura",
    severidad: "alta",
    mensaje:
      "Sensor S-MX-02 (Aguacate Hass) registra 6.5°C, fuera de rango óptimo en últimos 12 min.",
    sensorId: "S-MX-02",
    timestamp: new Date(REFERENCE_NOW - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "a-002",
    tipo: "vida útil",
    severidad: "crítica",
    mensaje:
      "Lote L-2026-0211 (Fresa Camarosa) tiene 3 días restantes. Recomendado priorizar venta.",
    timestamp: new Date(REFERENCE_NOW - 1000 * 60 * 32).toISOString(),
  },
  {
    id: "a-003",
    tipo: "sistema",
    severidad: "media",
    mensaje:
      "Sensor S-CL-03 (Almacén Granel Chile) fuera de línea, batería al 12%.",
    sensorId: "S-CL-03",
    timestamp: new Date(REFERENCE_NOW - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "a-004",
    tipo: "humedad",
    severidad: "baja",
    mensaje:
      "Humedad ligeramente baja en cámara S-CO-02 (Café Excelso). Ajuste manual sugerido.",
    sensorId: "S-CO-02",
    timestamp: new Date(REFERENCE_NOW - 1000 * 60 * 60 * 4).toISOString(),
  },
];

export const proximasCosechas = [
  { producto: "Tomate Saladette", productor: "Invernaderos La Esperanza", fecha: "2026-05-15", toneladasEstimadas: 12 },
  { producto: "Fresa Camarosa", productor: "Berries del Bajío", fecha: "2026-05-13", toneladasEstimadas: 4.5 },
  { producto: "Aguacate Hass", productor: "Aguacates del Valle", fecha: "2026-05-18", toneladasEstimadas: 22 },
  { producto: "Espinaca baby", productor: "Verde Fresco SPR", fecha: "2026-05-14", toneladasEstimadas: 1.2 },
];

export const mermasHistoricas = [
  { mes: "Ene", mermas: 14.2, objetivo: 10 },
  { mes: "Feb", mermas: 12.8, objetivo: 10 },
  { mes: "Mar", mermas: 11.4, objetivo: 9 },
  { mes: "Abr", mermas: 9.1, objetivo: 8 },
  { mes: "May", mermas: 6.4, objetivo: 7 },
];
