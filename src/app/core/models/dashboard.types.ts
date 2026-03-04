// ============================================================
// dashboard.types.ts
// ============================================================
export interface RevenueExpense {
  month: string;
  revenue: number;
  expenses: number;
}

export interface Profit {
  month: string;
  profit: number;
}

export interface CashFlow {
  month: string;
  cashFlow: number;
  forecast?: boolean;
}

export interface BudgetActual {
  category: string;
  budget: number;
  actual: number;
}

export type RiskLevel = "high" | "medium" | "low";
export type AlertIconType = "alert" | "trend" | "activity";

export interface AiAlert {
  title: string;
  description: string;
  risk: RiskLevel;
  iconType: AlertIconType;
}

export interface KPI {
  title: string;
  value: number;
  change: string;
  isPositive: boolean;
  color: string;
}

export type HealthStatus = "excellent" | "good" | "warning" | "critical";

export interface AIHealthScoreModel {
  score: number; // 0 - 100
  status: HealthStatus;
}
