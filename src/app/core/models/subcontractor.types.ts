// ============================================================
// subcontractor.types.ts  (updated)
// ============================================================
import type { Lang } from "./Settings.types";

// ── Core entities ────────────────────────────────────────────

export interface Subcontractor {
  id: string;
  name: string;
  specialty: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

export interface SubcontractorContract {
  id: string;
  subcontractorId: string;
  contractValue: number;
}

export interface SubcontractorPayment {
  id: string;
  subcontractorId: string;
  amount: number;
}

export interface SubcontractorStats {
  contracts: number;
  totalPaid: number;
  totalContractValue: number;
}

export interface SubcontractorData {
  subcontractors: Subcontractor[];
  contracts: SubcontractorContract[];
  payments: SubcontractorPayment[];
}

// ── Form ─────────────────────────────────────────────────────

/** The shape of the controlled form inside the modal */
export type SubcontractorFormData = Omit<Subcontractor, "id">;

/** Payload sent to onSave — includes id when editing, omits it when adding */
export type SubcontractorSavePayload =
  | (SubcontractorFormData & { id: string })   // edit
  | SubcontractorFormData;                      // add

/** Per-field validation errors (all fields optional) */
export type SubcontractorFormErrors = Partial<Record<keyof SubcontractorFormData, string>>;

// ── Modal ────────────────────────────────────────────────────

export type SubcontractorModalMode = "add" | "view";

export interface SubcontractorModalProps {
  /** null → Add mode,  object → View/Edit mode */
  subcontractor: Subcontractor | null;
  stats?: SubcontractorStats;
  mode: SubcontractorModalMode;
  onClose: () => void;
  onSave: (data: SubcontractorSavePayload) => void;
  onDelete: (id: string) => void;
}

// ── Component props ──────────────────────────────────────────

export interface SubcontractorHeaderProps {
  lang: Lang;
  onAdd: () => void;
}

export interface SubcontractorCardProps {
  subcontractor: Subcontractor;
  stats: SubcontractorStats;
  onDetails: () => void;
}

export interface SubcontractorGridProps {
  subcontractors: Subcontractor[];
  statsMap: Record<string, SubcontractorStats>;
  onDetails: (id: string) => void;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}
