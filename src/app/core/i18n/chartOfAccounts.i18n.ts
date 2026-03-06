// ============================================================
// chartOfAccounts.i18n.ts
// Only static UI chrome — labels, titles, button text,
// validation messages, and fixed enum resolvers.
//
// NOT here: account.name, account.code, account.balance —
// those are dynamic API strings/numbers rendered directly.
// ============================================================
import type { Lang }        from "../models/Settings.types";
import type { AccountType } from "../models/ChartOfAccounts.types";

const COA_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:          { ar: "دليل الحسابات",                    en: "Chart of Accounts"              },
  pageSubtitle:       { ar: "الهيكل الكامل للحسابات المالية",   en: "Complete financial account structure" },
  addAccount:         { ar: "إضافة حساب جديد",                  en: "Add New Account"                },

  // ── Table headers ─────────────────────────────────────────
  colCode:            { ar: "رمز الحساب",                       en: "Code"                           },
  colName:            { ar: "اسم الحساب",                       en: "Account Name"                   },
  colType:            { ar: "النوع",                            en: "Type"                           },
  colBalance:         { ar: "الرصيد",                           en: "Balance"                        },
  colActions:         { ar: "إجراءات",                          en: "Actions"                        },

  // ── Account type badge labels (fixed enum) ────────────────
  typeMain:           { ar: "رئيسي",                            en: "Main"                           },
  typeSub:            { ar: "فرعي",                             en: "Sub"                            },
  typeDetail:         { ar: "تفصيلي",                           en: "Detail"                         },

  // ── Summary cards ─────────────────────────────────────────
  totalAssets:        { ar: "إجمالي الأصول",                    en: "Total Assets"                   },
  totalLiabilities:   { ar: "إجمالي الخصوم",                   en: "Total Liabilities"              },
  equity:             { ar: "حقوق الملكية",                     en: "Equity"                         },
  revenues:           { ar: "الإيرادات",                        en: "Revenues"                       },
  expenses:           { ar: "المصروفات",                        en: "Expenses"                       },
  currency:           { ar: "ر.س",                              en: "SAR"                            },

  // ── Modal — create ────────────────────────────────────────
  modalAddTitle:      { ar: "إضافة حساب جديد",                  en: "Add New Account"                },
  modalAddSubtitle:   { ar: "أدخل بيانات الحساب الجديد",        en: "Enter the new account details"  },

  // ── Modal — edit ──────────────────────────────────────────
  modalEditTitle:     { ar: "تعديل الحساب",                     en: "Edit Account"                   },
  // modalEditSubtitle uses interpolation: "تعديل بيانات الحساب {code}"
  modalEditSubtitle:  { ar: "تعديل بيانات الحساب {code}",       en: "Editing account {code}"         },

  // ── Modal — form fields ───────────────────────────────────
  fieldCode:          { ar: "رمز الحساب",                       en: "Account Code"                   },
  fieldCodePlaceholder: { ar: "مثال: 1101",                     en: "e.g. 1101"                      },
  fieldType:          { ar: "نوع الحساب",                       en: "Account Type"                   },
  fieldName:          { ar: "اسم الحساب",                       en: "Account Name"                   },
  fieldNamePlaceholder: { ar: "مثال: الصندوق",                  en: "e.g. Cash"                      },
  fieldBalance:       { ar: "الرصيد الافتتاحي (ر.س)",           en: "Opening Balance (SAR)"          },
  fieldParent:        { ar: "الحساب الأب (اختياري)",             en: "Parent Account (optional)"      },
  fieldParentNone:    { ar: "— بدون حساب أب (مستوى رئيسي) —",  en: "— No parent (top-level) —"      },

  // ── Modal — buttons ───────────────────────────────────────
  cancel:             { ar: "إلغاء",                            en: "Cancel"                         },
  save:               { ar: "حفظ التعديلات",                    en: "Save Changes"                   },
  saving:             { ar: "جارٍ الحفظ…",                      en: "Saving…"                        },
  addBtn:             { ar: "إضافة الحساب",                     en: "Add Account"                    },

  // ── Validation errors ─────────────────────────────────────
  errCodeRequired:    { ar: "رمز الحساب مطلوب",                 en: "Account code is required"       },
  errCodeFormat:      { ar: "يجب أن يحتوي الرمز على 4 أرقام على الأقل", en: "Code must be at least 4 digits" },
  errNameRequired:    { ar: "اسم الحساب مطلوب",                 en: "Account name is required"       },
  errNameShort:       { ar: "الاسم قصير جداً",                  en: "Name is too short"              },
  errBalanceRequired: { ar: "الرصيد مطلوب",                     en: "Balance is required"            },
  errBalanceInvalid:  { ar: "يجب إدخال رقم صحيح موجب",          en: "Must be a valid positive number" },

  // ── Delete confirm ────────────────────────────────────────
  deleteTitle:        { ar: "تأكيد الحذف",                      en: "Confirm Delete"                 },
  deleteQuestion:     { ar: "هل أنت متأكد من حذف الحساب",       en: "Are you sure you want to delete" },
  deleteWarning:      { ar: "⚠️ هذا الحساب يحتوي على {n} حساب فرعي — سيتم حذفها جميعاً",
                        en: "⚠️ This account has {n} sub-accounts — they will all be deleted"        },
  deleteIrreversible: { ar: "لا يمكن التراجع عن هذه العملية",   en: "This action cannot be undone"   },
  deleteConfirmBtn:   { ar: "نعم، احذف",                         en: "Yes, Delete"                    },
  deleting:           { ar: "جارٍ الحذف…",                      en: "Deleting…"                      },

  // ── Loading ───────────────────────────────────────────────
  loading:            { ar: "جارٍ التحميل…",                    en: "Loading…"                       },
} as const;

export type COAStringKey = keyof typeof COA_STRINGS;

export function tCOA(lang: Lang, key: COAStringKey): string {
  return COA_STRINGS[key][lang];
}

// ── Interpolation helper ──────────────────────────────────────
export function tCOAInterp(
  lang: Lang,
  key: COAStringKey,
  vars: Record<string, string | number>,
): string {
  let result = COA_STRINGS[key][lang] as string;
  for (const [k, v] of Object.entries(vars)) {
    result = result.replace(`{${k}}`, String(v));
  }
  return result;
}

// ── AccountType enum → badge config ──────────────────────────
export const TYPE_BADGE_CLASS: Record<AccountType, string> = {
  main:   "bg-purple-500/20 text-purple-400 border-purple-500/30",
  sub:    "bg-blue-500/20   text-blue-400   border-blue-500/30",
  detail: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function resolveTypeBadge(
  lang: Lang,
  type: AccountType,
): { label: string; className: string } {
  const map: Record<AccountType, COAStringKey> = {
    main:   "typeMain",
    sub:    "typeSub",
    detail: "typeDetail",
  };
  return { label: tCOA(lang, map[type]), className: TYPE_BADGE_CLASS[type] };
}

// ── Number formatter ──────────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
}
