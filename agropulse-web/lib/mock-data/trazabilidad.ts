import type { LoteTrazabilidad } from "../types";
import { products } from "./products";
import { getCountry } from "../countries";

function buildTrazabilidad(productoId: string): LoteTrazabilidad | undefined {
  const p = products.find((x) => x.id === productoId);
  if (!p) return undefined;

  const fechaSiembra = new Date(p.fechaCosecha);
  fechaSiembra.setDate(fechaSiembra.getDate() - 90);

  const country = getCountry(p.country);
  // Generate slight offsets around the capital for visual variety
  const [lat, lng] = country.capitalCoords;
  const siembra: [number, number] = [lat + 0.6, lng - 0.4];
  const cosecha: [number, number] = [lat + 0.6, lng - 0.4];
  const almacen: [number, number] = [lat + 0.3, lng + 0.2];
  const ruta: [number, number] = [lat + 0.1, lng + 0.05];
  const destino: [number, number] = [lat, lng];

  return {
    loteId: p.loteId,
    producto: p.nombre,
    productor: p.productor,
    fechaSiembra: fechaSiembra.toISOString(),
    fechaCosecha: p.fechaCosecha,
    certificaciones: p.certificaciones,
    eventos: [
      {
        id: "ev-1",
        fecha: fechaSiembra.toISOString(),
        tipo: "siembra",
        ubicacion: `Predio ${p.productor.nombre}, ${p.productor.region}`,
        coordenadas: siembra,
        responsable: p.productor.nombre,
        notas: "Inicio de ciclo productivo. Semilla certificada y suelo analizado.",
        hashBlockchain: "0x4f2a...e91c",
      },
      {
        id: "ev-2",
        fecha: p.fechaCosecha,
        tipo: "cosecha",
        ubicacion: `Predio ${p.productor.nombre}, ${p.productor.estado}`,
        coordenadas: cosecha,
        responsable: p.productor.nombre,
        notas: "Cosecha en óptima madurez. Inspección sanitaria positiva.",
        hashBlockchain: "0x7b9d...0f24",
      },
      {
        id: "ev-3",
        fecha: new Date(
          new Date(p.fechaCosecha).getTime() + 1000 * 60 * 60 * 4,
        ).toISOString(),
        tipo: "almacén",
        ubicacion: `Bodega refrigerada — ${p.productor.region}`,
        coordenadas: almacen,
        responsable: "AgroPulse Logistics",
        notas: `Ingreso a cámara con temperatura ${p.condicionesIoT.rangoOptimoTemp[0]}°C – ${p.condicionesIoT.rangoOptimoTemp[1]}°C.`,
        hashBlockchain: "0xa12c...7e8d",
      },
      {
        id: "ev-4",
        fecha: new Date(
          new Date(p.fechaCosecha).getTime() + 1000 * 60 * 60 * 24,
        ).toISOString(),
        tipo: "transporte",
        ubicacion: `Ruta ${p.productor.estado} — ${country.capital}`,
        coordenadas: ruta,
        responsable: "TransFríos LATAM",
        notas: "Transporte refrigerado, cadena de frío sin rupturas. Telemetría continua.",
        hashBlockchain: "0xd57e...3b91",
      },
      {
        id: "ev-5",
        fecha: new Date(
          new Date(p.fechaCosecha).getTime() + 1000 * 60 * 60 * 36,
        ).toISOString(),
        tipo: "punto de venta",
        ubicacion: `Centro de distribución, ${country.capital}`,
        coordenadas: destino,
        responsable: "Comprador final",
        notas: "Recepción verificada por inspector independiente.",
        hashBlockchain: "0xf831...a4c2",
      },
    ],
  };
}

export function getTrazabilidad(loteId: string): LoteTrazabilidad | undefined {
  const p = products.find((x) => x.loteId === loteId);
  if (!p) return undefined;
  return buildTrazabilidad(p.id);
}

export function getAllLoteIds(): string[] {
  return products.map((p) => p.loteId);
}
