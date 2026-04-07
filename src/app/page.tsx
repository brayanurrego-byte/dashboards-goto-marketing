import { createServerClient } from "@/lib/supabase/server";
import type { AuthMetadata } from "@/types";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const metadata = user.user_metadata as AuthMetadata;

  if (metadata.role === "admin") {
    redirect("/dashboard");
  }

  redirect("/dashboard");
}
