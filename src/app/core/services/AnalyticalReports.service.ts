// ============================================================
// AnalyticalReports.service.ts
// ============================================================
import { createContext, useContext, useState, useEffect } from "react";
import type {
  AnalyticalReportsData,
  DateRange,
  ReportType,
} from "../models/AnalyticalReports.types";

// ── Fetch layer ───────────────────────────────────────────────

export async function fetchAnalyticalReports(
  _dateRange: DateRange,
  _reportType: ReportType,
): Promise<AnalyticalReportsData> {
  // TODO: replace with real API call:
  // const params = new URLSearchParams({ from: _dateRange.from, to: _dateRange.to, type: _reportType });
  // const res = await fetch(`/api/analytical-reports?${params}`);
  // if (!res.ok) throw new Error("Failed to fetch");
  // return res.json();

  // Static seed — mirrors real API response shape.
  // The API returns report names, month labels, and category names
  // as plain strings already in the user's language.
  // The frontend never translates these values.
  return {
    quickReports: [
      { id: "cashflow",    name: "تقرير التدفق النقدي", color: "from-blue-500 to-blue-600"       },
      { id: "profit",      name: "تحليل الربحية",       color: "from-emerald-500 to-emerald-600" },
      { id: "cost",        name: "تحليل التكاليف",       color: "from-red-500 to-red-600"         },
      { id: "customers",   name: "تقرير العملاء",        color: "from-purple-500 to-purple-600"   },
      { id: "suppliers",   name: "تقرير الموردين",       color: "from-orange-500 to-orange-600"   },
      { id: "expenses",    name: "تحليل المصروفات",      color: "from-pink-500 to-pink-600"       },
    ],
    // month is a number (1–12) — frontend resolves to name via SHORT_MONTHS[lang]
    profitability: [
      { month: 1, margin: 28.5, roi: 12.3 },
      { month: 2, margin: 31.8, roi: 14.1 },
      { month: 3, margin: 34.6, roi: 15.7 },
      { month: 4, margin: 27.5, roi: 11.8 },
      { month: 5, margin: 33.3, roi: 16.2 },
      { month: 6, margin: 36.1, roi: 18.5 },
    ],
    // category is a plain string from the API — already in the user's language
    expenseBreakdown: [
      { category: "الرواتب",   amount: 2_200_000 },
      { category: "المواد",    amount: 3_200_000 },
      { category: "المعدات",   amount: 1_800_000 },
      { category: "النقل",     amount:   750_000 },
      { category: "الإيجارات", amount:   800_000 },
      { category: "إدارية",    amount:   500_000 },
    ],
  };
}

export async function exportQuickReport(reportId: string, dateRange: DateRange): Promise<void> {
  // TODO: replace with real API call
  console.log("Exporting report", reportId, dateRange);
}

// ── Context ───────────────────────────────────────────────────

export interface AnalyticalReportsContextValue {
  data:          AnalyticalReportsData | null;
  loading:       boolean;
  error:         string | null;
  dateRange:     DateRange;
  setDateRange:  (v: DateRange) => void;
  reportType:    ReportType;
  setReportType: (v: ReportType) => void;
  applyFilter:   () => void;
}

export const AnalyticalReportsContext =
  createContext<AnalyticalReportsContextValue | null>(null);

export function useAnalyticalReports(): AnalyticalReportsContextValue {
  const ctx = useContext(AnalyticalReportsContext);
  if (!ctx) throw new Error("useAnalyticalReports must be used inside <AnalyticalReportsProvider>");
  return ctx;
}

export function useAnalyticalReportsState(): AnalyticalReportsContextValue {
  const [data,       setData]       = useState<AnalyticalReportsData | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [dateRange,  setDateRange]  = useState<DateRange>({ from: "2026-01-01", to: "2026-02-21" });
  const [reportType, setReportType] = useState<ReportType>("all");
  const [trigger,    setTrigger]    = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAnalyticalReports(dateRange, reportType)
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => { if (!cancelled) setError("failed"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [trigger]);

  function applyFilter() { setTrigger((t) => t + 1); }

  return { data, loading, error, dateRange, setDateRange, reportType, setReportType, applyFilter };
}
