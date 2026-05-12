import type { CountryCode } from "./countries";

export type Urgencia = "alta" | "media" | "baja";

export type ProductoCategoria =
  | "Hortalizas"
  | "Frutas"
  | "Lácteos"
  | "Granos"
  | "Carnes"
  | "Café"
  | "Cacao"
  | "Especias"
  | "Tubérculos";

export interface Productor {
  id: string;
  nombre: string;
  region: string;
  estado: string;
  certificaciones: string[];
  rating: number;
  yearsActive: number;
}

export interface CondicionesIoT {
  temperaturaC: number;
  humedadPct: number;
  ultimaLectura: string;
  rangoOptimoTemp: [number, number];
  rangoOptimoHumedad: [number, number];
}

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  categoria: ProductoCategoria;
  country: CountryCode;
  productor: Productor;
  precio: number;
  unidad: string;
  stock: number;
  fechaCosecha: string;
  vidaUtilDias: number;
  urgencia: Urgencia;
  imagen: string;
  galeria: string[];
  certificaciones: string[];
  condicionesIoT: CondicionesIoT;
  descripcion: string;
  sensorId: string;
  loteId: string;
}

export interface SensorReading {
  timestamp: string;
  temperatura: number;
  humedad: number;
}

export interface Sensor {
  id: string;
  nombre: string;
  ubicacion: string;
  country: CountryCode;
  tipo: "almacén" | "cámara frigorífica" | "transporte";
  productoId?: string;
  estado: "activo" | "alerta" | "fuera de línea";
  bateria: number;
  rangoOptimo: {
    temperatura: [number, number];
    humedad: [number, number];
  };
  lecturas: SensorReading[];
}

export interface ForecastEntry {
  trimestre: string;
  producto: string;
  region: string;
  country: CountryCode;
  demandaProyectadaTon: number;
  precioEsperadoMxnPorKg: number;
}

export interface Order {
  id: string;
  fecha: string;
  comprador: string;
  country: CountryCode;
  productos: { nombre: string; cantidad: number; unidad: string }[];
  total: number;
  estado: "pendiente" | "en tránsito" | "entregado" | "cancelado";
}

export interface KPI {
  id: string;
  etiqueta: string;
  valor: string;
  cambioPct: number;
  tendencia: "up" | "down" | "flat";
  descripcion: string;
}

export interface Plan {
  id: "basico" | "pro" | "enterprise";
  nombre: string;
  precio: string;
  precioRaw: number | null;
  periodo: string;
  sensores: string;
  destacado: boolean;
  features: string[];
  cta: string;
}

export interface TeamMember {
  id: string;
  nombre: string;
  rol: string;
  bio: string;
  avatar: string;
  linkedin?: string;
}

export interface EventoTrazabilidad {
  id: string;
  fecha: string;
  tipo: "siembra" | "cosecha" | "almacén" | "transporte" | "punto de venta";
  ubicacion: string;
  coordenadas: [number, number];
  responsable: string;
  notas: string;
  hashBlockchain?: string;
}

export interface LoteTrazabilidad {
  loteId: string;
  producto: string;
  productor: Productor;
  fechaSiembra: string;
  fechaCosecha: string;
  certificaciones: string[];
  eventos: EventoTrazabilidad[];
}

export interface Alerta {
  id: string;
  tipo: "temperatura" | "humedad" | "vida útil" | "sistema";
  severidad: "crítica" | "alta" | "media" | "baja";
  mensaje: string;
  sensorId?: string;
  productoId?: string;
  timestamp: string;
}
