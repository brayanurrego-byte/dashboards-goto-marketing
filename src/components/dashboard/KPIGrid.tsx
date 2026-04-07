import { KPICard } from "@/components/ui/KPICard";
import type { KPIViewItem } from "@/types";

interface KPIGridProps {
  items: KPIViewItem[];
}

export function KPIGrid({ items }: KPIGridProps) {
  if (items.length === 0) {
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
          {"// KPI.GRID"}
        </p>
        <div
          style={{
            marginTop: 10,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            padding: 20,
            color: "rgba(255,255,255,0.60)",
          }}
        >
          No hay KPIs sincronizados para esta empresa.
        </div>
      </section>
    );
  }

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
        {"// KPI.GRID"}
      </p>
      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {items.map((item) => (
          <KPICard
            key={item.metricKey}
            label={item.label}
            value={item.value}
            unit={item.unit}
            deltaPct={item.deltaPct}
          />
        ))}
      </div>
    </section>
  );
}
