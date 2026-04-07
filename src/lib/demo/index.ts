export interface MonthlyRevenue {
  month: string;
  revenue: number;
  target: number;
  lastYear: number;
  orders?: number;
}

export interface ChannelData {
  channel: string;
  color: string;
  revenue: number;
  leads: number;
  pct: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  pct: number;
  color: string;
}

export interface PipelineDeal {
  id: string;
  name: string;
  value: number;
  probability: number;
  contact: string;
  days: number;
}

export interface PipelineStage {
  id: string;
  label: string;
  color: string;
  deals: PipelineDeal[];
}

export interface ShopifyProduct {
  name: string;
  sku: string;
  sold: number;
  revenue: number;
  trend: "up" | "down" | "flat";
}

export interface ShopifyData {
  ordersToday: number;
  ordersWeek: number;
  gmvMonth: number;
  aov: number;
  conversionRate: number;
  abandonedCarts: number;
  products: ShopifyProduct[];
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  stock: number;
  sold30d: number;
  reorderPoint: number;
  cost: number;
  price: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  ltv: number;
  aov: number;
  retention: number;
  color: string;
}

export interface DemoData {
  monthlyRevenue: MonthlyRevenue[];
  channels: ChannelData[];
  funnel: FunnelStage[];
  pipeline: PipelineStage[];
  shopify: ShopifyData | null;
  inventory: InventoryItem[] | null;
  customerSegments: CustomerSegment[];
  topMetrics: { label: string; value: string; delta: number; icon: string }[];
}

