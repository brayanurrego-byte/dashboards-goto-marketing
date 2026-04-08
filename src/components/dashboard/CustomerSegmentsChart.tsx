"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import type { CustomerSegment } from "@/lib/demo";
import { formatCOP } from "@/lib/demo";

interface CustomerSegmentsChartProps {
  segments: CustomerSegment[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as CustomerSegment;
  return (
    <div style={{ background: "#0F1B35", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "12px 16px", fontSize: 12 }}>
      <p style={{ margin: "0 0 8px", color: d.color, fontWeight: 700 }}>{d.segment}</p>
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.50)" }}>Clientes</span>
          <strong style={{ color: "#FFFFFF" }}>{d.count.toLocaleString("es-CO")}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.50)" }}>LTV</span>
          <strong style={{ color: d.color }}>{formatCOP(d.ltv)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.50)" }}>Ticket prom.</span>
          <strong style={{ color: "#FFFFFF" }}>{formatCOP(d.aov)}</strong>
        </div>
        {d.retention > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
            <span style={{ color: "rgba(255,255,255,0.50)" }}>Retención</span>
            <strong style={{ color: "#00D4AA" }}>{d.retention}%</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export function CustomerSegmentsChart({ segments }: CustomerSegmentsChartProps) {
  const totalClients = segments.reduce((s, d) => s + d.count, 0);

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
          {"// CUSTOMER.SEGMENTS"}
        </p>
        <h3 style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 600 }}>Segmentos de Clientes</h3>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.40)" }}>
          Total base: <strong style={{ color: "#FFFFFF" }}>{totalClients.toLocaleString("es-CO")}</strong> clientes
        </p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={segments} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="segment" tick={{ fill: "rgba(255,255,255,0.50)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.40)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="count" name="Clientes" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {segments.map((entry) => (
              <Cell key={entry.segment} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* LTV comparison */}
      <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
        <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.30)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          LTV por segmento
        </p>
        {segments.map((seg) => {
          const maxLTV = Math.max(...segments.map((s) => s.ltv));
          return (
            <div key={seg.segment} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.50)", minWidth: 140, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {seg.segment}
              </span>
              <div style={{ flex: 1, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                <div
                  style={{
                    width: `${(seg.ltv / maxLTV) * 100}%`,
                    height: "100%",
                    borderRadius: 99,
                    background: seg.color,
                  }}
                />
              </div>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: seg.color, minWidth: 56, textAlign: "right" }}>
                {formatCOP(seg.ltv)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
