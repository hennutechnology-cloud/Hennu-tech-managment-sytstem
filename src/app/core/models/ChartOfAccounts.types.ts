export type AccountType = "main" | "sub" | "detail";

export interface Account {
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  children?: Account[];
}

export interface AccountSummary {
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  revenues: number;
  expenses: number;
}

// ── Form ──────────────────────────────────────────────────────────────────
export interface AccountFormValues {
  code: string;
  name: string;
  type: AccountType;
  balance: string; // kept as string so the input stays controlled
  parentCode: string; // "" = top-level
}

export interface AccountFormErrors {
  code?: string;
  name?: string;
  type?: string;
  balance?: string;
}

// ── Component Props ───────────────────────────────────────────────────────
export interface ChartHeaderProps {
  title?: string;
  subtitle?: string;
  onAddAccount: () => void;
}

export interface AccountsTreeProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export interface SummaryCardsProps {
  summary: AccountSummary;
}

export interface AccountModalProps {
  isOpen: boolean;
  editAccount: Account | null; // null = create mode
  accounts: Account[];         // for parent selector
  onClose: () => void;
  onSave: (values: AccountFormValues) => Promise<void>;
}

export interface DeleteConfirmProps {
  isOpen: boolean;
  account: Account | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}
