// ============================================================
// invoice.i18n.ts  (updated)
// ============================================================
import type { Lang } from "../models/Settings.types";

const STRINGS = {
  // ── Page ──────────────────────────────────────────────────
  title:               { ar: "الفواتير",                           en: "Invoices"                     },
  subtitle:            { ar: "إدارة الفواتير والمستخلصات",          en: "Manage invoices & progress"   },
  newInvoice:          { ar: "فاتورة جديدة",                       en: "New Invoice"                  },

  // ── Summary cards ─────────────────────────────────────────
  totalInvoices:       { ar: "إجمالي الفواتير",                    en: "Total Invoices"               },
  totalRevenues:       { ar: "إجمالي الإيرادات",                   en: "Total Revenues"               },
  totalExpenses:       { ar: "إجمالي المصروفات",                   en: "Total Expenses"               },
  fullyPaid:           { ar: "مسددة بالكامل",                      en: "Fully Paid"                   },
  partiallyPaid:       { ar: "مسددة جزئياً",                       en: "Partially Paid"               },
  pendingInvoices:     { ar: "معلقة",                              en: "Pending"                      },
  overdueInvoices:     { ar: "متأخرة",                             en: "Overdue"                      },
  totalReceivable:     { ar: "إجمالي المستحقات",                   en: "Total Receivable"             },
  totalPayable:        { ar: "إجمالي المدفوعات المستحقة",           en: "Total Payable"                },
  totalContracts:      { ar: "العقود النشطة",                      en: "Active Contracts"             },

  // ── Invoice kind ──────────────────────────────────────────
  kindNormal:          { ar: "فاتورة عادية",                       en: "Normal Invoice"               },
  kindProgress:        { ar: "مستخلص",                             en: "Progress Invoice"             },
  kindLabel:           { ar: "نوع الفاتورة",                       en: "Invoice Type"                 },
  kindAll:             { ar: "الكل",                               en: "All"                          },

  // ── Contract ──────────────────────────────────────────────
  contractLabel:       { ar: "العقد",                              en: "Contract"                     },
  contractPH:          { ar: "اختر العقد",                         en: "Select contract"              },
  contractName:        { ar: "اسم العقد",                          en: "Contract Name"                },
  contractNamePH:      { ar: "وصف مختصر للعقد",                    en: "Short contract description"   },
  contractTotal:       { ar: "قيمة العقد الإجمالية",               en: "Total Contract Value"         },
  contractProgress:    { ar: "إجمالي المستخلصات",                  en: "Total Progress"               },
  contractRemaining:   { ar: "الأعمال المتبقية",                   en: "Remaining Work"               },
  contractPct:         { ar: "نسبة الإنجاز",                       en: "Completion"                   },
  newContract:         { ar: "عقد جديد",                           en: "New Contract"                 },
  editContract:        { ar: "تعديل العقد",                        en: "Edit Contract"                },
  deleteContract:      { ar: "حذف العقد",                          en: "Delete Contract"              },
  deleteContractMsg:   { ar: "هل أنت متأكد من حذف هذا العقد؟ سيتم إلغاء ربط المستخلصات المرتبطة به.",
                         en: "Are you sure you want to delete this contract? Linked progress invoices will be unlinked." },
  contractsPanel:      { ar: "العقود والمستخلصات",                  en: "Contracts & Progress"         },
  addProgressInvoice:  { ar: "إضافة مستخلص",                       en: "Add Progress Invoice"         },
  noContracts:         { ar: "لا توجد عقود",                        en: "No contracts"                 },
  contractInvoices:    { ar: "المستخلصات",                          en: "Progress Invoices"            },
  contractExceedsErr:  { ar: "المبلغ يتجاوز المتاح في العقد",       en: "Amount exceeds contract budget"},
  errContractReq:      { ar: "يرجى اختيار العقد",                   en: "Please select a contract"    },

  // ── Account type ──────────────────────────────────────────
  accountRevenue:      { ar: "إيرادات (واردة)",                    en: "Revenue (Incoming)"           },
  accountExpense:      { ar: "مصروفات (صادرة)",                    en: "Expense (Outgoing)"           },
  accountTypeLabel:    { ar: "نوع الحساب",                         en: "Account Type"                 },

  // ── Party type ────────────────────────────────────────────
  partySubcontractor:  { ar: "مقاول باطن",                         en: "Subcontractor"                },
  partyClient:         { ar: "عميل",                               en: "Client"                       },
  partyTypeLabel:      { ar: "نوع الطرف",                          en: "Party Type"                   },
  partyLabel:          { ar: "الطرف المعني",                        en: "Select Party"                 },
  partyEntityLabel:    { ar: "الجهة / الشركة",                     en: "Entity / Organization"        },
  partyEntityPH:       { ar: "اسم الشركة أو الجهة",                en: "Company or organization name" },
  projectLabel:        { ar: "المشروع",                            en: "Project"                      },
  projectPH:           { ar: "اختر المشروع",                       en: "Select project"               },
  partyPH:             { ar: "اختر الطرف",                         en: "Select party"                 },

  // ── Invoice fields ────────────────────────────────────────
  invoiceNumber:       { ar: "رقم الفاتورة",                       en: "Invoice #"                    },
  invoiceDate:         { ar: "تاريخ الفاتورة",                     en: "Invoice Date"                 },
  dueDate:             { ar: "تاريخ الاستحقاق",                    en: "Due Date"                     },
  totalAmount:         { ar: "المبلغ الإجمالي",                    en: "Total Amount"                 },
  paidAmount:          { ar: "المبلغ المدفوع",                     en: "Paid Amount"                  },
  remainingAmount:     { ar: "المبلغ المتبقي",                     en: "Remaining Amount"             },
  description:         { ar: "الوصف / الملاحظات",                  en: "Description / Notes"          },
  descriptionPH:       { ar: "وصف الفاتورة أو ملاحظات إضافية…",    en: "Invoice description or notes…"},

  // ── Status ────────────────────────────────────────────────
  statusAll:           { ar: "جميع الحالات",                       en: "All Statuses"                 },
  statusPaid:          { ar: "مسددة",                              en: "Paid"                         },
  statusPartial:       { ar: "جزئية",                              en: "Partial"                      },
  statusPending:       { ar: "معلقة",                              en: "Pending"                      },
  statusOverdue:       { ar: "متأخرة",                             en: "Overdue"                      },

  // ── Filters ───────────────────────────────────────────────
  searchPH:            { ar: "بحث في الفواتير…",                    en: "Search invoices…"             },
  filterAll:           { ar: "الكل",                                en: "All"                          },
  filterRevenue:       { ar: "إيرادات",                             en: "Revenue"                      },
  filterExpense:       { ar: "مصروفات",                             en: "Expenses"                     },

  // ── Table columns ─────────────────────────────────────────
  colInvoice:          { ar: "الفاتورة",                            en: "Invoice"                      },
  colParty:            { ar: "الطرف",                               en: "Party"                        },
  colProject:          { ar: "المشروع",                             en: "Project"                      },
  colDate:             { ar: "التاريخ",                             en: "Date"                         },
  colTotal:            { ar: "الإجمالي",                            en: "Total"                        },
  colPaid:             { ar: "المدفوع",                             en: "Paid"                         },
  colRemaining:        { ar: "المتبقي",                             en: "Remaining"                    },
  colStatus:           { ar: "الحالة",                              en: "Status"                       },
  colActions:          { ar: "الإجراءات",                           en: "Actions"                      },

  // ── Actions ───────────────────────────────────────────────
  viewDetails:         { ar: "عرض التفاصيل",                       en: "View Details"                 },
  addPayment:          { ar: "تسجيل دفعة",                         en: "Register Payment"             },
  editPaymentTitle:    { ar: "تعديل الدفعة",                        en: "Edit Payment"                 },
  exportPdf:           { ar: "تصدير PDF",                          en: "Export PDF"                   },
  save:                { ar: "حفظ",                                 en: "Save"                         },
  saving:              { ar: "جارٍ الحفظ…",                         en: "Saving…"                      },
  cancel:              { ar: "إلغاء",                               en: "Cancel"                       },
  close:               { ar: "إغلاق",                               en: "Close"                        },
  confirm:             { ar: "تأكيد",                               en: "Confirm"                      },

  // ── Edit / delete invoice ─────────────────────────────────
  editInvoice:         { ar: "تعديل الفاتورة",                      en: "Edit Invoice"                 },
  modalEditTitle:      { ar: "تعديل الفاتورة",                      en: "Edit Invoice"                 },
  deleteInvoice:       { ar: "حذف الفاتورة",                        en: "Delete Invoice"               },
  deleteInvoiceMsg:    { ar: "هل أنت متأكد من حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.",
                         en: "Are you sure you want to delete this invoice? This action cannot be undone." },

  // ── Edit / delete payment ─────────────────────────────────
  editPayment:         { ar: "تعديل الدفعة",                        en: "Edit Payment"                 },
  deletePayment:       { ar: "حذف الدفعة",                          en: "Delete Payment"               },
  deletePaymentMsg:    { ar: "هل أنت متأكد من حذف هذه الدفعة؟",    en: "Are you sure you want to delete this payment?" },

  // ── Create invoice modal ──────────────────────────────────
  modalCreateTitle:    { ar: "إنشاء فاتورة جديدة",                  en: "Create New Invoice"           },
  modalCreateSub:      { ar: "أدخل تفاصيل الفاتورة الجديدة",        en: "Enter new invoice details"    },

  // ── Details modal ─────────────────────────────────────────
  detailsTitle:        { ar: "تفاصيل الفاتورة",                     en: "Invoice Details"              },
  paymentHistory:      { ar: "سجل المدفوعات",                       en: "Payment History"              },
  noPayments:          { ar: "لا توجد مدفوعات مسجلة",               en: "No payments recorded"         },
  progressLabel:       { ar: "نسبة السداد",                          en: "Payment Progress"             },

  // ── Payment modal ─────────────────────────────────────────
  paymentTitle:        { ar: "تسجيل دفعة",                          en: "Register Payment"             },
  paymentSubtitle:     { ar: "سجّل دفعة لهذه الفاتورة",             en: "Log a payment for this invoice"},
  paymentAmount:       { ar: "مبلغ الدفعة",                         en: "Payment Amount"               },
  paymentMethod:       { ar: "طريقة الدفع",                         en: "Payment Method"               },
  paymentDate:         { ar: "تاريخ الدفعة",                        en: "Payment Date"                 },
  paymentNote:         { ar: "ملاحظات",                             en: "Notes"                        },
  paymentNotePH:       { ar: "ملاحظة اختيارية…",                    en: "Optional note…"               },
  methodBankTransfer:  { ar: "تحويل بنكي",                          en: "Bank Transfer"                },
  methodCash:          { ar: "نقداً",                                en: "Cash"                         },
  methodCheck:         { ar: "شيك",                                 en: "Check"                        },
  methodCard:          { ar: "بطاقة",                               en: "Card"                         },

  // ── Validation ────────────────────────────────────────────
  errPartyReq:         { ar: "يرجى اختيار الطرف",                   en: "Please select a party"        },
  errEntityReq:        { ar: "اسم الجهة مطلوب",                     en: "Entity name is required"      },
  errProjectReq:       { ar: "يرجى اختيار المشروع",                 en: "Please select a project"      },
  errDateReq:          { ar: "تاريخ الفاتورة مطلوب",                en: "Invoice date is required"     },
  errDueDateReq:       { ar: "تاريخ الاستحقاق مطلوب",               en: "Due date is required"         },
  errAmountReq:        { ar: "المبلغ مطلوب",                        en: "Amount is required"           },
  errAmountInvalid:    { ar: "المبلغ يجب أن يكون أكبر من صفر",      en: "Amount must be greater than 0"},
  errAmountExceeds:    { ar: "المبلغ يتجاوز المتبقي",               en: "Amount exceeds remaining"     },
  errMethodReq:        { ar: "طريقة الدفع مطلوبة",                  en: "Payment method is required"   },
  errPayDateReq:       { ar: "تاريخ الدفعة مطلوب",                  en: "Payment date is required"     },
  errContractName:     { ar: "اسم العقد مطلوب",                     en: "Contract name is required"    },
  errContractAmount:   { ar: "قيمة العقد يجب أن تكون أكبر من صفر",  en: "Contract value must be > 0"   },
  errContractParty:    { ar: "يرجى اختيار الطرف",                   en: "Please select a party"        },
  errContractProject:  { ar: "يرجى اختيار المشروع",                 en: "Please select a project"      },

  // ── No data ───────────────────────────────────────────────
  noInvoices:          { ar: "لا توجد فواتير",                       en: "No invoices found"            },
  loading:             { ar: "جارٍ التحميل…",                        en: "Loading…"                     },

  // ── PDF ───────────────────────────────────────────────────
  pdfInvoiceTitle:     { ar: "فاتورة",                              en: "Invoice"                      },
  pdfIssuedTo:         { ar: "صادرة إلى",                           en: "Issued To"                    },
  pdfIssuedBy:         { ar: "صادرة من",                            en: "Issued By"                    },
  pdfProject:          { ar: "المشروع",                             en: "Project"                      },
  pdfType:             { ar: "النوع",                               en: "Type"                         },
  pdfPaymentStatus:    { ar: "حالة السداد",                          en: "Payment Status"               },
  currency:            { ar: "ر.س",                                 en: "SAR"                          },
} as const;

export type InvKey = keyof typeof STRINGS;

export function tInv(lang: Lang, key: InvKey): string {
  return STRINGS[key][lang];
}

export function formatCurrency(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
    style: "currency", currency: "SAR", minimumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso.split("T")[0]);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export const STATUS_STYLES = {
  paid:    { bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400" },
  partial: { bg: "bg-blue-500/10",    border: "border-blue-500/25",    text: "text-blue-400"    },
  pending: { bg: "bg-amber-500/10",   border: "border-amber-500/25",   text: "text-amber-400"   },
  overdue: { bg: "bg-red-500/10",     border: "border-red-500/25",     text: "text-red-400"     },
} as const;

export const ACCOUNT_STYLES = {
  revenue: { bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400", dot: "bg-emerald-500" },
  expense: { bg: "bg-red-500/10",     border: "border-red-500/25",     text: "text-red-400",     dot: "bg-red-500"     },
} as const;

export const KIND_STYLES = {
  normal:   { bg: "bg-slate-500/10",  border: "border-slate-500/25",  text: "text-slate-400"  },
  progress: { bg: "bg-violet-500/10", border: "border-violet-500/25", text: "text-violet-400" },
} as const;
