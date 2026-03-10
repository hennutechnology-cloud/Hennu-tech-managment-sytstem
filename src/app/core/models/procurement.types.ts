// ============================================================
// procurement.types.ts
// All static string fields (name, category, etc.) are plain
// strings returned from the service — rendered directly.
// Dynamic UI labels are handled via procurement.i18n.ts
// ============================================================
import type { Lang } from "./Settings.types";

export type AiScoreTier = "high" | "medium" | "low";

export interface Supplier {
  id:               string;
  name:             string;   // plain string
  category:         string;   // plain string
  avgPrice:         number;
  deliveryTime:     number;   // days
  performanceRating: number;  // 0–5
  onTimeDelivery:   number;   // percentage 0–100
  aiScore:          number;   // 0–100
  totalOrders:      number;
}

export interface PriceTrendPoint {
  month:  number;  // 1–12
  price:  number;
}

export interface ProcurementSummary {
  totalSuppliers:   number;
  avgRating:        number;
  avgDeliveryDays:  number;
  annualSaving:     number;   // percentage
}

export interface SavingOpportunity {
  id:          string;
  description: string;  // plain string
}

export interface BestSupplierCard {
  supplierId:  string;
  supplierName: string;
  reason:       string;  // plain string
  aiScore:      number;
}

export interface ProcurementData {
  suppliers:        Supplier[];
  priceTrend:       PriceTrendPoint[];
  summary:          ProcurementSummary;
  savingOpportunities: SavingOpportunity[];
  bestSupplier:     BestSupplierCard;
}

// ── Form shape for Add / Edit ─────────────────────────────────
export type SupplierFormData = Omit<Supplier, "id">;

// ── Component prop types ──────────────────────────────────────
export interface ProcurementHeaderProps  { lang: Lang; onAdd: () => void; }
export interface AiBannerProps           { lang: Lang; onCreateOrder: () => void; }
export interface SummaryCardsProps       { summary: ProcurementSummary; lang: Lang; }
export interface SuppliersTableProps     {
  suppliers: Supplier[];
  lang:      Lang;
  onEdit:    (supplier: Supplier) => void;
  onDelete:  (supplier: Supplier) => void;
}
export interface PriceTrendChartProps    { data: PriceTrendPoint[]; lang: Lang; }
export interface RecommendationCardsProps {
  bestSupplier:        BestSupplierCard;
  savingOpportunities: SavingOpportunity[];
  lang:                Lang;
}
export interface SupplierModalProps {
  lang:       Lang;
  initial?:   Supplier | null;   // null = add mode
  onSave:     (data: SupplierFormData) => void;
  onClose:    () => void;
}
export interface DeleteConfirmModalProps {
  lang:        Lang;
  supplierName: string;
  onConfirm:   () => void;
  onCancel:    () => void;
}
