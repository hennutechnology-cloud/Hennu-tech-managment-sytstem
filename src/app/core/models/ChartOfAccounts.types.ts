// ============================================================
// ChartOfAccounts.types.ts
// ============================================================
import type { Lang } from "./Settings.types";

export type AccountType = "main" | "sub" | "detail";

export interface Account {
  code:      string;   // plain string from API
  name:      string;   // plain string from API
  type:      AccountType;
  balance:   number;
  children?: Account[];
}

export interface AccountSummary {
  totalAssets:      number;
  totalLiabilities: number;
  equity:           number;
  revenues:         number;
  expenses:         number;
}

// ── Form ──────────────────────────────────────────────────────
export interface AccountFormValues {
  code:       string;
  name:       string;
  type:       AccountType;
  balance:    string;    // kept as string so the input stays controlled
  parentCode: string;    // "" = top-level
}

export interface AccountFormErrors {
  code?:    string;
  name?:    string;
  type?:    string;
  balance?: string;
}

// ── Component Props ───────────────────────────────────────────
export interface ChartHeaderProps {
  onAddAccount: () => void;
  lang:         Lang;
}

export interface AccountsTreeProps {
  accounts: Account[];
  onEdit:   (account: Account) => void;
  onDelete: (account: Account) => void;
  lang:     Lang;
}

export interface SummaryCardsProps {
  summary: AccountSummary;
  lang:    Lang;
}

export interface AccountModalProps {
  isOpen:      boolean;
  editAccount: Account | null;
  accounts:    Account[];
  onClose:     () => void;
  onSave:      (values: AccountFormValues) => Promise<void>;
  lang:        Lang;
}

export interface DeleteConfirmProps {
  isOpen:    boolean;
  account:   Account | null;
  onConfirm: () => Promise<void>;
  onCancel:  () => void;
  lang:      Lang;
}
