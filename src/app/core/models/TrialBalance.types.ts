// ============================================================
// TrialBalance.types.ts
// ============================================================

export interface TrialBalanceItem {
  code: string;
  account: string;
  debit: number;
  credit: number;
}

export interface TrialBalanceSummary {
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  difference: number;
}

export interface TrialBalanceFilters {
  dateFrom: string;
  dateTo: string;
}

export interface TrialHeaderProps {
  onExport: () => void;
  exporting: boolean;
}

export interface TrialDateFilterProps {
  filters: TrialBalanceFilters;
  onChange: (f: TrialBalanceFilters) => void;
  onApply: () => void;
}

export interface BalanceStatusProps {
  summary: TrialBalanceSummary;
}

export interface TrialTableProps {
  items: TrialBalanceItem[];
  summary: TrialBalanceSummary;
}

export interface NoDataAlertProps {
  isOpen: boolean;
  onClose: () => void;
}
