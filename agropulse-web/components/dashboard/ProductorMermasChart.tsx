"use client";

import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  /** seed determinista del productor (strHash) */
  seed: number;
}

const MESES = ["Ene", "Feb", "Mar", "Abr", "May"];

function buildMermas(seed: number) {
  // Mermas bajando: empieza 14% y baja a 6% con ruido seedado.
  return MESES.map((mes, i) => {
    const base = 14 - i * 1.8;
    const noise = ((seed * (i + 2)) % 11) / 50 - 0.1;
    const mermas = Math.max(3, Number((base + noise).toFixed(1)));
    const objetivo = Math.max(4, 10 - i);
    return { mes, mermas, objetivo };
  });
}

export function ProductorMermasChart({ seed }: Props) {
  const data = buildMermas(seed);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 14, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="mes"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(value, name) => [
              `${value}%`,
              name === "mermas" ? "Mermas reales" : "Objetivo",
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 6 }}
            iconType="circle"
            formatter={(v) => (v === "mermas" ? "Mermas reales" : "Objetivo")}
          />
          <Bar
            dataKey="mermas"
            fill="#15803D"
            radius={[8, 8, 0, 0]}
            barSize={36}
          />
          <Line
            type="monotone"
            dataKey="objetivo"
            stroke="#DC2626"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
