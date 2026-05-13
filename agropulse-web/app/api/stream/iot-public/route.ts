/**
 * SSE PUBLIC stream — for landing IoT widget.
 *
 * No auth required. Emits aggregated IoT metrics every ~1500ms:
 *   - avg temperatura (°C)
 *   - avg humedad (%)
 *   - avg vida útil estimada (días)
 *   - sensores activos
 *
 * Includes a small sparkline-friendly history with the last 10 averages so
 * the client can render a mini-chart without keeping its own buffer.
 */
import type { NextRequest } from "next/server";
import { ORIGIN_COUNTRY, type CountryCode } from "@/lib/countries";
import { sensors as ALL_SENSORS } from "@/lib/mock-data/sensors";
import { createSseStream, sleep } from "@/lib/realtime/sse";

export const dynamic = "force-dynamic";

interface IotPublicTick {
  ts: string;
  country: CountryCode;
  tempAvg: number;
  humAvg: number;
  vidaUtilDias: number;
  sensoresActivos: number;
  alertas: number;
  tempInRange: boolean;
  humInRange: boolean;
  /** rolling history for sparkline (oldest to newest) */
  history: { ts: string; temp: number; hum: number }[];
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const country = (sp.get("country") as CountryCode | null) ?? ORIGIN_COUNTRY;
  const scope = ALL_SENSORS.filter((s) => s.country === country);
  const pool = scope.length > 0 ? scope : ALL_SENSORS.slice(0, 5);

  // Average optimal ranges for the pool, used to flag "in range" state.
  const avgLoT = pool.reduce((a, s) => a + s.rangoOptimo.temperatura[0], 0) / pool.length;
  const avgHiT = pool.reduce((a, s) => a + s.rangoOptimo.temperatura[1], 0) / pool.length;
  const avgLoH = pool.reduce((a, s) => a + s.rangoOptimo.humedad[0], 0) / pool.length;
  const avgHiH = pool.reduce((a, s) => a + s.rangoOptimo.humedad[1], 0) / pool.length;
  const baseTemp = (avgLoT + avgHiT) / 2;
  const baseHum = (avgLoH + avgHiH) / 2;

  // Seed history with 10 entries so the sparkline isn't empty on first frame.
  const history: { ts: string; temp: number; hum: number }[] = [];
  const seedNow = Date.now();
  for (let i = 9; i >= 0; i--) {
    history.push({
      ts: new Date(seedNow - i * 1500).toISOString(),
      temp: Number((baseTemp + (Math.random() - 0.5) * 0.9).toFixed(2)),
      hum: Number((baseHum + (Math.random() - 0.5) * 2.4).toFixed(2)),
    });
  }

  const buildTick = (): IotPublicTick => {
    // ~12% chance of drift out of range for visual variety.
    const driftT = Math.random() < 0.12 ? (Math.random() < 0.5 ? -1.4 : 1.4) : 0;
    const driftH = Math.random() < 0.12 ? (Math.random() < 0.5 ? -4 : 4) : 0;
    const tempAvg = Number((baseTemp + (Math.random() - 0.5) * 0.8 + driftT).toFixed(2));
    const humAvg = Number(
      Math.min(99, Math.max(45, baseHum + (Math.random() - 0.5) * 2.5 + driftH)).toFixed(2),
    );

    const tempInRange = tempAvg >= avgLoT && tempAvg <= avgHiT;
    const humInRange = humAvg >= avgLoH && humAvg <= avgHiH;

    // Vida útil correlated with how well conditions sit: better range → longer
    const optimalScore =
      (tempInRange ? 0.5 : 0) + (humInRange ? 0.5 : 0) + Math.random() * 0.2 - 0.1;
    const vidaUtilDias = Number((6.5 + optimalScore * 3.5).toFixed(1));

    const sensoresActivos = pool.filter((s) => s.estado === "activo").length || pool.length;
    const alertas =
      (tempInRange ? 0 : 1) + (humInRange ? 0 : 1) + Math.floor(Math.random() * 2);

    history.push({ ts: new Date().toISOString(), temp: tempAvg, hum: humAvg });
    while (history.length > 10) history.shift();

    return {
      ts: new Date().toISOString(),
      country,
      tempAvg,
      humAvg,
      vidaUtilDias,
      sensoresActivos,
      alertas,
      tempInRange,
      humInRange,
      history: [...history],
    };
  };

  return createSseStream<IotPublicTick>(async (send, close) => {
    send("tick", buildTick());
    for (let i = 0; i < 5; i++) {
      await sleep(1500);
      send("tick", buildTick());
    }
    close();
  });
}
