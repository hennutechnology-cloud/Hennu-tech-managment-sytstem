// ============================================================
// trialBalance.i18n.ts
// Only static UI chrome — titles, labels, button text.
//
// Shared helpers (formatNum, dirAttr, flip, isRTL) and
// time/date data (months, days) live in util.i18n.ts.
// Nothing is duplicated here.
// ============================================================
import type { Lang } from "../models/Settings.types";

// ── Re-export shared util so consumers only import from here ──
export { tUtil, tUtilInterp } from "./util.i18n";

// ── Shared RTL / direction helpers ───────────────────────────
export const isRTL   = (lang: Lang): boolean => lang === "ar";
export const dirAttr = (lang: Lang) => (isRTL(lang) ? "rtl" : "ltr") as "rtl" | "ltr";
export const flip    = (lang: Lang, ltr: string, rtl: string) => isRTL(lang) ? rtl : ltr;

// ── Number formatter ──────────────────────────────────────────
export const formatNum = (n: number, lang: Lang): string =>
  n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");

// ── Date formatter — numeric months (DD/MM/YYYY) ──────────────
// Uses plain numbers 1–12, no month names, identical in AR + EN.
// e.g. "2025-03-07" → "07/03/2025"
export function fmtDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

// ── Trial Balance strings ─────────────────────────────────────
const TB_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:       { ar: "ميزان المراجعة",                                        en: "Trial Balance"                                       },
  pageSubtitle:    { ar: "التحقق من توازن الحسابات",                              en: "Verify account balances"                             },
  exportExcel:     { ar: "تصدير Excel",                                           en: "Export Excel"                                        },
  exporting:       { ar: "جارٍ التصدير…",                                         en: "Exporting…"                                          },

  // ── Date filter ───────────────────────────────────────────
  periodLabel:     { ar: "الفترة المحاسبية",                                      en: "Accounting Period"                                   },
  dateFrom:        { ar: "من تاريخ",                                              en: "From Date"                                           },
  dateTo:          { ar: "إلى تاريخ",                                             en: "To Date"                                             },
  applyFilter:     { ar: "تطبيق",                                                 en: "Apply"                                               },

  // ── Table headers ─────────────────────────────────────────
  colCode:         { ar: "رمز الحساب",                                            en: "Code"                                                },
  colAccount:      { ar: "اسم الحساب",                                            en: "Account Name"                                       },
  colDebit:        { ar: "مدين",                                                  en: "Debit"                                               },
  colCredit:       { ar: "دائن",                                                  en: "Credit"                                              },
  colDebitSar:     { ar: "مدين (ر.س)",                                            en: "Debit (SAR)"                                         },
  colCreditSar:    { ar: "دائن (ر.س)",                                            en: "Credit (SAR)"                                       },
  totalLabel:      { ar: "الإجمالي",                                              en: "Total"                                               },
  noData:          { ar: "لا توجد بيانات في هذه الفترة",                         en: "No data for this period"                             },

  // ── Balance status ────────────────────────────────────────
  balancedTitle:   { ar: "الميزان متوازن",                                        en: "Balance is Balanced"                                 },
  balancedBody:    { ar: "مجموع الجانب المدين يساوي مجموع الجانب الدائن",         en: "Total debits equal total credits"                   },
  unbalancedTitle: { ar: "الميزان غير متوازن",                                    en: "Balance is Unbalanced"                               },
  unbalancedBody:  { ar: "يوجد فرق بمقدار {amount} — يرجى المراجعة",             en: "There is a difference of {amount} — please review"  },
  currency:        { ar: "ر.س",                                                   en: "SAR"                                                 },

  // ── No-data alert dialog ──────────────────────────────────
  alertTitle:      { ar: "لا توجد بيانات",                                        en: "No Data Found"                                       },
  alertBody:       { ar: "لا توجد بيانات لميزان المراجعة في الفترة المحددة.\nيرجى تغيير الفترة المحاسبية والمحاولة مجدداً.",
                     en: "No trial balance data found for the selected period.\nPlease change the accounting period and try again."        },
  alertClose:      { ar: "حسناً، فهمت",                                           en: "Got it"                                              },

  // ── Loading / error ───────────────────────────────────────
  loading:         { ar: "جارٍ التحميل…",                                         en: "Loading…"                                            },
  loadError:       { ar: "تعذّر تحميل البيانات",                                  en: "Failed to load data"                                 },

  // ── Excel export strings ──────────────────────────────────
  excelCompany:    { ar: "Hennu Tech — نظام إدارة المشاريع الإنشائية",            en: "Hennu Tech — Construction Project Management System" },
  excelSheetTitle: { ar: "ميزان المراجعة",                                        en: "Trial Balance"                                       },
  excelPeriod:     { ar: "الفترة",                                                en: "Period"                                              },
  excelPrintedOn:  { ar: "تاريخ الطباعة",                                         en: "Printed On"                                          },
  excelBalanced:   { ar: "✓  الميزان متوازن  —  الإجمالي: {total} ر.س",          en: "✓  Balance is balanced  —  Total: {total} SAR"       },
  excelUnbalanced: { ar: "✗  الميزان غير متوازن  —  الفرق: {diff} ر.س",          en: "✗  Balance is unbalanced  —  Difference: {diff} SAR" },
  excelColCode:    { ar: "رمز الحساب",                                            en: "Code"                                                },
  excelColAccount: { ar: "اسم الحساب",                                            en: "Account Name"                                        },
  excelColDebit:   { ar: "مدين (ر.س)",                                            en: "Debit (SAR)"                                         },
  excelColCredit:  { ar: "دائن (ر.س)",                                            en: "Credit (SAR)"                                       },
  excelTotal:      { ar: "الإجمالي",                                              en: "Total"                                               },
  excelSheetName:  { ar: "ميزان المراجعة",                                        en: "Trial Balance"                                       },
} as const;

export type TBStringKey = keyof typeof TB_STRINGS;

export function tTB(lang: Lang, key: TBStringKey): string {
  return TB_STRINGS[key][lang];
}

export function tTBInterp(
  lang: Lang,
  key: TBStringKey,
  vars: Record<string, string | number>,
): string {
  let result = TB_STRINGS[key][lang] as string;
  for (const [k, v] of Object.entries(vars)) {
    result = result.replace(`{${k}}`, String(v));
  }
  return result;
}
