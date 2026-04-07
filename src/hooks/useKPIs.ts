"use client";

import { useState } from "react";
import type { KPIData } from "@/types";

export function useKPIs() {
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  return { kpis, setKpis, loading, setLoading };
}
