/**
 * SSE: live KPI updates for the dashboard.
 *
 * Emits a `tick` ~every 1500ms with the base KPIs plus small random
 * variations to give a "pulse" effect. Optionally filtered by country.
 *
 * Query params:
 *   - country=CR
 */
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { kpis as BASE_KPIS } from "@/lib/mock-data/kpis";
import { sensors as ALL_SENSORS } from "@/lib/mock-data/sensors";
import { createSseStream, sleep } from "@/lib/realtime/sse";
import type { CountryCode } from "@/lib/countries";

export const dynamic = "force-dynamic";

interface KpiSnapshot {
  id: string;
  etiqueta: string;
  /** numeric value used for animation and comparison */
  numericValue: number;
  /** formatted display string */
  display: string;
  cambioPct: number;
  tendencia: "up" | "down" | "flat";
  descripcion: string;
}

interface DashboardTick {
  ts: string;
  country: CountryCode | null;
  kpis: KpiSnapshot[];
  alertasActivas: number;
  sensoresOnline: number;
  sensoresAlerta: number;
}

// Parse numeric value from a KPI valor like "$412,000", "6.4%", "47", "8.2 días"
function extractNumeric(valor: string): { num: number; render: (n: number) => string } {
  // Currency like "$412,000"
  const currency = valor.match(/^([^\d.,-]*)([\d,]+(?:\.\d+)?)/);
  if (currency && valor.startsWith("$")) {
    const num = Number(currency[2].replace(/,/g, ""));
    return {
      num,
      render: (n) => `$${Math.round(n).toLocaleString("es-MX")}`,
    };
  }
  // Percent
  if (valor.endsWith("%")) {
    const num = Number(valor.replace("%", ""));
    return { num, render: (n) => `${n.toFixed(1)}%` };
  }
  // Days suffix
  if (/días$/i.test(valor)) {
    const num = Number(valor.replace(/[^\d.]/g, ""));
    return { num, render: (n) => `${n.toFixed(1)} días` };
  }
  // Plain number
  const plainNum = Number(valor.replace(/[^\d.-]/g, ""));
  if (!Number.isNaN(plainNum)) {
    return { num: plainNum, render: (n) => Math.round(n).toLocaleString("es-MX") };
  }
  return { num: 0, render: () => valor };
}

const KPI_BASE = BASE_KPIS.map((k) => {
  const { num, render } = extractNumeric(k.valor);
  return {
    ...k,
    baseNum: num,
    render,
  };
});

function jitter(base: number, pct: number): number {
  const delta = base * pct * (Math.random() - 0.5);
  return base + delta;
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
  const country = (sp.get("country") as CountryCode | null) || null;

  const sensorsScope = country
    ? ALL_SENSORS.filter((s) => s.country === country)
    : ALL_SENSORS;

  const buildTick = (): DashboardTick => {
    const sensoresOnline = sensorsScope.filter((s) => s.estado === "activo").length;
    const sensoresAlerta = sensorsScope.filter((s) => s.estado === "alerta").length;
    return {
      ts: new Date().toISOString(),
      country,
      kpis: KPI_BASE.map((k) => {
        // Mermas should jitter less and trend downward; others up.
        const pct = k.id === "mermas" ? 0.03 : 0.04;
        const value = jitter(k.baseNum, pct);
        return {
          id: k.id,
          etiqueta: k.etiqueta,
          numericValue: value,
          display: k.render(value),
          cambioPct: k.cambioPct,
          tendencia: k.tendencia,
          descripcion: k.descripcion,
        };
      }),
      alertasActivas: 2 + Math.floor(Math.random() * 3),
      sensoresOnline,
      sensoresAlerta,
    };
  };

  return createSseStream<DashboardTick>(async (send, close) => {
    send("tick", buildTick());
    for (let i = 0; i < 5; i++) {
      await sleep(1500);
      send("tick", buildTick());
    }
    close();
  });
}
