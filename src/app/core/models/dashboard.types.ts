// ============================================================
// dashboard.types.ts
// month is a number (1–12) — frontend resolves via SHORT_MONTHS[lang]
// title, description, category are plain API strings — rendered directly
// ============================================================
import type { Lang } from "./Settings.types";

export interface RevenueExpense {
  month:    number;  // 1–12
  revenue:  number;
  expenses: number;
}

export interface Profit {
  month:  number;  // 1–12
  profit: number;
}

export interface CashFlow {
  month:     number;  // 1–12
  cashFlow:  number;
  forecast?: boolean;
}

export interface BudgetActual {
  category: string;  // plain API string, already in user's language
  budget:   number;
  actual:   number;
}

export type RiskLevel     = "high" | "medium" | "low";
export type AlertIconType = "alert" | "trend" | "activity";

export interface AiAlert {
  title:       string;  // plain API string
  description: string;  // plain API string
  risk:        RiskLevel;
  iconType:    AlertIconType;
}

export interface KPI {
  title:      string;  // plain API string
  value:      number;
  change:     string;  // e.g. "+12%" — plain API string
  isPositive: boolean;
  color:      string;  // Tailwind gradient class
}

export type HealthStatus = "excellent" | "good" | "warning" | "critical";

export interface AIHealthScoreModel {
  score:  number;        // 0–100
  status: HealthStatus;  // enum → resolved by i18n
}

// ── All dashboard data in one shape (for single page fetch) ──
export interface DashboardData {
  kpis:          KPI[];
  revenueExpense: RevenueExpense[];
  profit:        Profit[];
  cashFlow:      CashFlow[];
  budgetActual:  BudgetActual[];
  aiAlerts:      AiAlert[];
  healthScore:   AIHealthScoreModel;
}

// ── Component prop types ──────────────────────────────────────
export interface DashboardHeaderProps  { lang: Lang; }
export interface KPICardsProps         { kpis: KPI[];                  lang: Lang; }
export interface AIHealthScoreProps    { health: AIHealthScoreModel;   lang: Lang; }
export interface ChartsGridProps       { data: Pick<DashboardData, "revenueExpense" | "profit" | "cashFlow" | "budgetActual">; lang: Lang; }
export interface AIAlertPanelProps     { alerts: AiAlert[];            lang: Lang; }
