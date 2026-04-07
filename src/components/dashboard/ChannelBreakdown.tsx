"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import type { ChannelData } from "@/lib/demo";
import { formatCOP } from "@/lib/demo";

interface ChannelBreakdownProps {
  data: ChannelData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as ChannelData;
  return (
    <div
      style={{
        background: "#0F1B35",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 10,
        padding: "12px 16px",
        fontSize: 12,
        minWidth: 170,
      }}
    >
      <p style={{ margin: "0 0 8px", color: d.color, fontWeight: 700 }}>{label}</p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
        <span style={{ color: "rgba(255,255,255,0.60)" }}>Ingresos</span>
        <strong style={{ color: "#FFFFFF" }}>{formatCOP(d.revenue)}</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
        <span style={{ color: "rgba(255,255,255,0.60)" }}>Leads</span>
        <strong style={{ color: "#FFFFFF" }}>{d.leads.toLocaleString("es-CO")}</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ color: "rgba(255,255,255,0.60)" }}>Participación</span>
        <strong style={{ color: d.color }}>{d.pct}%</strong>
      </div>
    </div>
  );
};

export function ChannelBreakdown({ data }: ChannelBreakdownProps) {
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        padding: "20px 20px 12px",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, color: "#00D4AA", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>
          // CHANNEL.BREAKDOWN
        </p>
        <h3 style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 600 }}>Ingresos por Canal</h3>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.40)" }}>
          Total: <strong style={{ color: "#FFFFFF" }}>{formatCOP(total)}</strong>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => formatCOP(v)} tick={{ fill: "rgba(255,255,255,0.40)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="channel" tick={{ fill: "rgba(255,255,255,0.60)", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={20}>
            {data.map((entry) => (
              <Cell key={entry.channel} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", marginTop: 12 }}>
        {data.map((d) => (
          <div key={d.channel} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
            <span style={{ color: "rgba(255,255,255,0.50)" }}>{d.channel}</span>
            <span style={{ color: d.color, fontWeight: 600 }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
