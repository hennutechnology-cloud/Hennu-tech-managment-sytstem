// ============================================================
// projects.service.ts
// Static in-memory data store — every public method is async
// so swapping to real API calls (fetch / axios) requires only
// replacing the method body, never the call sites.
// ============================================================
import type {
  Project, ProjectFormValues,
  CostBreakdownItem, BudgetActualItem, ProjectStats,
} from "../models/projects.types";

// ── Helpers ───────────────────────────────────────────────────
let nextId = 5;
const delay = <T>(data: T, ms = 200): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

function cloneProjects(): Project[] {
  return JSON.parse(JSON.stringify(store)) as Project[];
}

// ── Mutable in-memory store ───────────────────────────────────
let store: Project[] = [
  {
    id:           1,
    name:         "مشروع برج المملكة",
    budget:       50_000_000,
    actualCost:   34_000_000,
    progress:     68,
    profitMargin: 15.5,
    riskLevel:    "low",
  },
  {
    id:           2,
    name:         "مشروع الواحة السكني",
    budget:       35_000_000,
    actualCost:   28_000_000,
    progress:     85,
    profitMargin: 12.3,
    riskLevel:    "medium",
  },
  {
    id:           3,
    name:         "مجمع النخيل التجاري",
    budget:       62_000_000,
    actualCost:   48_500_000,
    progress:     72,
    profitMargin: 18.7,
    riskLevel:    "low",
  },
  {
    id:           4,
    name:         "مشروع الياسمين",
    budget:       28_000_000,
    actualCost:   24_800_000,
    progress:     92,
    profitMargin: 8.2,
    riskLevel:    "high",
  },
];

// ── Per-project cost breakdown ────────────────────────────────
// In a real API: GET /api/projects/:id/cost-breakdown
const COST_BREAKDOWN: Record<number, CostBreakdownItem[]> = {
  1: [
    { name: "مواد البناء",    value: 12_500_000, color: "#F97316" },
    { name: "العمالة",        value:  9_800_000, color: "#10B981" },
    { name: "المعدات",        value:  6_200_000, color: "#3B82F6" },
    { name: "النقل والخدمات", value:  3_400_000, color: "#8B5CF6" },
    { name: "إدارية",         value:  2_100_000, color: "#EC4899" },
  ],
  2: [
    { name: "مواد البناء",    value:  9_200_000, color: "#F97316" },
    { name: "العمالة",        value:  7_500_000, color: "#10B981" },
    { name: "المعدات",        value:  4_800_000, color: "#3B82F6" },
    { name: "النقل والخدمات", value:  3_100_000, color: "#8B5CF6" },
    { name: "إدارية",         value:  3_400_000, color: "#EC4899" },
  ],
  3: [
    { name: "مواد البناء",    value: 18_000_000, color: "#F97316" },
    { name: "العمالة",        value: 13_500_000, color: "#10B981" },
    { name: "المعدات",        value:  9_000_000, color: "#3B82F6" },
    { name: "النقل والخدمات", value:  5_000_000, color: "#8B5CF6" },
    { name: "إدارية",         value:  3_000_000, color: "#EC4899" },
  ],
  4: [
    { name: "مواد البناء",    value:  8_500_000, color: "#F97316" },
    { name: "العمالة",        value:  6_200_000, color: "#10B981" },
    { name: "المعدات",        value:  4_100_000, color: "#3B82F6" },
    { name: "النقل والخدمات", value:  3_200_000, color: "#8B5CF6" },
    { name: "إدارية",         value:  2_800_000, color: "#EC4899" },
  ],
};

