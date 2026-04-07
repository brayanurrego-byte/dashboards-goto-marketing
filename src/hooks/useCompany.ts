"use client";

import { useState } from "react";

export function useCompany() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  return { selectedCompanyId, setSelectedCompanyId };
}
