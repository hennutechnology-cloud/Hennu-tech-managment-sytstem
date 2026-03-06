// ============================================================
// TrialBalance.types.ts
// ============================================================
import type { Lang } from "./Settings.types";

export interface TrialBalanceItem {
  code:    string;   // plain API string
  account: string;   // plain API string
  debit:   number;
  credit:  number;
}

export interface TrialBalanceSummary {
  totalDebit:  number;
  totalCredit: number;
  isBalanced:  boolean;
  difference:  number;
}

export interface TrialBalanceFilters {
  dateFrom: string;
  dateTo:   string;
}

// ── Component props ───────────────────────────────────────────
export interface TrialHeaderProps {
  lang:      Lang;
  onExport:  () => void;
  exporting: boolean;
}

export interface TrialDateFilterProps {
  lang:     Lang;
  filters:  TrialBalanceFilters;
  onChange: (f: TrialBalanceFilters) => void;
  onApply:  () => void;
}

export interface BalanceStatusProps {
  lang:    Lang;
  summary: TrialBalanceSummary;
}

export interface TrialTableProps {
  lang:    Lang;
  items:   TrialBalanceItem[];
  summary: TrialBalanceSummary;
}

export interface NoDataAlertProps {
  lang:    Lang;
  isOpen:  boolean;
  onClose: () => void;
}
