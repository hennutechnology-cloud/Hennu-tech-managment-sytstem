// ============================================================
// inventory.i18n.ts
// Static UI strings for the Inventory page and all components.
// ============================================================
import type { Lang }         from "../models/Settings.types";
import type { StockStatus, MovementType } from "../models/inventory.types";

const INVENTORY_STRINGS = {
  // ── Page ─────────────────────────────────────────────────
  pageTitle:          { ar: "إدارة المخزون",                         en: "Inventory Management"              },
  pageSubtitle:       { ar: "تتبع المواد والمعدات والمستلزمات",         en: "Track materials, equipment & supplies" },
  addItem:            { ar: "إضافة صنف",                             en: "Add Item"                          },

  // ── Tabs ─────────────────────────────────────────────────
  tabItems:           { ar: "الأصناف",                               en: "Items"                             },
  tabMovements:       { ar: "حركة المخزون",                          en: "Movements"                         },

  // ── Summary cards ─────────────────────────────────────────
  totalItems:         { ar: "إجمالي الأصناف",                        en: "Total Items"                       },
  totalValue:         { ar: "إجمالي القيمة",                         en: "Total Value"                       },
  lowStock:           { ar: "مخزون منخفض",                          en: "Low Stock"                         },
  outOfStock:         { ar: "نفاد المخزون",                          en: "Out of Stock"                      },
  totalCategories:    { ar: "الفئات",                                en: "Categories"                        },
  currency:           { ar: "ر.س",                                  en: "SAR"                               },

  // ── Search & filter ───────────────────────────────────────
  searchPlaceholder:  { ar: "بحث باسم الصنف أو الكود…",              en: "Search by name or SKU…"            },
  filterAll:          { ar: "جميع الحالات",                          en: "All Statuses"                      },
  filterInStock:      { ar: "متوفر",                                 en: "In Stock"                          },
  filterLow:          { ar: "منخفض",                                 en: "Low Stock"                         },
  filterOut:          { ar: "نافد",                                  en: "Out of Stock"                      },
  allCategories:      { ar: "جميع الفئات",                           en: "All Categories"                    },

  // ── Items table ───────────────────────────────────────────
  tableItemsTitle:    { ar: "قائمة الأصناف",                         en: "Items List"                        },
  colName:            { ar: "الصنف",                                 en: "Item"                              },
  colCategory:        { ar: "الفئة",                                 en: "Category"                          },
  colQuantity:        { ar: "الكمية",                                en: "Qty"                               },
  colUnit:            { ar: "الوحدة",                                en: "Unit"                              },
  colUnitCost:        { ar: "سعر الوحدة",                            en: "Unit Cost"                         },
  colTotalValue:      { ar: "القيمة الإجمالية",                       en: "Total Value"                       },
  colLocation:        { ar: "الموقع",                                en: "Location"                          },
  colStatus:          { ar: "الحالة",                                en: "Status"                            },
  colActions:         { ar: "الإجراءات",                             en: "Actions"                           },
  colSupplier:        { ar: "المورد",                                en: "Supplier"                          },
  colLastUpdated:     { ar: "آخر تحديث",                             en: "Last Updated"                      },
  minQtyLabel:        { ar: "الحد الأدنى:",                          en: "Min:"                              },

  // ── Status labels ─────────────────────────────────────────
  statusInStock:      { ar: "متوفر",                                 en: "In Stock"                          },
  statusLowStock:     { ar: "مخزون منخفض",                          en: "Low Stock"                         },
  statusOutOfStock:   { ar: "نافد",                                  en: "Out of Stock"                      },

  // ── Movements table ───────────────────────────────────────
  tableMovementsTitle:{ ar: "حركة المخزون",                          en: "Stock Movements"                   },
  colItem:            { ar: "الصنف",                                 en: "Item"                              },
  colType:            { ar: "النوع",                                 en: "Type"                              },
  colQty:             { ar: "الكمية",                                en: "Quantity"                          },
  colDate:            { ar: "التاريخ",                               en: "Date"                              },
  colReference:       { ar: "المرجع",                               en: "Reference"                         },
  colPerformedBy:     { ar: "بواسطة",                               en: "By"                                },
  moveIn:             { ar: "إضافة",                                 en: "Stock In"                          },
  moveOut:            { ar: "صرف",                                   en: "Stock Out"                         },
  moveAdj:            { ar: "تسوية",                                 en: "Adjustment"                        },

  // ── Action buttons ────────────────────────────────────────
  btnEdit:            { ar: "تعديل",                                 en: "Edit"                              },
  btnDelete:          { ar: "حذف",                                   en: "Delete"                            },
  btnMove:            { ar: "تحريك مخزون",                           en: "Stock Move"                        },
  btnSave:            { ar: "حفظ",                                   en: "Save"                              },
  btnCancel:          { ar: "إلغاء",                                 en: "Cancel"                            },

  // ── Item modal ────────────────────────────────────────────
  modalAddTitle:      { ar: "إضافة صنف جديد",                        en: "Add New Item"                      },
  modalEditTitle:     { ar: "تعديل الصنف",                           en: "Edit Item"                         },
  fieldName:          { ar: "اسم الصنف",                             en: "Item Name"                         },
  fieldSku:           { ar: "كود الصنف (SKU)",                       en: "SKU Code"                          },
  fieldCategory:      { ar: "الفئة",                                 en: "Category"                          },
  fieldUnit:          { ar: "وحدة القياس",                           en: "Unit"                              },
  fieldQuantity:      { ar: "الكمية",                                en: "Quantity"                          },
  fieldMinQty:        { ar: "الحد الأدنى للمخزون",                    en: "Min. Stock Qty"                    },
  fieldUnitCost:      { ar: "سعر الوحدة (ر.س)",                      en: "Unit Cost (SAR)"                   },
  fieldLocation:      { ar: "الموقع / المستودع",                      en: "Location / Warehouse"              },
  fieldSupplier:      { ar: "المورد",                                en: "Supplier"                          },
  fieldLastUpdated:   { ar: "تاريخ آخر تحديث",                       en: "Last Updated Date"                 },
  fieldNotes:         { ar: "ملاحظات",                               en: "Notes"                             },

  // ── Movement modal ────────────────────────────────────────
  modalMoveTitle:     { ar: "تحريك مخزون",                           en: "Stock Movement"                    },
  moveType:           { ar: "نوع الحركة",                            en: "Movement Type"                     },
  moveQty:            { ar: "الكمية",                                en: "Quantity"                          },
  moveRef:            { ar: "رقم المرجع (طلب / أمر عمل)",             en: "Reference (PO / WO)"               },
  moveNotes:          { ar: "ملاحظات",                               en: "Notes"                             },
  currentStock:       { ar: "المخزون الحالي:",                        en: "Current stock:"                    },

  // ── Delete confirm ────────────────────────────────────────
  deleteTitle:        { ar: "تأكيد الحذف",                           en: "Confirm Delete"                    },
  deleteBody:         { ar: "هل أنت متأكد من حذف الصنف",             en: "Are you sure you want to delete"   },
  deleteBodySuffix:   { ar: "؟ لا يمكن التراجع عن هذا الإجراء.",      en: "? This action cannot be undone."   },
  btnConfirmDelete:   { ar: "نعم، احذف",                             en: "Yes, Delete"                       },

  // ── Loading / error ───────────────────────────────────────
  loading:            { ar: "جارٍ التحميل…",                         en: "Loading…"                          },
  loadError:          { ar: "تعذّر تحميل البيانات",                   en: "Failed to load data"               },
  noItems:            { ar: "لا توجد أصناف تطابق البحث",              en: "No items match your search"        },
} as const;

