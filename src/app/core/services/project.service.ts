import {
  Project,
  ProjectDetailsModel,
  ProjectStats,
} from "../models/projects.types";

const delay = <T>(data: T, time = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), time));

class ProjectService {
  async getProjects(): Promise<Project[]> {
    return delay([
      {
        id: 1,
        name: "مشروع برج المملكة",
        budget: 51000000,
        actualCost: 34000000,
        progress: 68,
        profitMargin: 15.5,
        riskLevel: "low",
        status: "active",
      },
      {
        id: 2,
        name: "مشروع الواحة السكني",
        budget: 35000000,
        actualCost: 28000000,
        progress: 85,
        profitMargin: 12.3,
        riskLevel: "medium",
        status: "completed",
      },
      {
        id: 3,
        name: "مجمع النخيل التجاري",
        budget: 62000000,
        actualCost: 48500000,
        progress: 72,
        profitMargin: 18.7,
        riskLevel: "low",
        status: "active",
      },
      {
        id: 4,
        name: "مشروع الياسمين",
        budget: 28000000,
        actualCost: 24800000,
        progress: 92,
        profitMargin: 8.2,
        riskLevel: "high",
        status: "delayed",
      },
    ]);
  }

  async getProjectDetails(projectId: number): Promise<ProjectDetailsModel> {
    return delay({
      projectId,
      costBreakdown: [
        { name: "مواد البناء", value: 12500000, color: "#F97316" },
        { name: "العمالة", value: 9800000, color: "#10B981" },
        { name: "المعدات", value: 6200000, color: "#3B82F6" },
        { name: "النقل والخدمات", value: 3400000, color: "#8B5CF6" },
        { name: "إدارية", value: 2100000, color: "#EC4899" },
      ],
      budgetVsActual: [
        { phase: "التأسيس", budget: 8000000, actual: 7850000 },
        { phase: "الهيكل", budget: 15000000, actual: 14500000 },
        { phase: "التشطيبات", budget: 12000000, actual: 11650000 },
        { phase: "الخدمات", budget: 5000000, actual: 0 },
      ],
      overrunProbability: 35,
      overrunAmount: 2500000,
      delayPercent: 8,
      delayWeeks: 3,
    });
  }

  async getProjectStats(): Promise<ProjectStats> {
    const projects = await this.getProjects();
    return {
      total: projects.length,
      active: projects.filter(p => p.status === "active").length,
      completed: projects.filter(p => p.status === "completed").length,
      delayed: projects.filter(p => p.status === "delayed").length,
    };
  }
}

export const projectService = new ProjectService();
