// ============================================================
// projects.types.ts — Extended with contract integration
// ============================================================
import type { Lang } from "./Settings.types";
import type { ContractFormValues, Contract } from "./contracts.types";

export type RiskLevel = "low" | "medium" | "high";

export interface Project {
  id:           number;
  name:         string;
  budget:       number;
  actualCost:   number;
  progress:     number;   // 0–100
  profitMargin: number;
  riskLevel:    RiskLevel;
}

export interface CostBreakdownItem {
  name:  string;
  value: number;
  color: string;
}

export interface BudgetActualItem {
  phase:  string;
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
  // Optional inline contract when creating a project
  addContract?:      boolean;
  contractValues?:   ContractFormValues;
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
  selectedProjectId: number | null;
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
