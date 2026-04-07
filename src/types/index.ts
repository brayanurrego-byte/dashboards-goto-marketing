export type UserRole = "admin" | "company";
export type CompanyTier = "starter" | "professional" | "enterprise";
export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type PlatformType =
  | "meta_ads"
  | "google_ads"
  | "tiktok_ads"
  | "shopify"
  | "google_sheets"
  | "excel";

export interface AuthMetadata {
  role: UserRole;
  agency_id: string;
  company_id: string | null;
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
}

export interface Company {
  id: string;
  agency_id: string;
  name: string;
  slug: string;
  tier: CompanyTier;
  industry: string | null;
  active: boolean;
  created_at: string;
}

export interface PlatformConnection {
  id: string;
  company_id: string;
  platform: PlatformType;
  credentials: Record<string, unknown> | null;
  status: string;
  last_sync: string | null;
  created_at: string;
}

export interface KPIConfig {
  id: string;
  company_id: string;
  metric_key: string;
  label: string;
  target: number | null;
  unit: string | null;
  display_order: number;
}

export interface KPIData {
  id: string;
  company_id: string;
  metric_key: string;
  value: number;
  period_start: string;
  period_end: string;
  source: string | null;
  synced_at: string;
}

export interface Alert {
  id: string;
  company_id: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  read: boolean;
  created_at: string;
}

export interface ApiErrorResponse {
  error: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface AuthenticatedUserContext {
  userId: string;
  role: UserRole;
  agencyId: string;
  companyId: string | null;
}

/** Alert row with joined company (Supabase nested select). */
export interface AlertWithCompany extends Alert {
  companies: { name: string; slug: string } | { name: string; slug: string }[] | null;
}

export interface KPIViewItem {
  metricKey: string;
  label: string;
  value: number;
  unit: string | null;
  deltaPct: number | null;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface CampaignRow {
  campaignName: string;
  platform: "meta_ads" | "google_ads" | "tiktok_ads" | "shopify";
  spend: number;
  clicks: number;
  impressions: number;
  roas: number | null;
  sourceBadge?: "DEMO DATA";
}
