import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { AuthMetadata } from "@/types";

function isProtectedPath(pathname: string) {
  return pathname.startsWith("/dashboard");
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: Record<string, unknown>) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (isProtectedPath(pathname) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!user) return response;

  const metadata = user.user_metadata as AuthMetadata;
  const role = metadata?.role;
  const companyId = metadata?.company_id ?? null;
  let companySlug: string | null = null;

  if (role === "company" && companyId) {
    const { data: companyRecord } = await supabase
      .from("companies")
      .select("slug")
      .eq("id", companyId)
      .single();
    companySlug = companyRecord?.slug ?? null;
  }

  if (pathname === "/login") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (role === "company" && companyId) {
      return NextResponse.redirect(
        new URL(`/dashboard/empresa/${companySlug ?? companyId}`, request.url)
      );
    }
  }

  if (role === "company" && pathname.startsWith("/dashboard/empresa/")) {
    const routeCompanySlug = pathname.split("/")[3];
    if (
      routeCompanySlug &&
      companyId &&
      companySlug &&
      routeCompanySlug !== companySlug
    ) {
      return NextResponse.redirect(
        new URL(`/dashboard/empresa/${companySlug}`, request.url)
      );
    }
  }

  if (role === "company" && pathname === "/dashboard") {
    return NextResponse.redirect(
      new URL(`/dashboard/empresa/${companySlug ?? companyId}`, request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
