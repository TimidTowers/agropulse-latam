import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Radio, BatteryLow, Wifi, WifiOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { sensors } from "@/lib/mock-data/sensors";
import { LiveSensorsView } from "@/components/realtime/LiveSensorsView";
import { LiveBadge } from "@/components/realtime/LiveKpiCards";
import { requireProductorDashboard } from "@/lib/dashboard-guard";
import { CURRENCIES, resolveUserCurrency } from "@/lib/currency/rates";

export const metadata: Metadata = {
  title: "Sensores IoT — AgroPulse",
};

export default async function SensoresPage() {
  const user = await requireProductorDashboard("/dashboard/sensores");
  const currency = resolveUserCurrency(user.preferredCurrency, user.country);
  const userCurrencyInfo = CURRENCIES[currency];

  // Sólo sensores del país del productor
  const mySensors = sensors.filter((s) => s.country === user.country);

  return (
    <main className="bg-background min-h-screen">
      <header className="h-16 border-b border-border-soft bg-surface flex items-center px-6 sticky top-0 z-30">
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div>
            <h1 className="text-base font-semibold text-ink">Sensores IoT</h1>
            <p className="text-xs text-muted">
              Tu red LoRaWAN en {user.country}
            </p>
          </div>
          <LiveBadge />
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-emerald-700 mr-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {mySensors.filter((s) => s.estado === "activo").length} sensores online
        </span>
        <Link
          href="/perfil#currency"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink border border-border-soft rounded-lg px-2.5 py-1 hover:bg-surface-2 mr-3"
          title="Cambiar moneda preferida"
        >
          <span aria-hidden>{userCurrencyInfo.flag}</span>
          <span className="font-mono">{currency}</span>
        </Link>
        <button
          aria-label="Notificaciones"
          className="relative h-9 w-9 grid place-items-center rounded-lg border border-border-soft hover:bg-surface-2"
        >
          <Bell size={16} />
        </button>
      </header>

      <Container size="wide" className="py-8">
        {/* Top stats — solo del país del productor */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-border-soft bg-surface p-5">
            <Radio size={18} className="text-brand" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">
              Total sensores
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {mySensors.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5">
            <Wifi size={18} className="text-emerald-700" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">
              Activos
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {mySensors.filter((s) => s.estado === "activo").length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5">
            <WifiOff size={18} className="text-red-600" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">
              Fuera de línea
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {mySensors.filter((s) => s.estado === "fuera de línea").length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5">
            <BatteryLow size={18} className="text-amber-700" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">
              Batería &lt;30%
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {mySensors.filter((s) => s.bateria < 30).length}
            </p>
          </div>
        </div>

        {/* Live SSE-powered sensor view */}
        <LiveSensorsView />
      </Container>
    </main>
  );
}
