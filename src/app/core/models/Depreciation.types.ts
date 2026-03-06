// ============================================================
// Depreciation.types.ts
// ============================================================
import type { Lang } from "./Settings.types";

// Stored as a stable key — resolved to display string by resolveMethod()
export type DepreciationMethod = "straight-line" | "declining-balance";

export interface DepreciationAsset {
  id:                 number;
  name:               string;   // plain API string
  cost:               number;
  salvageValue:       number;
  usefulLife:         number;
  method:             DepreciationMethod;
  annualDepreciation: number;
  accumulated:        number;
  bookValue:          number;
  purchaseDate:       string;   // "YYYY-MM-DD" — formatted by util.i18n
}

export interface DepreciationTrend {
  year:         string;   // e.g. "2024" — always a year string, not a month
  depreciation: number;
}

export interface DepreciationSummaryData {
  totalAssetValue:    number;
  totalAccumulated:   number;
  totalBookValue:     number;
  annualDepreciation: number;
}

export interface DepreciationData {
  assets:  DepreciationAsset[];
  trend:   DepreciationTrend[];
  summary: DepreciationSummaryData;
}

// ── Modal / Form ──────────────────────────────────────────────
export interface DepreciationFormValues {
  name:         string;
  cost:         string;
  salvageValue: string;
  usefulLife:   string;
  method:       DepreciationMethod;
  purchaseDate: string;
}

export interface DepreciationFormErrors {
  name?:         string;
  cost?:         string;
  salvageValue?: string;
  usefulLife?:   string;
  purchaseDate?: string;
}

// ── Component Props ───────────────────────────────────────────
export interface DepreciationModalProps {
  isOpen:    boolean;
  editAsset: DepreciationAsset | null;
  onClose:   () => void;
  onSave:    (values: DepreciationFormValues) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  lang:      Lang;
}

export interface DepreciationHeaderProps   { lang: Lang; }
export interface DepreciationSummaryProps  { lang: Lang; }
export interface DepreciationChartProps    { lang: Lang; }
export interface DepreciationTableProps    { lang: Lang; }
