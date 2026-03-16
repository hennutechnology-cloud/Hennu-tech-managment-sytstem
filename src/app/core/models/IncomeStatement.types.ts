// ============================================================
// IncomeStatement.types.ts
// All numeric data — rendered via formatNum()/sar() from i18n.
// period.label is a plain API string returned in user's language.
// ============================================================
import type { Lang } from "./Settings.types";

export interface RevenueSection {
  sales:       number;
  otherIncome: number;
  total:       number;
}

export interface CogsSection {
  materials: number;
  labor:     number;
  other:     number;
  total:     number;
}

export interface OperatingExpensesSection {
  salaries:       number;
  rent:           number;
  administrative: number;
  utilities:      number;
  marketing:      number;
  depreciation:   number;
  total:          number;
}

export interface OtherExpensesSection {
  taxes:    number;
  total:    number;
}

export interface IncomeStatementData {
  revenue:           RevenueSection;
  cogs:              CogsSection;
  grossProfit:       number;
  operatingExpenses: OperatingExpensesSection;
  operatingIncome:   number;
  otherExpenses:     OtherExpensesSection;
  netIncome:         number;
}

export type PeriodKey =
  | "annual_2026"
  | "q1_2026"
  | "q2_2026"
  | "q3_2026"
  | "q4_2026";

export interface Period {
  key:   PeriodKey;
  label: string;  // plain API string — already in user's language
}

// ── Component Props ────────────────────────────────────────────
export interface IncomeHeaderProps {
  onExport:  () => void;
  exporting: boolean;
  lang:      Lang;
}

export interface PeriodSelectorProps {
  selected: PeriodKey;
  periods:  Period[];
  onChange: (key: PeriodKey) => void;
  lang:     Lang;
}

export interface IncomeStatementBodyProps {
  data: IncomeStatementData;
  lang: Lang;
}

export interface NoDataAlertProps {
  isOpen:  boolean;
  onClose: () => void;
  lang:    Lang;
}
