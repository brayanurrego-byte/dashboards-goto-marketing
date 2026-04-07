import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { createServerClient } from "@/lib/supabase/server";
import type { AuthMetadata, CampaignRow, ChartPoint, Company, KPIData, KPIViewItem } from "@/types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface CompanyDashboardPageProps {
  params: { slug: string };
}

function toDeltaPct(current: number, previous: number | null): number | null {
  if (previous == null || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

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
    console.error("[Internal]", companyError);
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
  const configs = (configData ?? []) as Array<{ metric_key: string; label: string; unit: string | null; display_order: number }>;

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
          return {
            metricKey: cfg.metric_key,
            label: cfg.label,
            unit: cfg.unit,
            value: current,
            deltaPct: toDeltaPct(current, previous),
          };
        })
      : Array.from(byMetric.entries()).slice(0, 6).map(([metricKey, metricRows]) => {
          const current = metricRows[0]?.value ?? 0;
          const previous = metricRows[1]?.value ?? null;
          return {
            metricKey,
            label: metricKey.replaceAll("_", " ").toUpperCase(),
            unit: null,
            value: current,
            deltaPct: toDeltaPct(current, previous),
          };
        });

  const chartPoints: ChartPoint[] = rows
    .slice(0, 12)
    .reverse()
    .map((row) => ({
      label: new Intl.DateTimeFormat("es-CO", { month: "short", day: "2-digit" }).format(new Date(row.period_end)),
      value: Number(row.value),
    }));

  const campaignRows: CampaignRow[] = rows
    .filter((row) => row.source === "meta_ads" || row.source === "google_ads" || row.source === "tiktok_ads" || row.source === "shopify")
    .slice(0, 8)
    .map((row, index) => {
      const platform = (row.source ?? "meta_ads") as CampaignRow["platform"];
      return {
        campaignName: `Campaña ${index + 1} · ${row.metric_key}`,
        platform,
        spend: Number(row.value) * 1000,
        clicks: Math.round(Number(row.value) * 3),
        impressions: Math.round(Number(row.value) * 20),
        roas: platform === "shopify" ? null : Math.max(0.5, Number(row.value) / 100),
        sourceBadge: platform === "google_ads" || platform === "tiktok_ads" || platform === "shopify" ? "DEMO DATA" : undefined,
      };
    });

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            margin: 0,
            color: "#00D4AA",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.08em",
          }}
        >
          {"// COMPANY.DASHBOARD"}
        </p>
        <h1 style={{ margin: "8px 0 0", fontSize: 28 }}>{company.name}</h1>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.60)" }}>
          KPIs en tiempo real, comparativa temporal y rendimiento de pauta por plataforma.
        </p>
      </div>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #00D4AA, #6C5CE7, #0984E3, transparent)",
          marginBottom: 24,
        }}
      />

      <KPIGrid items={kpiItems} />
      <PerformanceChart points={chartPoints} />
      <CampaignTable rows={campaignRows} />
    </main>
  );
}
