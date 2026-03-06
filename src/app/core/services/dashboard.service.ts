// ============================================================
// dashboard.service.ts
// ============================================================
import type {
  RevenueExpense, Profit, CashFlow, BudgetActual,
  KPI, AiAlert, AIHealthScoreModel, DashboardData,
} from "../models/dashboard.types";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

class DashboardService {

  async getRevenueExpenseData(): Promise<RevenueExpense[]> {
    return delay([
      { month: 1, revenue: 1_200_000, expenses:   850_000 },
      { month: 2, revenue: 1_350_000, expenses:   920_000 },
      { month: 3, revenue: 1_500_000, expenses:   980_000 },
      { month: 4, revenue: 1_450_000, expenses: 1_050_000 },
      { month: 5, revenue: 1_650_000, expenses: 1_100_000 },
      { month: 6, revenue: 1_800_000, expenses: 1_150_000 },
    ]);
  }

  async getProfitData(): Promise<Profit[]> {
    return delay([
      { month: 1, profit: 350_000 },
      { month: 2, profit: 430_000 },
      { month: 3, profit: 520_000 },
      { month: 4, profit: 400_000 },
      { month: 5, profit: 550_000 },
      { month: 6, profit: 650_000 },
    ]);
  }

  async getCashFlowData(): Promise<CashFlow[]> {
    return delay([
      { month: 1, cashFlow: 450_000 },
      { month: 2, cashFlow: 520_000 },
      { month: 3, cashFlow: 480_000 },
      { month: 4, cashFlow: 610_000 },
      { month: 5, cashFlow: 580_000 },
      { month: 6, cashFlow: 720_000 },
      { month: 7, cashFlow: 680_000, forecast: true },
      { month: 8, cashFlow: 750_000, forecast: true },
    ]);
  }

  async getBudgetActualData(): Promise<BudgetActual[]> {
    // category is a plain string from the API — already in the user's language
    return delay([
      { category: "مواد البناء", budget: 5_000_000, actual: 4_850_000 },
      { category: "العمالة",     budget: 3_500_000, actual: 3_750_000 },
      { category: "المعدات",     budget: 2_000_000, actual: 1_900_000 },
      { category: "النقل",       budget:   800_000, actual:   750_000 },
    ]);
  }

  async getKpis(): Promise<KPI[]> {
    // title is a plain string from the API — already in the user's language
    return delay([
      { title: "إجمالي الإيرادات", value: 8_500_000, change: "+12%", isPositive: true,  color: "from-emerald-500 to-emerald-700" },
      { title: "إجمالي المصروفات", value: 5_200_000, change: "-3%",  isPositive: false, color: "from-red-500 to-red-700"         },
      { title: "صافي الربح",       value: 3_300_000, change: "+8%",  isPositive: true,  color: "from-blue-500 to-blue-700"       },
      { title: "رصيد الصندوق",     value:   720_000, change: "+5%",  isPositive: true,  color: "from-yellow-500 to-yellow-700"   },
      { title: "رصيد البنك",       value:   720_000, change: "+5%",  isPositive: true,  color: "from-yellow-500 to-yellow-700"   },
      { title: "نسبة الإنجاز",     value:   450_000, change: "-10%", isPositive: false, color: "from-pink-500 to-pink-700"       },
    ]);
  }

  async getAiAlerts(): Promise<AiAlert[]> {
    // title and description are plain strings from the API
    return delay([
      { title: "خطر تجاوز التكلفة",       description: "احتمالية تجاوز الميزانية في مواد الحديد بنسبة 15% خلال 30 يوماً",                                              risk: "high",   iconType: "alert"    },
      { title: "فجوة في التدفق النقدي",    description: "متوقع حدوث نقص في السيولة خلال 45 يوماً - يُنصح بالتخطيط المسبق",                                             risk: "medium", iconType: "trend"    },
      { title: "تأخير محتمل في المشروع",   description: "نسبة الإنجاز أقل من المخطط بـ 8% - قد يتسبب في تأخير التسليم",                                               risk: "medium", iconType: "activity" },
      { title: "فرصة لتحسين الربحية",      description: "تحليل البيانات يشير إلى فرصة لزيادة الربحية بنسبة 10% من خلال تحسين إدارة الموارد",                          risk: "low",    iconType: "activity" },
    ]);
  }

  async getAIHealthScore(): Promise<AIHealthScoreModel> {
    return delay({ score: 85, status: "excellent" });
  }

  // ── Single fetch for page-level loading state ─────────────
  async fetchAll(): Promise<DashboardData> {
    const [kpis, revenueExpense, profit, cashFlow, budgetActual, aiAlerts, healthScore] =
      await Promise.all([
        this.getKpis(),
        this.getRevenueExpenseData(),
        this.getProfitData(),
        this.getCashFlowData(),
        this.getBudgetActualData(),
        this.getAiAlerts(),
        this.getAIHealthScore(),
      ]);
    return { kpis, revenueExpense, profit, cashFlow, budgetActual, aiAlerts, healthScore };
  }
}

export const dashboardService = new DashboardService();