const MARALTA: DemoData = {
  topMetrics: [
    { label: "Ingresos Hoy", value: "$4.2M COP", delta: 12.4, icon: "💰" },
    { label: "Órdenes Activas", value: "47", delta: 8.2, icon: "📦" },
    { label: "Visitantes Web", value: "3,841", delta: 22.1, icon: "👥" },
    { label: "Tasa Conversión", value: "3.8%", delta: -1.2, icon: "📈" },
  ],
  monthlyRevenue: [
    { month: "May 25", revenue: 52_000_000, target: 55_000_000, lastYear: 38_000_000, orders: 284 },
    { month: "Jun 25", revenue: 58_400_000, target: 58_000_000, lastYear: 41_200_000, orders: 312 },
    { month: "Jul 25", revenue: 61_200_000, target: 60_000_000, lastYear: 45_000_000, orders: 330 },
    { month: "Ago 25", revenue: 55_800_000, target: 62_000_000, lastYear: 43_500_000, orders: 298 },
    { month: "Sep 25", revenue: 67_300_000, target: 65_000_000, lastYear: 49_000_000, orders: 361 },
    { month: "Oct 25", revenue: 74_100_000, target: 70_000_000, lastYear: 54_800_000, orders: 398 },
    { month: "Nov 25", revenue: 82_600_000, target: 75_000_000, lastYear: 60_200_000, orders: 442 },
    { month: "Dic 25", revenue: 98_400_000, target: 90_000_000, lastYear: 72_000_000, orders: 527 },
    { month: "Ene 26", revenue: 71_200_000, target: 75_000_000, lastYear: 55_000_000, orders: 381 },
    { month: "Feb 26", revenue: 76_500_000, target: 78_000_000, lastYear: 58_400_000, orders: 410 },
    { month: "Mar 26", revenue: 85_000_000, target: 82_000_000, lastYear: 63_000_000, orders: 455 },
    { month: "Abr 26", revenue: 92_000_000, target: 88_000_000, lastYear: 68_200_000, orders: 492 },
  ],
  channels: [
    { channel: "Meta Ads", color: "#1877F2", revenue: 38_640_000, leads: 1842, pct: 42 },
    { channel: "Google Ads", color: "#4285F4", revenue: 27_600_000, leads: 1104, pct: 30 },
    { channel: "Shopify Organic", color: "#96BF48", revenue: 13_800_000, leads: 720, pct: 15 },
    { channel: "TikTok Ads", color: "#FF0050", revenue: 7_360_000, leads: 368, pct: 8 },
    { channel: "Email / Referidos", color: "#00D4AA", revenue: 4_600_000, leads: 184, pct: 5 },
  ],
  funnel: [
    { stage: "Visitantes Web", count: 84_200, pct: 100, color: "#0984E3" },
    { stage: "Leads Capturados", count: 12_630, pct: 15.0, color: "#6C5CE7" },
    { stage: "Leads Calificados", count: 5_052, pct: 6.0, color: "#00D4AA" },
    { stage: "Carrito Activo", count: 2_526, pct: 3.0, color: "#FECA57" },
    { stage: "Conversiones (Compra)", count: 1_389, pct: 1.65, color: "#00D4AA" },
    { stage: "Recompra (+30d)", count: 556, pct: 0.66, color: "#A29BFE" },
  ],
  pipeline: [
    {
      id: "prospection",
      label: "Prospección",
      color: "#0984E3",
      deals: [
        { id: "1", name: "Grupo Empresarial TH", value: 8_500_000, probability: 20, contact: "Andrea Torres", days: 3 },
        { id: "2", name: "Distribuidora Nacional", value: 12_000_000, probability: 25, contact: "Carlos M.", days: 7 },
        { id: "3", name: "Almacenes Don Juan", value: 5_200_000, probability: 15, contact: "Diana P.", days: 1 },
      ],
    },
    {
      id: "qualified",
      label: "Calificado",
      color: "#6C5CE7",
      deals: [
        { id: "4", name: "Retail Express SAS", value: 22_000_000, probability: 45, contact: "Felipe R.", days: 12 },
        { id: "5", name: "Mayoristas del Norte", value: 18_500_000, probability: 50, contact: "Luisa V.", days: 9 },
      ],
    },
    {
      id: "proposal",
      label: "Propuesta",
      color: "#FECA57",
      deals: [
        { id: "6", name: "Cadena SuperMart", value: 45_000_000, probability: 65, contact: "Roberto A.", days: 18 },
        { id: "7", name: "Hipermercados CL", value: 31_000_000, probability: 70, contact: "Valentina G.", days: 21 },
      ],
    },
    {
      id: "negotiation",
      label: "Negociación",
      color: "#FF7675",
      deals: [
        { id: "8", name: "Grupo OXXO Colombia", value: 78_000_000, probability: 80, contact: "Sergio N.", days: 28 },
      ],
    },
    {
      id: "closed",
      label: "Cerrado ✓",
      color: "#00D4AA",
      deals: [
        { id: "9", name: "Multicentro Ventas", value: 34_500_000, probability: 100, contact: "Patricia L.", days: 35 },
        { id: "10", name: "Easy Logistics", value: 19_800_000, probability: 100, contact: "Manuel O.", days: 42 },
      ],
    },
  ],
  shopify: {
    ordersToday: 47,
    ordersWeek: 312,
    gmvMonth: 92_000_000,
    aov: 186_991,
    conversionRate: 3.8,
    abandonedCarts: 138,
    products: [
      { name: "Camiseta Premium Oversize", sku: "CAM-001", sold: 342, revenue: 31_464_000, trend: "up" },
      { name: "Jean Slim Fit Azul", sku: "JEA-004", sold: 287, revenue: 40_180_000, trend: "up" },
      { name: "Vestido Floral Verano", sku: "VES-012", sold: 218, revenue: 28_340_000, trend: "flat" },
      { name: "Sudadera Hoodie Logo", sku: "SUD-007", sold: 194, revenue: 27_160_000, trend: "down" },
      { name: "Short Deportivo Pro", sku: "SHO-003", sold: 176, revenue: 14_080_000, trend: "up" },
    ],
  },
  inventory: [
    { sku: "CAM-001", name: "Camiseta Premium Oversize", category: "Tops", stock: 248, sold30d: 112, reorderPoint: 100, cost: 42_000, price: 89_000 },
    { sku: "JEA-004", name: "Jean Slim Fit Azul", category: "Bottoms", stock: 87, sold30d: 98, reorderPoint: 150, cost: 68_000, price: 149_000 },
    { sku: "VES-012", name: "Vestido Floral Verano", category: "Vestidos", stock: 312, sold30d: 72, reorderPoint: 80, cost: 52_000, price: 129_000 },
    { sku: "SUD-007", name: "Sudadera Hoodie Logo", category: "Tops", stock: 54, sold30d: 64, reorderPoint: 120, cost: 75_000, price: 139_000 },
    { sku: "SHO-003", name: "Short Deportivo Pro", category: "Bottoms", stock: 189, sold30d: 58, reorderPoint: 60, cost: 28_000, price: 79_000 },
    { sku: "CHA-009", name: "Chaqueta Cuero Sintético", category: "Outerwear", stock: 23, sold30d: 41, reorderPoint: 50, cost: 118_000, price: 259_000 },
    { sku: "CAL-015", name: "Calzado Deportivo Runner", category: "Calzado", stock: 145, sold30d: 88, reorderPoint: 100, cost: 89_000, price: 189_000 },
  ],
  customerSegments: [
    { segment: "Clientes Nuevos", count: 892, ltv: 420_000, aov: 162_000, retention: 0, color: "#0984E3" },
    { segment: "Recurrentes (2-5x)", count: 647, ltv: 1_280_000, aov: 194_000, retention: 62, color: "#6C5CE7" },
    { segment: "Leales (6-15x)", count: 234, ltv: 3_840_000, aov: 218_000, retention: 84, color: "#00D4AA" },
    { segment: "VIP (+16x)", count: 82, ltv: 9_200_000, aov: 276_000, retention: 93, color: "#FECA57" },
  ],
};

