// ============================================================
// invoice.types.ts  (updated)
// ============================================================
import type { Lang } from "./Settings.types";

// ── Enums / unions ────────────────────────────────────────────
export type InvoiceAccountType = "revenue" | "expense";
export type InvoicePartyType   = "subcontractor" | "client";
export type InvoiceStatus      = "paid" | "partial" | "pending" | "overdue";

/**
 * "normal"   → classic fixed-amount invoice (existing behaviour)
 * "progress" → مستخلص: represents a chunk of work done against a Contract
 */
export type InvoiceKind = "normal" | "progress";

// ── Contract ──────────────────────────────────────────────────
export interface Contract {
  id:          string;
  name:        string;
  /** Total agreed contract value */
  totalAmount: number;
  projectId:   string;
  partyId:     string;
  partyType:   InvoicePartyType;
  accountType: InvoiceAccountType;
  createdAt:   string;
  description: string;
}

/** Derived view returned by the service – never stored */
export interface ContractSummary {
  contract:         Contract;
  /** Sum of all progress invoices belonging to this contract */
  totalProgress:    number;
  /** totalAmount - totalProgress */
  remainingWork:    number;
  /** Percentage completed (0-100) */
  progressPct:      number;
  invoices:         Invoice[];
}

// ── Core entities ─────────────────────────────────────────────
export interface PaymentRecord {
  id:        string;
  invoiceId: string;
  amount:    number;
  date:      string;
  note:      string;
  method:    string;
}

export interface Invoice {
  id:              string;
  invoiceNumber:   string;
  /** "normal" (default) or "progress" */
  invoiceKind:     InvoiceKind;
  /** Only set when invoiceKind === "progress" */
  contractId?:     string;
  accountType:     InvoiceAccountType;
  partyType:       InvoicePartyType;
  partyId:         string;
  partyName:       string;
  partyEntity:     string;
  projectId:       string;
  projectName:     string;
  date:            string;
  dueDate:         string;
  totalAmount:     number;
  paidAmount:      number;
  remainingAmount: number;
  status:          InvoiceStatus;
  description:     string;
  payments:        PaymentRecord[];
  createdAt:       string;
}

// ── Summary ────────────────────────────────────────────────────
export interface InvoiceSummary {
  totalInvoices:   number;
  totalRevenues:   number;
  totalExpenses:   number;
  fullyPaid:       number;
  partiallyPaid:   number;
  pending:         number;
  overdue:         number;
  totalReceivable: number;
  totalPayable:    number;
  /** Number of active contracts */
  totalContracts:  number;
}

// ── Form values ───────────────────────────────────────────────
export interface InvoiceFormValues {
  invoiceKind:  InvoiceKind;
  contractId:   string;           // "" when normal
  accountType:  InvoiceAccountType;
  partyType:    InvoicePartyType;
  partyId:      string;
  partyEntity:  string;
  projectId:    string;
  date:         string;
  dueDate:      string;
  totalAmount:  string;
  description:  string;
}

export interface InvoiceFormErrors {
  partyId?:     string;
  partyEntity?: string;
  projectId?:   string;
  date?:        string;
  dueDate?:     string;
  totalAmount?: string;
  description?: string;
  contractId?:  string;
}

export interface ContractFormValues {
  name:        string;
  totalAmount: string;
  projectId:   string;
  partyId:     string;
  partyType:   InvoicePartyType;
  accountType: InvoiceAccountType;
  description: string;
}

export interface ContractFormErrors {
  name?:        string;
  totalAmount?: string;
  projectId?:   string;
  partyId?:     string;
}

export interface PaymentFormValues {
  amount:  string;
  date:    string;
  note:    string;
  method:  string;
}

export interface PaymentFormErrors {
  amount?: string;
  date?:   string;
  method?: string;
}

// ── Component props ───────────────────────────────────────────
export interface InvoiceHeaderProps {
  lang:    Lang;
  summary: InvoiceSummary;
  onAdd:   () => void;
}

export interface InvoiceSummaryCardsProps {
  summary: InvoiceSummary;
  lang:    Lang;
}

export interface InvoiceFiltersProps {
  search:       string;
  onSearch:     (v: string) => void;
  statusFilter: InvoiceStatus | "all";
  onStatus:     (s: InvoiceStatus | "all") => void;
  typeFilter:   InvoiceAccountType | "all";
  onType:       (t: InvoiceAccountType | "all") => void;
  kindFilter:   InvoiceKind | "all";
  onKind:       (k: InvoiceKind | "all") => void;
  lang:         Lang;
}

export interface InvoiceTableProps {
  invoices:     Invoice[];
  contracts:    Contract[];
  lang:         Lang;
  onDetails:    (invoice: Invoice) => void;
  onAddPayment: (invoice: Invoice) => void;
  onExportPdf:  (invoice: Invoice) => void;
}

export interface InvoiceModalProps {
  isOpen:         boolean;
  editInvoice:    Invoice | null;
  lang:           Lang;
  subcontractors: { id: string; name: string; specialty: string }[];
  projects:       { id: string; name: string }[];
  contracts:      Contract[];
  onClose:        () => void;
  onSave:         (values: InvoiceFormValues, id?: string) => Promise<void>;
}

export interface InvoiceDetailsModalProps {
  isOpen:          boolean;
  invoice:         Invoice | null;
  contract:        Contract | null;
  lang:            Lang;
  subcontractors:  { id: string; name: string; specialty: string }[];
  projects:        { id: string; name: string }[];
  onClose:         () => void;
  onEdit:          (invoice: Invoice) => void;
  onDelete:        (invoice: Invoice) => void;
  onAddPayment:    (invoice: Invoice) => void;
  onEditPayment:   (invoice: Invoice, payment: PaymentRecord) => void;
  onDeletePayment: (invoice: Invoice, paymentId: string) => void;
  onExportPdf:     (invoice: Invoice) => void;
}

export interface PaymentModalProps {
  isOpen:        boolean;
  invoice:       Invoice | null;
  editPayment:   PaymentRecord | null;
  lang:          Lang;
  onClose:       () => void;
  onSave:        (invoiceId: string, values: PaymentFormValues, paymentId?: string) => Promise<void>;
}

export interface DeleteConfirmModalProps {
  isOpen:       boolean;
  title:        string;
  description:  string;
  lang:         Lang;
  onClose:      () => void;
  onConfirm:    () => void;
}

export interface ContractModalProps {
  isOpen:         boolean;
  editContract:   Contract | null;
  lang:           Lang;
  subcontractors: { id: string; name: string; specialty: string }[];
  projects:       { id: string; name: string }[];
  onClose:        () => void;
  onSave:         (values: ContractFormValues, id?: string) => Promise<void>;
}

export interface ContractsPanelProps {
  contracts:    ContractSummary[];
  lang:         Lang;
  onAddInvoice: (contract: Contract) => void;
  onEdit:       (contract: Contract) => void;
  onDelete:     (contract: Contract) => void;
}
