// ============================================================
// AnalyticalReports.types.ts
// ============================================================

export type ReportType = "all" | "financial" | "performance" | "projects";

export interface QuickReport {
  id:    string;
  name:  string;   // plain string from API, already in user's language
  color: string;
}

export interface ProfitabilityPoint {
  month:  number;  // 1–12 — frontend resolves to month name via SHORT_MONTHS[lang]
  margin: number;
  roi:    number;
}

export interface ExpenseCategory {
  category: string;  // plain string from API, already in user's language
  amount:   number;
}

export interface DateRange {
  from: string;  // "YYYY-MM-DD"
  to:   string;  // "YYYY-MM-DD"
}

export interface AnalyticalReportsData {
  quickReports:     QuickReport[];
  profitability:    ProfitabilityPoint[];
  expenseBreakdown: ExpenseCategory[];
}
