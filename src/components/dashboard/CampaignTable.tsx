import type { CampaignRow } from "@/types";

interface CampaignTableProps {
  rows: CampaignRow[];
}

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CampaignTable({ rows }: CampaignTableProps) {
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
        {"// CAMPAIGNS.TABLE"}
      </p>
      <div
        style={{
          marginTop: 12,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          overflowX: "auto",
        }}
      >
        {rows.length === 0 ? (
          <p style={{ margin: 0, padding: 16, color: "rgba(255,255,255,0.60)" }}>
            No hay campañas disponibles para este periodo.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Campaña", "Plataforma", "Inversión", "Clics", "Impresiones", "ROAS"].map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.platform}-${row.campaignName}`} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "12px 14px", color: "#FFFFFF" }}>{row.campaignName}</td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.60)" }}>
                    {row.platform}
                    {row.sourceBadge ? (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 11,
                          color: "#FECA57",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                        }}
                      >
                        {row.sourceBadge}
                      </span>
                    ) : null}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#FFFFFF" }}>{formatCOP(row.spend)}</td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.60)" }}>{row.clicks}</td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.60)" }}>{row.impressions}</td>
                  <td style={{ padding: "12px 14px", color: "#00D4AA" }}>
                    {row.roas == null ? "-" : `${row.roas.toFixed(2)}x`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
