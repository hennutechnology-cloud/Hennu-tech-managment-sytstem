// ============================================================
// depreciation.i18n.ts
// Only static UI chrome — titles, labels, button text,
// table headers, validation messages, and enum resolvers.
//
// NOT here: asset.name, asset.purchaseDate — plain API strings.
// DepreciationMethod IS translated here because it's a fixed
// enum the frontend owns (unlike account names which are user data).
// ============================================================
import type { Lang }              from "../models/Settings.types";
import type { DepreciationMethod } from "../models/Depreciation.types";

const DEP_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:          { ar: "نظام الإهلاك",                        en: "Depreciation System"              },
  pageSubtitle:       { ar: "إدارة إهلاك الأصول الثابتة",           en: "Fixed Asset Depreciation Management" },
  addAsset:           { ar: "إضافة أصل جديد",                      en: "Add New Asset"                    },

  // ── Summary cards ─────────────────────────────────────────
  totalAssetValue:    { ar: "إجمالي قيمة الأصول",                  en: "Total Asset Value"                },
  totalAccumulated:   { ar: "الإهلاك المتراكم",                     en: "Accumulated Depreciation"         },
  totalBookValue:     { ar: "القيمة الدفترية",                      en: "Book Value"                       },
  annualDepreciation: { ar: "الإهلاك السنوي",                       en: "Annual Depreciation"              },
  currency:           { ar: "ر.س",                                  en: "SAR"                              },

  // ── Chart ─────────────────────────────────────────────────
  chartTitle:         { ar: "اتجاه الإهلاك السنوي",                 en: "Annual Depreciation Trend"        },
  depreciationLabel:  { ar: "الإهلاك",                              en: "Depreciation"                     },

  // ── Table ─────────────────────────────────────────────────
  tableTitle:         { ar: "سجل الأصول",                           en: "Asset Register"                   },
  colAssetName:       { ar: "اسم الأصل",                            en: "Asset Name"                       },
  colCost:            { ar: "التكلفة",                              en: "Cost"                             },
  colUsefulLife:      { ar: "العمر الإنتاجي",                       en: "Useful Life"                      },
  colMethod:          { ar: "طريقة الإهلاك",                        en: "Method"                           },
  colAnnualDep:       { ar: "الإهلاك السنوي",                       en: "Annual Dep."                      },
  colAccumulated:     { ar: "الإهلاك المتراكم",                     en: "Accumulated"                      },
  colBookValue:       { ar: "القيمة الدفترية",                      en: "Book Value"                       },
  purchaseDateLabel:  { ar: "تاريخ الشراء",                         en: "Purchase Date"                    },
  yearUnit:           { ar: "سنة",                                  en: "yr"                               },

  // ── Row expanded detail ───────────────────────────────────
  detailSalvageValue: { ar: "القيمة المتبقية",                      en: "Salvage Value"                    },
  detailDepreciable:  { ar: "قابل للإهلاك",                         en: "Depreciable Amount"               },
  detailAccumPct:     { ar: "نسبة الإهلاك المتراكم",                 en: "Accumulated Dep. %"               },
  detailYearsLeft:    { ar: "السنوات المتبقية",                      en: "Years Remaining"                  },
  detailConsumPct:    { ar: "نسبة الاستهلاك",                       en: "Consumption Rate"                 },

  // ── Depreciation method enum (frontend-owned fixed values) ─
  methodStraightLine: { ar: "قسط ثابت",   en: "Straight-Line"    },
  methodDeclining:    { ar: "قسط متناقص", en: "Declining Balance" },

  // ── Modal — create ────────────────────────────────────────
  modalAddTitle:      { ar: "إضافة أصل جديد",            en: "Add New Asset"              },
  modalAddSubtitle:   { ar: "أدخل بيانات الأصل الجديد",  en: "Enter the new asset details" },

  // ── Modal — edit (subtitle uses interpolation {name}) ────
  modalEditTitle:     { ar: "تعديل الأصل",                en: "Edit Asset"                 },
  modalEditSubtitle:  { ar: "تعديل بيانات {name}",        en: "Editing {name}"             },

  // ── Modal form field labels ───────────────────────────────
  fieldName:          { ar: "اسم الأصل",                  en: "Asset Name"                 },
  fieldNamePlaceholder:{ ar: "مثال: مبنى المكتب",          en: "e.g. Office Building"       },
  fieldCost:          { ar: "التكلفة (ر.س)",               en: "Cost (SAR)"                 },
  fieldSalvageValue:  { ar: "القيمة المتبقية (ر.س)",       en: "Salvage Value (SAR)"        },
  fieldUsefulLife:    { ar: "العمر الإنتاجي (سنة)",        en: "Useful Life (years)"        },
  fieldMethod:        { ar: "طريقة الإهلاك",               en: "Depreciation Method"        },
  fieldPurchaseDate:  { ar: "تاريخ الشراء",                en: "Purchase Date"              },

  // ── Modal buttons ─────────────────────────────────────────
  cancel:             { ar: "إلغاء",           en: "Cancel"       },
  save:               { ar: "حفظ التعديلات",   en: "Save Changes" },
  addBtn:             { ar: "إضافة الأصل",     en: "Add Asset"    },
  delete:             { ar: "حذف",             en: "Delete"       },
  confirmDelete:      { ar: "تأكيد الحذف",     en: "Confirm Delete" },
  deleting:           { ar: "جارٍ الحذف…",     en: "Deleting…"    },

  // ── Delete confirmation message ───────────────────────────
  deleteConfirmMsg:   {
    ar: "هل أنت متأكد من حذف هذا الأصل؟ اضغط حذف مرة أخرى للتأكيد.",
    en: "Are you sure you want to delete this asset? Press delete again to confirm.",
  },

  // ── Validation errors ─────────────────────────────────────
  errNameRequired:    { ar: "اسم الأصل مطلوب",                        en: "Asset name is required"              },
  errNameShort:       { ar: "الاسم قصير جداً",                        en: "Name is too short"                   },
  errCostRequired:    { ar: "التكلفة مطلوبة",                          en: "Cost is required"                    },
  errCostInvalid:     { ar: "يجب إدخال رقم موجب",                     en: "Must be a positive number"           },
  errSalvageRequired: { ar: "القيمة المتبقية مطلوبة",                  en: "Salvage value is required"           },
  errSalvageInvalid:  { ar: "يجب إدخال رقم صحيح",                     en: "Must be a valid number"              },
  errSalvageHigh:     { ar: "يجب أن تكون أقل من التكلفة",              en: "Must be less than cost"              },
  errLifeRequired:    { ar: "العمر الإنتاجي مطلوب",                    en: "Useful life is required"             },
  errLifeInvalid:     { ar: "يجب أن يكون سنة واحدة على الأقل",         en: "Must be at least 1 year"             },
  errDateRequired:    { ar: "تاريخ الشراء مطلوب",                      en: "Purchase date is required"           },

  // ── Loading / error ───────────────────────────────────────
  loading:            { ar: "جارٍ التحميل…",       en: "Loading…"             },
  loadError:          { ar: "تعذّر تحميل البيانات", en: "Failed to load data"  },
} as const;

