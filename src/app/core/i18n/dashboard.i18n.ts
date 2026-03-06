// ============================================================
// dashboard.i18n.ts
// Only static UI chrome — titles, labels, button text,
// and fixed enum resolvers (health status, risk level).
//
// NOT here: alert titles/descriptions, budget category names
// — those are dynamic API strings returned in the user's language.
//
// KPI titles ARE now static here (moved from API strings).
// ============================================================
import type { Lang }         from "../models/Settings.types";
import type { HealthStatus } from "../models/dashboard.types";

const DASH_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:          { ar: "لوحة التحكم",                              en: "Dashboard"                            },
  pageSubtitle:       { ar: "مرحباً بك في نظام التحكم المالي الذكي",    en: "Welcome to the Smart Finance System"  },
  exportReport:       { ar: "تصدير التقرير",                            en: "Export Report"                        },

  // ── KPI card titles (static — switch with language) ───────
  kpiTotalRevenue:    { ar: "إجمالي الإيرادات",  en: "Total Revenue"   },
  kpiTotalExpenses:   { ar: "إجمالي المصروفات",  en: "Total Expenses"  },
  kpiNetProfit:       { ar: "صافي الربح",         en: "Net Profit"      },
  kpiFundBalance:     { ar: "رصيد الصندوق",       en: "Fund Balance"    },
  kpiBankBalance:     { ar: "رصيد البنك",         en: "Bank Balance"    },
  kpiCompletion:      { ar: "نسبة الإنجاز",       en: "Completion Rate" },

  // ── KPI cards ─────────────────────────────────────────────
  currency:           { ar: "ر.س",                                      en: "SAR"                                  },

  // ── AI Health Score ───────────────────────────────────────
  healthTitle:        { ar: "مؤشر صحة المشروع (AI)",                    en: "Project Health Score (AI)"            },
  healthSubtitle:     { ar: "تحليل شامل لأداء المشروع بالذكاء الاصطناعي", en: "Comprehensive AI-powered project analysis" },

  // ── Health status enum → display ─────────────────────────
  status_excellent:   { ar: "ممتاز",  en: "Excellent" },
  status_good:        { ar: "جيد",    en: "Good"      },
  status_warning:     { ar: "تحذير",  en: "Warning"   },
  status_critical:    { ar: "خطر",    en: "Critical"  },

  // ── Charts ────────────────────────────────────────────────
  revenueExpenseTitle:  { ar: "الإيرادات مقابل المصروفات",    en: "Revenue vs Expenses"         },
  revenueLabel:         { ar: "الإيرادات",                    en: "Revenue"                     },
  expensesLabel:        { ar: "المصروفات",                    en: "Expenses"                    },
  profitTitle:          { ar: "صافي الربح الشهري",             en: "Monthly Net Profit"          },
  profitLabel:          { ar: "الربح",                        en: "Profit"                      },
  cashFlowTitle:        { ar: "توقعات التدفق النقدي",          en: "Cash Flow Forecast"          },
  cashFlowLabel:        { ar: "التدفق النقدي",                 en: "Cash Flow"                   },
  cashFlowNote:         { ar: "* البيانات المستقبلية هي توقعات بناءً على الذكاء الاصطناعي",
                          en: "* Future data are AI-based forecasts"                            },
  budgetActualTitle:    { ar: "الميزانية مقابل الفعلي",        en: "Budget vs Actual"            },
  budgetLabel:          { ar: "الميزانية",                     en: "Budget"                      },
  actualLabel:          { ar: "الفعلي",                       en: "Actual"                      },

  // ── AI Alerts ─────────────────────────────────────────────
  alertsTitle:        { ar: "تنبيهات الذكاء الاصطناعي",       en: "AI Alerts"                   },

  // ── Loading / error ───────────────────────────────────────
  loading:            { ar: "جارٍ التحميل…",                  en: "Loading…"                    },
  loadError:          { ar: "تعذّر تحميل البيانات",             en: "Failed to load data"         },
} as const;

export type DashStringKey = keyof typeof DASH_STRINGS;

export function tDash(lang: Lang, key: DashStringKey): string {
  return DASH_STRINGS[key][lang];
}

// ── KPI title key map (index-based, matches service order) ───
// Order must match getKpis() in dashboard.service.ts
export const KPI_TITLE_KEYS: DashStringKey[] = [
  "kpiTotalRevenue",
  "kpiTotalExpenses",
  "kpiNetProfit",
  "kpiFundBalance",
  "kpiBankBalance",
  "kpiCompletion",
];

// ── Health status enum resolver ───────────────────────────────
export function resolveHealthStatus(lang: Lang, status: HealthStatus): string {
  const map: Record<HealthStatus, DashStringKey> = {
    excellent: "status_excellent",
    good:      "status_good",
    warning:   "status_warning",
    critical:  "status_critical",
  };
  return tDash(lang, map[status]);
}

// ── Health status color ───────────────────────────────────────
export const HEALTH_STATUS_COLOR: Record<HealthStatus, string> = {
  excellent: "text-emerald-400",
  good:      "text-emerald-500",
  warning:   "text-yellow-400",
  critical:  "text-red-500",
};

// ── Risk gradient classes ─────────────────────────────────────
export const RISK_GRADIENT = {
  high:   "from-red-500/20    to-red-600/10    border-red-500/30",
  medium: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  low:    "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
} as const;

// ── Number formatter ──────────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
}

// ── Chart axis helpers ────────────────────────────────────────

/**
 * Compact number formatter for chart Y-axis ticks.
 * Keeps labels short so they never overflow into the plot area.
 * e.g. 1_500_000 → "1.5M" / "١.٥م"
 */
export function formatAxisNum(n: number, lang: Lang): string {
  const isAr = lang === "ar";
  if (Math.abs(n) >= 1_000_000) {
    const v = (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return isAr ? `${v}م` : `${v}M`;
  }
  if (Math.abs(n) >= 1_000) {
    const v = (n / 1_000).toFixed(0);
    return isAr ? `${v}ك` : `${v}K`;
  }
  return String(n);
}

/**
 * Returns chart layout values that depend on direction.
 * Centralises all the magic numbers so ChartsGrid stays clean.
 */
export function chartLayout(lang: Lang) {
  const isAr = lang === "ar";
  return {
    /** Side the numeric Y-axis appears on */
    yAxisSide: (isAr ? "right" : "left") as "right" | "left",
    /** Side the category Y-axis appears on (horizontal bar chart) */
    categoryAxisSide: (isAr ? "left" : "right") as "right" | "left",
    /** px reserved for the numeric Y-axis tick labels */
    yAxisWidth: 52,
    /** px reserved for category labels in the horizontal bar chart */
    categoryAxisWidth: isAr ? 110 : 100,
    /** Chart margins — give the axis labels room to breathe */
    margin: isAr
      ? { top: 5, right: 16, left: 8, bottom: 5 }
      : { top: 5, right: 8,  left: 16, bottom: 5 },
    /** Rounded corners on horizontal bars face outward */
    barRadius: (isAr ? [8, 0, 0, 8] : [0, 8, 8, 0]) as [number, number, number, number],
  };
}
