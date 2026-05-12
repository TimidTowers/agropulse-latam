import type { NextRequest } from "next/server";
import { getForecast } from "@/lib/mock-data/forecast";
import type { CountryCode } from "@/lib/countries";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const producto = sp.get("producto") ?? undefined;
  const region = sp.get("region") ?? undefined;
  const country = (sp.get("country") ?? undefined) as CountryCode | undefined;
  const data = getForecast({ producto, region, country });
  return Response.json({ ok: true, count: data.length, forecast: data });
}
