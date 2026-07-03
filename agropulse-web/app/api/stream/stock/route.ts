/**
 * SSE PÚBLICO — stock en vivo del marketplace.
 *
 * GET /api/stream/stock?country=CR
 *
 * Emite cada ~2.5s un evento "tick" con el stock efectivo de todos los
 * productos estáticos del país + lotes dinámicos activos:
 *   { ts, country, stocks: { [productId]: effectiveStock } }
 *
 * Patrón Vercel-safe: el stream cierra a ~9s y el cliente (useSSE)
 * reconecta automáticamente.
 */
import type { NextRequest } from "next/server";
import { COUNTRIES, ORIGIN_COUNTRY, type CountryCode } from "@/lib/countries";
import { createSseStream, sleep } from "@/lib/realtime/sse";
import { getStocksForCountry } from "@/lib/stock-utils";

export const dynamic = "force-dynamic";

interface StockTick {
  ts: string;
  country: CountryCode;
  stocks: Record<string, number>;
}

const TICK_MS = 2500;
/** 4 emisiones por sesión de stream (t=0, 2.5s, 5s, 7.5s) < 9s máx. */
const TICKS_PER_SESSION = 4;

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("country");
  const country: CountryCode =
    raw && COUNTRIES.some((c) => c.code === raw)
      ? (raw as CountryCode)
      : ORIGIN_COUNTRY;

  return createSseStream<StockTick>(async (send) => {
    for (let i = 0; i < TICKS_PER_SESSION; i++) {
      send("tick", {
        ts: new Date().toISOString(),
        country,
        stocks: await getStocksForCountry(country),
      });
      if (i < TICKS_PER_SESSION - 1) await sleep(TICK_MS);
    }
  });
}
