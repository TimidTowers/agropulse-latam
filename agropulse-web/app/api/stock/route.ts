/**
 * GET /api/stock — stock efectivo (base − vendido − reservado activo).
 *
 *   ?ids=p-cr-001,lot-xxx  → stocks de esos ids (estáticos o lotes)
 *   ?country=CR            → todos los productos del país + lotes activos
 *
 * Público (solo lectura). Respuesta: { ok, stocks: { [productId]: number } }
 */
import type { NextRequest } from "next/server";
import { COUNTRIES, type CountryCode } from "@/lib/countries";
import { getEffectiveStockFor, getStocksForCountry } from "@/lib/stock-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const idsParam = sp.get("ids");
  const countryParam = sp.get("country");

  let stocks: Record<string, number> = {};

  if (idsParam) {
    const ids = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 100);
    for (const id of ids) {
      const v = await getEffectiveStockFor(id);
      if (v !== null) stocks[id] = v;
    }
  } else if (
    countryParam &&
    COUNTRIES.some((c) => c.code === countryParam)
  ) {
    stocks = await getStocksForCountry(countryParam as CountryCode);
  } else {
    return Response.json(
      { ok: false, error: "missing_ids_or_country" },
      { status: 400 },
    );
  }

  return Response.json({ ok: true, stocks });
}
