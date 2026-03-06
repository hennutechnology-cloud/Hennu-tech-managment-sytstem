// ============================================================
// AIAnalytics.service.ts
// ============================================================
import type { AIAnalyticsData } from "../models/AIAnalytics.types";

const STATIC: AIAnalyticsData = {
  health: {
    score:          78,
    labelKey:       "good",     // enum → i18n resolves to "جيد" / "Good"
    successRate:    82,
    riskLevelKey:   "medium",   // enum → i18n resolves to "متوسط" / "Medium"
    lastUpdatedIso: "2024-02-01T11:00:00Z",
  },

  riskAssessment: [
    { categoryKey: "cost",       score: 85 },
    { categoryKey: "quality",    score: 90 },
    { categoryKey: "time",       score: 65 },
    { categoryKey: "liquidity",  score: 75 },
    { categoryKey: "compliance", score: 95 },
    { categoryKey: "resources",  score: 80 },
  ],

  costPrediction: [
    { month: 2, actual: 9250000, predicted: 9250000 },
    { month: 3,                  predicted: 9800000  },
    { month: 4,                  predicted: 10200000 },
    { month: 5,                  predicted: 10500000 },
    { month: 6,                  predicted: 10100000 },
    { month: 7,                  predicted: 9900000  },
  ],

  cashFlowForecast: [
    { month: 2, inflow: 1800000, outflow: 1150000 },
    { month: 3, inflow: 1950000, outflow: 1280000 },
    { month: 4, inflow: 2100000, outflow: 1350000 },
    { month: 5, inflow: 2250000, outflow: 1420000 },
    { month: 6, inflow: 2400000, outflow: 1500000 },
  ],

  // title, description → plain strings the API returns in the user's language
  insights: [
    {
      title:       "توقع تجاوز التكلفة",
      description: "بناءً على تحليل 247 نقطة بيانات، يتوقع النموذج احتمالية 35% لتجاوز الميزانية في Q2 بمقدار 2.5M ر.س",
      risk:        "high",
      iconKey:     "trending",
      confidence:  92,
    },
    {
      title:       "فجوة التدفق النقدي",
      description: "تحليل التدفقات النقدية يشير إلى احتمالية نقص سيولة خلال 45-60 يوماً. يُنصح بإعادة جدولة المدفوعات",
      risk:        "medium",
      iconKey:     "alert",
      confidence:  87,
    },
    {
      title:       "فرصة توفير في المشتريات",
      description: "اكتشف النظام فرصة لتوفير 8% من تكاليف المواد عبر الشراء الجماعي من 3 موردين محددين",
      risk:        "low",
      iconKey:     "cart",
      confidence:  95,
    },
    {
      title:       "تنبيه احتيال محتمل",
      description: "تم رصد 12 معاملة غير نمطية في حساب المصروفات الإدارية. تتطلب مراجعة فورية",
      risk:        "high",
      iconKey:     "shield",
      confidence:  78,
    },
  ],

  // title, action, impact → plain strings from API
  // priority → enum, i18n resolves to "عالية" / "High" etc.
  recommendations: [
    {
      title:    "زيادة السيولة",
      action:   "تسريع تحصيل المستحقات من العملاء الرئيسيين",
      impact:   "+3.2M ر.س",
      priority: "high",
    },
    {
      title:    "تحسين الربحية",
      action:   "إعادة التفاوض على عقود الموردين الرئيسيين",
      impact:   "+8% هامش",
      priority: "medium",
    },
    {
      title:    "إدارة المخاطر",
      action:   "التحوط ضد تقلبات أسعار الحديد والإسمنت",
      impact:   "-15% مخاطر",
      priority: "high",
    },
  ],
};

function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

// Replace the body of this function with your real API call:
//   const res = await fetch("/api/ai-analytics");
//   return res.json() as Promise<AIAnalyticsData>;
export async function fetchAIAnalytics(): Promise<AIAnalyticsData> {
  await delay(300);
  return JSON.parse(JSON.stringify(STATIC)) as AIAnalyticsData;
}

export async function applyRecommendation(index: number): Promise<void> {
  await delay(700);
  console.log(`[TODO] Apply recommendation #${index}`);
}
