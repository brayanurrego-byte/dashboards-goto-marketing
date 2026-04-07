import Link from "next/link";
import type { Company } from "@/types";

const BRANEX = {
  deep: "#0F1B35",
  signal: "#00D4AA",
  data: "#0984E3",
  neural: "#6C5CE7",
  textSecondary: "rgba(255,255,255,0.60)",
  textTertiary: "rgba(255,255,255,0.35)",
  borderSubtle: "rgba(255,255,255,0.06)",
  warning: "#FECA57",
};

interface CompanyCardProps {
  company: Company;
  alertCount: number;
}

export function CompanyCard({ company, alertCount }: CompanyCardProps) {
  const tierLabel =
    company.tier === "starter"
      ? "Starter"
      : company.tier === "professional"
        ? "Professional"
        : "Enterprise";

  return (
    <article
      style={{
        position: "relative",
        borderRadius: 12,
        border: `1px solid ${BRANEX.borderSubtle}`,
        background: "rgba(255,255,255,0.02)",
        padding: 18,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: company.active ? BRANEX.signal : BRANEX.textTertiary,
        }}
      />
      <div style={{ paddingLeft: 8 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>{company.name}</h2>
            <p
              style={{
                margin: "6px 0 0",
                color: BRANEX.textSecondary,
                fontSize: 13,
              }}
            >
              {company.industry ?? "Sin industria definida"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: BRANEX.neural,
                border: `1px solid ${BRANEX.borderSubtle}`,
                borderRadius: 8,
                padding: "4px 8px",
                background: BRANEX.deep,
              }}
            >
              {tierLabel}
            </span>
            {alertCount > 0 ? (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: BRANEX.warning,
                  border: `1px solid ${BRANEX.borderSubtle}`,
                  borderRadius: 8,
                  padding: "4px 8px",
                  background: BRANEX.deep,
                }}
              >
                {alertCount} alerta{alertCount === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: BRANEX.textTertiary, fontSize: 12 }}>
            Estado:{" "}
            <strong style={{ color: company.active ? BRANEX.signal : BRANEX.textSecondary }}>
              {company.active ? "Activa" : "Inactiva"}
            </strong>
          </span>
          <Link
            href={`/dashboard/empresa/${company.slug}`}
            style={{
              color: BRANEX.data,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Ver dashboard →
          </Link>
        </div>
      </div>
    </article>
  );
}
