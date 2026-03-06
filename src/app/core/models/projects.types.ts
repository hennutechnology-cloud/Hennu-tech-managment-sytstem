// ============================================================
// projects.types.ts
// ============================================================
import type { Lang } from "./Settings.types";

export type RiskLevel = "low" | "medium" | "high";

export interface Project {
  id:           number;
  name:         string;   // plain API string
  budget:       number;
  actualCost:   number;
  progress:     number;   // 0–100
  profitMargin: number;
  riskLevel:    RiskLevel;
}

export interface CostBreakdownItem {
  name:  string;   // plain API string
  value: number;
  color: string;
}

export interface BudgetActualItem {
  phase:  string;  // plain API string
  budget: number;
  actual: number;
}

export interface ProjectStats {
  total:     number;
  active:    number;
  completed: number;
  delayed:   number;
}

// ── Form ──────────────────────────────────────────────────────
export interface ProjectFormValues {
  name:         string;
  budget:       string;
  actualCost:   string;
  progress:     string;
  profitMargin: string;
  riskLevel:    RiskLevel;
}

export interface ProjectFormErrors {
  name?:         string;
  budget?:       string;
  actualCost?:   string;
  progress?:     string;
  profitMargin?: string;
}

// ── Modal mode ────────────────────────────────────────────────
export type ModalMode = "add" | "view" | "edit";

// ── Component props ───────────────────────────────────────────
export interface ProjectsHeaderProps {
  lang:         Lang;
  onAddProject: () => void;
}

export interface ProjectsTableProps {
  projects:          Project[];
  lang:              Lang;
  /** ID of the currently-selected project for row highlight */
  selectedProjectId: number | null;
  /** Row body click (not action buttons) → update ProjectDetails */
  onSelect:          (project: Project) => void;
  onView:            (project: Project) => void;
  onEdit:            (project: Project) => void;
  onDelete:          (project: Project) => void;
}

export interface ProjectDetailsProps {
  project:       Project;
  costBreakdown: CostBreakdownItem[];
  budgetActual:  BudgetActualItem[];
  lang:          Lang;
}

export interface ProjectStatsProps {
  stats: ProjectStats;
  lang:  Lang;
}

export interface ProjectModalProps {
  isOpen:   boolean;
  mode:     ModalMode;
  project:  Project | null;
  lang:     Lang;
  onClose:  () => void;
  onSave:   (values: ProjectFormValues) => Promise<void>;
  onEdit:   (project: Project) => void;
}

export interface DeleteConfirmProps {
  isOpen:    boolean;
  project:   Project | null;
  lang:      Lang;
  onConfirm: () => Promise<void>;
  onCancel:  () => void;
}
