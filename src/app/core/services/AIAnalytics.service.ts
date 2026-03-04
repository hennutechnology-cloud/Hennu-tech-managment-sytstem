// ============================================================
// AIAnalytics.service.ts
// ============================================================
import type { AIAnalyticsData } from "../models/AIAnalytics.types";

// ---------------------------------------------------------------------------
// Static seed
// ---------------------------------------------------------------------------
const STATIC: AIAnalyticsData = {
  health: {
    score:       78,
    label:       "جيد",
    successRate: 82,
    riskLevel:   "متوسط",
    lastUpdated: "منذ ساعة",
  },
  riskAssessment: [
    { category: "التكلفة",  score: 85 },
    { category: "الجودة",   score: 90 },
    { category: "الوقت",    score: 65 },
    { category: "السيولة",  score: 75 },
    { category: "الامتثال", score: 95 },
    { category: "الموارد",  score: 80 },
  ],
  costPrediction: [
    { month: "فبراير", actual: 9250000, predicted: 9250000 },
    { month: "مارس",   predicted: 9800000  },
    { month: "أبريل",  predicted: 10200000 },
    { month: "مايو",   predicted: 10500000 },
    { month: "يونيو",  predicted: 10100000 },
    { month: "يوليو",  predicted: 9900000  },
  ],
  cashFlowForecast: [
    { month: "فبراير", inflow: 1800000, outflow: 1150000 },
    { month: "مارس",   inflow: 1950000, outflow: 1280000 },
    { month: "أبريل",  inflow: 2100000, outflow: 1350000 },
    { month: "مايو",   inflow: 2250000, outflow: 1420000 },
    { month: "يونيو",  inflow: 2400000, outflow: 1500000 },
  ],
  insights: [
    {
      title:       "توقع تجاوز التكلفة",
      description: "بناءً على تحليل 247 نقطة بيانات، يتوقع النموذج احتمالية 35% لتجاوز الميزانية في Q2 بمقدار 2.5M ر.س",
      risk:        "high",
      iconKey:     "trending",
      confidence:  "92%",
    },
    {
      title:       "فجوة التدفق النقدي",
      description: "تحليل التدفقات النقدية يشير إلى احتمالية نقص سيولة خلال 45-60 يوماً. يُنصح بإعادة جدولة المدفوعات",
      risk:        "medium",
      iconKey:     "alert",
      confidence:  "87%",
    },
    {
      title:       "فرصة توفير في المشتريات",
      description: "اكتشف النظام فرصة لتوفير 8% من تكاليف المواد عبر الشراء الجماعي من 3 موردين محددين",
      risk:        "low",
      iconKey:     "cart",
      confidence:  "95%",
    },
    {
      title:       "تنبيه احتيال محتمل",
      description: "تم رصد 12 معاملة غير نمطية في حساب المصروفات الإدارية. تتطلب مراجعة فورية",
      risk:        "high",
      iconKey:     "shield",
      confidence:  "78%",
    },
  ],
  recommendations: [
    {
      title:    "زيادة السيولة",
      action:   "تسريع تحصيل المستحقات من العملاء الرئيسيين",
      impact:   "+3.2M ر.س",
      priority: "عالية",
    },
    {
      title:    "تحسين الربحية",
      action:   "إعادة التفاوض على عقود الموردين الرئيسيين",
      impact:   "+8% هامش",
      priority: "متوسطة",
    },
    {
      title:    "إدارة المخاطر",
      action:   "التحوط ضد تقلبات أسعار الحديد والإسمنت",
      impact:   "-15% مخاطر",
      priority: "عالية",
    },
  ],
};

function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

export async function fetchAIAnalytics(): Promise<AIAnalyticsData> {
  await delay(300);
  return JSON.parse(JSON.stringify(STATIC)) as AIAnalyticsData;
}

export async function applyRecommendation(index: number): Promise<void> {
  await delay(700);
  console.log(`[TODO] Apply recommendation #${index}`);
}
