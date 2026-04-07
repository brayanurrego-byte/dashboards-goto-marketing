"use client";

import type { PipelineStage } from "@/lib/demo";
import { formatCOP } from "@/lib/demo";

interface SalesPipelineProps {
  stages: PipelineStage[];
}

function ProbabilityBar({ value }: { value: number }) {
  const color = value >= 80 ? "#00D4AA" : value >= 50 ? "#FECA57" : "#FF7675";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ width: `${value}%`, height: "100%", borderRadius: 99, background: color }} />
      </div>
      <span style={{ fontSize: 10, color, fontFamily: "monospace", minWidth: 28 }}>{value}%</span>
    </div>
  );
}

export function SalesPipeline({ stages }: SalesPipelineProps) {
  const totalValue = stages
    .flatMap((s) => s.deals)
    .reduce((sum, d) => sum + d.value * (d.probability / 100), 0);

  const totalDeals = stages.flatMap((s) => s.deals).length;

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        padding: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ margin: 0, color: "#00D4AA", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>
            // SALES.PIPELINE
          </p>
          <h3 style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 600 }}>Pipeline de Ventas</h3>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.40)" }}>Negocios</p>
            <strong style={{ color: "#FFFFFF", fontSize: 18, fontFamily: "monospace" }}>{totalDeals}</strong>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.40)" }}>Valor ponderado</p>
            <strong style={{ color: "#00D4AA", fontSize: 18, fontFamily: "monospace" }}>{formatCOP(totalValue)}</strong>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
          gap: 10,
          overflowX: "auto",
        }}
      >
        {stages.map((stage) => {
          const stageTotal = stage.deals.reduce((s, d) => s + d.value, 0);
          return (
            <div
              key={stage.id}
              style={{
                minWidth: 180,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {/* Stage header */}
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${stage.color}18`,
                  border: `1px solid ${stage.color}40`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: stage.color, letterSpacing: "0.04em" }}>
                    {stage.label}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.40)" }}>
                    {stage.deals.length} negocio{stage.deals.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.60)" }}>
                  {formatCOP(stageTotal)}
                </span>
              </div>

              {/* Deal cards */}
              {stage.deals.map((deal) => (
                <div
                  key={deal.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.3 }}>
                    {deal.name}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.40)" }}>{deal.contact}</span>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: stage.color, fontWeight: 700 }}>
                      {formatCOP(deal.value)}
                    </span>
                  </div>
                  <ProbabilityBar value={deal.probability} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.30)" }}>
                    {deal.days}d en pipeline
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
