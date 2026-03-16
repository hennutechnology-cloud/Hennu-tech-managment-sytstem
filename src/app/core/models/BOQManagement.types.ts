// ============================================================
// BOQManagement.types.ts
// ============================================================
import type { Lang }        from "./Settings.types";
import type { Subcontractor } from "./subcontractor.types";

// ── Unit of measurement ───────────────────────────────────────
export type BOQUnit = "m3" | "m2" | "ton" | "m" | "unit" | "ls";

// ── View mode ─────────────────────────────────────────────────
export type ViewMode = "standard" | "comparison";

// ── Progress entry executor type ──────────────────────────────
export type ProgressExecutorType = "own" | "subcontract";

// ── A single progress entry logged against a BOQ item ─────────
export interface BOQProgressEntry {
  id:           string;
  itemId:       string;
  executorType: ProgressExecutorType;
  /** For subcontract: name of the sub company; for own: team/crew name */
  executorName: string;
  /** subcontractorId if executorType === "subcontract", else undefined */
  subcontractorId?: string;
  unitPrice:    number;
  quantity:     number;
  totalCost:    number;   // unitPrice * quantity
  date:         string;   // "YYYY-MM-DDTHH:mm:ss"
  notes:        string;
}

// ── Aggregated progress state for a BOQ item ──────────────────
export interface BOQItemProgress {
  itemId:          string;
  entries:         BOQProgressEntry[];
  totalProcessed:  number;   // sum of all entry quantities
  totalCost:       number;   // sum of all entry costs
  percentComplete: number;   // (totalProcessed / item.quantity) * 100
  remaining:       number;   // item.quantity - totalProcessed
}

// ── A single BOQ line item ────────────────────────────────────
export interface BOQItem {
  id:          string;
  code:        string;
  sectionCode: string;
  description: string;
  unit:        BOQUnit;
  quantity:    number;
  unitPrice:   number;
  totalCost:   number;
  actualCost:  number;
  variance:    number;
  month:       number;
}

// ── A section (group of items) ────────────────────────────────
export interface BOQSection {
  code:  string;
  name:  string;
  items: BOQItem[];
}

// ── Summary totals ────────────────────────────────────────────
export interface BOQSummary {
  totalEstimated: number;
  totalActual:    number;
  totalVariance:  number;
}

// ── Full page data ────────────────────────────────────────────
export interface BOQManagementData {
  sections: BOQSection[];
  summary:  BOQSummary;
}

// ── Item form values ──────────────────────────────────────────
export interface BOQItemFormValues {
  code:        string;
  sectionCode: string;
  description: string;
  unit:        BOQUnit;
  quantity:    string;
  unitPrice:   string;
  actualCost:  string;
  month:       string;
}

export interface BOQItemFormErrors {
  code?:        string;
  sectionCode?: string;
  description?: string;
  unit?:        string;
  quantity?:    string;
  unitPrice?:   string;
  actualCost?:  string;
  month?:       string;
}

// ── Progress form values ──────────────────────────────────────
export interface BOQProgressFormValues {
  executorType:    ProgressExecutorType;
  executorName:    string;   // free-text for "own"; auto-filled for subcontract
  subcontractorId: string;   // empty string when executorType === "own"
  unitPrice:       string;
  quantity:        string;
  date:            string;   // "YYYY-MM-DDTHH:mm:ss"
  notes:           string;
}

export interface BOQProgressFormErrors {
  executorName?:    string;
  subcontractorId?: string;
  unitPrice?:       string;
  quantity?:        string;
  date?:            string;
}

// ── Component prop types ──────────────────────────────────────
export interface BOQManagementHeaderProps {
  onAdd: () => void;
  lang:  Lang;
}

export interface BOQSummaryCardsProps {
  summary: BOQSummary;
  lang:    Lang;
}

export interface BOQFiltersProps {
  search:     string;
  onSearch:   (v: string) => void;
  viewMode:   ViewMode;
  onViewMode: (m: ViewMode) => void;
  lang:       Lang;
}

export interface BOQTableProps {
  sections:         BOQSection[];
  viewMode:         ViewMode;
  expandedSections: Set<string>;
  onToggleSection:  (code: string) => void;
  onEdit:           (item: BOQItem) => void;
  onDelete:         (item: BOQItem) => void;
  onProgress:       (item: BOQItem) => void;
  progressMap:      Record<string, BOQItemProgress>;
  lang:             Lang;
}

export interface BOQItemModalProps {
  isOpen:   boolean;
  editItem: BOQItem | null;
  sections: BOQSection[];
  onClose:  () => void;
  onSave:   (values: BOQItemFormValues) => Promise<void>;
  lang:     Lang;
}

export interface BOQDeleteConfirmProps {
  isOpen:    boolean;
  item:      BOQItem | null;
  onClose:   () => void;
  onConfirm: () => Promise<void>;
  lang:      Lang;
}

export interface BOQProgressModalProps {
  isOpen:          boolean;
  item:            BOQItem | null;
  progress:        BOQItemProgress | null;
  subcontractors:  Subcontractor[];
  onClose:         () => void;
  onAddEntry:      (itemId: string, values: BOQProgressFormValues) => Promise<void>;
  onUpdateEntry:   (itemId: string, entryId: string, values: BOQProgressFormValues) => Promise<void>;
  onDeleteEntry:   (itemId: string, entryId: string) => void;
  lang:            Lang;
}
