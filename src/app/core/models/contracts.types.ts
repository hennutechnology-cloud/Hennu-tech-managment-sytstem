// ============================================================
// contracts.types.ts — Extended with payment & edit support
// ============================================================
import type { Lang } from "./Settings.types";

export type ContractStatus = "active" | "completed" | "suspended" | "terminated";
export type PaymentStatus  = "paid" | "pending" | "overdue" | "partial";

// ── Core contract ─────────────────────────────────────────────
export interface Contract {
  id:               number;
  projectId:        number;
  contractNumber:   string;
  contractorName:   string;
  scopeDescription: string;
  status:           ContractStatus;
  startDate:        CalendarDate;
  endDate:          CalendarDate;
  originalValue:    number;
  variations:       number;
  currentValue:     number;
  advancePayment:   number;
  retentionPercent: number;
  retention:        number;
  paidToDate:       number;
  penalties:        number;
}

export interface CalendarDate {
  year:  number;
  month: number; // 1–12
  day:   number;
}

// ── Change order ──────────────────────────────────────────────
export interface ChangeOrder {
  id:          number;
  contractId:  number;
  orderNumber: string;
  description: string;
  amount:      number;
  approvedOn:  CalendarDate;
  status:      "approved" | "pending" | "rejected";
}

// ── Payment certificate ───────────────────────────────────────
export interface PaymentCertificate {
  id:          number;
  contractId:  number;
  certNumber:  string;
  periodFrom:  CalendarDate;
  periodTo:    CalendarDate;
  grossAmount: number;
  deductions:  number;
  netAmount:   number;
  status:      PaymentStatus;
  issuedOn:    CalendarDate;
}

// ── Payment record (direct payment, not via certificate) ──────
export interface DirectPayment {
  id:          number;
  contractId:  number;
  amount:      number;
  type:        "partial" | "full";
  description: string;
  paidOn:      CalendarDate;
  reference:   string;
}

// ── Summary stats ─────────────────────────────────────────────
export interface ContractStats {
  totalContracts:  number;
  activeContracts: number;
  totalValue:      number;
  totalPaid:       number;
  totalRetention:  number;
  totalPending:    number;
}

// ─────────────────────────────────────────────────────────────
// Component props
// ─────────────────────────────────────────────────────────────
export interface ContractsHeaderProps {
  stats: ContractStats;
  lang:  Lang;
}

export interface ContractsTableProps {
  contracts:          Contract[];
  lang:               Lang;
  selectedContractId: number | null;
  onSelect:           (c: Contract) => void;
  onView:             (c: Contract) => void;
}

export interface ContractDetailProps {
  contract:              Contract;
  changeOrders:          ChangeOrder[];
  certificates:          PaymentCertificate[];
  lang:                  Lang;
  onCertAdded?:          (cert: PaymentCertificate) => void;
  onChangeOrderAdded?:   (co: ChangeOrder) => void;
  onContractUpdated?:    (contract: Contract) => void;
}

export interface ContractCardProps {
  contract:  Contract;
  lang:      Lang;
  selected:  boolean;
  onSelect:  () => void;
  onView:    () => void;
}

export interface ContractModalProps {
  isOpen:   boolean;
  contract: Contract | null;
  lang:     Lang;
  onClose:  () => void;
}

export interface ProjectContractsWidgetProps {
  projectId: number;
  lang:      Lang;
}

// ─────────────────────────────────────────────────────────────
// Add-contract form
// ─────────────────────────────────────────────────────────────
export interface ContractFormValues {
  contractorName:   string;
  scopeDescription: string;
  status:           ContractStatus;
  startDay:         string;
  startMonth:       string;
  startYear:        string;
  endDay:           string;
  endMonth:         string;
  endYear:          string;
  originalValue:    string;
  advancePayment:   string;
  retentionPercent: string;
  penalties:        string;
}

export interface ContractFormErrors {
  contractorName?:   string;
  scopeDescription?: string;
  originalValue?:    string;
  advancePayment?:   string;
  retentionPercent?: string;
  startDate?:        string;
  endDate?:          string;
}

// ─────────────────────────────────────────────────────────────
// Edit-contract form (subset of fields editable after creation)
// ─────────────────────────────────────────────────────────────
export interface ContractEditValues {
  contractorName:   string;
  scopeDescription: string;
  status:           ContractStatus;
  endDay:           string;
  endMonth:         string;
  endYear:          string;
  retentionPercent: string;
  penalties:        string;
}

export interface ContractEditErrors {
  contractorName?:   string;
  scopeDescription?: string;
  retentionPercent?: string;
  endDate?:          string;
}

// ─────────────────────────────────────────────────────────────
// Add-payment-certificate form
// ─────────────────────────────────────────────────────────────
export interface CertFormValues {
  periodFromDay:   string;
  periodFromMonth: string;
  periodFromYear:  string;
  periodToDay:     string;
  periodToMonth:   string;
  periodToYear:    string;
  grossAmount:     string;
  deductions:      string;
  status:          PaymentStatus;
}

export interface CertFormErrors {
  periodFrom?:  string;
  periodTo?:    string;
  grossAmount?: string;
  deductions?:  string;
}

// ─────────────────────────────────────────────────────────────
// Add-change-order form
// ─────────────────────────────────────────────────────────────
export interface ChangeOrderFormValues {
  description:   string;
  amount:        string;
  status:        "approved" | "pending" | "rejected";
  approvedDay:   string;
  approvedMonth: string;
  approvedYear:  string;
}

export interface ChangeOrderFormErrors {
  description?: string;
  amount?:      string;
  approvedOn?:  string;
}

// ─────────────────────────────────────────────────────────────
// Direct payment form
// ─────────────────────────────────────────────────────────────
export interface DirectPaymentFormValues {
  amount:      string;
  type:        "partial" | "full";
  description: string;
  paidDay:     string;
  paidMonth:   string;
  paidYear:    string;
  reference:   string;
}

export interface DirectPaymentFormErrors {
  amount?:      string;
  description?: string;
  paidOn?:      string;
  reference?:   string;
}

// ─────────────────────────────────────────────────────────────
// Modal props
// ─────────────────────────────────────────────────────────────
export interface AddContractModalProps {
  isOpen:    boolean;
  projectId: number;
  lang:      Lang;
  onClose:   () => void;
  onSaved:   (contract: Contract) => void;
}

export interface AddCertModalProps {
  isOpen:     boolean;
  contractId: number;
  lang:       Lang;
  onClose:    () => void;
  onSaved:    (cert: PaymentCertificate) => void;
}

export interface AddChangeOrderModalProps {
  isOpen:     boolean;
  contractId: number;
  lang:       Lang;
  onClose:    () => void;
  onSaved:    (co: ChangeOrder) => void;
}

export interface AddPaymentModalProps {
  isOpen:       boolean;
  contractId:   number;
  remainingAmount: number;
  lang:         Lang;
  onClose:      () => void;
  onSaved:      (payment: DirectPayment) => void;
}

export interface EditContractModalProps {
  isOpen:    boolean;
  contract:  Contract | null;
  lang:      Lang;
  onClose:   () => void;
  onSaved:   (contract: Contract) => void;
}

export interface ContractDeleteConfirmProps {
  isOpen:    boolean;
  contract:  Contract | null;
  lang:      Lang;
  onConfirm: () => Promise<void>;
  onCancel:  () => void;
}
