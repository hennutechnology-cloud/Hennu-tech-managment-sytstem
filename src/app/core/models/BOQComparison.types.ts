// ============================================================
// BOQComparison.types.ts
// All dynamic API strings (item names, supplier names) are plain
// strings returned in the user's language.
// Static UI labels live in boqComparison.i18n.ts.
// ============================================================
import type { Lang } from "./Settings.types";

// ── Upload state ──────────────────────────────────────────────
export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadFile {
  name:   string;
  size:   number;   // bytes
  status: UploadStatus;
}

// ── A single BOQ line item ────────────────────────────────────
export interface BOQItem {
  id:           string;
  item:         string;   // plain API string – already in user's language
  quantity:     string;   // e.g. "8,900 م³" – plain API string
  estimated:    number;   // unit price
  suppliers:    SupplierQuote[];
  bestSupplierId: string; // matches SupplierQuote.id of winner
  savings:      number;   // total savings vs estimated
}

export interface SupplierQuote {
  id:        string;   // "supplier1", "supplier2", …
  name:      string;   // plain API string – "مورد 1" / "Supplier 1"
  unitPrice: number;
}

// ── Savings summary ───────────────────────────────────────────
export interface SavingsSummary {
  totalSavings:     number;
  itemCount:        number;
  aiAccuracyPct:    number;   // 0–100
}

// ── Optimisation suggestion ───────────────────────────────────
export type SuggestionType = "saving" | "risk";

export interface OptimisationSuggestion {
  id:   string;
  type: SuggestionType;
  text: string;   // plain API string
}

// ── Full page data (single fetch) ────────────────────────────
export interface BOQComparisonData {
  items:       BOQItem[];
  summary:     SavingsSummary;
  suggestions: OptimisationSuggestion[];
}

// ── Component prop types ──────────────────────────────────────
export interface BOQHeaderProps {
  lang: Lang;
}

export interface BOQUploadAreaProps {
  boqStatus:    UploadStatus;
  quotesStatus: UploadStatus;
  onBOQUpload:    (file: File) => void;
  onQuotesUpload: (file: File) => void;
  lang: Lang;
}

export interface BOQSavingsSummaryProps {
  summary: SavingsSummary;
  lang:    Lang;
}

export interface BOQComparisonTableProps {
  items:    BOQItem[];
  onAIOptimise: () => void;
  lang:     Lang;
}

export interface BOQOptimisationProps {
  suggestions: OptimisationSuggestion[];
  lang:        Lang;
}
