import { CompanyCard } from "@/components/dashboard/CompanyCard";
import type { Company } from "@/types";

interface CompanyListProps {
  companies: Company[];
  alertCounts: Record<string, number>;
}

export function CompanyList({ companies, alertCounts }: CompanyListProps) {
  if (companies.length === 0) {
    return (
      <section style={{ marginBottom: 32 }}>
        <p
          style={{
            margin: 0,
            color: "#00D4AA",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.08em",
          }}
        >
          {"// COMPANIES.LIST"}
        </p>
        <h2 style={{ margin: "8px 0 12px", fontSize: 20 }}>Portafolio</h2>
        <div
          style={{
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            padding: 24,
            color: "rgba(255,255,255,0.60)",
          }}
        >
          No hay empresas registradas para esta agencia. Cuando agregues empresas en
          Supabase, aparecerán aquí.
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: 32 }}>
      <p
        style={{
          margin: 0,
          color: "#00D4AA",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.08em",
        }}
      >
        {"// COMPANIES.LIST"}
      </p>
      <h2 style={{ margin: "8px 0 16px", fontSize: 20 }}>Portafolio</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            alertCount={alertCounts[company.id] ?? 0}
          />
        ))}
      </div>
    </section>
  );
}
