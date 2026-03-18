// ============================================================
// category.i18n.ts
// ============================================================
import type { Lang } from "../models/Settings.types";

const STRINGS = {
  // ── Page ──────────────────────────────────────────────────
  title:           { ar: "إدارة التصنيفات",              en: "Category Management"         },
  subtitle:        { ar: "إدارة تصنيفات خدمات النظام",   en: "Manage system service categories" },
  totalLabel:      { ar: "إجمالي التصنيفات",             en: "Total categories"            },

  // ── Actions ───────────────────────────────────────────────
  addCategory:     { ar: "تصنيف جديد",                   en: "New Category"                },
  edit:            { ar: "تعديل",                        en: "Edit"                        },
  delete:          { ar: "حذف",                          en: "Delete"                      },
  save:            { ar: "حفظ",                          en: "Save"                        },
  cancel:          { ar: "إلغاء",                        en: "Cancel"                      },
  saving:          { ar: "جارٍ الحفظ…",                  en: "Saving…"                     },

  // ── Search ────────────────────────────────────────────────
  searchPH:        { ar: "بحث في التصنيفات…",             en: "Search categories…"          },
  noResults:       { ar: "لا توجد تصنيفات مطابقة",        en: "No matching categories"      },
  noCategories:    { ar: "لا توجد تصنيفات بعد",           en: "No categories yet"           },

  // ── Card ──────────────────────────────────────────────────
  usageCount:      { ar: "عنصر مرتبط",                   en: "linked items"                },

  // ── Add / Edit modal ──────────────────────────────────────
  modalAddTitle:   { ar: "إضافة تصنيف جديد",             en: "Add New Category"            },
  modalEditTitle:  { ar: "تعديل التصنيف",                 en: "Edit Category"               },

  // ── Form fields ───────────────────────────────────────────
  fieldNameAr:     { ar: "الاسم بالعربية",                en: "Name in Arabic"              },
  fieldNameArPH:   { ar: "مثال: الحديد والصلب",           en: "e.g. الحديد والصلب"          },
  fieldNameEn:     { ar: "الاسم بالإنجليزية",             en: "Name in English"             },
  fieldNameEnPH:   { ar: "e.g. Iron & Steel",             en: "e.g. Iron & Steel"           },
  fieldIcon:       { ar: "الأيقونة",                      en: "Icon"                        },
  fieldColor:      { ar: "اللون",                         en: "Color"                       },

  // ── Validation ────────────────────────────────────────────
  errNameArReq:    { ar: "الاسم العربي مطلوب",            en: "Arabic name is required"     },
  errNameEnReq:    { ar: "الاسم الإنجليزي مطلوب",         en: "English name is required"    },
  errIconReq:      { ar: "الأيقونة مطلوبة",               en: "Icon is required"            },

  // ── Delete ────────────────────────────────────────────────
  deleteTitle:     { ar: "حذف التصنيف",                   en: "Delete Category"             },
  deleteMsg:       { ar: "هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن التراجع عن هذا الإجراء.",
                     en: "Are you sure you want to delete this category? This action cannot be undone." },
  deleteHasItems:  { ar: "تحذير: هذا التصنيف مرتبط بـ",   en: "Warning: this category has" },
  deleteHasItems2: { ar: "عنصر مرتبط.",                   en: "linked items."               },
  confirmDelete:   { ar: "تأكيد الحذف",                   en: "Confirm Delete"              },
  deleting:        { ar: "جارٍ الحذف…",                   en: "Deleting…"                   },

  // ── Loading ───────────────────────────────────────────────
  loading:         { ar: "جارٍ التحميل…",                 en: "Loading…"                    },
} as const;

export type CatKey = keyof typeof STRINGS;

export function tCat(lang: Lang, key: CatKey): string {
  return STRINGS[key][lang];
}

// ── Color palette options ─────────────────────────────────────
export const COLOR_OPTIONS = [
  { value: "orange",  bg: "bg-orange-500/15",  border: "border-orange-500/40",  text: "text-orange-400",  dot: "bg-orange-500"  },
  { value: "blue",    bg: "bg-blue-500/15",    border: "border-blue-500/40",    text: "text-blue-400",    dot: "bg-blue-500"    },
  { value: "emerald", bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-400", dot: "bg-emerald-500" },
  { value: "violet",  bg: "bg-violet-500/15",  border: "border-violet-500/40",  text: "text-violet-400",  dot: "bg-violet-500"  },
  { value: "rose",    bg: "bg-rose-500/15",    border: "border-rose-500/40",    text: "text-rose-400",    dot: "bg-rose-500"    },
  { value: "amber",   bg: "bg-amber-500/15",   border: "border-amber-500/40",   text: "text-amber-400",   dot: "bg-amber-500"   },
  { value: "cyan",    bg: "bg-cyan-500/15",    border: "border-cyan-500/40",    text: "text-cyan-400",    dot: "bg-cyan-500"    },
  { value: "pink",    bg: "bg-pink-500/15",    border: "border-pink-500/40",    text: "text-pink-400",    dot: "bg-pink-500"    },
] as const;

export type ColorOption = (typeof COLOR_OPTIONS)[number];

export function getColorOption(value: string): ColorOption {
  return COLOR_OPTIONS.find((c) => c.value === value) ?? COLOR_OPTIONS[0];
}

// ── Preset icons ──────────────────────────────────────────────
export const ICON_OPTIONS = [
  "🔩", "🏗️", "🧱", "🪵", "🔧", "⚡", "🪨", "🎨", "🏠", "🔌",
  "🪜", "🛡️", "🌊", "🔥", "❄️", "🏭", "🔨", "⛏️", "🧰", "📐",
  "🪝", "🔑", "🚿", "🛁", "🪟", "🚪", "🌿", "🪴", "💡", "🔦",
];
