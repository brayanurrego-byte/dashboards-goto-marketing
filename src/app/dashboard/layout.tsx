import type { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { createServerClient } from "@/lib/supabase/server";
import type { AuthMetadata } from "@/types";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let companies: Array<{ slug: string; name: string }> = [];

  if (user) {
    const metadata = user.user_metadata as AuthMetadata;
    if (metadata?.role === "admin" && metadata?.agency_id) {
      const { data } = await supabase
        .from("companies")
        .select("slug, name")
        .eq("agency_id", metadata.agency_id)
        .eq("active", true)
        .order("name");
      companies = data ?? [];
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060B18",
        display: "flex",
      }}
    >
      <Sidebar companies={companies} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Header />
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}
