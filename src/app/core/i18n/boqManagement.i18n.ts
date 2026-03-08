// ============================================================
// boqManagement.i18n.ts
// Static UI chrome only.
// NOT here: section names, item descriptions — plain API strings.
// Month numbers (1–12) come from API; resolved to names here.
// ============================================================
import type { Lang }    from "../models/Settings.types";
import type { BOQUnit, ViewMode } from "../models/BOQManagement.types";

const BOQ_MGT_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:        { ar: "البنود (BOQ)",                      en: "BOQ Management"               },
  pageSubtitle:     { ar: "إدارة تفصيلية لبنود الأعمال",        en: "Detailed management of work items" },
  addBtn:           { ar: "إضافة بند",                         en: "Add Item"                     },

  // ── Summary cards ─────────────────────────────────────────
  totalEstimated:   { ar: "إجمالي التكلفة المقدرة",             en: "Total Estimated Cost"         },
  totalActual:      { ar: "إجمالي التكلفة الفعلية",             en: "Total Actual Cost"            },
  totalDeviation:   { ar: "الانحراف الكلي",                    en: "Total Deviation"              },
  currency:         { ar: "ر.س",                               en: "SAR"                          },

  // ── Filters ───────────────────────────────────────────────
  searchPlaceholder:{ ar: "بحث في البنود…",                    en: "Search items…"                },
  viewStandard:     { ar: "عرض قياسي",                         en: "Standard View"                },
  viewComparison:   { ar: "مقارنة المقدر vs الفعلي",            en: "Budget vs Actual"             },

  // ── Table columns ─────────────────────────────────────────
  colCode:          { ar: "الكود",                             en: "Code"                         },
  colDescription:   { ar: "الوصف",                             en: "Description"                  },
  colUnit:          { ar: "الوحدة",                            en: "Unit"                         },
  colQuantity:      { ar: "الكمية",                            en: "Qty"                          },
  colUnitPrice:     { ar: "سعر الوحدة",                        en: "Unit Price"                   },
  colEstimated:     { ar: "التكلفة المقدرة",                   en: "Estimated Cost"               },
  colActual:        { ar: "التكلفة الفعلية",                   en: "Actual Cost"                  },
  colVariance:      { ar: "الانحراف %",                        en: "Variance %"                   },
  colMonth:         { ar: "الشهر",                             en: "Month"                        },
  colActions:       { ar: "الإجراءات",                         en: "Actions"                      },
  tableTotal:       { ar: "الإجمالي",                          en: "Total"                        },

  // ── Modal ─────────────────────────────────────────────────
  modalAddTitle:    { ar: "إضافة بند جديد",                    en: "Add New Item"                 },
  modalAddSubtitle: { ar: "أدخل تفاصيل البند الجديد",          en: "Enter the details of the new item" },
  modalEditTitle:   { ar: "تعديل البند",                       en: "Edit Item"                    },
  modalEditSubtitle:{ ar: "تعديل تفاصيل البند",                en: "Update item details"          },

  // ── Form fields ───────────────────────────────────────────
  fieldCode:        { ar: "كود البند",                         en: "Item Code"                    },
  fieldCodePH:      { ar: "مثال: 01.001",                      en: "e.g. 01.001"                  },
  fieldSection:     { ar: "القسم",                             en: "Section"                      },
  fieldSectionPH:   { ar: "اختر القسم",                        en: "Select section"               },
  fieldDesc:        { ar: "الوصف",                             en: "Description"                  },
  fieldDescPH:      { ar: "وصف البند",                         en: "Item description"             },
  fieldUnit:        { ar: "وحدة القياس",                       en: "Unit"                         },
  fieldQty:         { ar: "الكمية",                            en: "Quantity"                     },
  fieldUnitPrice:   { ar: "سعر الوحدة",                        en: "Unit Price"                   },
  fieldActualCost:  { ar: "التكلفة الفعلية",                   en: "Actual Cost"                  },
  fieldMonth:       { ar: "الشهر",                             en: "Month"                        },

  // ── Validation errors ─────────────────────────────────────
  errCodeRequired:  { ar: "كود البند مطلوب",                   en: "Item code is required"        },
  errCodeFormat:    { ar: "الكود يجب أن يكون بصيغة XX.XXX",    en: "Code must follow XX.XXX format" },
  errSectionReq:    { ar: "القسم مطلوب",                       en: "Section is required"          },
  errDescRequired:  { ar: "الوصف مطلوب",                       en: "Description is required"     },
  errDescShort:     { ar: "الوصف قصير جداً",                   en: "Description is too short"    },
  errQtyRequired:   { ar: "الكمية مطلوبة",                     en: "Quantity is required"         },
  errQtyInvalid:    { ar: "الكمية يجب أن تكون أكبر من صفر",    en: "Quantity must be greater than 0" },
  errPriceRequired: { ar: "سعر الوحدة مطلوب",                  en: "Unit price is required"       },
  errPriceInvalid:  { ar: "السعر يجب أن يكون أكبر من صفر",     en: "Price must be greater than 0" },
  errActualReq:     { ar: "التكلفة الفعلية مطلوبة",             en: "Actual cost is required"      },
  errActualInvalid: { ar: "التكلفة يجب أن تكون صحيحة",         en: "Actual cost must be valid"    },
  errMonthRequired: { ar: "الشهر مطلوب",                       en: "Month is required"            },

  // ── Modal actions ─────────────────────────────────────────
  cancel:           { ar: "إلغاء",                             en: "Cancel"                       },
  save:             { ar: "حفظ",                               en: "Save"                         },
  addItemBtn:       { ar: "إضافة البند",                       en: "Add Item"                     },

  // ── Delete confirm ────────────────────────────────────────
  deleteTitle:      { ar: "حذف البند",                         en: "Delete Item"                  },
  deleteMessage:    { ar: "هل أنت متأكد من حذف هذا البند؟ لا يمكن التراجع عن هذا الإجراء.", en: "Are you sure you want to delete this item? This action cannot be undone." },
  deleteConfirm:    { ar: "حذف",                               en: "Delete"                       },
  deleting:         { ar: "جارٍ الحذف…",                       en: "Deleting…"                    },

  // ── Loading / error ───────────────────────────────────────
  loading:          { ar: "جارٍ التحميل…",                     en: "Loading…"                     },
  loadError:        { ar: "تعذّر تحميل البيانات",               en: "Failed to load data"          },
  noResults:        { ar: "لا توجد نتائج مطابقة",               en: "No matching results"          },
} as const;

