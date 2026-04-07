import { authorizeCompanyScope, getAuthenticatedUser } from "@/lib/api/auth";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (auth.error || !auth.user) {
      return auth.error ?? Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = (await request.json()) as { company_id?: string };
    const companyId = body.company_id ?? null;

    const scopeError = authorizeCompanyScope(auth.user, companyId);
    if (scopeError) return scopeError;

    const supabase = createServerClient();
    const { error } = await supabase
      .from("platform_connections")
      .update({ last_sync: new Date().toISOString() })
      .eq("company_id", companyId);

    if (error) {
      console.error("[Internal]", error);
      return Response.json({ error: "Error interno" }, { status: 500 });
    }

    return Response.json({ data: { synced: true, company_id: companyId } });
  } catch (error) {
    console.error("[Internal]", error);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
