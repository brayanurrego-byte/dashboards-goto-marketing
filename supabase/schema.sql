-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tables
CREATE TABLE IF NOT EXISTS agencies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  plan       TEXT DEFAULT 'standard',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS companies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id  UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL,
  tier       TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'professional', 'enterprise')),
  industry   TEXT,
  active     BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agency_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_companies_agency ON companies(agency_id);

CREATE TABLE IF NOT EXISTS platform_connections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform    TEXT NOT NULL CHECK (platform IN ('meta_ads', 'google_ads', 'tiktok_ads', 'shopify', 'google_sheets', 'excel')),
  credentials JSONB,
  status      TEXT DEFAULT 'active',
  last_sync   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kpi_configs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  metric_key    TEXT NOT NULL,
  label         TEXT NOT NULL,
  target        NUMERIC,
  unit          TEXT,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kpi_data (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  metric_key   TEXT NOT NULL,
  value        NUMERIC NOT NULL,
  period_start DATE NOT NULL,
  period_end   DATE NOT NULL,
  source       TEXT,
  synced_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kpi_data_company_period ON kpi_data(company_id, period_start DESC);

CREATE TABLE IF NOT EXISTS alerts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  severity   TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_alerts_company ON alerts(company_id, read, created_at DESC);

-- RLS activation
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Remove stale policies for idempotent execution
DROP POLICY IF EXISTS agencies_isolation_select ON agencies;
DROP POLICY IF EXISTS agencies_isolation_insert ON agencies;
DROP POLICY IF EXISTS agencies_isolation_update ON agencies;
DROP POLICY IF EXISTS agencies_isolation_delete ON agencies;

DROP POLICY IF EXISTS companies_isolation_select ON companies;
DROP POLICY IF EXISTS companies_isolation_insert ON companies;
DROP POLICY IF EXISTS companies_isolation_update ON companies;
DROP POLICY IF EXISTS companies_isolation_delete ON companies;

DROP POLICY IF EXISTS platform_connections_isolation_select ON platform_connections;
DROP POLICY IF EXISTS platform_connections_isolation_insert ON platform_connections;
DROP POLICY IF EXISTS platform_connections_isolation_update ON platform_connections;
DROP POLICY IF EXISTS platform_connections_isolation_delete ON platform_connections;

DROP POLICY IF EXISTS kpi_configs_isolation_select ON kpi_configs;
DROP POLICY IF EXISTS kpi_configs_isolation_insert ON kpi_configs;
DROP POLICY IF EXISTS kpi_configs_isolation_update ON kpi_configs;
DROP POLICY IF EXISTS kpi_configs_isolation_delete ON kpi_configs;

DROP POLICY IF EXISTS kpi_data_isolation_select ON kpi_data;
DROP POLICY IF EXISTS kpi_data_isolation_insert ON kpi_data;
DROP POLICY IF EXISTS kpi_data_isolation_update ON kpi_data;
DROP POLICY IF EXISTS kpi_data_isolation_delete ON kpi_data;

DROP POLICY IF EXISTS alerts_isolation_select ON alerts;
DROP POLICY IF EXISTS alerts_isolation_insert ON alerts;
DROP POLICY IF EXISTS alerts_isolation_update ON alerts;
DROP POLICY IF EXISTS alerts_isolation_delete ON alerts;

-- Agencies policies (admin bound to own agency)
CREATE POLICY agencies_isolation_select ON agencies
  FOR SELECT
  USING (
    id = (auth.jwt() ->> 'agency_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY agencies_isolation_insert ON agencies
  FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY agencies_isolation_update ON agencies
  FOR UPDATE
  USING (
    id = (auth.jwt() ->> 'agency_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    id = (auth.jwt() ->> 'agency_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY agencies_isolation_delete ON agencies
  FOR DELETE
  USING ((auth.jwt() ->> 'role') = 'admin');

-- Companies policies
CREATE POLICY companies_isolation_select ON companies
  FOR SELECT
  USING (
    agency_id = (auth.jwt() ->> 'agency_id')::uuid
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY companies_isolation_insert ON companies
  FOR INSERT
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
    AND agency_id = (auth.jwt() ->> 'agency_id')::uuid
  );

CREATE POLICY companies_isolation_update ON companies
  FOR UPDATE
  USING (
    agency_id = (auth.jwt() ->> 'agency_id')::uuid
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR id = (auth.jwt() ->> 'company_id')::uuid
    )
  )
  WITH CHECK (
    agency_id = (auth.jwt() ->> 'agency_id')::uuid
    AND (
      (auth.jwt() ->> 'role') = 'admin'
      OR id = (auth.jwt() ->> 'company_id')::uuid
    )
  );

CREATE POLICY companies_isolation_delete ON companies
  FOR DELETE
  USING (
    (auth.jwt() ->> 'role') = 'admin'
    AND agency_id = (auth.jwt() ->> 'agency_id')::uuid
  );

-- platform_connections policies
CREATE POLICY platform_connections_isolation_select ON platform_connections
  FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY platform_connections_isolation_insert ON platform_connections
  FOR INSERT
  WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY platform_connections_isolation_update ON platform_connections
  FOR UPDATE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY platform_connections_isolation_delete ON platform_connections
  FOR DELETE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

-- kpi_configs policies
CREATE POLICY kpi_configs_isolation_select ON kpi_configs
  FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY kpi_configs_isolation_insert ON kpi_configs
  FOR INSERT
  WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY kpi_configs_isolation_update ON kpi_configs
  FOR UPDATE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY kpi_configs_isolation_delete ON kpi_configs
  FOR DELETE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

-- kpi_data policies
CREATE POLICY kpi_data_isolation_select ON kpi_data
  FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY kpi_data_isolation_insert ON kpi_data
  FOR INSERT
  WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY kpi_data_isolation_update ON kpi_data
  FOR UPDATE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY kpi_data_isolation_delete ON kpi_data
  FOR DELETE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

-- alerts policies
CREATE POLICY alerts_isolation_select ON alerts
  FOR SELECT
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY alerts_isolation_insert ON alerts
  FOR INSERT
  WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY alerts_isolation_update ON alerts
  FOR UPDATE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY alerts_isolation_delete ON alerts
  FOR DELETE
  USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
    OR (auth.jwt() ->> 'role') = 'admin'
  );

-- Metadata contract for auth.users.raw_user_meta_data
-- {
--   "role": "admin" | "company",
--   "agency_id": "<uuid>",
--   "company_id": "<uuid|null>"
-- }