export type BOQMgtStringKey = keyof typeof BOQ_MGT_STRINGS;

export function tBOQMgt(lang: Lang, key: BOQMgtStringKey): string {
  return BOQ_MGT_STRINGS[key][lang];
}

// ── Month number (1–12) → display name ───────────────────────
// Months come as numbers from API — never as strings
const MONTH_NAMES: Record<Lang, string[]> = {
  ar: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
};

export function resolveMonth(lang: Lang, month: number): string {
  return MONTH_NAMES[lang][month - 1] ?? String(month);
}

// ── All 12 months as options for <select> ─────────────────────
export function getMonthOptions(lang: Lang): { value: number; label: string }[] {
  return MONTH_NAMES[lang].map((label, i) => ({ value: i + 1, label }));
}

// ── Unit display labels ───────────────────────────────────────
const UNIT_LABELS: Record<BOQUnit, Record<Lang, string>> = {
  m3:   { ar: "م³",   en: "m³"   },
  m2:   { ar: "م²",   en: "m²"   },
  ton:  { ar: "طن",   en: "Ton"  },
  m:    { ar: "م",    en: "m"    },
  unit: { ar: "وحدة", en: "Unit" },
  ls:   { ar: "مقطوع",en: "L.S." },
};

export function resolveUnit(lang: Lang, unit: BOQUnit): string {
  return UNIT_LABELS[unit][lang];
}

export function getUnitOptions(lang: Lang): { value: BOQUnit; label: string }[] {
  return (Object.keys(UNIT_LABELS) as BOQUnit[]).map((u) => ({
    value: u,
    label: UNIT_LABELS[u][lang],
  }));
}

// ── Number / currency formatters ──────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
}

export function formatCurrency(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
    style: "currency", currency: "SAR", minimumFractionDigits: 0,
  }).format(n);
}

// ── Variance colour class ─────────────────────────────────────
export function varianceClass(variance: number): string {
  return variance > 0 ? "text-red-400" : "text-emerald-400";
}

export function varianceBgClass(variance: number): string {
  return variance > 0
    ? "bg-red-500/10 text-red-400 border border-red-500/20"
    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
}
