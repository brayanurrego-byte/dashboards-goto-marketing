"use client";

interface Metric {
  label: string;
  value: string;
  delta: number;
  icon: string;
}

interface LiveMetricsBarProps {
  metrics: Metric[];
  lastSync?: string;
}

export function LiveMetricsBar({ metrics, lastSync }: LiveMetricsBarProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
        gap: 12,
        marginBottom: 24,
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          style={{
            padding: "14px 16px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {m.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {m.label}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <strong style={{ fontSize: 20, fontFamily: "monospace", color: "#FFFFFF" }}>{m.value}</strong>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: m.delta > 0 ? "#00D4AA" : m.delta < 0 ? "#FF6B6B" : "rgba(255,255,255,0.40)",
                }}
              >
                {m.delta > 0 ? `↑ ${m.delta}%` : m.delta < 0 ? `↓ ${Math.abs(m.delta)}%` : "→"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
