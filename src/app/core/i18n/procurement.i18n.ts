// ============================================================
// procurement.i18n.ts
// Static UI strings for the Procurement page and components.
// Dynamic API strings (supplier names, categories, descriptions)
// are NOT here — they come from the service as plain strings.
// ============================================================
import type { Lang } from "../models/Settings.types";

const PROCUREMENT_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:             { ar: "المشتريات الذكية",                           en: "Smart Procurement"                     },
  pageSubtitle:          { ar: "إدارة الموردين وتحسين قرارات الشراء",         en: "Manage suppliers and optimise purchasing decisions" },
  addSupplier:           { ar: "إضافة مورد",                                 en: "Add Supplier"                          },

  // ── AI Banner ────────────────────────────────────────────
  aiBannerTitle:         { ar: "توصية AI للشراء",                            en: "AI Procurement Recommendation"         },
  aiBannerBody:          { ar: "أفضل وقت للشراء هو خلال الأسبوعين القادمين. الأسعار المتوقعة منخفضة بنسبة 4.2% عن المعدل الشهري.",
                           en: "Best time to buy is within the next two weeks. Expected prices are 4.2% below the monthly average." },
  potentialSaving:       { ar: "توفير محتمل: 8.5%",                          en: "Potential saving: 8.5%"                },
  createOrder:           { ar: "إنشاء طلب شراء",                             en: "Create Purchase Order"                 },

  // ── Summary cards ─────────────────────────────────────────
  totalSuppliers:        { ar: "إجمالي الموردين",                            en: "Total Suppliers"                       },
  avgRating:             { ar: "متوسط التقييم",                              en: "Average Rating"                        },
  avgDelivery:           { ar: "متوسط وقت التسليم",                          en: "Avg. Delivery Time"                    },
  days:                  { ar: "أيام",                                       en: "days"                                  },
  annualSaving:          { ar: "التوفير السنوي",                             en: "Annual Saving"                         },

  // ── Suppliers table ───────────────────────────────────────
  tableTitle:            { ar: "الموردون",                                   en: "Suppliers"                             },
  colName:               { ar: "اسم المورد",                                 en: "Supplier"                              },
  colAvgPrice:           { ar: "متوسط السعر",                               en: "Avg. Price"                            },
  colDelivery:           { ar: "وقت التسليم",                               en: "Delivery"                              },
  colRating:             { ar: "التقييم",                                   en: "Rating"                                },
  colOnTime:             { ar: "التسليم في الوقت",                           en: "On-Time %"                             },
  colAiScore:            { ar: "درجة AI",                                   en: "AI Score"                              },
  colCategory:           { ar: "الفئة",                                     en: "Category"                              },
  colActions:            { ar: "الإجراءات",                                 en: "Actions"                               },
  orders:                { ar: "طلب",                                       en: "orders"                                },
  currency:              { ar: "ر.س",                                       en: "SAR"                                   },

  // ── Price trend chart ─────────────────────────────────────
  priceTrendTitle:       { ar: "اتجاه الأسعار - المواد الأساسية",             en: "Price Trend – Core Materials"          },
  priceLabel:            { ar: "متوسط السعر (ر.س)",                          en: "Avg. Price (SAR)"                      },

  // ── Recommendation cards ──────────────────────────────────
  bestSupplierTitle:     { ar: "أفضل مورد للمواد",                           en: "Best Materials Supplier"               },
  savingOppsTitle:       { ar: "فرص التوفير",                               en: "Saving Opportunities"                  },

  // ── Supplier modal — Add ──────────────────────────────────
  modalAddTitle:         { ar: "إضافة مورد جديد",                            en: "Add New Supplier"                      },
  modalEditTitle:        { ar: "تعديل بيانات المورد",                        en: "Edit Supplier"                         },
  fieldName:             { ar: "اسم المورد",                                 en: "Supplier Name"                         },
  fieldCategory:         { ar: "الفئة",                                     en: "Category"                              },
  fieldAvgPrice:         { ar: "متوسط السعر (ر.س)",                          en: "Avg. Price (SAR)"                      },
  fieldDeliveryTime:     { ar: "وقت التسليم (أيام)",                         en: "Delivery Time (days)"                  },
  fieldRating:           { ar: "التقييم (0-5)",                              en: "Rating (0–5)"                          },
  fieldOnTime:           { ar: "التسليم في الوقت (%)",                       en: "On-Time Delivery (%)"                  },
  fieldAiScore:          { ar: "درجة AI (0-100)",                            en: "AI Score (0–100)"                      },
  fieldTotalOrders:      { ar: "إجمالي الطلبات",                             en: "Total Orders"                          },
  btnSave:               { ar: "حفظ",                                       en: "Save"                                  },
  btnCancel:             { ar: "إلغاء",                                     en: "Cancel"                                },
  btnEdit:               { ar: "تعديل",                                     en: "Edit"                                  },
  btnDelete:             { ar: "حذف",                                       en: "Delete"                                },

  // ── Delete confirmation modal ─────────────────────────────
  deleteTitle:           { ar: "تأكيد الحذف",                               en: "Confirm Delete"                        },
  deleteBody:            { ar: "هل أنت متأكد من حذف المورد",                 en: "Are you sure you want to delete"       },
  deleteBodySuffix:      { ar: "؟ لا يمكن التراجع عن هذا الإجراء.",          en: "? This action cannot be undone."       },
  btnConfirmDelete:      { ar: "نعم، احذف",                                 en: "Yes, Delete"                           },

  // ── Loading / error ───────────────────────────────────────
  loading:               { ar: "جارٍ التحميل…",                             en: "Loading…"                              },
  loadError:             { ar: "تعذّر تحميل البيانات",                       en: "Failed to load data"                   },
} as const;

export type ProcurementStringKey = keyof typeof PROCUREMENT_STRINGS;

export function tPro(lang: Lang, key: ProcurementStringKey): string {
  return PROCUREMENT_STRINGS[key][lang];
}

// ── AI score tier → colour classes ───────────────────────────
export const AI_SCORE_COLORS = {
  high:   "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30",
  medium: "bg-blue-500/10    text-blue-500    border border-blue-500/30",
  low:    "bg-orange-500/10  text-orange-500  border border-orange-500/30",
} as const;

export function aiScoreTier(score: number): keyof typeof AI_SCORE_COLORS {
  if (score >= 90) return "high";
  if (score >= 80) return "medium";
  return "low";
}
