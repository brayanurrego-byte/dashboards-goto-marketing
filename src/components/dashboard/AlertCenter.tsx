import type { AlertWithCompany } from "@/types";

const severityColor: Record<string, string> = {
  low: "#0984E3",
  medium: "#FECA57",
  high: "#00CEFF",
  critical: "#FF6B6B",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

interface AlertCenterProps {
  alerts: AlertWithCompany[];
}

export function AlertCenter({ alerts }: AlertCenterProps) {
  return (
    <section>
      <p
        style={{
          margin: 0,
          color: "#00D4AA",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.08em",
        }}
      >
        {"// ALERTS.CENTER"}
      </p>
      <h2 style={{ margin: "8px 0 16px", fontSize: 20 }}>Centro de alertas</h2>

      {alerts.length === 0 ? (
        <div
          style={{
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            padding: 24,
            color: "rgba(255,255,255,0.60)",
          }}
        >
          No hay alertas recientes en el portafolio. Las variaciones críticas
          aparecerán aquí cuando el motor de sincronización las genere.
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: 12,
          }}
        >
          {alerts.map((alert) => {
            const companyEmbed = alert.companies;
            const companyName = Array.isArray(companyEmbed)
              ? companyEmbed[0]?.name ?? "Empresa"
              : companyEmbed?.name ?? "Empresa";
            const accent = severityColor[alert.severity] ?? "#0984E3";
            return (
              <li
                key={alert.id}
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  padding: "14px 16px",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.60)",
                    }}
                  >
                    {companyName}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: accent,
                    }}
                  >
                    {alert.severity} · {alert.type}
                  </span>
                </div>
                <p style={{ margin: 0, color: "#FFFFFF", lineHeight: 1.45 }}>
                  {alert.message}
                </p>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {formatDate(alert.created_at)}
                  {alert.read ? " · Leída" : ""}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
