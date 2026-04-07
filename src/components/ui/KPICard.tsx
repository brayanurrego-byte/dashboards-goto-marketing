interface KPICardProps {
  label: string;
  value: number;
  unit?: string | null;
  deltaPct?: number | null;
}

function formatValue(value: number, unit?: string | null): string {
  if (unit === "cop") {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (unit === "%") {
    return `${value.toFixed(2)}%`;
  }
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function KPICard({ label, value, unit, deltaPct }: KPICardProps) {
  const semanticColor =
    deltaPct == null ? "#0984E3" : deltaPct > 0 ? "#00D4AA" : deltaPct < 0 ? "#FF6B6B" : "#0984E3";
  const deltaText =
    deltaPct == null ? "Sin comparación" : `${deltaPct > 0 ? "↑" : deltaPct < 0 ? "↓" : "→"} ${Math.abs(deltaPct).toFixed(1)}%`;

  return (
    <article
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        padding: 16,
        borderLeft: `4px solid ${semanticColor}`,
      }}
    >
      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: 11,
        }}
      >
        {label}
      </p>
      <strong
        style={{
          marginTop: 6,
          display: "block",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 30,
          lineHeight: 1.2,
          color: "#FFFFFF",
        }}
      >
        {formatValue(value, unit)}
      </strong>
      <p
        style={{
          margin: "8px 0 0",
          color: semanticColor,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {deltaText}
      </p>
    </article>
  );
}
