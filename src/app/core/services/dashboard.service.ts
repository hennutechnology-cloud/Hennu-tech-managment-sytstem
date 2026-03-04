import {
  RevenueExpense,
  Profit,
  CashFlow,
  BudgetActual,
  KPI,
  AiAlert,
  AIHealthScoreModel,
} from "../models/dashboard.types";

const delay = <T>(data: T, time = 300): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), time);
  });
};

class DashboardService {
  async getRevenueExpenseData(): Promise<RevenueExpense[]> {
    return delay([
      { month: "يناير", revenue: 1200000, expenses: 850000 },
      { month: "فبراير", revenue: 1350000, expenses: 920000 },
      { month: "مارس", revenue: 1500000, expenses: 980000 },
      { month: "أبريل", revenue: 1450000, expenses: 1050000 },
      { month: "مايو", revenue: 1650000, expenses: 1100000 },
      { month: "يونيو", revenue: 1800000, expenses: 1150000 },
    ]);
  }

  async getProfitData(): Promise<Profit[]> {
    return delay([
      { month: "يناير", profit: 350000 },
      { month: "فبراير", profit: 430000 },
      { month: "مارس", profit: 520000 },
      { month: "أبريل", profit: 400000 },
      { month: "مايو", profit: 550000 },
      { month: "يونيو", profit: 650000 },
    ]);
  }

  async getCashFlowData(): Promise<CashFlow[]> {
    return delay([
      { month: "يناير", cashFlow: 450000 },
      { month: "فبراير", cashFlow: 520000 },
      { month: "مارس", cashFlow: 480000 },
      { month: "أبريل", cashFlow: 610000 },
      { month: "مايو", cashFlow: 580000 },
      { month: "يونيو", cashFlow: 720000 },
      { month: "يوليو", cashFlow: 680000, forecast: true },
      { month: "أغسطس", cashFlow: 750000, forecast: true },
    ]);
  }

  async getBudgetActualData(): Promise<BudgetActual[]> {
    return delay([
      { category: "مواد البناء", budget: 5000000, actual: 4850000 },
      { category: "العمالة", budget: 3500000, actual: 3750000 },
      { category: "المعدات", budget: 2000000, actual: 1900000 },
      { category: "النقل", budget: 800000, actual: 750000 },
    ]);
  }

  async getKpis(): Promise<KPI[]> {
    return delay([
      {
        title: "إجمالي الإيرادات",
        value: 8500000,
        change: "+12%",
        isPositive: true,
        color: "from-emerald-500 to-emerald-700",
      },
      {
        title: "إجمالي المصروفات",
        value: 5200000,
        change: "-3%",
        isPositive: false,
        color: "from-red-500 to-red-700",
      },
      {
        title: "صافي الربح",
        value: 3300000,
        change: "+8%",
        isPositive: true,
        color: "from-blue-500 to-blue-700",
      },{
        title: "رصيد الصندوق",
        value: 720000,
        change: "+5%",
        isPositive: true,
        color: "form-gold-500 to-yellow-700",
      },
      {
        title: "رصيد البنك",
        value: 720000,
        change: "+5%",
        isPositive: true,
        color: "from-yellow-500 to-yellow-700",
      },
      {
        title: "نسبة الإنجاز",
        value: 450000,
        change: "-10%",
        isPositive: false,
        color: "from-pink-500 to-pink-700",
      }
    ]);
  }

  async getAiAlerts(): Promise<AiAlert[]> {
  return delay([
    {
      title: "خطر تجاوز التكلفة",
      description:
        "احتمالية تجاوز الميزانية في مواد الحديد بنسبة 15% خلال 30 يوماً",
      risk: "high",
      iconType: "alert",
    },
    {
      title: "فجوة في التدفق النقدي",
      description:
        "متوقع حدوث نقص في السيولة خلال 45 يوماً - يُنصح بالتخطيط المسبق",
      risk: "medium",
      iconType: "trend",
    },
    {
      title: "تأخير محتمل في المشروع",
      description:
        "نسبة الإنجاز أقل من المخطط بـ 8% - قد يتسبب في تأخير التسليم",
      risk: "medium",
      iconType: "activity",
    },
    {
      title: "فرصة لتحسين الربحية",
      description:
        "تحليل البيانات يشير إلى فرصة لزيادة الربحية بنسبة 10% من خلال تحسين إدارة الموارد",
      risk: "low",
      iconType: "activity",
    },
  ]);
}

async getAIHealthScore(): Promise<AIHealthScoreModel> {
  return delay({
    score:85,
    status: "excellent",
  });
}
}

export const dashboardService = new DashboardService();
