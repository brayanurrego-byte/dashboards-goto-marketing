export default function DashboardLoading() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            height: 12,
            width: 120,
            borderRadius: 6,
            background: "rgba(0,212,170,0.12)",
            marginBottom: 12,
          }}
        />
        <div
          style={{
            height: 28,
            width: 280,
            borderRadius: 6,
            background: "rgba(255,255,255,0.06)",
            marginBottom: 8,
          }}
        />
        <div
          style={{
            height: 16,
            width: 420,
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
          }}
        />
      </div>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, #00D4AA, #6C5CE7, #0984E3, transparent)",
          marginBottom: 28,
        }}
      />

      {/* Company card skeletons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              padding: 18,
              height: 120,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    </main>
  );
}
