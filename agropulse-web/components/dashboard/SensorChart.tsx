"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceArea,
} from "recharts";
import type { Sensor, SensorReading } from "@/lib/types";

interface SensorChartProps {
  sensor: Sensor;
  variable: "temperatura" | "humedad";
  live?: boolean;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SensorChart({
  sensor,
  variable,
  live = false,
}: SensorChartProps) {
  const [data, setData] = useState<SensorReading[]>(sensor.lecturas);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const newReading: SensorReading = {
          timestamp: new Date().toISOString(),
          temperatura: Number(
            (
              last.temperatura +
              (Math.random() - 0.5) * 0.6
            ).toFixed(2),
          ),
          humedad: Number(
            Math.min(
              99,
              Math.max(50, last.humedad + (Math.random() - 0.5) * 1.5),
            ).toFixed(2),
          ),
        };
        return [...prev.slice(1), newReading];
      });
    }, 4000);
    return () => clearInterval(id);
  }, [live]);

  const [lo, hi] =
    variable === "temperatura"
      ? sensor.rangoOptimo.temperatura
      : sensor.rangoOptimo.humedad;

  const color = variable === "temperatura" ? "#15803D" : "#0EA5E9";
  const unit = variable === "temperatura" ? "°C" : "%";

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 14, left: -10, bottom: 0 }}
        >
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
