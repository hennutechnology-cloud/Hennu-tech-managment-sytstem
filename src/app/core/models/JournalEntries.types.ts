// ============================================================
// JournalEntries.types.ts
// ============================================================
import type { Lang } from "./Settings.types";

export interface EntryLine {
  id: number;
  accountCode: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: number;
  date: string;
  description: string;
  lines: EntryLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

// ── Form ──────────────────────────────────────────────────────────────────
export interface EntryLineForm {
  id: number;
  accountCode: string;
  description: string;
  debit: string;
  credit: string;
}

export interface JournalEntryFormValues {
  date: string;
  description: string;
  lines: EntryLineForm[];
}

export interface JournalEntryFormErrors {
  date?: string;
  description?: string;
  lines?: { accountCode?: string; amounts?: string }[];
  balance?: string;
}

// ── Component Props ───────────────────────────────────────────────────────
export interface JournalHeaderProps {
  lang: Lang;
}

export interface EntryFormProps {
  lang: Lang;
  onSave: (values: JournalEntryFormValues) => Promise<void>;
}

export interface RecentEntriesProps {
  lang: Lang;
  entries: JournalEntry[];
  onView: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}

export interface EntryDetailModalProps {
  lang: Lang;
  isOpen: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}

export interface EntryEditModalProps {
  lang: Lang;
  isOpen: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onSave: (id: number, values: JournalEntryFormValues) => Promise<void>;
}

export interface DeleteConfirmProps {
  lang: Lang;
  isOpen: boolean;
  entry: JournalEntry | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const ACCOUNT_OPTIONS = [
  { code: "1101", name: "الصندوق" },
  { code: "1102", name: "البنك - الراجحي" },
  { code: "1103", name: "البنك - الأهلي" },
  { code: "1110", name: "العملاء" },
  { code: "1120", name: "المخزون" },
  { code: "2101", name: "الموردون" },
  { code: "4001", name: "إيرادات المبيعات" },
  { code: "4002", name: "إيرادات أخرى" },
  { code: "5001", name: "تكلفة البضاعة المباعة" },
  { code: "5002", name: "الرواتب والأجور" },
];
