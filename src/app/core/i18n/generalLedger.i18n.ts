// ============================================================
// generalLedger.i18n.ts
// Only static UI chrome — titles, labels, column headers,
// button text, and date formatting helpers.
//
// NOT here:
//   entry.description — plain API string, rendered directly
//   account.name      — plain API string, rendered directly
//   entry.date        — formatted by formatLedgerDate(lang, iso)
// ============================================================
import type { Lang } from "../models/Settings.types";
import { FULL_MONTHS } from "./util.i18n";

// ── String table ──────────────────────────────────────────────
const GL_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:          { ar: "الأستاذ العام",                              en: "General Ledger"                      },
  pageSubtitle:       { ar: "سجل تفصيلي لحركات الحسابات",                 en: "Detailed account transaction register" },
  exportPdf:          { ar: "تصدير PDF",                                  en: "Export PDF"                          },
  exporting:          { ar: "جارٍ التصدير…",                              en: "Exporting…"                          },

  // ── Filters ───────────────────────────────────────────────
  filterAccount:      { ar: "الحساب",                                     en: "Account"                             },
  filterFrom:         { ar: "من تاريخ",                                   en: "From Date"                           },
  filterTo:           { ar: "إلى تاريخ",                                  en: "To Date"                             },
  filterApply:        { ar: "تصفية",                                      en: "Apply"                               },

  // ── Table sub-header ──────────────────────────────────────
  periodLabel:        { ar: "فترة: من {from} إلى {to}",                  en: "Period: {from} to {to}"              },
  openingBalance:     { ar: "رصيد افتتاحي",                              en: "Opening Balance"                     },
  closingBalance:     { ar: "رصيد ختامي",                                en: "Closing Balance"                     },

  // ── Table column headers ──────────────────────────────────
  colDate:            { ar: "التاريخ",                                    en: "Date"                                },
  colDescription:     { ar: "البيان",                                     en: "Description"                         },
  colDebit:           { ar: "مدين",                                       en: "Debit"                               },
  colCredit:          { ar: "دائن",                                       en: "Credit"                              },
  colBalance:         { ar: "الرصيد",                                     en: "Balance"                             },

  // ── Table footer ──────────────────────────────────────────
  totals:             { ar: "الإجماليات",                                 en: "Totals"                              },

  // ── Empty state ───────────────────────────────────────────
  noEntries:          { ar: "لا توجد حركات في هذه الفترة",               en: "No transactions in this period"      },

  // ── No-data alert ─────────────────────────────────────────
  noDataTitle:        { ar: "لا توجد بيانات",                             en: "No Data"                             },
  noDataBody:         { ar: "لا توجد حركات مالية في الفترة المحددة للحساب المختار.\nيرجى تغيير الفلاتر والمحاولة مجدداً.",
                        en: "No transactions found for the selected account and period.\nPlease adjust the filters and try again." },
  noDataOk:           { ar: "حسناً، فهمت",                               en: "Got it"                              },

  // ── Loading ───────────────────────────────────────────────
  loading:            { ar: "جارٍ التحميل…",                             en: "Loading…"                            },

  // ── Currency ──────────────────────────────────────────────
  currency:           { ar: "ر.س",                                        en: "SAR"                                 },
  currencyFull:       { ar: "ريال سعودي",                                 en: "Saudi Riyal"                         },

  // ── PDF strings ───────────────────────────────────────────
  pdfTitle:           { ar: "تقرير الأستاذ العام",                        en: "General Ledger Report"               },
  pdfSubtitle:        { ar: "بيان حركات الحساب",                          en: "Account Transaction Statement"       },
  pdfMetaAccount:     { ar: "الحساب",                                     en: "Account"                             },
  pdfMetaPeriod:      { ar: "الفترة الزمنية",                             en: "Period"                              },
  pdfKpiOpening:      { ar: "الرصيد الافتتاحي",                           en: "Opening Balance"                     },
  pdfKpiDebit:        { ar: "إجمالي المدين",                              en: "Total Debit"                         },
  pdfKpiCredit:       { ar: "إجمالي الدائن",                              en: "Total Credit"                        },
  pdfKpiClosing:      { ar: "الرصيد الختامي",                             en: "Closing Balance"                     },
  pdfSectionTitle:    { ar: "تفاصيل الحركات المالية",                     en: "Transaction Details"                 },
  pdfColDate:         { ar: "التاريخ",                                    en: "Date"                                },
  pdfColDesc:         { ar: "البيان",                                     en: "Description"                         },
  pdfColDebit:        { ar: "مدين",                                       en: "Debit"                               },
  pdfColCredit:       { ar: "دائن",                                       en: "Credit"                              },
  pdfColBalance:      { ar: "الرصيد",                                     en: "Balance"                             },
  pdfTotals:          { ar: "الإجماليات",                                 en: "Totals"                              },
} as const;

export type GLStringKey = keyof typeof GL_STRINGS;

// Normalize any locale string ("ar", "ar-SA", undefined, …) to "ar" | "en"
function normLang(lang: unknown): "ar" | "en" {
  if (typeof lang === "string" && lang.startsWith("en")) return "en";
  return "ar";
}

export function tGL(lang: Lang, key: GLStringKey): string {
  return GL_STRINGS[key][normLang(lang)];
}

// ── Interpolation helper ──────────────────────────────────────
export function tGLInterp(
  lang: Lang,
  key: GLStringKey,
  vars: Record<string, string | number>,
): string {
  let result = GL_STRINGS[key][normLang(lang)] as string;
  for (const [k, v] of Object.entries(vars))
    result = result.replace(`{${k}}`, String(v));
  return result;
}

// ── Date formatter using FULL_MONTHS from util.i18n ───────────
// Converts "YYYY-MM-DD" → "3 فبراير 2026" / "3 February 2026"
export function formatLedgerDate(lang: Lang, iso: string): string {
  if (!iso) return iso;
  const [y, m, day] = iso.split("-");
  return `${parseInt(day)} ${FULL_MONTHS[normLang(lang)][parseInt(m) - 1]} ${y}`;
}

// ── Number formatters ─────────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(normLang(lang) === "ar" ? "ar-SA" : "en-US");
}

export function sar(n: number, lang: Lang): string {
  return `${formatNum(n, lang)} ${GL_STRINGS.currency[normLang(lang)]}`;
}