export type InventoryStringKey = keyof typeof INVENTORY_STRINGS;

export function tInv(lang: Lang, key: InventoryStringKey): string {
  return INVENTORY_STRINGS[key][lang];
}

// ── Status → colour classes ────────────────────────────────────
export const STOCK_STATUS_STYLES: Record<StockStatus, string> = {
  in_stock:     "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  low_stock:    "bg-yellow-500/10  text-yellow-400  border border-yellow-500/30",
  out_of_stock: "bg-red-500/10     text-red-400     border border-red-500/30",
};

export function stockStatusLabel(lang: Lang, status: StockStatus): string {
  const map: Record<StockStatus, InventoryStringKey> = {
    in_stock:     "statusInStock",
    low_stock:    "statusLowStock",
    out_of_stock: "statusOutOfStock",
  };
  return tInv(lang, map[status]);
}

// ── Movement type → colour / label ────────────────────────────
export const MOVEMENT_STYLES: Record<MovementType, string> = {
  in:         "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  out:        "bg-red-500/10     text-red-400     border border-red-500/30",
  adjustment: "bg-blue-500/10   text-blue-400    border border-blue-500/30",
};

export function movementLabel(lang: Lang, type: MovementType): string {
  const map: Record<MovementType, InventoryStringKey> = {
    in:         "moveIn",
    out:        "moveOut",
    adjustment: "moveAdj",
  };
  return tInv(lang, map[type]);
}

// ── Derive status from quantity ────────────────────────────────
export function deriveStatus(qty: number, minQty: number): StockStatus {
  if (qty <= 0)       return "out_of_stock";
  if (qty <= minQty)  return "low_stock";
  return "in_stock";
}
