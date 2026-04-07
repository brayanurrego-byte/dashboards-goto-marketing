"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const companies = [
  { slug: "maralta", label: "Maralta" },
  { slug: "transportes-nova", label: "Transportes Nova" },
  { slug: "legal-one", label: "Legal One" },
];

export function Sidebar() {
  const { role } = useAuth();

  return (
    <aside
      style={{
        width: 280,
        background: "#0F1B35",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: 18,
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#00D4AA",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.1em",
        }}
      >
        {"// BRANEX.NAV"}
      </p>
      <h2 style={{ marginTop: 8, marginBottom: 18, fontSize: 18 }}>BRANEX</h2>

      <nav style={{ display: "grid", gap: 8 }}>
        {role === "admin" ? (
          <>
            <Link href="/dashboard" style={{ color: "#FFFFFF", textDecoration: "none" }}>
              Portafolio
            </Link>
            {companies.map((company) => (
              <Link
                key={company.slug}
                href={`/dashboard/empresa/${company.slug}`}
                style={{ color: "rgba(255,255,255,0.60)", textDecoration: "none" }}
              >
                {company.label}
              </Link>
            ))}
          </>
        ) : (
          <Link
            href="/dashboard"
            style={{ color: "#FFFFFF", textDecoration: "none" }}
          >
            Mi empresa
          </Link>
        )}
      </nav>
    </aside>
  );
}
