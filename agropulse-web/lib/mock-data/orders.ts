import type { Order } from "../types";
import type { CountryCode } from "../countries";

export const orders: Order[] = [
  {
    id: "OR-3201",
    fecha: "2026-05-09",
    comprador: "Supermercados Bajío S.A.",
    country: "MX",
    productos: [
      { nombre: "Tomate Saladette", cantidad: 800, unidad: "kg" },
      { nombre: "Chile jalapeño", cantidad: 250, unidad: "kg" },
    ],
    total: 37400,
    estado: "en tránsito",
  },
  {
    id: "OR-3200",
    fecha: "2026-05-08",
    comprador: "Restaurante Casa Verde",
    country: "MX",
    productos: [
      { nombre: "Aguacate Hass", cantidad: 80, unidad: "kg" },
      { nombre: "Lechuga romana", cantidad: 35, unidad: "kg" },
    ],
    total: 10270,
    estado: "entregado",
  },
  {
    id: "OR-3199",
    fecha: "2026-05-07",
    comprador: "Whole Foods USA",
    country: "CL",
    productos: [
      { nombre: "Cereza Bing", cantidad: 200, unidad: "kg" },
      { nombre: "Palta Hass", cantidad: 180, unidad: "kg" },
    ],
    total: 2532000,
    estado: "entregado",
  },
  {
    id: "OR-3198",
    fecha: "2026-05-06",
    comprador: "Café Premium Tokyo",
    country: "CO",
    productos: [
      { nombre: "Café Excelso", cantidad: 120, unidad: "kg" },
    ],
    total: 2640000,
    estado: "entregado",
  },
  {
    id: "OR-3197",
    fecha: "2026-05-05",
    comprador: "Distribuidor Europa GmbH",
    country: "EC",
    productos: [
      { nombre: "Cacao Nacional Arriba", cantidad: 500, unidad: "kg" },
    ],
    total: 3250,
    estado: "entregado",
  },
  {
    id: "OR-3196",
    fecha: "2026-05-03",
    comprador: "Importadora Madrid",
    country: "PE",
    productos: [
      { nombre: "Quinua Real", cantidad: 600, unidad: "kg" },
      { nombre: "Espárragos", cantidad: 200, unidad: "kg" },
    ],
    total: 16800,
    estado: "pendiente",
  },
  {
    id: "OR-3195",
    fecha: "2026-05-02",
    comprador: "Cafés Brasileiros LTDA",
    country: "BR",
    productos: [{ nombre: "Café Bourbon", cantidad: 800, unidad: "kg" }],
    total: 30400,
    estado: "entregado",
  },
  {
    id: "OR-3194",
    fecha: "2026-05-01",
    comprador: "Mayorista Buenos Aires",
    country: "AR",
    productos: [
      { nombre: "Yerba Mate", cantidad: 1200, unidad: "kg" },
      { nombre: "Miel Pradera", cantidad: 80, unidad: "kg" },
    ],
    total: 3168000,
    estado: "en tránsito",
  },
];

export function getOrdersByCountry(country: CountryCode): Order[] {
  return orders.filter((o) => o.country === country);
}

export const ventasMensuales = [
  { mes: "Ene", ventas: 285000, mermas: 14 },
  { mes: "Feb", ventas: 310000, mermas: 12 },
  { mes: "Mar", ventas: 342000, mermas: 11 },
  { mes: "Abr", ventas: 398000, mermas: 9 },
  { mes: "May", ventas: 412000, mermas: 8 },
  { mes: "Jun", ventas: 445000, mermas: 7 },
  { mes: "Jul", ventas: 465000, mermas: 6 },
  { mes: "Ago", ventas: 478000, mermas: 6 },
  { mes: "Sep", ventas: 502000, mermas: 5 },
  { mes: "Oct", ventas: 524000, mermas: 5 },
  { mes: "Nov", ventas: 561000, mermas: 4 },
  { mes: "Dic", ventas: 580000, mermas: 4 },
];
