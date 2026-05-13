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
import {
  CURRENCIES,
  USD_RATES,
  formatCurrency,
  type CurrencyCode,
} from "@/lib/currency/rates";

interface Props {
  currency: CurrencyCode;
  /** seed determinista del productor (strHash de su user.id) */
  seed: number;
}

const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function buildSeries(seed: number, currency: CurrencyCode) {
  const baseUSD = 18_000 + (seed % 9_000); // 18k–27k USD
  return MESES.map((mes, i) => {
    const growth = Math.pow(1.04, i);
    const noise = ((seed * (i + 1)) % 13) / 200 - 0.03;
    const usdValue = baseUSD * growth * (1 + noise);
    const value = usdValue * USD_RATES[currency];
    return { mes, ventas: Math.round(value) };
  });
}

export function ProductorSalesChart({ currency, seed }: Props) {
  const data = buildSeries(seed, currency);
  const info = CURRENCIES[currency];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 14, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#15803D" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#15803D" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(v) => `${info.symbol}${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            cursor={{
              stroke: "#15803D",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(value) => [
              formatCurrency(Number(value), currency),
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
