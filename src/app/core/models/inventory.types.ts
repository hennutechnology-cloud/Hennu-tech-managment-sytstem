// ============================================================
// inventory.types.ts
// All dynamic string fields (name, unit, category, location,
// notes) are plain strings returned from the service.
// Static UI labels are handled via inventory.i18n.ts
// ============================================================
import type { Lang } from "./Settings.types";

// ── Stock status ──────────────────────────────────────────────
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

// ── Movement type ─────────────────────────────────────────────
export type MovementType = "in" | "out" | "adjustment";

// ── Core models ───────────────────────────────────────────────
export interface InventoryItem {
  id:              string;
  name:            string;   // plain string
  sku:             string;   // stock-keeping unit code
  category:        string;   // plain string
  unit:            string;   // e.g. "طن", "م³", "قطعة"
  quantity:        number;
  minQuantity:     number;   // threshold → triggers low-stock warning
  unitCost:        number;   // cost per unit (SAR)
  totalValue:      number;   // quantity × unitCost
  location:        string;   // warehouse / site location
  supplier:        string;   // supplier name (plain string)
  lastUpdated:     string;   // ISO date string
  status:          StockStatus;
  notes?:          string;
}

export interface InventoryMovement {
  id:          string;
  itemId:      string;
  itemName:    string;   // plain string (denormalised for display)
  type:        MovementType;
  quantity:    number;
  date:        string;   // ISO date string
  reference:   string;   // PO / WO number etc.
  performedBy: string;   // plain string
  notes?:      string;
}

export interface InventorySummary {
  totalItems:       number;
  totalValue:       number;
  lowStockCount:    number;
  outOfStockCount:  number;
  totalCategories:  number;
}

export interface InventoryData {
  items:     InventoryItem[];
  movements: InventoryMovement[];
  summary:   InventorySummary;
}

// ── Form shape for Add / Edit ─────────────────────────────────
export type InventoryItemFormData = Omit<InventoryItem, "id" | "totalValue" | "status">;

// ── Component prop types ──────────────────────────────────────
export interface InventoryHeaderProps {
  lang:  Lang;
  onAdd: () => void;
}

export interface InventorySummaryCardsProps {
  summary: InventorySummary;
  lang:    Lang;
}

export interface InventoryTableProps {
  items:    InventoryItem[];
  lang:     Lang;
  onEdit:   (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onMove:   (item: InventoryItem) => void;
}

export interface MovementsTableProps {
  movements: InventoryMovement[];
  lang:      Lang;
}

export interface InventoryItemModalProps {
  lang:     Lang;
  initial?: InventoryItem | null;
  onSave:   (data: InventoryItemFormData) => void;
  onClose:  () => void;
}

export interface MovementModalProps {
  lang:    Lang;
  item:    InventoryItem;
  onSave:  (type: MovementType, qty: number, reference: string, notes: string) => void;
  onClose: () => void;
}

export interface DeleteConfirmModalProps {
  lang:     Lang;
  itemName: string;
  onConfirm: () => void;
  onCancel:  () => void;
}
