// ============================================================
// BOQManagement.types.ts
// month numbers 1–12 (never month name strings from API).
// section.name, item.description are plain API strings.
// All static UI labels live in boqManagement.i18n.ts.
// ============================================================
import type { Lang } from "./Settings.types";

// ── Unit of measurement ───────────────────────────────────────
export type BOQUnit = "m3" | "m2" | "ton" | "m" | "unit" | "ls";

// ── View mode ─────────────────────────────────────────────────
export type ViewMode = "standard" | "comparison";

// ── A single BOQ line item ────────────────────────────────────
export interface BOQItem {
  id:          string;
  code:        string;       // e.g. "01.001"
  sectionCode: string;       // e.g. "01"
  description: string;       // plain API string
  unit:        BOQUnit;
  quantity:    number;
  unitPrice:   number;
  totalCost:   number;       // quantity * unitPrice
  actualCost:  number;
  variance:    number;       // % deviation  (actualCost/totalCost - 1) * 100
  month:       number;       // 1–12
}

// ── A section (group of items) ────────────────────────────────
export interface BOQSection {
  code:  string;   // e.g. "01"
  name:  string;   // plain API string
  items: BOQItem[];
}

// ── Summary totals ────────────────────────────────────────────
export interface BOQSummary {
  totalEstimated: number;
  totalActual:    number;
  totalVariance:  number;   // % overall
}

// ── Full page data ────────────────────────────────────────────
export interface BOQManagementData {
  sections: BOQSection[];
  summary:  BOQSummary;
}

// ── Form values (add / edit) ──────────────────────────────────
export interface BOQItemFormValues {
  code:        string;
  sectionCode: string;
  description: string;
  unit:        BOQUnit;
  quantity:    string;   // string for input binding
  unitPrice:   string;
  actualCost:  string;
  month:       string;   // "1"–"12"
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
  search:      string;
  onSearch:    (v: string) => void;
  viewMode:    ViewMode;
  onViewMode:  (m: ViewMode) => void;
  lang:        Lang;
}

export interface BOQTableProps {
  sections:         BOQSection[];
  viewMode:         ViewMode;
  expandedSections: Set<string>;
  onToggleSection:  (code: string) => void;
  onEdit:           (item: BOQItem) => void;
  onDelete:         (item: BOQItem) => void;
  lang:             Lang;
}

export interface BOQItemModalProps {
  isOpen:    boolean;
  editItem:  BOQItem | null;
  sections:  BOQSection[];
  onClose:   () => void;
  onSave:    (values: BOQItemFormValues) => Promise<void>;
  lang:      Lang;
}

export interface BOQDeleteConfirmProps {
  isOpen:   boolean;
  item:     BOQItem | null;
  onClose:  () => void;
  onConfirm: () => Promise<void>;
  lang:     Lang;
}
