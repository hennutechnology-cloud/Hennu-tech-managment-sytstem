// ============================================================
// category.types.ts
// ============================================================
import type { Lang } from "./Settings.types";

// ── Core entity ───────────────────────────────────────────────
export interface Category {
  id:          string;
  name:        string;       // e.g. "الحديد والصلب"
  nameEn:      string;       // e.g. "Iron & Steel"
  icon:        string;       // emoji or icon key
  color:       string;       // tailwind color token e.g. "orange"
  usageCount:  number;       // how many items reference this category
  createdAt:   string;       // ISO date string
}

// ── Form ─────────────────────────────────────────────────────
export type CategoryFormData = Pick<Category, "name" | "nameEn" | "icon" | "color">;

export type CategoryFormErrors = Partial<Record<keyof CategoryFormData, string>>;

// ── Modal modes ───────────────────────────────────────────────
export type CategoryModalMode = "add" | "edit";

// ── Component props ───────────────────────────────────────────
export interface CategoryHeaderProps {
  lang:   Lang;
  total:  number;
  onAdd:  () => void;
}

export interface CategoryCardProps {
  category: Category;
  lang:     Lang;
  onEdit:   (c: Category) => void;
  onDelete: (c: Category) => void;
}

export interface CategoryGridProps {
  categories: Category[];
  lang:       Lang;
  onEdit:     (c: Category) => void;
  onDelete:   (c: Category) => void;
}

export interface CategoryModalProps {
  isOpen:   boolean;
  mode:     CategoryModalMode;
  category: Category | null;    // null when adding
  lang:     Lang;
  onClose:  () => void;
  onSave:   (data: CategoryFormData, id?: string) => void;
}

export interface CategoryDeleteConfirmProps {
  isOpen:    boolean;
  category:  Category | null;
  lang:      Lang;
  onClose:   () => void;
  onConfirm: () => void;
}

export interface CategorySearchBarProps {
  value:    string;
  onChange: (v: string) => void;
  lang:     Lang;
}
