import { CompanyList } from "@/components/dashboard/CompanyList";
import { AlertCenter } from "@/components/dashboard/AlertCenter";
import { createServerClient } from "@/lib/supabase/server";
import type { AlertWithCompany, AuthMetadata, Company } from "@/types";
import { redirect } from "next/navigation";
import { getDemoData, formatCOP } from "@/lib/demo";

function countAlertsByCompany(alerts: Pick<AlertWithCompany, "company_id">[]): Record<string, number> {
  return alerts.reduce<Record<string, number>>((acc, row) => {
    acc[row.company_id] = (acc[row.company_id] ?? 0) + 1;
    return acc;
  }, {});
}

const COMPANY_SLUGS = ["maralta", "transportes-nova", "legal-one"];

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const metadata = user.user_metadata as AuthMetadata;
  if (metadata.role !== "admin") {
    const { data: companyRow } = await supabase
      .from("companies")
      .select("slug")
      .eq("id", metadata.company_id ?? "")
      .maybeSingle();
    redirect(`/dashboard/empresa/${companyRow?.slug ?? "empresa"}`);
  }

  const { data: companiesData } = await supabase
    .from("companies")
    .select("id, agency_id, name, slug, tier, industry, active, created_at")
    .eq("agency_id", metadata.agency_id)
    .order("name");

  const companies: Company[] = (companiesData ?? []) as Company[];
  const companyIds = companies.map((c) => c.id);

  let alerts: AlertWithCompany[] = [];
  if (companyIds.length > 0) {
    const { data: alertsData } = await supabase
      .from("alerts")
      .select("id, company_id, type, severity, message, read, created_at, companies ( name, slug )")
      .in("company_id", companyIds)
      .order("created_at", { ascending: false })
      .limit(80);
    alerts = (alertsData ?? []) as AlertWithCompany[];
  }

  const alertCounts = countAlertsByCompany(alerts);
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  // Aggregate demo metrics across portfolio
  const allRevenue = COMPANY_SLUGS.reduce((sum, slug) => {
    const d = getDemoData(slug);
    const lastMonth = d.monthlyRevenue[d.monthlyRevenue.length - 1];
    return sum + (lastMonth?.revenue ?? 0);
  }, 0);

  const allRevenuePrev = COMPANY_SLUGS.reduce((sum, slug) => {
    const d = getDemoData(slug);
    const prevMonth = d.monthlyRevenue[d.monthlyRevenue.length - 2];
    return sum + (prevMonth?.revenue ?? 0);
  }, 0);

  const revenueGrowth = allRevenuePrev > 0
    ? (((allRevenue - allRevenuePrev) / allRevenuePrev) * 100).toFixed(1)
    : "—";

  const totalPipelineValue = COMPANY_SLUGS.reduce((sum, slug) => {
    const d = getDemoData(slug);
    return sum + d.pipeline.flatMap((s) => s.deals).reduce((s2, deal) => s2 + deal.value * (deal.probability / 100), 0);
  }, 0);

  const totalLeads = COMPANY_SLUGS.reduce((sum, slug) => {
    const d = getDemoData(slug);
    return sum + d.channels.reduce((s2, ch) => s2 + ch.leads, 0);
  }, 0);

  const now = new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", paddingBottom: 48 }}>

      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, color: "#00D4AA", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>
          // ADMIN.PORTFOLIO
        </p>
        <h1 style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Centro de Control
        </h1>
        <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
          {now} · Vista consolidada del portafolio Go to Marketing
        </p>
      </div>

      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #00D4AA, #6C5CE7, #0984E3, transparent)", marginBottom: 28 }} />

      {/* ── Portfolio KPIs ────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Ingresos Portafolio",
            value: formatCOP(allRevenue),
            delta: `↑ ${revenueGrowth}%`,
            deltaColor: "#00D4AA",
            icon: "💰",
            sub: "vs mes anterior",
          },
          {
            label: "Pipeline Ponderado",
            value: formatCOP(totalPipelineValue),
            delta: `${companies.length} empresas`,
            deltaColor: "#6C5CE7",
            icon: "🔀",
            sub: "valor esperado",
          },
          {
            label: "Leads Generados",
            value: totalLeads.toLocaleString("es-CO"),
            delta: "Este mes",
            deltaColor: "#0984E3",
            icon: "🎯",
            sub: "todos los canales",
          },
          {
            label: "Alertas Activas",
            value: String(unreadAlerts),
            delta: unreadAlerts === 0 ? "Sin alertas" : `${unreadAlerts} sin leer`,
            deltaColor: unreadAlerts > 0 ? "#FECA57" : "#00D4AA",
            icon: "🔔",
            sub: "requieren atención",
          },
          {
            label: "Empresas Activas",
            value: String(companies.filter((c) => c.active).length),
            delta: `de ${companies.length} totales`,
            deltaColor: "#00D4AA",
            icon: "🏢",
            sub: "en portafolio",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              padding: "16px 18px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {kpi.label}
              </p>
              <span style={{ fontSize: 18 }}>{kpi.icon}</span>
            </div>
            <strong style={{ display: "block", fontSize: 24, fontFamily: "monospace", color: "#FFFFFF", marginBottom: 4 }}>
              {kpi.value}
            </strong>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: kpi.deltaColor }}>{kpi.delta}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.30)" }}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Company cards ─────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Empresas del Portafolio</h2>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
            {companies.length} cliente{companies.length !== 1 ? "s" : ""}
          </span>
        </div>
        <CompanyList companies={companies} alertCounts={alertCounts} />
      </div>

      {/* ── Per-company revenue mini-bars ─────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 600 }}>Performance por Empresa — Último Mes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {COMPANY_SLUGS.map((slug) => {
            const d = getDemoData(slug);
            const company = companies.find((c) => c.slug === slug);
            if (!company) return null;
            const lastMonth = d.monthlyRevenue[d.monthlyRevenue.length - 1];
            const prevMonth = d.monthlyRevenue[d.monthlyRevenue.length - 2];
            const growth = prevMonth ? (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1) : "—";
            const vsTarget = lastMonth.target > 0 ? ((lastMonth.revenue / lastMonth.target) * 100).toFixed(0) : "—";
            const targetPct = Math.min((lastMonth.revenue / lastMonth.target) * 100, 100);
            const targetColor = targetPct >= 100 ? "#00D4AA" : targetPct >= 85 ? "#FECA57" : "#FF6B6B";
            const topChannel = d.channels.sort((a, b) => b.revenue - a.revenue)[0];

            return (
              <div
                key={slug}
                style={{
                  padding: "16px 18px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>{company.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{company.industry}</p>
                  </div>
                  <span style={{ fontSize: 20, fontFamily: "monospace", color: "#FFFFFF", fontWeight: 700 }}>
                    {formatCOP(lastMonth.revenue)}
                  </span>
                </div>

                {/* Target progress */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: "rgba(255,255,255,0.40)" }}>vs Objetivo</span>
                    <span style={{ color: targetColor, fontWeight: 700 }}>{vsTarget}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ width: `${targetPct}%`, height: "100%", borderRadius: 99, background: targetColor }} />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.40)" }}>
                    Crecimiento: <strong style={{ color: parseFloat(growth) >= 0 ? "#00D4AA" : "#FF6B6B" }}>
                      {parseFloat(growth) >= 0 ? "↑" : "↓"} {Math.abs(parseFloat(growth))}%
                    </strong>
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.40)" }}>
                    Top canal: <strong style={{ color: topChannel.color }}>{topChannel.channel}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Alert center ──────────────────────────────────────── */}
      <AlertCenter alerts={alerts} />
    </main>
  );
}
