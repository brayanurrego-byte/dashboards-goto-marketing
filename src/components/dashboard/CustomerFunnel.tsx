"use client";

import type { FunnelStage } from "@/lib/demo";

interface CustomerFunnelProps {
  stages: FunnelStage[];
  title?: string;
}

export function CustomerFunnel({ stages, title = "Embudo de Conversión" }: CustomerFunnelProps) {
  const maxCount = stages[0]?.count ?? 1;

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: 0, color: "#00D4AA", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>
          // CONVERSION.FUNNEL
        </p>
        <h3 style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 600 }}>{title}</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {stages.map((stage, i) => {
          const widthPct = Math.max((stage.count / maxCount) * 100, 8);
          const dropOff = i > 0 ? (((stages[i - 1].count - stage.count) / stages[i - 1].count) * 100).toFixed(1) : null;

          return (
            <div key={stage.stage}>
              {dropOff !== null && (
                <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>
                    ▼ {dropOff}% dropout
                  </span>
                </div>
              )}
              <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: `${widthPct}%`,
                    minWidth: "30%",
                    background: `linear-gradient(90deg, ${stage.color}22, ${stage.color}44)`,
                    border: `1px solid ${stage.color}55`,
                    borderRadius: 6,
                    padding: "8px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "width 0.3s ease",
                  }}
                >
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.80)", fontWeight: 500 }}>
                    {stage.stage}
                  </span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", fontFamily: "monospace" }}>
                      {stage.count.toLocaleString("es-CO")}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: stage.color,
                        background: `${stage.color}22`,
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontFamily: "monospace",
                        fontWeight: 700,
                      }}
                    >
                      {stage.pct.toFixed(stage.pct < 1 ? 2 : 1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div
        style={{
          marginTop: 16,
          padding: "10px 14px",
          borderRadius: 8,
          background: "rgba(0,212,170,0.06)",
          border: "1px solid rgba(0,212,170,0.15)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.60)" }}>
          Tasa de conversión total
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#00D4AA", fontFamily: "monospace" }}>
          {stages.length > 1
            ? `${((stages[stages.length - 1].count / stages[0].count) * 100).toFixed(2)}%`
            : "—"}
        </span>
      </div>
    </div>
  );
}
