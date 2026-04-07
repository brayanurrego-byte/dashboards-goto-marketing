import { authorizeCompanyScope, getAuthenticatedUser } from "@/lib/api/auth";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (auth.error || !auth.user) {
      return auth.error ?? Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const companyId = new URL(request.url).searchParams.get("company_id");
    const scopeError = authorizeCompanyScope(auth.user, companyId);
    if (scopeError) return scopeError;

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("kpi_data")
      .select("company_id, metric_key, value, period_start, period_end, source, synced_at")
      .eq("company_id", companyId)
      .eq("source", "meta_ads");

    if (error) {
      console.error("[Internal]", error);
      return Response.json({ error: "Error interno" }, { status: 500 });
    }

    return Response.json({ data: data ?? [] });
  } catch (error) {
    console.error("[Internal]", error);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
