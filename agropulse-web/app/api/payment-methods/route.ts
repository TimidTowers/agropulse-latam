import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { paymentMethodsDb } from "@/lib/db/store";
import { COUNTRIES, type CountryCode } from "@/lib/countries";

function isCountryCode(value: string | null): value is CountryCode {
  if (!value) return false;
  return COUNTRIES.some((c) => c.code === value);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const queryCountry = url.searchParams.get("country");
  let country: CountryCode | null = isCountryCode(queryCountry) ? queryCountry : null;

  if (!country) {
    const session = await auth();
    if (session?.user?.country) country = session.user.country;
  }

  if (!country) {
    return Response.json(
      { ok: false, error: "country_required" },
      { status: 400 },
    );
  }

  const methods = await paymentMethodsDb.listByCountry(country);
  return Response.json({ ok: true, country, methods });
}
