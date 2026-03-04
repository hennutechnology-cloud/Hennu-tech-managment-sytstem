// ============================================================
// Depreciation.types.ts
// ============================================================

export type DepreciationMethod = "قسط ثابت" | "قسط متناقص";

export interface DepreciationAsset {
  id: number;
  name: string;
  cost: number;
  salvageValue: number;
  usefulLife: number;
  method: DepreciationMethod;
  annualDepreciation: number;
  accumulated: number;
  bookValue: number;
  purchaseDate: string; // "YYYY-MM-DD"
}

export interface DepreciationTrend {
  year: string;
  depreciation: number;
}

export interface DepreciationSummaryData {
  totalAssetValue: number;
  totalAccumulated: number;
  totalBookValue: number;
  annualDepreciation: number;
}

export interface DepreciationData {
  assets: DepreciationAsset[];
  trend: DepreciationTrend[];
  summary: DepreciationSummaryData;
}

// ── Modal / Form ──────────────────────────────────────────────

export interface DepreciationFormValues {
  name: string;
  cost: string;
  salvageValue: string;
  usefulLife: string;
  method: DepreciationMethod;
  purchaseDate: string;
}

export interface DepreciationFormErrors {
  name?: string;
  cost?: string;
  salvageValue?: string;
  usefulLife?: string;
  purchaseDate?: string;
}

export interface DepreciationModalProps {
  isOpen: boolean;
  editAsset: DepreciationAsset | null;
  onClose: () => void;
  onSave: (values: DepreciationFormValues) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}
