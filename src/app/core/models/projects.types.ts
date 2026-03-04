// ============================================================
// projects.types.ts
// ============================================================
export type RiskLevel = "low" | "medium" | "high";
export type ProjectStatus = "active" | "completed" | "delayed";

export interface Project {
  id: number;
  name: string;
  budget: number;
  actualCost: number;
  progress: number;
  profitMargin: number;
  riskLevel: RiskLevel;
  status: ProjectStatus;
}

export interface CostBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface BudgetPhase {
  phase: string;
  budget: number;
  actual: number;
}

export interface ProjectDetailsModel {
  projectId: number;
  costBreakdown: CostBreakdown[];
  budgetVsActual: BudgetPhase[];
  overrunProbability: number;
  overrunAmount: number;
  delayPercent: number;
  delayWeeks: number;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  delayed: number;
}
