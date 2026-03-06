// ============================================================
// balanceSheet.i18n.ts
// Only static UI chrome — section titles, row labels, button
// text, status messages, and PDF strings.
//
// NOT here: numeric values, asOf date (comes from API),
// bank names if they ever become dynamic API strings.
//
// NOTE: bank names (bank1, bank2) are currently hardcoded UI
// labels. If the API ever returns them, move them to the service
// and render directly like other dynamic strings.
// ============================================================
import type { Lang } from "../models/Settings.types";

const BS_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:              { ar: "الميزانية العمومية",              en: "Balance Sheet"                    },
  pageSubtitle:           { ar: "المركز المالي للشركة",             en: "Company Financial Position"       },
  exportPdf:              { ar: "تصدير PDF",                       en: "Export PDF"                       },

  // ── Date picker ───────────────────────────────────────────
  asOf:                   { ar: "كما في",                          en: "As of"                            },

  // ── Assets section ────────────────────────────────────────
  assetsTitle:            { ar: "الأصول",                          en: "Assets"                           },
  currentAssetsTitle:     { ar: "الأصول المتداولة",                 en: "Current Assets"                   },
  fixedAssetsTitle:       { ar: "الأصول الثابتة",                   en: "Fixed Assets"                     },

  // Current asset row labels
  cash:                   { ar: "الصندوق",                         en: "Cash"                             },
  bank1:                  { ar: "البنك - الراجحي",                  en: "Bank - Al Rajhi"                  },
  bank2:                  { ar: "البنك - الأهلي",                   en: "Bank - Al Ahli"                   },
  receivables:            { ar: "العملاء",                          en: "Receivables"                      },
  inventory:              { ar: "المخزون",                          en: "Inventory"                        },
  totalCurrentAssets:     { ar: "إجمالي الأصول المتداولة",           en: "Total Current Assets"             },

  // Fixed asset row labels
  land:                   { ar: "الأراضي",                          en: "Land"                             },
  buildings:              { ar: "المباني",                          en: "Buildings"                        },
  equipment:              { ar: "المعدات",                          en: "Equipment"                        },
  vehicles:               { ar: "السيارات",                         en: "Vehicles"                         },
  totalFixedAssets:       { ar: "إجمالي الأصول الثابتة",             en: "Total Fixed Assets"               },

  // Total
  totalAssets:            { ar: "إجمالي الأصول",                    en: "Total Assets"                     },

  // ── Liabilities & equity section ─────────────────────────
  liabilitiesEquityTitle: { ar: "الخصوم وحقوق الملكية",             en: "Liabilities & Equity"             },
  currentLiabTitle:       { ar: "الخصوم المتداولة",                  en: "Current Liabilities"              },
  longTermLiabTitle:      { ar: "الخصوم طويلة الأجل",               en: "Long-Term Liabilities"            },
  equityTitle:            { ar: "حقوق الملكية",                     en: "Equity"                           },

  // Current liability row labels
  payables:               { ar: "الموردون",                         en: "Payables"                         },
  shortTermLoans:         { ar: "قروض قصيرة الأجل",                 en: "Short-Term Loans"                 },
  taxes:                  { ar: "مستحقات ضريبية",                   en: "Tax Payables"                     },
  totalCurrentLiab:       { ar: "إجمالي الخصوم المتداولة",           en: "Total Current Liabilities"        },

  // Long-term liability row labels
  longTermLoans:          { ar: "قروض طويلة الأجل",                 en: "Long-Term Loans"                  },
  bonds:                  { ar: "سندات",                            en: "Bonds"                            },
  totalLongTermLiab:      { ar: "إجمالي الخصوم طويلة الأجل",         en: "Total Long-Term Liabilities"      },

  // Total liabilities
  totalLiabilities:       { ar: "إجمالي الخصوم",                    en: "Total Liabilities"                },

  // Equity row labels
  capital:                { ar: "رأس المال",                        en: "Capital"                          },
  retainedEarnings:       { ar: "الأرباح المحتجزة",                  en: "Retained Earnings"                },
  totalEquity:            { ar: "إجمالي حقوق الملكية",               en: "Total Equity"                     },

  // Grand total
  totalLiabilitiesEquity: { ar: "إجمالي الخصوم وحقوق الملكية",       en: "Total Liabilities & Equity"       },

  // ── Status banner ─────────────────────────────────────────
  balanced:               { ar: "الميزانية متوازنة",                 en: "Balance Sheet Balanced"           },
  balancedDesc:           { ar: "الأصول = الخصوم + حقوق الملكية",    en: "Assets = Liabilities + Equity"    },

  // ── PDF KPI labels ────────────────────────────────────────
  pdfAsOf:                { ar: "كما في",                           en: "As of"                            },
  kpiTotalAssets:         { ar: "إجمالي الأصول",                    en: "Total Assets"                     },
  kpiTotalLiabilities:    { ar: "إجمالي الخصوم",                    en: "Total Liabilities"                },
  kpiEquity:              { ar: "حقوق الملكية",                     en: "Equity"                           },
  kpiLiabAndEquity:       { ar: "الخصوم + حقوق الملكية",            en: "Liabilities + Equity"             },
  currency:               { ar: "ر.س",                              en: "SAR"                              },
  currencyUnit:           { ar: "ريال سعودي",                       en: "Saudi Riyal"                      },
} as const;

export type BSStringKey = keyof typeof BS_STRINGS;

export function tBS(lang: Lang, key: BSStringKey): string {
  return BS_STRINGS[key][lang];
}

// ── Number formatter ──────────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
}

// ── SAR amount string ─────────────────────────────────────────
export function sar(n: number, lang: Lang): string {
  return `${formatNum(n, lang)} ${tBS(lang, "currency")}`;
}
