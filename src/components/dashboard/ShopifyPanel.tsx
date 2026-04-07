"use client";

import type { ShopifyData } from "@/lib/demo";
import { formatCOP } from "@/lib/demo";

interface ShopifyPanelProps {
  data: ShopifyData;
}

const SHOPIFY_GREEN = "#96BF48";

function StatCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 10,
        background: highlight ? "rgba(150,191,72,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${highlight ? "rgba(150,191,72,0.25)" : "rgba(255,255,255,0.06)"}`,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </p>
      <strong style={{ fontSize: 22, fontFamily: "monospace", color: highlight ? SHOPIFY_GREEN : "#FFFFFF" }}>
        {value}
      </strong>
      {sub && <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{sub}</p>}
    </div>
  );
}

export function ShopifyPanel({ data }: ShopifyPanelProps) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(150,191,72,0.20)",
        background: "rgba(255,255,255,0.02)",
        padding: 20,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Shopify accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #96BF48, #5A8A1F)",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: SHOPIFY_GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 900,
            color: "#FFFFFF",
          }}
        >
          S
        </div>
        <div>
          <p style={{ margin: 0, color: SHOPIFY_GREEN, fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>
            // SHOPIFY.INTEGRATION
          </p>
          <h3 style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 600 }}>Tienda Shopify — Demo Live</h3>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 99,
            background: "rgba(150,191,72,0.12)",
            border: "1px solid rgba(150,191,72,0.25)",
            fontSize: 11,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: SHOPIFY_GREEN }} />
          <span style={{ color: SHOPIFY_GREEN, fontWeight: 600 }}>Conectado</span>
        </div>
      </div>

      {/* Metric grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <StatCard label="Órdenes hoy" value={String(data.ordersToday)} sub="Últimas 24h" highlight />
        <StatCard label="Órdenes semana" value={String(data.ordersWeek)} sub="Últ. 7 días" />
        <StatCard label="GMV del mes" value={formatCOP(data.gmvMonth)} sub="Gross Merchandise" highlight />
        <StatCard label="Ticket promedio" value={formatCOP(data.aov)} sub="AOV" />
        <StatCard label="Tasa conversión" value={`${data.conversionRate}%`} sub="Visitas → Compra" highlight />
        <StatCard label="Carritos abnd." value={String(data.abandonedCarts)} sub={`~${formatCOP(data.abandonedCarts * data.aov)} recuperables`} />
      </div>

      {/* Top products */}
      <div>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Productos más vendidos
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {data.products.map((product, i) => (
            <div
              key={product.sku}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.25)", minWidth: 16 }}>
                #{i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {product.name}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
                  {product.sku}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: SHOPIFY_GREEN, fontFamily: "monospace" }}>
                  {formatCOP(product.revenue)}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.40)" }}>
                  {product.sold} uds
                </p>
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: product.trend === "up" ? "#00D4AA" : product.trend === "down" ? "#FF6B6B" : "rgba(255,255,255,0.30)",
                }}
              >
                {product.trend === "up" ? "↑" : product.trend === "down" ? "↓" : "→"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
