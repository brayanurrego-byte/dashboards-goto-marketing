"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const router = useRouter();
  const { email, role, signOut } = useAuth();

  const onSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header
      style={{
        height: 72,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,11,24,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: "#00D4AA",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
          }}
        >
          {"// DASHBOARD.OVERVIEW"}
        </p>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.60)", fontSize: 13 }}>
          {role === "admin" ? "Modo administrador" : "Modo empresa"}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "rgba(255,255,255,0.60)", fontSize: 13 }}>{email ?? "usuario"}</span>
        <button
          type="button"
          onClick={onSignOut}
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            background: "transparent",
            color: "#FFFFFF",
            borderRadius: 10,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