// ── Per-project budget phases ─────────────────────────────────
// In a real API: GET /api/projects/:id/budget-phases
const BUDGET_ACTUAL: Record<number, BudgetActualItem[]> = {
  1: [
    { phase: "التأسيس",   budget:  8_000_000, actual:  7_850_000 },
    { phase: "الهيكل",    budget: 15_000_000, actual: 14_500_000 },
    { phase: "التشطيبات", budget: 12_000_000, actual: 11_650_000 },
    { phase: "الخدمات",   budget:  5_000_000, actual:           0 },
  ],
  2: [
    { phase: "التأسيس",   budget:  5_000_000, actual:  4_900_000 },
    { phase: "الهيكل",    budget: 10_000_000, actual: 10_200_000 },
    { phase: "التشطيبات", budget:  8_000_000, actual:  7_800_000 },
    { phase: "الخدمات",   budget:  4_000_000, actual:  5_100_000 },
  ],
  3: [
    { phase: "التأسيس",   budget: 10_000_000, actual:  9_500_000 },
    { phase: "الهيكل",    budget: 22_000_000, actual: 21_000_000 },
    { phase: "التشطيبات", budget: 18_000_000, actual: 15_000_000 },
    { phase: "الخدمات",   budget:  8_000_000, actual:  3_000_000 },
  ],
  4: [
    { phase: "التأسيس",   budget:  4_000_000, actual:  4_100_000 },
    { phase: "الهيكل",    budget:  8_000_000, actual:  8_500_000 },
    { phase: "التشطيبات", budget:  7_000_000, actual:  7_200_000 },
    { phase: "الخدمات",   budget:  3_500_000, actual:  5_000_000 },
  ],
};

// ── Fallback for newly-created projects ───────────────────────
const FALLBACK_COST: CostBreakdownItem[] = [
  { name: "مواد البناء",    value: 0, color: "#F97316" },
  { name: "العمالة",        value: 0, color: "#10B981" },
  { name: "المعدات",        value: 0, color: "#3B82F6" },
  { name: "النقل والخدمات", value: 0, color: "#8B5CF6" },
  { name: "إدارية",         value: 0, color: "#EC4899" },
];

const FALLBACK_BUDGET: BudgetActualItem[] = [
  { phase: "التأسيس",   budget: 0, actual: 0 },
  { phase: "الهيكل",    budget: 0, actual: 0 },
  { phase: "التشطيبات", budget: 0, actual: 0 },
  { phase: "الخدمات",   budget: 0, actual: 0 },
];

// ── Service class ─────────────────────────────────────────────
class ProjectsService {

  // TODO (API): replace with → fetch("/api/projects").then(r => r.json())
  async fetchProjects(): Promise<Project[]> {
    return delay(cloneProjects());
  }

  // TODO (API): replace with → fetch("/api/projects/stats").then(r => r.json())
  async fetchStats(): Promise<ProjectStats> {
    return delay({
      total:     12,
      active:    7,
      completed: 4,
      delayed:   1,
    });
  }

  // TODO (API): replace with → fetch(`/api/projects/${projectId}/cost-breakdown`).then(r => r.json())
  async fetchCostBreakdown(projectId: number): Promise<CostBreakdownItem[]> {
    return delay(COST_BREAKDOWN[projectId] ?? FALLBACK_COST);
  }

  // TODO (API): replace with → fetch(`/api/projects/${projectId}/budget-phases`).then(r => r.json())
  async fetchBudgetActual(projectId: number): Promise<BudgetActualItem[]> {
    return delay(BUDGET_ACTUAL[projectId] ?? FALLBACK_BUDGET);
  }

  // TODO (API): replace body with → fetch("/api/projects", { method: "POST", body: JSON.stringify(values) })
  async createProject(values: ProjectFormValues): Promise<Project[]> {
    const newProject: Project = {
      id:           nextId++,
      name:         values.name.trim(),
      budget:       parseFloat(values.budget)       || 0,
      actualCost:   parseFloat(values.actualCost)   || 0,
      progress:     parseFloat(values.progress)     || 0,
      profitMargin: parseFloat(values.profitMargin) || 0,
      riskLevel:    values.riskLevel,
    };
    store.push(newProject);
    return delay(cloneProjects());
  }

  // TODO (API): replace body with → fetch(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(values) })
  async updateProject(id: number, values: ProjectFormValues): Promise<Project[]> {
    store = store.map((p) =>
      p.id === id
        ? {
            ...p,
            name:         values.name.trim(),
            budget:       parseFloat(values.budget)       || 0,
            actualCost:   parseFloat(values.actualCost)   || 0,
            progress:     parseFloat(values.progress)     || 0,
            profitMargin: parseFloat(values.profitMargin) || 0,
            riskLevel:    values.riskLevel,
          }
        : p,
    );
    return delay(cloneProjects());
  }

  // TODO (API): replace body with → fetch(`/api/projects/${id}`, { method: "DELETE" })
  async deleteProject(id: number): Promise<Project[]> {
    store = store.filter((p) => p.id !== id);
    return delay(cloneProjects());
  }
}

export const projectsService = new ProjectsService();
