"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ventasMensuales } from "@/lib/mock-data/orders";

export function SalesChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={ventasMensuales}
          margin={{ top: 10, right: 14, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#15803D" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#15803D" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            cursor={{ stroke: "#15803D", strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(value) => [
              `$${Number(value).toLocaleString("es-MX")} MXN`,
              "Ventas",
            ]}
          />
          <Area
            type="monotone"
            dataKey="ventas"
            stroke="#15803D"
            strokeWidth={2}
            fill="url(#salesGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
