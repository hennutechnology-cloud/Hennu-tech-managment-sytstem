// ============================================================
// journalEntries.i18n.ts
// Only static UI chrome — labels, titles, button text,
// validation messages, and fixed enum resolvers.
//
// NOT here: entry.description, entry.date, entry.totalDebit,
// entry.totalCredit, line.description, line.accountCode —
// those are dynamic API strings/numbers rendered directly.
// ============================================================
import type { Lang } from "../models/Settings.types";

const JE_STRINGS = {
  // ── Page header (JournalHeader) ───────────────────────────
  pageTitle:            { ar: "قيود اليومية",                       en: "Journal Entries"                  },
  pageSubtitle:         { ar: "إضافة وإدارة القيود المحاسبية",      en: "Add and manage accounting entries" },

  // ── EntryForm ─────────────────────────────────────────────
  formTitle:            { ar: "قيد يومية جديد",                     en: "New Journal Entry"                },
  fieldDate:            { ar: "التاريخ",                            en: "Date"                             },
  fieldDescription:     { ar: "البيان",                             en: "Description"                      },
  fieldDescPlaceholder: { ar: "وصف القيد المحاسبي",                 en: "Accounting entry description"     },

  // ── Lines table headers ───────────────────────────────────
  colAccount:           { ar: "الحساب",                             en: "Account"                          },
  colLineDesc:          { ar: "البيان",                             en: "Description"                      },
  colDebit:             { ar: "مدين",                               en: "Debit"                            },
  colCredit:            { ar: "دائن",                               en: "Credit"                           },
  colActions:           { ar: "إجراءات",                            en: "Actions"                          },

  // ── Lines table placeholders / defaults ───────────────────
  selectAccount:        { ar: "اختر الحساب",                        en: "Select Account"                   },
  lineDescPlaceholder:  { ar: "البيان التفصيلي",                    en: "Line description"                 },
  addLine:              { ar: "إضافة سطر",                          en: "Add Line"                         },

  // ── Balance indicator ─────────────────────────────────────
  balanced:             { ar: "القيد متوازن",                       en: "Entry is balanced"                },
  balancedSub:          { ar: "المدين = الدائن",                    en: "Debit = Credit"                   },
  notBalanced:          { ar: "القيد غير متوازن",                   en: "Entry is not balanced"            },
  // uses interpolation: tJEInterp(lang, "balanceDiff", { n: "1,000" })
  balanceDiff:          { ar: "الفرق: {n} ر.س",                     en: "Difference: {n} SAR"              },

  // ── Totals row ────────────────────────────────────────────
  total:                { ar: "الإجمالي",                           en: "Total"                            },

  // ── Form buttons ─────────────────────────────────────────
  saveEntry:            { ar: "حفظ القيد",                          en: "Save Entry"                       },
  saving:               { ar: "جارٍ الحفظ…",                        en: "Saving…"                          },
  cancel:               { ar: "إلغاء",                              en: "Cancel"                           },
  saveChanges:          { ar: "حفظ التعديلات",                      en: "Save Changes"                     },

  // ── Validation errors ─────────────────────────────────────
  errDateRequired:      { ar: "التاريخ مطلوب",                      en: "Date is required"                 },
  errDescRequired:      { ar: "البيان مطلوب",                       en: "Description is required"          },
  errAccountRequired:   { ar: "اختر حساباً",                        en: "Select an account"                },
  errAmountRequired:    { ar: "أدخل مبلغاً",                        en: "Enter an amount"                  },
  errDebitOrCredit:     { ar: "مدين أو دائن فقط",                   en: "Debit or credit only"             },
  // uses interpolation: tJEInterp(lang, "errNotBalanced", { n: "500" })
  errNotBalanced:       { ar: "القيد غير متوازن — الفرق: {n} ر.س", en: "Entry not balanced — diff: {n} SAR" },

  // ── RecentEntries ─────────────────────────────────────────
  recentTitle:          { ar: "القيود الأخيرة",                     en: "Recent Entries"                   },
  colDate:              { ar: "التاريخ",                            en: "Date"                             },
  colDesc:              { ar: "البيان",                             en: "Description"                      },
  colTotalDebit:        { ar: "المدين",                             en: "Debit"                            },
  colTotalCredit:       { ar: "الدائن",                             en: "Credit"                           },
  colLines:             { ar: "عدد الأسطر",                         en: "Lines"                            },
  colActionsTable:      { ar: "إجراءات",                            en: "Actions"                          },
  currency:             { ar: "ر.س",                                en: "SAR"                              },
  viewBtn:              { ar: "عرض",                                en: "View"                             },

  // ── EntryDetailModal ──────────────────────────────────────
  detailTitle:          { ar: "تفاصيل القيد",                       en: "Entry Details"                    },
  // uses interpolation: tJEInterp(lang, "entryNo", { id: "42" })
  entryNo:              { ar: "قيد رقم #{id}",                      en: "Entry #{id}"                      },
  metaDate:             { ar: "التاريخ",                            en: "Date"                             },
  metaLines:            { ar: "عدد الأسطر",                         en: "Lines count"                      },
  // uses interpolation: tJEInterp(lang, "linesCount", { n: "3" })
  linesCount:           { ar: "{n} سطر",                            en: "{n} lines"                        },
  metaDescription:      { ar: "البيان",                             en: "Description"                      },
  isBalanced:           { ar: "القيد متوازن",                       en: "Entry is balanced"                },
  isNotBalanced:        { ar: "القيد غير متوازن",                   en: "Entry is not balanced"            },
  editBtn:              { ar: "تعديل",                              en: "Edit"                             },
  deleteBtn:            { ar: "حذف",                                en: "Delete"                           },

  // ── EntryEditModal ────────────────────────────────────────
  editTitle:            { ar: "تعديل القيد",                        en: "Edit Entry"                       },

  // ── JournalDeleteConfirm ──────────────────────────────────
  deleteTitle:          { ar: "تأكيد الحذف",                        en: "Confirm Delete"                   },
  deleteQuestion:       { ar: "هل أنت متأكد من حذف القيد",          en: "Are you sure you want to delete"  },
  deleteIrreversible:   { ar: "لا يمكن التراجع عن هذه العملية",     en: "This action cannot be undone"     },
  deleteConfirmBtn:     { ar: "نعم، احذف",                          en: "Yes, Delete"                      },
  deleting:             { ar: "جارٍ الحذف…",                        en: "Deleting…"                        },

  // ── Loading ───────────────────────────────────────────────
  loading:              { ar: "جارٍ التحميل…",                      en: "Loading…"                         },
  noEntries:            { ar: "لا توجد قيود",                       en: "No entries found"                 },
} as const;

export type JEStringKey = keyof typeof JE_STRINGS;

export function tJE(lang: Lang, key: JEStringKey): string {
  return JE_STRINGS[key][lang];
}

// ── Interpolation helper ──────────────────────────────────────
// Usage: tJEInterp(lang, "errNotBalanced", { n: "500" }) → "القيد غير متوازن — الفرق: 500 ر.س"
export function tJEInterp(
  lang: Lang,
  key: JEStringKey,
  vars: Record<string, string | number>,
): string {
  let result = JE_STRINGS[key][lang] as string;
  for (const [k, v] of Object.entries(vars)) {
    result = result.replace(`{${k}}`, String(v));
  }
  return result;
}