const TRANSPORTES_NOVA: DemoData = {
  topMetrics: [
    { label: "Contratos Activos", value: "28", delta: 14.3, icon: "📋" },
    { label: "Leads Este Mes", value: "95", delta: 9.2, icon: "🎯" },
    { label: "Ingreso Mensual", value: "$38M COP", delta: 18.75, icon: "💰" },
    { label: "Costo por Lead", value: "$40K", delta: 8.7, icon: "📉" },
  ],
  monthlyRevenue: [
    { month: "May 25", revenue: 18_200_000, target: 20_000_000, lastYear: 14_500_000 },
    { month: "Jun 25", revenue: 21_400_000, target: 22_000_000, lastYear: 16_200_000 },
    { month: "Jul 25", revenue: 24_800_000, target: 24_000_000, lastYear: 18_100_000 },
    { month: "Ago 25", revenue: 22_100_000, target: 25_000_000, lastYear: 17_800_000 },
    { month: "Sep 25", revenue: 27_600_000, target: 26_000_000, lastYear: 20_400_000 },
    { month: "Oct 25", revenue: 29_300_000, target: 28_000_000, lastYear: 22_700_000 },
    { month: "Nov 25", revenue: 31_800_000, target: 30_000_000, lastYear: 24_300_000 },
    { month: "Dic 25", revenue: 34_200_000, target: 33_000_000, lastYear: 26_100_000 },
    { month: "Ene 26", revenue: 28_700_000, target: 32_000_000, lastYear: 22_500_000 },
    { month: "Feb 26", revenue: 32_100_000, target: 33_000_000, lastYear: 24_800_000 },
    { month: "Mar 26", revenue: 35_400_000, target: 35_000_000, lastYear: 27_200_000 },
    { month: "Abr 26", revenue: 38_000_000, target: 37_000_000, lastYear: 29_600_000 },
  ],
  channels: [
    { channel: "Google Ads", color: "#4285F4", revenue: 19_000_000, leads: 42, pct: 50 },
    { channel: "LinkedIn Ads", color: "#0A66C2", revenue: 11_400_000, leads: 26, pct: 30 },
    { channel: "Referidos", color: "#00D4AA", revenue: 5_700_000, leads: 15, pct: 15 },
    { channel: "Orgánico / SEO", color: "#6C5CE7", revenue: 1_900_000, leads: 12, pct: 5 },
  ],
  funnel: [
    { stage: "Impresiones Ads", count: 248_000, pct: 100, color: "#0984E3" },
    { stage: "Clics Recibidos", count: 4_960, pct: 2.0, color: "#6C5CE7" },
    { stage: "Formularios Enviados", count: 744, pct: 0.3, color: "#00D4AA" },
    { stage: "Leads Calificados", count: 297, pct: 0.12, color: "#FECA57" },
    { stage: "Propuesta Enviada", count: 89, pct: 0.036, color: "#FF7675" },
    { stage: "Contratos Cerrados", count: 28, pct: 0.011, color: "#00D4AA" },
  ],
  pipeline: [
    {
      id: "prospection",
      label: "Prospección",
      color: "#0984E3",
      deals: [
        { id: "1", name: "Logística Andina SAS", value: 12_000_000, probability: 20, contact: "Mario R.", days: 4 },
        { id: "2", name: "Importadora Pacific", value: 8_400_000, probability: 25, contact: "Claudia S.", days: 2 },
      ],
    },
    {
      id: "qualified",
      label: "Calificado",
      color: "#6C5CE7",
      deals: [
        { id: "3", name: "Almacenes Éxito (Ext)", value: 28_000_000, probability: 40, contact: "Jorge P.", days: 15 },
        { id: "4", name: "Distribuciones Norte", value: 16_500_000, probability: 45, contact: "Laura M.", days: 10 },
      ],
    },
    {
      id: "proposal",
      label: "Propuesta",
      color: "#FECA57",
      deals: [
        { id: "5", name: "TCC Colombia", value: 42_000_000, probability: 60, contact: "Ricardo V.", days: 22 },
      ],
    },
    {
      id: "negotiation",
      label: "Negociación",
      color: "#FF7675",
      deals: [
        { id: "6", name: "Grupo Bios Logística", value: 65_000_000, probability: 75, contact: "Adriana F.", days: 31 },
        { id: "7", name: "DHL Colombia (parcial)", value: 38_000_000, probability: 85, contact: "Héctor L.", days: 28 },
      ],
    },
    {
      id: "closed",
      label: "Cerrado ✓",
      color: "#00D4AA",
      deals: [
        { id: "8", name: "Servientrega Nacional", value: 48_000_000, probability: 100, contact: "Beatriz O.", days: 45 },
        { id: "9", name: "Coltrans SAS", value: 24_000_000, probability: 100, contact: "Nelson G.", days: 38 },
        { id: "10", name: "FlotaMax Ltda", value: 18_500_000, probability: 100, contact: "Pilar C.", days: 50 },
      ],
    },
  ],
  shopify: null,
  inventory: null,
  customerSegments: [
    { segment: "Contratos Nuevos", count: 28, ltv: 4_200_000, aov: 1_400_000, retention: 0, color: "#0984E3" },
    { segment: "Contratos Renovados", count: 41, ltv: 18_400_000, aov: 1_800_000, retention: 72, color: "#6C5CE7" },
    { segment: "Clientes Premium", count: 12, ltv: 52_000_000, aov: 3_200_000, retention: 91, color: "#00D4AA" },
    { segment: "Corporativos", count: 6, ltv: 128_000_000, aov: 8_000_000, retention: 96, color: "#FECA57" },
  ],
};

