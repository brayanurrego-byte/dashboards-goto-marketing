import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { AuthMetadata, Company, KPIData, KPIViewItem } from "@/types";
import { getDemoData } from "@/lib/demo";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { RevenueLineChart } from "@/components/dashboard/RevenueLineChart";
import { ChannelBreakdown } from "@/components/dashboard/ChannelBreakdown";
import { CustomerFunnel } from "@/components/dashboard/CustomerFunnel";
import { SalesPipeline } from "@/components/dashboard/SalesPipeline";
import { ShopifyPanel } from "@/components/dashboard/ShopifyPanel";
import { InventoryPanel } from "@/components/dashboard/InventoryPanel";
import { CustomerSegmentsChart } from "@/components/dashboard/CustomerSegmentsChart";
import { LiveMetricsBar } from "@/components/dashboard/LiveMetricsBar";

export const dynamic = "force-dynamic";

interface CompanyDashboardPageProps {
  params: { slug: string };
}

function toDeltaPct(current: number, previous: number | null): number | null {
  if (previous == null || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

const TIER_BADGE: Record<string, { label: string; color: string }> = {
  enterprise: { label: "Enterprise", color: "#00D4AA" },
  professional: { label: "Professional", color: "#6C5CE7" },
  starter: { label: "Starter", color: "#0984E3" },
};

export default async function CompanyDashboardPage({ params }: CompanyDashboardPageProps) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  const metadata = user.user_metadata as AuthMetadata;

  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("id, agency_id, name, slug, tier, industry, active, created_at")
    .eq("slug", params.slug)
    .eq("agency_id", metadata.agency_id)
    .maybeSingle();

  if (companyError || !companyData) {
    redirect("/dashboard");
  }

  const company = companyData as Company;

  if (metadata.role === "company" && metadata.company_id !== company.id) {
    const { data: ownCompany } = await supabase
      .from("companies")
      .select("slug")
      .eq("id", metadata.company_id ?? "")
      .eq("agency_id", metadata.agency_id)
      .maybeSingle();
    redirect(`/dashboard/empresa/${ownCompany?.slug ?? "empresa"}`);
  }

  const { data: configData } = await supabase
    .from("kpi_configs")
    .select("metric_key, label, unit, display_order")
    .eq("company_id", company.id)
    .order("display_order", { ascending: true });

  const { data: kpiData } = await supabase
    .from("kpi_data")
    .select("id, company_id, metric_key, value, period_start, period_end, source, synced_at")
    .eq("company_id", company.id)
    .order("period_end", { ascending: false })
    .limit(120);

  const rows = (kpiData ?? []) as KPIData[];
  const configs = (configData ?? []) as Array<{
    metric_key: string; label: string; unit: string | null; display_order: number;
  }>;

  const byMetric = new Map<string, KPIData[]>();
  for (const row of rows) {
    const metricRows = byMetric.get(row.metric_key) ?? [];
    metricRows.push(row);
    byMetric.set(row.metric_key, metricRows);
  }

  const kpiItems: KPIViewItem[] =
    configs.length > 0
      ? configs.map((cfg) => {
          const metricRows = byMetric.get(cfg.metric_key) ?? [];
          const current = metricRows[0]?.value ?? 0;
          const previous = metricRows[1]?.value ?? null;
          return { metricKey: cfg.metric_key, label: cfg.label, unit: cfg.unit, value: current, deltaPct: toDeltaPct(current, previous) };
        })
      : Array.from(byMetric.entries()).slice(0, 6).map(([metricKey, metricRows]) => ({
          metricKey,
          label: metricKey.replaceAll("_", " ").toUpperCase(),
          unit: null,
          value: metricRows[0]?.value ?? 0,
          deltaPct: toDeltaPct(metricRows[0]?.value ?? 0, metricRows[1]?.value ?? null),
        }));

  // Demo data enrichment
  const demo = getDemoData(company.slug);
  const tierInfo = TIER_BADGE[company.tier] ?? TIER_BADGE.starter;
  const now = new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", paddingBottom: 48 }}>

      {/* ── Page header ───────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <p style={{ margin: 0, color: "#00D4AA", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>
            // COMPANY.DASHBOARD
          </p>
          <span
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 99,
              background: `${tierInfo.color}18`,
              border: `1px solid ${tierInfo.color}40`,
              color: tierInfo.color,
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            {tierInfo.label}
          </span>
          {company.industry && (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)" }}>
              {company.industry}
            </span>
          )}
        </div>
        <h1 style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{company.name}</h1>
        <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
          {now} · KPIs en tiempo real, analytics de canales y performance de pauta
        </p>
      </div>

      {/* Gradient divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #00D4AA, #6C5CE7, #0984E3, transparent)", marginBottom: 24 }} />

      {/* ── Live metrics bar ───────────────────────────────────── */}
      <LiveMetricsBar metrics={demo.topMetrics} />

      {/* ── KPI grid (real data from Supabase) ────────────────── */}
      <KPIGrid items={kpiItems} />

      {/* ── Revenue + Channel breakdown ───────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginBottom: 20 }}>
        <RevenueLineChart data={demo.monthlyRevenue} showOrders={!!demo.shopify} />
        <ChannelBreakdown data={demo.channels} />
      </div>

      {/* ── Funnel + Customer segments ────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <CustomerFunnel stages={demo.funnel} />
        <CustomerSegmentsChart segments={demo.customerSegments} />
      </div>

      {/* ── Pipeline ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <SalesPipeline stages={demo.pipeline} />
      </div>

      {/* ── Shopify panel (only for e-commerce) ───────────────── */}
      {demo.shopify && (
        <div style={{ marginBottom: 20 }}>
          <ShopifyPanel data={demo.shopify} />
        </div>
      )}

      {/* ── Inventory / Excel (only when available) ───────────── */}
      {demo.inventory && (
        <div style={{ marginBottom: 20 }}>
          <InventoryPanel items={demo.inventory} />
        </div>
      )}

      {/* ── Footer sync note ──────────────────────────────────── */}
      <div
        style={{
          marginTop: 8,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          color: "rgba(255,255,255,0.25)",
          fontFamily: "monospace",
        }}
      >
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00D4AA" }} />
        Última sincronización: hace 2 min · Branex Analytics Engine v2.4
      </div>
    </main>
  );
}
