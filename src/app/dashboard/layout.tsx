import type { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060B18",
        display: "flex",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Header />
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}
