import type { NextRequest } from "next/server";
import { sensors, getSensorById, getRecentReadings } from "@/lib/mock-data/sensors";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const id = sp.get("id");
  const limit = sp.get("limit") ? Number(sp.get("limit")) : 24;

  if (id) {
    const s = getSensorById(id);
    if (!s) {
      return Response.json(
        { ok: false, error: "sensor_not_found" },
        { status: 404 },
      );
    }
    return Response.json({
      ok: true,
      sensor: {
        ...s,
        lecturas: getRecentReadings(s.id, limit),
      },
    });
  }

  return Response.json({
    ok: true,
    count: sensors.length,
    sensors: sensors.map((s) => ({
      ...s,
      lecturas: getRecentReadings(s.id, Math.min(limit, 6)),
    })),
  });
}
