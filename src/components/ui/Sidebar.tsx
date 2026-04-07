"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  companies: Array<{ slug: string; name: string }>;
}

export function Sidebar({ companies }: SidebarProps) {
  const { role } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  const isCompanyActive = (slug: string) =>
    pathname === `/dashboard/empresa/${slug}`;

  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        background: "#0A1628",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Brand */}
      <div style={{ padding: "0 8px 20px" }}>
        <p
          style={{
            margin: 0,
            color: "#00D4AA",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
          }}
        >
          {"// BRANEX.NAV"}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "linear-gradient(135deg, #00D4AA 0%, #0984E3 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "#060B18",
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          >
            B
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.04em" }}>
            BRANEX
          </span>
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
          margin: "0 8px 16px",
        }}
      />

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {role === "admin" ? (
          <>
            <NavItem
              href="/dashboard"
              label="Portafolio"
              icon="▤"
              active={isActive("/dashboard")}
            />

            {companies.length > 0 && (
              <>
                <p
                  style={{
                    margin: "12px 8px 4px",
                    color: "rgba(255,255,255,0.30)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  Empresas
                </p>
                {companies.map((company) => (
                  <NavItem
                    key={company.slug}
                    href={`/dashboard/empresa/${company.slug}`}
                    label={company.name}
                    icon="◈"
                    active={isCompanyActive(company.slug)}
                    secondary
                  />
                ))}
              </>
            )}
          </>
        ) : (
          <NavItem
            href="/dashboard"
            label="Mi empresa"
            icon="▤"
            active={isActive("/dashboard")}
          />
        )}
      </nav>

      {/* Footer label */}
      <div style={{ padding: "16px 8px 0" }}>
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 12,
          }}
        />
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.20)",
            fontSize: 10,
            letterSpacing: "0.08em",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          Go to Marketing © 2026
        </p>
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  secondary?: boolean;
}

function NavItem({ href, label, icon, active, secondary = false }: NavItemProps) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 8,
        textDecoration: "none",
        fontSize: secondary ? 13 : 14,
        fontWeight: active ? 600 : 400,
        color: active ? "#FFFFFF" : secondary ? "rgba(255,255,255,0.50)" : "rgba(255,255,255,0.70)",
        background: active ? "rgba(0,212,170,0.10)" : "transparent",
        borderLeft: active ? "2px solid #00D4AA" : "2px solid transparent",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: active ? "#00D4AA" : "rgba(255,255,255,0.30)",
          lineHeight: 1,
        }}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}
