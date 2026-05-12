import type { Metadata } from "next";
import { Bell, Radio, BatteryLow, Wifi, WifiOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SensorChart } from "@/components/dashboard/SensorChart";
import { sensors } from "@/lib/mock-data/sensors";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sensores IoT — AgroPulse",
};

function estadoBadge(estado: string) {
  if (estado === "activo")
    return <Badge variant="success">Activo</Badge>;
  if (estado === "alerta")
    return <Badge variant="warning">Alerta</Badge>;
  return <Badge variant="danger">Fuera de línea</Badge>;
}

export default function SensoresPage() {
  const featured = sensors.slice(0, 2);

  return (
    <main className="bg-background min-h-screen">
      <header className="h-16 border-b border-border-soft bg-surface flex items-center px-6 sticky top-0 z-30">
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-ink">Sensores IoT</h1>
          <p className="text-xs text-muted">
            Monitoreo en tiempo real de tu red LoRaWAN
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-emerald-700 mr-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {sensors.filter((s) => s.estado === "activo").length} sensores online
        </span>
        <button
          aria-label="Notificaciones"
          className="relative h-9 w-9 grid place-items-center rounded-lg border border-border-soft hover:bg-surface-2"
        >
          <Bell size={16} />
        </button>
      </header>

      <Container size="wide" className="py-8">
        {/* Top stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-border-soft bg-surface p-5">
            <Radio size={18} className="text-brand" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">
              Total sensores
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {sensors.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5">
            <Wifi size={18} className="text-emerald-700" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">
              Activos
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {sensors.filter((s) => s.estado === "activo").length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5">
            <WifiOff size={18} className="text-red-600" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">
              Fuera de línea
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {sensors.filter((s) => s.estado === "fuera de línea").length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface p-5">
            <BatteryLow size={18} className="text-amber-700" />
            <p className="mt-3 text-xs uppercase tracking-wider text-muted">
              Batería &lt;30%
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {sensors.filter((s) => s.bateria < 30).length}
            </p>
          </div>
        </div>

        {/* Featured live charts */}
        <h2 className="text-lg font-semibold text-ink mb-4">
          Gráficas en vivo
        </h2>
        <div className="grid lg:grid-cols-2 gap-4 mb-10">
          {featured.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-border-soft bg-surface p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted font-mono">{s.id}</p>
                  <h3 className="font-semibold text-ink">{s.nombre}</h3>
                  <p className="text-xs text-muted mt-0.5">{s.ubicacion}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En vivo
                  </span>
                  {estadoBadge(s.estado)}
                </div>
              </div>
              <div className="mb-3">
                <p className="text-xs text-muted mb-1">Temperatura (°C)</p>
                <SensorChart sensor={s} variable="temperatura" live />
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Humedad (%)</p>
                <SensorChart sensor={s} variable="humedad" live />
              </div>
            </div>
          ))}
        </div>

        {/* Sensors table */}
        <h2 className="text-lg font-semibold text-ink mb-4">
          Todos los sensores
        </h2>
        <section className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border-soft bg-surface-2/30">
                <tr className="text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">Ubicación</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium text-right">Temp.</th>
                  <th className="px-6 py-3 font-medium text-right">Hum.</th>
                  <th className="px-6 py-3 font-medium text-right">Batería</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {sensors.map((s) => {
                  const ultima = s.lecturas[s.lecturas.length - 1];
                  const inRangeT =
                    ultima.temperatura >= s.rangoOptimo.temperatura[0] &&
                    ultima.temperatura <= s.rangoOptimo.temperatura[1];
                  const inRangeH =
                    ultima.humedad >= s.rangoOptimo.humedad[0] &&
                    ultima.humedad <= s.rangoOptimo.humedad[1];
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-border-soft last:border-0"
                    >
                      <td className="px-6 py-3 font-mono text-xs">{s.id}</td>
                      <td className="px-6 py-3 text-ink">{s.nombre}</td>
                      <td className="px-6 py-3 text-muted">{s.ubicacion}</td>
                      <td className="px-6 py-3 text-muted capitalize text-xs">
                        {s.tipo}
                      </td>
                      <td
                        className={cn(
                          "px-6 py-3 text-right font-medium",
                          inRangeT ? "text-ink" : "text-amber-700",
                        )}
                      >
                        {ultima.temperatura.toFixed(1)}°C
                      </td>
                      <td
                        className={cn(
                          "px-6 py-3 text-right font-medium",
                          inRangeH ? "text-ink" : "text-amber-700",
                        )}
                      >
                        {ultima.humedad.toFixed(0)}%
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5",
                            s.bateria < 30 ? "text-red-600" : "text-muted",
                          )}
                        >
                          <span className="inline-block h-2 w-8 rounded-sm bg-surface-2 overflow-hidden">
                            <span
                              className={cn(
                                "block h-full",
                                s.bateria > 50
                                  ? "bg-emerald-500"
                                  : s.bateria > 25
                                    ? "bg-amber-500"
                                    : "bg-red-500",
                              )}
                              style={{ width: `${s.bateria}%` }}
                            />
                          </span>
                          {s.bateria}%
                        </span>
                      </td>
                      <td className="px-6 py-3">{estadoBadge(s.estado)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
    </main>
  );
}
