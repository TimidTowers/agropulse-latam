"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { mermasHistoricas } from "@/lib/mock-data/kpis";

export function MermasChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={mermasHistoricas}
          margin={{ top: 10, right: 14, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
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
