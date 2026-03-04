// ============================================================
// IncomeStatement.types.ts
// ============================================================

export interface RevenueSection {
  sales: number;
  otherIncome: number;
  total: number;
}

export interface CogsSection {
  materials: number;
  labor: number;
  other: number;
  total: number;
}

export interface OperatingExpensesSection {
  salaries: number;
  rent: number;
  administrative: number;
  utilities: number;
  marketing: number;
  depreciation: number;
  total: number;
}

export interface OtherExpensesSection {
  interest: number;
  taxes: number;
  total: number;
}

export interface IncomeStatementData {
  revenue: RevenueSection;
  cogs: CogsSection;
  grossProfit: number;
  operatingExpenses: OperatingExpensesSection;
  operatingIncome: number;
  otherExpenses: OtherExpensesSection;
  netIncome: number;
}

export type PeriodKey =
  | "annual_2026"
  | "q1_2026"
  | "q2_2026"
  | "q3_2026"
  | "q4_2026";

export interface Period {
  key: PeriodKey;
  label: string;
}

// ── Component Props ────────────────────────────────────────────

export interface IncomeHeaderProps {
  onExport: () => void;
  exporting: boolean;
}

export interface PeriodSelectorProps {
  selected: PeriodKey;
  periods: Period[];
  onChange: (key: PeriodKey) => void;
}

export interface IncomeStatementBodyProps {
  data: IncomeStatementData;
}

export interface NoDataAlertProps {
  isOpen: boolean;
  onClose: () => void;
}
