"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { MonthlyRevenue } from "@/lib/demo";
import { formatCOP } from "@/lib/demo";

interface RevenueLineChartProps {
  data: MonthlyRevenue[];
  showOrders?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0F1B35",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 10,
        padding: "12px 16px",
        fontSize: 12,
        minWidth: 180,
      }}
    >
      <p style={{ margin: "0 0 8px", color: "#00D4AA", fontFamily: "monospace", letterSpacing: "0.06em" }}>
        {label}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          <span style={{ color: "rgba(255,255,255,0.60)" }}>{entry.name}</span>
          <span style={{ color: entry.color, fontWeight: 600 }}>
            {entry.name === "Órdenes" ? entry.value : formatCOP(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export function RevenueLineChart({ data, showOrders = false }: RevenueLineChartProps) {
  const avg = data.reduce((s, d) => s + d.revenue, 0) / data.length;

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        padding: "20px 20px 12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ margin: 0, color: "#00D4AA", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>
            // REVENUE.TIMELINE
          </p>
          <h3 style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 600 }}>Ingresos por Mes</h3>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.40)" }}>
            Promedio: <strong style={{ color: "#FFFFFF" }}>{formatCOP(avg)}</strong>
          </span>
          <span style={{ color: "rgba(255,255,255,0.40)" }}>
            Pico: <strong style={{ color: "#00D4AA" }}>{formatCOP(Math.max(...data.map(d => d.revenue)))}</strong>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(255,255,255,0.40)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatCOP(v)}
            tick={{ fill: "rgba(255,255,255,0.40)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.50)", paddingTop: 8 }}
          />
          <ReferenceLine y={avg} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
          {showOrders && (
            <Bar dataKey="orders" name="Órdenes" fill="rgba(108,92,231,0.3)" radius={[4, 4, 0, 0]} yAxisId={0} />
          )}
          <Line
            type="monotone"
            dataKey="lastYear"
            name="Año anterior"
            stroke="rgba(255,255,255,0.20)"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 4"
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Objetivo"
            stroke="#6C5CE7"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Ingresos"
            stroke="#00D4AA"
            strokeWidth={2.5}
            dot={{ fill: "#00D4AA", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 6, fill: "#00D4AA", stroke: "#060B18", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
