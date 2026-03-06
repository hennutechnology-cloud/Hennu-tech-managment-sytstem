// ============================================================
// analyticalReports.i18n.ts
// Only static UI chrome — titles, labels, button text,
// and fixed enum resolvers (report type options).
// ============================================================
import type { Lang }       from "../models/Settings.types";
import type { ReportType } from "../models/AnalyticalReports.types";

const AR_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:          { ar: "التقارير التحليلية",              en: "Analytical Reports"           },
  pageSubtitle:       { ar: "تقارير مفصلة وتحليلات متقدمة",   en: "Detailed reports and advanced analytics" },

  // ── Filter ────────────────────────────────────────────────
  reportTypeLabel:    { ar: "نوع التقرير",                     en: "Report Type"                  },
  fromDate:           { ar: "من تاريخ",                        en: "From Date"                    },
  toDate:             { ar: "إلى تاريخ",                       en: "To Date"                      },
  filter:             { ar: "تصفية",                           en: "Filter"                       },

  // ── Report type enum → display ────────────────────────────
  reportType_all:         { ar: "جميع التقارير",               en: "All Reports"                  },
  reportType_financial:   { ar: "التقارير المالية",             en: "Financial Reports"            },
  reportType_performance: { ar: "تقارير الأداء",               en: "Performance Reports"          },
  reportType_projects:    { ar: "تقارير المشاريع",              en: "Project Reports"              },

  // ── Quick reports ─────────────────────────────────────────
  quickReportsTitle:  { ar: "التقارير السريعة",                 en: "Quick Reports"                },
  analyticalReport:   { ar: "تقرير تحليلي",                    en: "Analytical Report"            },
  period:             { ar: "الفترة",                          en: "Period"                       },

  // ── Charts ────────────────────────────────────────────────
  profitabilityTitle: { ar: "تحليل الربحية",                   en: "Profitability Analysis"       },
  expensesTitle:      { ar: "تحليل المصروفات",                  en: "Expense Analysis"             },
  profitMargin:       { ar: "هامش الربح %",                    en: "Profit Margin %"              },
  roi:                { ar: "العائد على الاستثمار %",           en: "Return on Investment %"       },
  amountLabel:        { ar: "المبلغ",                          en: "Amount"                       },

  // ── Export ────────────────────────────────────────────────
  exportTitle:        { ar: "تصدير التقارير",                   en: "Export Reports"               },
  exportPdf:          { ar: "تصدير إلى PDF",                   en: "Export to PDF"                },
  scheduleReports:    { ar: "جدولة التقارير",                   en: "Schedule Reports"             },
  scheduling:         { ar: "جارٍ الجدولة…",                   en: "Scheduling…"                  },

  // ── PDF content labels ────────────────────────────────────
  pdfSubtitle:        { ar: "تقارير مفصلة وتحليلات متقدمة",   en: "Detailed reports and advanced analytics" },
  avgProfitMargin:    { ar: "متوسط هامش الربح",                en: "Avg Profit Margin"            },
  avgRoi:             { ar: "متوسط العائد على الاستثمار",       en: "Avg Return on Investment"     },
  totalExpenses:      { ar: "إجمالي المصروفات",                en: "Total Expenses"               },
  profitAnalysis:     { ar: "تحليل الربحية",                   en: "Profitability Analysis"       },
  expenseAnalysis:    { ar: "تحليل المصروفات",                  en: "Expense Analysis"             },
  monthCol:           { ar: "الشهر",                           en: "Month"                        },
  profitMarginCol:    { ar: "هامش الربح %",                    en: "Profit Margin %"              },
  roiCol:             { ar: "العائد على الاستثمار %",           en: "ROI %"                        },
  categoryCol:        { ar: "الفئة",                           en: "Category"                     },
  amountCol:          { ar: "المبلغ",                          en: "Amount"                       },
  totalRow:           { ar: "الإجمالي",                        en: "Total"                        },
  currency:           { ar: "ر.س",                             en: "SAR"                          },

  // ── States ────────────────────────────────────────────────
  loadError:          { ar: "تعذّر تحميل البيانات",             en: "Failed to load data"          },
} as const;

export type ARStringKey = keyof typeof AR_STRINGS;

export function tAR(lang: Lang, key: ARStringKey): string {
  return AR_STRINGS[key][lang];
}

// ── Report type enum resolver ─────────────────────────────────
export function resolveReportType(lang: Lang, type: ReportType): string {
  const map: Record<ReportType, ARStringKey> = {
    all:         "reportType_all",
    financial:   "reportType_financial",
    performance: "reportType_performance",
    projects:    "reportType_projects",
  };
  return tAR(lang, map[type]);
}

// ── All report type options (for the select dropdown) ─────────
export const REPORT_TYPE_VALUES: ReportType[] = ["all", "financial", "performance", "projects"];

// ── Number formatter ──────────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
}

// ── Date formatter using FULL_MONTHS from util.i18n ───────────
// Input: "YYYY-MM-DD" → "3 February 2026" / "3 فبراير 2026"
import { FULL_MONTHS } from "./util.i18n";

export function formatDateDisplay(iso: string, lang: Lang): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const monthName = FULL_MONTHS[lang][parseInt(m) - 1];
  return lang === "ar"
    ? `${parseInt(d)} ${monthName} ${y}`
    : `${parseInt(d)} ${monthName} ${y}`;
}
