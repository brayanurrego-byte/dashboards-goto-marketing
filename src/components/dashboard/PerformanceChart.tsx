import type { ChartPoint } from "@/types";

interface PerformanceChartProps {
  points: ChartPoint[];
}

export function PerformanceChart({ points }: PerformanceChartProps) {
  const maxValue = points.reduce((max, point) => Math.max(max, point.value), 0);

  return (
    <section style={{ marginBottom: 24 }}>
      <p
        style={{
          margin: 0,
          color: "#00D4AA",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.08em",
        }}
      >
        {"// PERFORMANCE.CHART"}
      </p>
      <div
        style={{
          marginTop: 12,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          padding: 16,
        }}
      >
        {points.length === 0 ? (
          <p style={{ margin: 0, color: "rgba(255,255,255,0.60)" }}>
            Sin datos temporales para graficar.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {points.map((point) => {
              const widthPct = maxValue > 0 ? Math.max((point.value / maxValue) * 100, 2) : 0;
              return (
                <div key={point.label} style={{ display: "grid", gap: 4 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.60)",
                    }}
                  >
                    <span>{point.label}</span>
                    <span>{new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 }).format(point.value)}</span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${widthPct}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, #00D4AA, #6C5CE7, #0984E3)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
