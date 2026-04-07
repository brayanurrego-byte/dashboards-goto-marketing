import { CompanyList } from "@/components/dashboard/CompanyList";
import { AlertCenter } from "@/components/dashboard/AlertCenter";
import { createServerClient } from "@/lib/supabase/server";
import type { AlertWithCompany, AuthMetadata, Company } from "@/types";
import { redirect } from "next/navigation";

function countAlertsByCompany(
  alerts: Pick<AlertWithCompany, "company_id">[]
): Record<string, number> {
  return alerts.reduce<Record<string, number>>((acc, row) => {
    acc[row.company_id] = (acc[row.company_id] ?? 0) + 1;
    return acc;
  }, {});
}

export default async function DashboardPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const metadata = user.user_metadata as AuthMetadata;

  if (metadata.role !== "admin") {
    const { data: companyRow } = await supabase
      .from("companies")
      .select("slug")
      .eq("id", metadata.company_id ?? "")
      .maybeSingle();

    redirect(
      `/dashboard/empresa/${companyRow?.slug ?? metadata.company_id ?? "empresa"}`
    );
  }

  const { data: companiesData, error: companiesError } = await supabase
    .from("companies")
    .select("id, agency_id, name, slug, tier, industry, active, created_at")
    .eq("agency_id", metadata.agency_id)
    .order("name");

  if (companiesError) {
    console.error("[Internal]", companiesError);
  }

  const companies: Company[] = (companiesData ?? []) as Company[];
  const companyIds = companies.map((c) => c.id);

  let alerts: AlertWithCompany[] = [];
  if (companyIds.length > 0) {
    const { data: alertsData, error: alertsError } = await supabase
      .from("alerts")
      .select(
        "id, company_id, type, severity, message, read, created_at, companies ( name, slug )"
      )
      .in("company_id", companyIds)
      .order("created_at", { ascending: false })
      .limit(80);

    if (alertsError) {
      console.error("[Internal]", alertsError);
    } else {
      alerts = (alertsData ?? []) as AlertWithCompany[];
    }
  }

  const alertCounts = countAlertsByCompany(alerts);

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
          {"// ADMIN.PORTFOLIO"}
        </p>
        <h1 style={{ margin: "8px 0 0", fontSize: 28 }}>Empresas y alertas</h1>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.60)" }}>
          Vista central del portafolio: empresas activas y variaciones críticas
          recientes.
        </p>
      </div>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #00D4AA, #6C5CE7, #0984E3, transparent)",
          marginBottom: 28,
        }}
      />

      <CompanyList companies={companies} alertCounts={alertCounts} />
      <AlertCenter alerts={alerts} />
    </main>
  );
}