export type DepStringKey = keyof typeof DEP_STRINGS;

// Normalize any locale string ("ar", "ar-SA", undefined, …) to "ar" | "en"
function normLang(lang: unknown): "ar" | "en" {
  if (typeof lang === "string" && lang.startsWith("en")) return "en";
  return "ar";
}

export function tDep(lang: Lang, key: DepStringKey): string {
  return DEP_STRINGS[key][normLang(lang)];
}

// ── Interpolation helper ──────────────────────────────────────
export function tDepInterp(
  lang: Lang,
  key: DepStringKey,
  vars: Record<string, string | number>,
): string {
  let result = DEP_STRINGS[key][normLang(lang)] as string;
  for (const [k, v] of Object.entries(vars))
    result = result.replace(`{${k}}`, String(v));
  return result;
}

// ── DepreciationMethod enum → display string ──────────────────
// The method value stored in the asset is always the Arabic key
// ("قسط ثابت" | "قسط متناقص"). resolveMethod() maps it to the
// correct display string in any language.
export function resolveMethod(lang: Lang, method: DepreciationMethod): string {
  return method === "straight-line"
    ? tDep(lang, "methodStraightLine")
    : tDep(lang, "methodDeclining");
}

// ── Number formatter ──────────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(normLang(lang) === "ar" ? "ar-SA" : "en-US");
}
