/**
 * SSE: live sensor readings.
 *
 * Emits a `tick` event ~every 1500ms with the latest reading for each sensor.
 * Query params:
 *   - country=CR   filter by country code
 *   - limit=10     cap how many sensors per tick (default 10, max 50)
 *
 * Returns 401 if not authenticated.
 */
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { sensors as ALL_SENSORS } from "@/lib/mock-data/sensors";
import { createSseStream, sleep } from "@/lib/realtime/sse";
import type { Sensor } from "@/lib/types";

export const dynamic = "force-dynamic";

interface SensorTickReading {
  sensorId: string;
  nombre: string;
  ubicacion: string;
  tipo: Sensor["tipo"];
  estado: Sensor["estado"];
  bateria: number;
  timestamp: string;
  temperatura: number;
  humedad: number;
  rangoOptimo: Sensor["rangoOptimo"];
  inRangeTemp: boolean;
  inRangeHum: boolean;
  country: Sensor["country"];
}

interface SensorTick {
  ts: string;
  readings: SensorTickReading[];
}

function randomReading(sensor: Sensor): SensorTickReading {
  const [loT, hiT] = sensor.rangoOptimo.temperatura;
  const [loH, hiH] = sensor.rangoOptimo.humedad;
  const midT = (loT + hiT) / 2;
  const midH = (loH + hiH) / 2;
  const spreadT = (hiT - loT) / 2;
  const spreadH = (hiH - loH) / 2;

  // 10% chance to drift slightly out of range
  const driftT = Math.random() < 0.1 ? (Math.random() < 0.5 ? -1 : 1) * spreadT * 1.6 : 0;
  const driftH = Math.random() < 0.1 ? (Math.random() < 0.5 ? -1 : 1) * spreadH * 1.6 : 0;

  const temperatura = Number(
    (midT + (Math.random() - 0.5) * spreadT * 1.4 + driftT).toFixed(2),
  );
  const humedad = Number(
    Math.min(
      99,
      Math.max(40, midH + (Math.random() - 0.5) * spreadH * 1.4 + driftH),
    ).toFixed(2),
  );

  const inRangeTemp = temperatura >= loT && temperatura <= hiT;
  const inRangeHum = humedad >= loH && humedad <= hiH;

  return {
    sensorId: sensor.id,
    nombre: sensor.nombre,
    ubicacion: sensor.ubicacion,
    tipo: sensor.tipo,
    estado: sensor.estado,
    bateria: sensor.bateria,
    timestamp: new Date().toISOString(),
    temperatura,
    humedad,
    rangoOptimo: sensor.rangoOptimo,
    inRangeTemp,
    inRangeHum,
    country: sensor.country,
  };
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response(
      JSON.stringify({ ok: false, error: "unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const sp = req.nextUrl.searchParams;
  const country = sp.get("country");
  const limitParam = Number(sp.get("limit") ?? "10");
  const limit = Math.min(Math.max(1, Number.isFinite(limitParam) ? limitParam : 10), 50);

  const pool = (country ? ALL_SENSORS.filter((s) => s.country === country) : ALL_SENSORS).slice(
    0,
    limit,
  );

  return createSseStream<SensorTick>(async (send, close) => {
    if (pool.length === 0) {
      send("tick", { ts: new Date().toISOString(), readings: [] });
      close();
      return;
    }

    // Initial tick immediately
    send("tick", {
      ts: new Date().toISOString(),
      readings: pool.map(randomReading),
    });

    // Then ~5 more ticks @1500ms
    for (let i = 0; i < 5; i++) {
      await sleep(1500);
      send("tick", {
        ts: new Date().toISOString(),
        readings: pool.map(randomReading),
      });
    }
  });
}
