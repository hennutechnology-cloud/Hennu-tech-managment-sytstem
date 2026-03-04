// ============================================================
// AnalyticalReports.types.ts
// ============================================================

export type ReportType = "all" | "financial" | "performance" | "projects";

export interface QuickReport {
  id: string;
  name: string;
  color: string;
}

export interface ProfitabilityPoint {
  month: string;
  margin: number;
  roi: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
}

export interface DateRange {
  from: string; // "YYYY-MM-DD"
  to:   string; // "YYYY-MM-DD"
}

export interface AnalyticalReportsData {
  quickReports:      QuickReport[];
  profitability:     ProfitabilityPoint[];
  expenseBreakdown:  ExpenseCategory[];
}
