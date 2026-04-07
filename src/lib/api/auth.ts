import { createServerClient } from "@/lib/supabase/server";
import type { AuthMetadata, AuthenticatedUserContext } from "@/types";

function getBearerToken(request: Request): string | null {
  const authorizationHeader = request.headers.get("Authorization");
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authorizationHeader.replace("Bearer ", "").trim();
}

export async function getAuthenticatedUser(
  request: Request
): Promise<{ user: AuthenticatedUserContext | null; error: Response | null }> {
  const token = getBearerToken(request);
  if (!token) {
    return {
      user: null,
      error: Response.json({ error: "No autorizado" }, { status: 401 }),
    };
  }

  try {
    const supabase = createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return {
        user: null,
        error: Response.json({ error: "Token inválido" }, { status: 401 }),
      };
    }

    const metadata = user.user_metadata as AuthMetadata;

    if (!metadata?.role || !metadata?.agency_id) {
      return {
        user: null,
        error: Response.json({ error: "Token inválido" }, { status: 401 }),
      };
    }

    return {
      user: {
        userId: user.id,
        role: metadata.role,
        agencyId: metadata.agency_id,
        companyId: metadata.company_id ?? null,
      },
      error: null,
    };
  } catch (error) {
    console.error("[Internal]", error);
    return {
      user: null,
      error: Response.json({ error: "Error interno" }, { status: 500 }),
    };
  }
}

export function authorizeCompanyScope(
  user: AuthenticatedUserContext,
  requestedCompanyId: string | null
): Response | null {
  if (!requestedCompanyId) {
    return Response.json({ error: "company_id es requerido" }, { status: 400 });
  }

  if (user.role === "admin") {
    return null;
  }

  if (user.companyId !== requestedCompanyId) {
    return Response.json({ error: "Acceso denegado" }, { status: 403 });
  }

  return null;
}
