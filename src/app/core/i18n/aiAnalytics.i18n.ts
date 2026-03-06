// ============================================================
// aiAnalytics.i18n.ts
// Only static UI chrome — section titles, button labels,
// and fixed enum resolvers (health labels, risk levels, etc.)
//
// NOT here: insight titles/descriptions, recommendation
// titles/actions, impact values — those are dynamic API strings
// returned already in the user's language.
// ============================================================
import type { Lang }                  from "../models/Settings.types";
import type {
  RecommendationPriority,
  HealthLabelKey,
  RiskLevelKey,
  RiskCategoryKey,
}                                     from "../models/AIAnalytics.types";

const AI_STRINGS = {
  // ── Page chrome ───────────────────────────────────────────
  loading:             { ar: "جارٍ تحليل البيانات بالذكاء الاصطناعي…", en: "Analysing data with AI…"         },
  loadError:           { ar: "تعذّر تحميل بيانات التحليل",              en: "Failed to load analytics data"   },

  // ── Header ────────────────────────────────────────────────
  headerTitle:         { ar: "التحليلات الذكية (AI)",                   en: "AI Analytics"                    },
  headerSubtitle:      { ar: "رؤى متقدمة مدعومة بالذكاء الاصطناعي",    en: "Advanced insights powered by AI" },
  poweredBy:           { ar: "مدعوم بـ GPT-4",                          en: "Powered by GPT-4"                },

  // ── Health card ───────────────────────────────────────────
  healthTitle:         { ar: "مؤشر صحة المشروع (AI)",                   en: "Project Health Score (AI)"       },
  successRateLabel:    { ar: "معدل النجاح المتوقع",                      en: "Expected Success Rate"           },
  riskLevelLabel:      { ar: "مستوى المخاطرة",                           en: "Risk Level"                      },
  lastUpdatedLabel:    { ar: "آخر تحديث",                               en: "Last Updated"                    },

  // ── Health label enum → display ───────────────────────────
  healthLabel_good:    { ar: "جيد",    en: "Good" },
  healthLabel_fair:    { ar: "مقبول",  en: "Fair" },
  healthLabel_poor:    { ar: "ضعيف",   en: "Poor" },

  // ── Risk level enum → display ─────────────────────────────
  riskLevel_low:       { ar: "منخفض",  en: "Low"      },
  riskLevel_medium:    { ar: "متوسط",  en: "Medium"   },
  riskLevel_high:      { ar: "عالٍ",   en: "High"     },
  riskLevel_critical:  { ar: "حرج",    en: "Critical" },

  // ── Risk radar ────────────────────────────────────────────
  riskRadarTitle:      { ar: "تقييم المخاطر الشامل", en: "Comprehensive Risk Assessment" },
  radarSeriesName:     { ar: "النتيجة",               en: "Score"                         },

  // ── Risk category enum → display ─────────────────────────
  riskCat_cost:        { ar: "التكلفة",   en: "Cost"       },
  riskCat_quality:     { ar: "الجودة",    en: "Quality"    },
  riskCat_time:        { ar: "الوقت",     en: "Time"       },
  riskCat_liquidity:   { ar: "السيولة",   en: "Liquidity"  },
  riskCat_compliance:  { ar: "الامتثال",  en: "Compliance" },
  riskCat_resources:   { ar: "الموارد",   en: "Resources"  },

  // ── Insights section ──────────────────────────────────────
  insightsTitle:       { ar: "رؤى الذكاء الاصطناعي", en: "AI Insights"   },
  confidenceLabel:     { ar: "ثقة",                   en: "Confidence"    },

  // ── Prediction charts ─────────────────────────────────────
  costPredTitle:       { ar: "توقع التكاليف (AI)",                          en: "Cost Prediction (AI)"                              },
  costPredNote:        { ar: "* التوقعات مبنية على خوارزميات التعلم الآلي", en: "* Predictions based on ML algorithms"              },
  costActual:          { ar: "فعلي",                                         en: "Actual"                                            },
  costPredicted:       { ar: "متوقع",                                        en: "Predicted"                                         },
  cashFlowTitle:       { ar: "توقع التدفق النقدي (AI)",                      en: "Cash Flow Forecast (AI)"                           },
  cashFlowNote:        { ar: "* توقعات مبنية على البيانات التاريخية والأنماط الموسمية", en: "* Forecasts based on historical data and seasonal patterns" },
  inflow:              { ar: "التدفقات الداخلة", en: "Inflows"  },
  outflow:             { ar: "التدفقات الخارجة", en: "Outflows" },

  // ── Recommendations ───────────────────────────────────────
  recommendationsTitle: { ar: "التوصيات الذكية",   en: "AI Recommendations" },
  expectedImpactLabel:  { ar: "التأثير المتوقع:",  en: "Expected Impact:"   },
  apply:                { ar: "تطبيق",              en: "Apply"              },
  applying:             { ar: "جارٍ التطبيق…",      en: "Applying…"          },
  applied:              { ar: "تم التطبيق",          en: "Applied"            },

  // ── Priority enum → display ───────────────────────────────
  priority_high:        { ar: "عالية",   en: "High"   },
  priority_medium:      { ar: "متوسطة",  en: "Medium" },
  priority_low:         { ar: "منخفضة",  en: "Low"    },
} as const;

export type AIStringKey = keyof typeof AI_STRINGS;

export function tAI(lang: Lang, key: AIStringKey): string {
  return AI_STRINGS[key][lang];
}

// ── Enum resolvers ────────────────────────────────────────────

export function resolveHealthLabel(lang: Lang, key: HealthLabelKey): string {
  const map: Record<HealthLabelKey, AIStringKey> = {
    good: "healthLabel_good",
    fair: "healthLabel_fair",
    poor: "healthLabel_poor",
  };
  return tAI(lang, map[key]);
}

export function resolveRiskLevel(lang: Lang, key: RiskLevelKey): string {
  const map: Record<RiskLevelKey, AIStringKey> = {
    low:      "riskLevel_low",
    medium:   "riskLevel_medium",
    high:     "riskLevel_high",
    critical: "riskLevel_critical",
  };
  return tAI(lang, map[key]);
}

export function resolveRiskCategory(lang: Lang, key: RiskCategoryKey): string {
  const map: Record<RiskCategoryKey, AIStringKey> = {
    cost:       "riskCat_cost",
    quality:    "riskCat_quality",
    time:       "riskCat_time",
    liquidity:  "riskCat_liquidity",
    compliance: "riskCat_compliance",
    resources:  "riskCat_resources",
  };
  return tAI(lang, map[key]);
}

export function resolvePriority(lang: Lang, key: RecommendationPriority): string {
  const map: Record<RecommendationPriority, AIStringKey> = {
    high:   "priority_high",
    medium: "priority_medium",
    low:    "priority_low",
  };
  return tAI(lang, map[key]);
}

// ── Style map ─────────────────────────────────────────────────
export const PRIORITY_STYLE: Record<RecommendationPriority, string> = {
  high:   "bg-red-500/20    text-red-400    border border-red-500/30",
  medium: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  low:    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};
