"use client";

import type { InventoryItem } from "@/lib/demo";
import { formatCOP } from "@/lib/demo";

interface InventoryPanelProps {
  items: InventoryItem[];
}

function StockBadge({ stock, reorderPoint }: { stock: number; reorderPoint: number }) {
  const ratio = stock / reorderPoint;
  if (ratio <= 0.5) return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,107,107,0.15)", color: "#FF6B6B", fontWeight: 700 }}>CRÍTICO</span>;
  if (ratio <= 1) return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(254,202,87,0.15)", color: "#FECA57", fontWeight: 700 }}>BAJO</span>;
  return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(0,212,170,0.12)", color: "#00D4AA", fontWeight: 700 }}>OK</span>;
}

export function InventoryPanel({ items }: InventoryPanelProps) {
  const lowStock = items.filter((i) => i.stock <= i.reorderPoint).length;
  const totalValue = items.reduce((s, i) => s + i.stock * i.cost, 0);
  const totalRevenue = items.reduce((s, i) => s + i.sold30d * i.price, 0);

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(9,132,227,0.20)",
        background: "rgba(255,255,255,0.02)",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #0984E3, #6C5CE7)",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #0984E3, #6C5CE7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          📊
        </div>
        <div>
          <p style={{ margin: 0, color: "#0984E3", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em" }}>
            // EXCEL.INVENTORY
          </p>
          <h3 style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 600 }}>Inventario — Sincronizado Excel</h3>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 99,
            background: "rgba(9,132,227,0.12)",
            border: "1px solid rgba(9,132,227,0.25)",
            fontSize: 11,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0984E3" }} />
          <span style={{ color: "#0984E3", fontWeight: 600 }}>Excel Live</span>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", flex: 1, minWidth: 110 }}>
          <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Valor Inventario</p>
          <strong style={{ fontSize: 18, fontFamily: "monospace", color: "#FFFFFF" }}>{formatCOP(totalValue)}</strong>
        </div>
        <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", flex: 1, minWidth: 110 }}>
          <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ventas 30d</p>
          <strong style={{ fontSize: 18, fontFamily: "monospace", color: "#00D4AA" }}>{formatCOP(totalRevenue)}</strong>
        </div>
        <div style={{ padding: "8px 14px", borderRadius: 8, background: lowStock > 0 ? "rgba(254,202,87,0.08)" : "rgba(0,212,170,0.06)", border: `1px solid ${lowStock > 0 ? "rgba(254,202,87,0.25)" : "rgba(0,212,170,0.15)"}`, flex: 1, minWidth: 110 }}>
          <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.40)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Alertas Stock</p>
          <strong style={{ fontSize: 18, fontFamily: "monospace", color: lowStock > 0 ? "#FECA57" : "#00D4AA" }}>
            {lowStock > 0 ? `${lowStock} ítems` : "Sin alertas"}
          </strong>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["SKU", "Producto", "Categoría", "Stock", "Vendidos 30d", "P. Reorden", "Precio", "Estado"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "6px 10px",
                    textAlign: "left",
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 500,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.sku}
                style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}
              >
                <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.50)" }}>
                  {item.sku}
                </td>
                <td style={{ padding: "8px 10px", color: "#FFFFFF", fontWeight: 500, maxWidth: 160 }}>
                  {item.name}
                </td>
                <td style={{ padding: "8px 10px", color: "rgba(255,255,255,0.50)" }}>
                  {item.category}
                </td>
                <td style={{ padding: "8px 10px", fontFamily: "monospace", fontWeight: 700, color: item.stock <= item.reorderPoint ? "#FECA57" : "#FFFFFF" }}>
                  {item.stock.toLocaleString("es-CO")}
                </td>
                <td style={{ padding: "8px 10px", fontFamily: "monospace", color: "#0984E3" }}>
                  {item.sold30d}
                </td>
                <td style={{ padding: "8px 10px", fontFamily: "monospace", color: "rgba(255,255,255,0.40)" }}>
                  {item.reorderPoint}
                </td>
                <td style={{ padding: "8px 10px", fontFamily: "monospace", color: "#00D4AA" }}>
                  {formatCOP(item.price)}
                </td>
                <td style={{ padding: "8px 10px" }}>
                  <StockBadge stock={item.stock} reorderPoint={item.reorderPoint} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
