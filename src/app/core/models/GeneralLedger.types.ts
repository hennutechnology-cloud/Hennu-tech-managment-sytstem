// ============================================================
// GeneralLedger.types.ts
// ============================================================

export interface LedgerEntry {
  id: number;
  date: string;       // "YYYY-MM-DD"
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface LedgerAccount {
  code: string;
  name: string;
}

export interface LedgerFilters {
  accountCode: string;
  dateFrom: string;
  dateTo: string;
}

export interface LedgerSummary {
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
  openingBalance: number;
}

// ── Component Props ───────────────────────────────────────────────────────

export interface LedgerHeaderProps {
  onExportPdf: () => void;
  exporting: boolean;
}

export interface LedgerFiltersProps {
  filters: LedgerFilters;
  accounts: LedgerAccount[];
  onChange: (filters: LedgerFilters) => void;
  onApply: () => void;
}

export interface LedgerTableProps {
  entries: LedgerEntry[];
  summary: LedgerSummary;
  accountName: string;
  filters: LedgerFilters;
}
