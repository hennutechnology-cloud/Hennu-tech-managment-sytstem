// ============================================================
// invoice.types.ts
// ============================================================
import type { Lang } from "./Settings.types";

// ── Enums / unions ────────────────────────────────────────────
export type InvoiceAccountType = "revenue" | "expense";
export type InvoicePartyType   = "subcontractor" | "client";
export type InvoiceStatus      = "paid" | "partial" | "pending" | "overdue";

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
}

// ── Form values ───────────────────────────────────────────────
export interface InvoiceFormValues {
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
  lang:         Lang;
}

export interface InvoiceTableProps {
  invoices:     Invoice[];
  lang:         Lang;
  onDetails:    (invoice: Invoice) => void;
  onAddPayment: (invoice: Invoice) => void;
  onExportPdf:  (invoice: Invoice) => void;
}

export interface InvoiceModalProps {
  isOpen:         boolean;
  editInvoice:    Invoice | null;          // null = create, Invoice = edit
  lang:           Lang;
  subcontractors: { id: string; name: string; specialty: string }[];
  projects:       { id: string; name: string }[];
  onClose:        () => void;
  onSave:         (values: InvoiceFormValues, id?: string) => Promise<void>;
}

export interface InvoiceDetailsModalProps {
  isOpen:          boolean;
  invoice:         Invoice | null;
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
  editPayment:   PaymentRecord | null;     // null = add, PaymentRecord = edit
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