const LEGAL_ONE: DemoData = {
  topMetrics: [
    { label: "Casos Activos", value: "64", delta: 6.7, icon: "⚖️" },
    { label: "Consultas Web", value: "278", delta: -10.9, icon: "💬" },
    { label: "Honorarios Mes", value: "$18M COP", delta: -20.0, icon: "💰" },
    { label: "CTR Campaña", value: "3.8%", delta: -7.3, icon: "🎯" },
  ],
  monthlyRevenue: [
    { month: "May 25", revenue: 9_200_000, target: 10_000_000, lastYear: 7_400_000 },
    { month: "Jun 25", revenue: 10_800_000, target: 11_000_000, lastYear: 8_200_000 },
    { month: "Jul 25", revenue: 12_100_000, target: 12_000_000, lastYear: 9_600_000 },
    { month: "Ago 25", revenue: 11_400_000, target: 12_500_000, lastYear: 9_100_000 },
    { month: "Sep 25", revenue: 13_700_000, target: 13_000_000, lastYear: 10_800_000 },
    { month: "Oct 25", revenue: 14_900_000, target: 14_000_000, lastYear: 11_500_000 },
    { month: "Nov 25", revenue: 16_200_000, target: 15_000_000, lastYear: 12_400_000 },
    { month: "Dic 25", revenue: 14_800_000, target: 15_500_000, lastYear: 11_200_000 },
    { month: "Ene 26", revenue: 15_600_000, target: 16_000_000, lastYear: 12_100_000 },
    { month: "Feb 26", revenue: 17_200_000, target: 17_000_000, lastYear: 13_400_000 },
    { month: "Mar 26", revenue: 22_500_000, target: 18_000_000, lastYear: 14_200_000 },
    { month: "Abr 26", revenue: 18_000_000, target: 20_000_000, lastYear: 13_900_000 },
  ],
  channels: [
    { channel: "Google Ads", color: "#4285F4", revenue: 10_800_000, leads: 168, pct: 60 },
    { channel: "SEO / Orgánico", color: "#00D4AA", revenue: 3_600_000, leads: 62, pct: 20 },
    { channel: "Referidos", color: "#6C5CE7", revenue: 2_700_000, leads: 31, pct: 15 },
    { channel: "Redes Sociales", color: "#FF7675", revenue: 900_000, leads: 17, pct: 5 },
  ],
  funnel: [
    { stage: "Clicks en Anuncio", count: 31_200, pct: 100, color: "#0984E3" },
    { stage: "Visitas Landing", count: 8_424, pct: 27.0, color: "#6C5CE7" },
    { stage: "Formulario Iniciado", count: 1_685, pct: 5.4, color: "#FECA57" },
    { stage: "Consulta Solicitada", count: 758, pct: 2.43, color: "#FF7675" },
    { stage: "Consulta Atendida", count: 416, pct: 1.33, color: "#00D4AA" },
    { stage: "Cliente Contratado", count: 64, pct: 0.21, color: "#A29BFE" },
  ],
  pipeline: [
    {
      id: "prospection",
      label: "Consulta Inicial",
      color: "#0984E3",
      deals: [
        { id: "1", name: "Caso Laboral - J. Morales", value: 3_200_000, probability: 30, contact: "Juan M.", days: 2 },
        { id: "2", name: "Demanda Civil - García", value: 4_800_000, probability: 25, contact: "Ana G.", days: 5 },
        { id: "3", name: "Caso Familia - Rodríguez", value: 2_100_000, probability: 35, contact: "Pedro R.", days: 1 },
      ],
    },
    {
      id: "qualified",
      label: "Caso Evaluado",
      color: "#6C5CE7",
      deals: [
        { id: "4", name: "Litigio Comercial - Banco", value: 18_000_000, probability: 50, contact: "Banco Sol.", days: 14 },
        { id: "5", name: "Proceso Penal - Torres", value: 8_500_000, probability: 40, contact: "Carlos T.", days: 8 },
      ],
    },
    {
      id: "proposal",
      label: "Propuesta Honorarios",
      color: "#FECA57",
      deals: [
        { id: "6", name: "Fusión Empresarial - Grupo X", value: 42_000_000, probability: 65, contact: "Grupo XYZ", days: 20 },
        { id: "7", name: "Contrato Empresa ABC", value: 12_000_000, probability: 60, contact: "Luis A.", days: 17 },
      ],
    },
    {
      id: "negotiation",
      label: "Firma Contrato",
      color: "#FF7675",
      deals: [
        { id: "8", name: "Demanda Seguros Allianz", value: 28_000_000, probability: 80, contact: "Allianz CO", days: 25 },
      ],
    },
    {
      id: "closed",
      label: "Caso Activo ✓",
      color: "#00D4AA",
      deals: [
        { id: "9", name: "Proceso Sucesoral - Rueda", value: 15_000_000, probability: 100, contact: "Familia R.", days: 60 },
        { id: "10", name: "Asesoría Corporativa - TechCol", value: 24_000_000, probability: 100, contact: "TechCol SAS", days: 45 },
        { id: "11", name: "Defensa Penal - Vargas", value: 11_000_000, probability: 100, contact: "Diego V.", days: 38 },
      ],
    },
  ],
  shopify: null,
  inventory: null,
  customerSegments: [
    { segment: "Personas Naturales", count: 38, ltv: 2_800_000, aov: 680_000, retention: 0, color: "#0984E3" },
    { segment: "Pequeñas Empresas", count: 19, ltv: 8_400_000, aov: 2_100_000, retention: 58, color: "#6C5CE7" },
    { segment: "Medianas Empresas", count: 7, ltv: 28_000_000, aov: 6_400_000, retention: 78, color: "#00D4AA" },
  ],
};

const DEFAULT: DemoData = MARALTA;

export function getDemoData(slug: string): DemoData {
  const map: Record<string, DemoData> = {
    maralta: MARALTA,
    "transportes-nova": TRANSPORTES_NOVA,
    "legal-one": LEGAL_ONE,
  };
  return map[slug] ?? DEFAULT;
}

export function formatCOP(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString("es-CO")}`;
}
