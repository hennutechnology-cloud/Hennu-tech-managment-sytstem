// ============================================================
// incomeStatement.i18n.ts
// Only static UI chrome — titles, section headers, row labels,
// button text, period selector label, and PDF strings.
//
// NOT here:
//   period.label — these are financial period names that the API
//   returns in the user's language (e.g. "الربع الأول 2026").
//   All numeric data — rendered directly via formatNum().
// ============================================================
import type { Lang } from "../models/Settings.types";

const IS_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:          { ar: "قائمة الدخل",                         en: "Income Statement"                    },
  pageSubtitle:       { ar: "بيان الأرباح والخسائر",                en: "Profit & Loss Statement"             },
  exportPdf:          { ar: "تصدير PDF",                           en: "Export PDF"                          },
  exporting:          { ar: "جارٍ التصدير…",                       en: "Exporting…"                          },

  // ── Period selector ───────────────────────────────────────
  periodLabel:        { ar: "الفترة المالية",                      en: "Financial Period"                    },

  // ── Section titles ────────────────────────────────────────
  sectionRevenue:     { ar: "الإيرادات",                           en: "Revenue"                             },
  sectionCogs:        { ar: "تكلفة البضاعة المباعة",               en: "Cost of Goods Sold"                  },
  sectionOpEx:        { ar: "المصروفات التشغيلية",                 en: "Operating Expenses"                  },
  sectionOtherEx:     { ar: "مصروفات أخرى",                       en: "Other Expenses"                      },

  // ── Revenue rows ──────────────────────────────────────────
  revSales:           { ar: "إيرادات المبيعات",                    en: "Sales Revenue"                       },
  revOther:           { ar: "إيرادات أخرى",                        en: "Other Income"                        },
  revTotal:           { ar: "إجمالي الإيرادات",                    en: "Total Revenue"                       },

  // ── COGS rows ─────────────────────────────────────────────
  cogsMaterials:      { ar: "مواد خام",                            en: "Raw Materials"                       },
  cogsLabor:          { ar: "عمالة مباشرة",                        en: "Direct Labor"                        },
  cogsOther:          { ar: "تكاليف أخرى",                        en: "Other Costs"                         },
  cogsTotal:          { ar: "إجمالي التكلفة",                      en: "Total COGS"                          },

  // ── Gross profit highlight ────────────────────────────────
  grossProfit:        { ar: "إجمالي الربح",                        en: "Gross Profit"                        },

  // ── Operating expense rows ────────────────────────────────
  opExSalaries:       { ar: "الرواتب والأجور",                     en: "Salaries & Wages"                    },
  opExRent:           { ar: "الإيجارات",                           en: "Rent"                                },
  opExAdmin:          { ar: "المصاريف الإدارية",                   en: "Administrative Expenses"             },
  opExUtilities:      { ar: "المرافق والخدمات",                    en: "Utilities & Services"                },
  opExMarketing:      { ar: "التسويق والإعلان",                    en: "Marketing & Advertising"             },
  opExDepreciation:   { ar: "الإهلاك والاستهلاك",                  en: "Depreciation & Amortization"         },
  opExTotal:          { ar: "إجمالي المصروفات التشغيلية",          en: "Total Operating Expenses"            },

  // ── Operating income highlight ────────────────────────────
  operatingIncome:    { ar: "الدخل التشغيلي",                      en: "Operating Income"                    },

  // ── Other expense rows ────────────────────────────────────
  otherExInterest:    { ar: "فوائد بنكية",                         en: "Bank Interest"                       },
  otherExTaxes:       { ar: "ضرائب",                               en: "Taxes"                               },
  otherExTotal:       { ar: "إجمالي المصروفات الأخرى",            en: "Total Other Expenses"                },

  // ── Net income highlight ──────────────────────────────────
  netIncome:          { ar: "صافي الربح",                          en: "Net Income"                          },

  // ── Currency ──────────────────────────────────────────────
  currency:           { ar: "ر.س",                                 en: "SAR"                                 },

  // ── No-data alert ─────────────────────────────────────────
  noDataTitle:        { ar: "لا توجد بيانات",                      en: "No Data"                             },
  noDataBody:         { ar: "لا توجد بيانات لقائمة الدخل للفترة المحددة.\nيرجى اختيار فترة مالية مختلفة.",
                        en: "No income statement data for the selected period.\nPlease choose a different financial period." },
  noDataOk:           { ar: "حسناً، فهمت",                        en: "Got it"                              },

  // ── Loading ───────────────────────────────────────────────
  loading:            { ar: "جارٍ التحميل…",                       en: "Loading…"                            },
  noDataFallback:     { ar: "لا توجد بيانات",                      en: "No data available"                   },

  // ── PDF strings ───────────────────────────────────────────
  pdfTitle:           { ar: "قائمة الدخل",                         en: "Income Statement"                    },
  pdfSubtitle:        { ar: "بيان الأرباح والخسائر",               en: "Profit & Loss Statement"             },
  pdfMetaPeriod:      { ar: "الفترة المالية",                      en: "Financial Period"                    },
  pdfKpiRevenue:      { ar: "إجمالي الإيرادات",                    en: "Total Revenue"                       },
  pdfKpiGrossProfit:  { ar: "إجمالي الربح",                        en: "Gross Profit"                        },
  pdfKpiOpIncome:     { ar: "الدخل التشغيلي",                      en: "Operating Income"                    },
  pdfKpiNetIncome:    { ar: "صافي الربح",                          en: "Net Income"                          },
} as const;

export type ISStringKey = keyof typeof IS_STRINGS;

// Normalize any locale string ("ar", "ar-SA", undefined, …) to "ar" | "en"
function normLang(lang: unknown): "ar" | "en" {
  if (typeof lang === "string" && lang.startsWith("en")) return "en";
  return "ar";
}

export function tIS(lang: Lang, key: ISStringKey): string {
  return IS_STRINGS[key][normLang(lang)];
}

// ── Number formatters ─────────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(normLang(lang) === "ar" ? "ar-SA" : "en-US");
}

export function sar(n: number, lang: Lang): string {
  const l = normLang(lang);
  return `${formatNum(n, lang)} ${IS_STRINGS.currency[l]}`;
}

// ── Negative amount display ───────────────────────────────────
// Returns "(1,234) ر.س" / "(1,234) SAR"
export function sarNeg(n: number, lang: Lang): string {
  const l = normLang(lang);
  return `(${formatNum(n, lang)}) ${IS_STRINGS.currency[l]}`;
}
