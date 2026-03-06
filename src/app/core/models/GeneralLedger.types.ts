// ============================================================
// GeneralLedger.types.ts
// entry.date is "YYYY-MM-DD" — formatted by formatLedgerDate(lang, iso)
// entry.description and account.name are plain API strings
// ============================================================
import type { Lang } from "./Settings.types";

export interface LedgerEntry {
  id:          number;
  date:        string;   // "YYYY-MM-DD" — never a month number, it's a full date
  description: string;   // plain API string
  debit:       number;
  credit:      number;
  balance:     number;
}

export interface LedgerAccount {
  code: string;   // plain API string
  name: string;   // plain API string
}

export interface LedgerFilters {
  accountCode: string;
  dateFrom:    string;  // "YYYY-MM-DD"
  dateTo:      string;  // "YYYY-MM-DD"
}

export interface LedgerSummary {
  totalDebit:      number;
  totalCredit:     number;
  closingBalance:  number;
  openingBalance:  number;
}

// ── Component Props ───────────────────────────────────────────
export interface LedgerHeaderProps {
  onExportPdf: () => void;
  exporting:   boolean;
  lang:        Lang;
}

export interface LedgerFiltersProps {
  filters:   LedgerFilters;
  accounts:  LedgerAccount[];
  onChange:  (filters: LedgerFilters) => void;
  onApply:   () => void;
  lang:      Lang;
}

export interface LedgerTableProps {
  entries:     LedgerEntry[];
  summary:     LedgerSummary;
  accountName: string;   // plain string built from account.code + account.name
  filters:     LedgerFilters;
  lang:        Lang;
}

export interface NoDataAlertProps {
  isOpen:  boolean;
  onClose: () => void;
  lang:    Lang;
}
