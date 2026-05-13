"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Wifi, WifiOff } from "lucide-react";
import { useSSE } from "@/lib/realtime/useSSE";
import { useCountryStore } from "@/lib/stores/country-store";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { sensors as ALL_SENSORS } from "@/lib/mock-data/sensors";
import type { Sensor, SensorReading } from "@/lib/types";

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

const HISTORY_LEN = 24;

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function estadoBadge(estado: Sensor["estado"]) {
  if (estado === "activo") return <Badge variant="success">Activo</Badge>;
  if (estado === "alerta") return <Badge variant="warning">Alerta</Badge>;
  return <Badge variant="danger">Fuera de línea</Badge>;
}

function LiveChart({
  sensor,
  data,
  variable,
}: {
  sensor: Sensor;
  data: SensorReading[];
  variable: "temperatura" | "humedad";
}) {
  const [lo, hi] =
    variable === "temperatura"
      ? sensor.rangoOptimo.temperatura
      : sensor.rangoOptimo.humedad;
  const color = variable === "temperatura" ? "#15803D" : "#0EA5E9";
  const unit = variable === "temperatura" ? "°C" : "%";

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 14, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="timestamp"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtTime}
            minTickGap={32}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}${unit}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            labelFormatter={(v) =>
              new Date(v).toLocaleString("es-MX", {
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }
            formatter={(value) => [
              `${value}${unit}`,
              variable === "temperatura" ? "Temperatura" : "Humedad",
            ]}
          />
          <ReferenceArea
            y1={lo}
            y2={hi}
            fill={color}
            fillOpacity={0.07}
            stroke={color}
            strokeOpacity={0.15}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey={variable}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** SSR-safe mounted flag using useSyncExternalStore. */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function LiveSensorsView() {
  const { country } = useCountryStore();
  const mounted = useMounted();

  const url = mounted
    ? `/api/stream/sensors?country=${encodeURIComponent(country)}&limit=10`
    : null;
  const { data: tick, connected } = useSSE<SensorTick>(url, "tick");

  // Sensors visible (in the user's country).
  const scopedSensors = useMemo(() => {
    if (!mounted) return ALL_SENSORS.slice(0, 5);
    return ALL_SENSORS.filter((s) => s.country === country);
  }, [country, mounted]);

  // Per-sensor rolling history. We update it during render when a new tick
  // arrives — React supports this pattern (derived state) and it avoids
  // the cascading-render lint rule of useEffect+setState.
  const [history, setHistory] = useState<Record<string, SensorReading[]>>({});
  const [lastTs, setLastTs] = useState<string | null>(null);
  if (tick && tick.ts !== lastTs) {
    setLastTs(tick.ts);
    setHistory((prev) => {
      const next: Record<string, SensorReading[]> = { ...prev };
      for (const r of tick.readings) {
        const list = next[r.sensorId] ?? [];
        const updated = [
          ...list,
          {
            timestamp: r.timestamp,
            temperatura: r.temperatura,
            humedad: r.humedad,
          },
        ];
        next[r.sensorId] = updated.slice(-HISTORY_LEN);
      }
      return next;
    });
  }

  // Build a map of latest reading by id.
  const latestById = useMemo(() => {
    const map: Record<string, SensorTickReading> = {};
    if (tick) {
      for (const r of tick.readings) map[r.sensorId] = r;
    }
    return map;
  }, [tick]);

  // Featured = first 2 of scoped sensors.
  const featured = scopedSensors.slice(0, 2);

  return (
    <>
      {/* Top stats */}
      <div className="flex items-center gap-3 mb-4">
        {connected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Wifi size={12} />
            Streaming en vivo · {country}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <WifiOff size={12} />
            Desconectado · reintentando
          </span>
        )}
        {tick && (
          <span className="text-xs text-muted">
            Última actualización: {fmtTime(tick.ts)}
          </span>
        )}
      </div>

      {/* Featured live charts */}
      <h2 className="text-lg font-semibold text-ink mb-4">Gráficas en vivo</h2>
      <div className="grid lg:grid-cols-2 gap-4 mb-10">
        {featured.map((s) => {
          const latest = latestById[s.id];
          const seriesForChart =
            history[s.id] && history[s.id].length > 0
              ? history[s.id]
              : s.lecturas.slice(-HISTORY_LEN);
          const inRangeT = latest ? latest.inRangeTemp : true;
          const inRangeH = latest ? latest.inRangeHum : true;
          return (
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
                  {estadoBadge(latest ? latest.estado : s.estado)}
                </div>
              </div>

              <div className="flex items-baseline gap-4 mb-2">
                <div className="flex items-baseline gap-1.5">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={(latest?.temperatura ?? 0).toFixed(1)}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "text-xl font-semibold tabular-nums",
                        inRangeT ? "text-ink" : "text-amber-700",
                      )}
                    >
                      {(latest?.temperatura ?? s.lecturas[s.lecturas.length - 1]?.temperatura ?? 0).toFixed(1)}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs text-muted">°C</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={Math.round(latest?.humedad ?? 0)}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "text-xl font-semibold tabular-nums",
                        inRangeH ? "text-ink" : "text-amber-700",
                      )}
                    >
                      {Math.round(latest?.humedad ?? s.lecturas[s.lecturas.length - 1]?.humedad ?? 0)}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs text-muted">%</span>
                </div>
              </div>

              <p className="text-xs text-muted mb-1">Temperatura (°C)</p>
              <LiveChart sensor={s} data={seriesForChart} variable="temperatura" />
              <p className="text-xs text-muted mt-3 mb-1">Humedad (%)</p>
              <LiveChart sensor={s} data={seriesForChart} variable="humedad" />
            </div>
          );
        })}
      </div>

      {/* Sensors table */}
      <h2 className="text-lg font-semibold text-ink mb-4">Todos los sensores</h2>
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
              {scopedSensors.map((s) => {
                const latest = latestById[s.id];
                const fallback = s.lecturas[s.lecturas.length - 1];
                const tempV = latest?.temperatura ?? fallback.temperatura;
                const humV = latest?.humedad ?? fallback.humedad;
                const inRangeT =
                  tempV >= s.rangoOptimo.temperatura[0] &&
                  tempV <= s.rangoOptimo.temperatura[1];
                const inRangeH =
                  humV >= s.rangoOptimo.humedad[0] &&
                  humV <= s.rangoOptimo.humedad[1];
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
                        "px-6 py-3 text-right font-medium tabular-nums",
                        inRangeT ? "text-ink" : "text-amber-700",
                      )}
                    >
                      {tempV.toFixed(1)}°C
                    </td>
                    <td
                      className={cn(
                        "px-6 py-3 text-right font-medium tabular-nums",
                        inRangeH ? "text-ink" : "text-amber-700",
                      )}
                    >
                      {humV.toFixed(0)}%
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
                    <td className="px-6 py-3">
                      {estadoBadge(latest ? latest.estado : s.estado)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
