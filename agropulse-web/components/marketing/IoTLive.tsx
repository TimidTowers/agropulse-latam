"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Thermometer,
  Droplets,
  Clock,
  Radio,
  ArrowRight,
  WifiOff,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useSSE } from "@/lib/realtime/useSSE";
import { cn } from "@/lib/utils";

interface IotPublicTick {
  ts: string;
  country: string;
  tempAvg: number;
  humAvg: number;
  vidaUtilDias: number;
  sensoresActivos: number;
  alertas: number;
  tempInRange: boolean;
  humInRange: boolean;
  history: { ts: string; temp: number; hum: number }[];
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  unit: string;
  value: number;
  precision?: number;
  good?: boolean;
  accent: "emerald" | "sky" | "amber" | "violet";
}

const accentClasses: Record<MetricCardProps["accent"], string> = {
  emerald: "from-emerald-50 to-white text-emerald-700 ring-emerald-100",
  sky: "from-sky-50 to-white text-sky-700 ring-sky-100",
  amber: "from-amber-50 to-white text-amber-700 ring-amber-100",
  violet: "from-violet-50 to-white text-violet-700 ring-violet-100",
};

function MetricCard({
  icon: Icon,
  label,
  unit,
  value,
  precision = 1,
  good = true,
  accent,
}: MetricCardProps) {
  const displayValue = Number.isFinite(value)
    ? value.toFixed(precision)
    : "—";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border-soft bg-gradient-to-br p-5 ring-1 shadow-sm",
        accentClasses[accent],
      )}
    >
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/80 backdrop-blur shadow-sm">
          <Icon size={16} />
        </div>
        {good ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Óptimo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Alerta
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-ink/70">
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-3xl font-semibold tracking-tight text-ink tabular-nums"
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
        <span className="text-sm font-medium text-ink/60">{unit}</span>
      </div>
    </div>
  );
}

export default function IoTLive() {
  const { data, connected } = useSSE<IotPublicTick>(
    "/api/stream/iot-public?country=CR",
    "tick",
  );

  const tempAvg = data?.tempAvg ?? 8.2;
  const humAvg = data?.humAvg ?? 88;
  const vidaUtil = data?.vidaUtilDias ?? 8.5;
  const sensoresActivos = data?.sensoresActivos ?? 5;
  const tempInRange = data?.tempInRange ?? true;
  const humInRange = data?.humInRange ?? true;
  const alertas = data?.alertas ?? 0;
  const history = data?.history ?? [];

  return (
    <section className="relative border-y border-border-soft bg-surface">
      <Container className="py-16 sm:py-20">
        <Reveal>
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3 inline-flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              IoT en vivo
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Datos reales,{" "}
              <span className="text-brand-gradient">cada 1.5 segundos.</span>
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              Esta es una muestra agregada de los sensores LoRaWAN desplegados
              en cámaras y transportes en Costa Rica. Cuando ingresas al
              dashboard ves cada sensor individualmente, con alertas y mapas.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-3xl border border-border-soft bg-gradient-to-br from-surface-2/30 via-surface to-surface p-6 sm:p-8 shadow-xl">
            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Red IoT AgroPulse
                  </p>
                  <p className="text-xs text-muted">
                    Promedios en vivo · Costa Rica
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {connected ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Conectado en vivo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    <WifiOff size={12} />
                    Desconectado · reintentando
                  </span>
                )}
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted">
                  <Radio size={12} />
                  {sensoresActivos} sensores activos
                </span>
              </div>
            </div>

            {/* Metric grid 2x2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <MetricCard
                icon={Thermometer}
                label="Temperatura"
                unit="°C"
                value={tempAvg}
                precision={1}
                good={tempInRange}
                accent={tempInRange ? "emerald" : "amber"}
              />
              <MetricCard
                icon={Droplets}
                label="Humedad"
                unit="%"
                value={humAvg}
                precision={0}
                good={humInRange}
                accent={humInRange ? "sky" : "amber"}
              />
              <MetricCard
                icon={Clock}
                label="Vida útil prom."
                unit="días"
                value={vidaUtil}
                precision={1}
                good={vidaUtil >= 7}
                accent="violet"
              />
              <MetricCard
                icon={Radio}
                label="Sensores activos"
                unit=""
                value={sensoresActivos}
                precision={0}
                good={alertas < 2}
                accent="emerald"
              />
            </div>

            {/* Sparkline */}
            <div className="mt-6 rounded-2xl border border-border-soft bg-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Tendencia · Últimos 15s
                  </p>
                  <p className="text-sm text-ink mt-0.5">
                    Temperatura promedio de la red
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={history}
                    margin={{ top: 6, right: 4, left: 0, bottom: 0 }}
                  >
                    <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#15803D"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted">
                Esto es solo el promedio. En el dashboard ves cada sensor,
                cada lote y cada alerta en detalle.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark transition-colors"
              >
                Ver dashboard completo
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
