import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#060B18",
        padding: 24,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          background: "rgba(255,255,255,0.02)",
          padding: 24,
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#00D4AA",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.08em",
          }}
        >
          {"// AUTH.LOGIN"}
        </p>
        <h1 style={{ marginTop: 12, marginBottom: 8 }}>Branex x Go to Marketing</h1>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.60)" }}>
          Inicia sesión para acceder a tus dashboards empresariales.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
