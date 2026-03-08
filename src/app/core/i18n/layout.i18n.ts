// ============================================================
// layout.i18n.ts — UI strings for the Layout component only
// ============================================================

import type { Lang } from "../models/Settings.types";

const LAYOUT_STRINGS = {
  // ── Branding ──────────────────────────────────────────────
  appSubtitle:      { ar: "نظام التمويل الذكي",      en: "Smart Finance System"    },
  betaVersion:      { ar: "نسخة تجريبية",             en: "Beta Version"            },

  // ── Project switcher ──────────────────────────────────────
  projectKingdom:   { ar: "مشروع برج المملكة",        en: "Kingdom Tower Project"   },
  projectWaha:      { ar: "مشروع الواحة السكني",       en: "Al-Waha Residential"     },
  projectNakheel:   { ar: "مجمع النخيل التجاري",       en: "Al-Nakheel Commercial"   },

  // ── Main navigation ───────────────────────────────────────
  navDashboard:     { ar: "لوحة التحكم",               en: "Dashboard"               },
  navProjects:      { ar: "إدارة المشاريع",             en: "Projects"                },
  navBOQComparison: { ar: "مقايسات الأعمال",            en: "BOQ Comparison"          },
  navBOQManagement: { ar: "البنود (BOQ)",               en: "BOQ Management"          },
  navChartAccounts: { ar: "دليل الحسابات",              en: "Chart of Accounts"       },
  navJournalEntries:{ ar: "قيود اليومية",               en: "Journal Entries"         },
  navGeneralLedger: { ar: "الأستاذ العام",              en: "General Ledger"          },
  navTrialBalance:  { ar: "ميزان المراجعة",             en: "Trial Balance"           },
  navIncomeStmt:    { ar: "قائمة الدخل",                en: "Income Statement"        },
  navBalanceSheet:  { ar: "الميزانية العمومية",          en: "Balance Sheet"           },
  navDepreciation:  { ar: "نظام الإهلاك",               en: "Depreciation"            },
  navAnalytical:    { ar: "التقارير التحليلية",           en: "Analytical Reports"      },
  navAiAnalytics:   { ar: "التحليلات الذكية",            en: "AI Analytics"            },
  navSettings:      { ar: "الإعدادات",                  en: "Settings"                },
} as const;

export type LayoutStringKey = keyof typeof LAYOUT_STRINGS;

export function tLayout(lang: Lang, key: LayoutStringKey): string {
  return LAYOUT_STRINGS[key][lang];
}

// Route path → i18n key — used in the nav loop
export const ROUTE_LABEL_KEYS: Record<string, LayoutStringKey> = {
  "/":                    "navDashboard",
  "/projects":            "navProjects",
  "/boq-comparison":      "navBOQComparison",
  "/boq-management":      "navBOQManagement",
  "/chart-of-accounts":   "navChartAccounts",
  "/journal-entries":     "navJournalEntries",
  "/general-ledger":      "navGeneralLedger",
  "/trial-balance":       "navTrialBalance",
  "/income-statement":    "navIncomeStmt",
  "/balance-sheet":       "navBalanceSheet",
  "/depreciation":        "navDepreciation",
  "/analytical-reports":  "navAnalytical",
  "/ai-analytics":        "navAiAnalytics",
  "/settings":            "navSettings",
};
