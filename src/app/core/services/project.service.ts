// ============================================================
// project.service.ts
// In-memory store — starts EMPTY. All data entered via forms.
// Cost breakdown and budget/actual: full user-managed CRUD.
// ============================================================
import type {
  Project, ProjectStats, CostBreakdownItem,
  BudgetActualItem, ProjectFormValues,
} from "../models/projects.types";
import { contractsService } from "./contracts.service";

const delay = <T>(data: T, ms = 180): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

let nextId    = 1;
let PROJECTS: Project[]                                  = [];
const COST_BREAKDOWN: Record<number, CostBreakdownItem[]> = {};
const BUDGET_ACTUAL:  Record<number, BudgetActualItem[]>  = {};

class ProjectsService {

  // ── Projects ──────────────────────────────────────────────
  async fetchProjects(): Promise<Project[]> {
    return delay([...PROJECTS]);
  }

  async fetchStats(): Promise<ProjectStats> {
    return delay({
      total:     PROJECTS.length,
      active:    PROJECTS.filter((p) => p.progress < 100 && p.progress > 0).length,
      completed: PROJECTS.filter((p) => p.progress === 100).length,
      delayed:   PROJECTS.filter((p) => p.riskLevel === "high").length,
    });
  }

  async createProject(values: ProjectFormValues): Promise<Project> {
    const p: Project = {
      id:           nextId++,
      name:         values.name.trim(),
      budget:       parseFloat(values.budget)       || 0,
      actualCost:   parseFloat(values.actualCost)   || 0,
      progress:     parseFloat(values.progress)     || 0,
      profitMargin: parseFloat(values.profitMargin) || 0,
      riskLevel:    values.riskLevel,
    };
    PROJECTS.push(p);
    // Start empty — user fills these in via the manager panels
    COST_BREAKDOWN[p.id] = [];
    BUDGET_ACTUAL[p.id]  = [];

    if (values.addContract && values.contractValues) {
      await contractsService.createContract(p.id, values.contractValues);
    }
    return delay({ ...p });
  }

  async updateProject(id: number, values: ProjectFormValues): Promise<Project> {
    const idx = PROJECTS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Project not found");
    const updated: Project = {
      id,
      name:         values.name.trim(),
      budget:       parseFloat(values.budget)       || 0,
      actualCost:   parseFloat(values.actualCost)   || 0,
      progress:     parseFloat(values.progress)     || 0,
      profitMargin: parseFloat(values.profitMargin) || 0,
      riskLevel:    values.riskLevel,
    };
    PROJECTS[idx] = updated;
    return delay({ ...updated });
  }

  async deleteProject(id: number): Promise<void> {
    PROJECTS = PROJECTS.filter((p) => p.id !== id);
    delete COST_BREAKDOWN[id];
    delete BUDGET_ACTUAL[id];
    return delay(undefined as any);
  }

  // ── Cost Breakdown ────────────────────────────────────────
  async fetchCostBreakdown(projectId: number): Promise<CostBreakdownItem[]> {
    return delay([...(COST_BREAKDOWN[projectId] ?? [])]);
  }

  /** Overwrite all rows for the project. Used by CostBreakdownManager. */
  async saveCostBreakdown(projectId: number, items: CostBreakdownItem[]): Promise<CostBreakdownItem[]> {
    COST_BREAKDOWN[projectId] = items.map((i) => ({ ...i }));
    return delay([...COST_BREAKDOWN[projectId]]);
  }

  // ── Budget vs Actual ──────────────────────────────────────
  async fetchBudgetActual(projectId: number): Promise<BudgetActualItem[]> {
    return delay([...(BUDGET_ACTUAL[projectId] ?? [])]);
  }

  /** Overwrite all rows for the project. Used by BudgetActualManager. */
  async saveBudgetActual(projectId: number, items: BudgetActualItem[]): Promise<BudgetActualItem[]> {
    BUDGET_ACTUAL[projectId] = items.map((i) => ({ ...i }));
    return delay([...BUDGET_ACTUAL[projectId]]);
  }
}

export const projectsService = new ProjectsService();
