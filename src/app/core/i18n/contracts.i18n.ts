// ============================================================
// contracts.i18n.ts — Extended with edit & payment strings
// ============================================================
import type { Lang } from "../models/Settings.types";
import type { ContractStatus, PaymentStatus } from "../models/contracts.types";

const CONTRACT_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:            { ar: "إدارة العقود",                              en: "Contract Management"                   },
  pageSubtitle:         { ar: "متابعة العقود والدفعات وأوامر التغيير",     en: "Track contracts, payments & change orders" },

  // ── Summary card labels ───────────────────────────────────
  statsTotalContracts:  { ar: "إجمالي العقود",          en: "Total Contracts"      },
  statsActiveContracts: { ar: "العقود النشطة",           en: "Active Contracts"     },
  statsTotalValue:      { ar: "إجمالي قيمة العقود",     en: "Total Contract Value" },
  statsTotalPaid:       { ar: "المدفوع حتى الآن",        en: "Paid to Date"         },
  statsTotalRetention:  { ar: "إجمالي الاستبقاء",        en: "Total Retention"      },
  statsTotalPending:    { ar: "المبالغ المعلقة",          en: "Pending Payments"     },

  // ── Table / card column headers ───────────────────────────
  colContractNo:        { ar: "رقم العقد",               en: "Contract No."         },
  colContractor:        { ar: "المقاول",                  en: "Contractor"           },
  colScope:             { ar: "نطاق العمل",               en: "Scope"                },
  colOriginalValue:     { ar: "القيمة الأصلية",           en: "Original Value"       },
  colCurrentValue:      { ar: "القيمة الحالية",            en: "Current Value"        },
  colPaidToDate:        { ar: "المدفوع",                  en: "Paid"                 },
  colRemaining:         { ar: "المتبقي",                  en: "Remaining"            },
  colRetention:         { ar: "الاستبقاء",                en: "Retention"            },
  colStatus:            { ar: "الحالة",                   en: "Status"               },
  colActions:           { ar: "إجراءات",                  en: "Actions"              },
  colStartDate:         { ar: "تاريخ البدء",              en: "Start Date"           },
  colEndDate:           { ar: "تاريخ الانتهاء",            en: "End Date"             },

  // ── Contract status ───────────────────────────────────────
  statusActive:         { ar: "نشط",     en: "Active"      },
  statusCompleted:      { ar: "مكتمل",   en: "Completed"   },
  statusSuspended:      { ar: "موقوف",   en: "Suspended"   },
  statusTerminated:     { ar: "مُنهى",   en: "Terminated"  },

  // ── Payment status ────────────────────────────────────────
  payStatusPaid:        { ar: "مدفوع",   en: "Paid"    },
  payStatusPending:     { ar: "معلق",    en: "Pending" },
  payStatusOverdue:     { ar: "متأخر",   en: "Overdue" },
  payStatusPartial:     { ar: "جزئي",    en: "Partial" },

  // ── Detail section titles ─────────────────────────────────
  detailTitle:          { ar: "تفاصيل العقد",             en: "Contract Details"       },
  financialSummary:     { ar: "الملخص المالي",            en: "Financial Summary"      },
  paymentProgress:      { ar: "تقدم الدفعات",             en: "Payment Progress"       },
  changeOrdersTitle:    { ar: "أوامر التغيير",            en: "Change Orders"          },
  certificatesTitle:    { ar: "شهادات الدفع",             en: "Payment Certificates"   },
  paymentsTitle:        { ar: "الدفعات المباشرة",          en: "Direct Payments"        },
  contractDates:        { ar: "تواريخ العقد",             en: "Contract Dates"         },

  // ── Financial detail labels ───────────────────────────────
  originalValue:        { ar: "القيمة الأصلية للعقد",     en: "Original Contract Value"  },
  approvedVariations:   { ar: "التعديلات المعتمدة",        en: "Approved Variations"      },
  currentValue:         { ar: "القيمة الحالية للعقد",      en: "Current Contract Value"   },
  advancePayment:       { ar: "الدفعة المقدمة",            en: "Advance Payment"          },
  retentionPercent:     { ar: "نسبة الاستبقاء",            en: "Retention Rate"           },
  retentionAmount:      { ar: "مبلغ الاستبقاء",            en: "Retention Amount"         },
  paidToDate:           { ar: "المدفوع حتى الآن",          en: "Paid to Date"             },
  pendingAmount:        { ar: "المبلغ المعلق",              en: "Pending Amount"           },
  penaltiesApplied:     { ar: "الغرامات المطبقة",           en: "Penalties Applied"        },
  paymentRate:          { ar: "نسبة الدفع",                en: "Payment Rate"             },
  paidLabel:            { ar: "المدفوع",                   en: "Paid"                     },
  remainingLabel:       { ar: "المتبقي",                   en: "Remaining"                },

  // ── Change order labels ───────────────────────────────────
  coNumber:             { ar: "رقم الأمر",                 en: "Order No."   },
  coDescription:        { ar: "الوصف",                    en: "Description" },
  coAmount:             { ar: "المبلغ",                    en: "Amount"      },
  coApprovedOn:         { ar: "تاريخ الاعتماد",            en: "Approved On" },
  coStatus:             { ar: "الحالة",                    en: "Status"      },
  coApproved:           { ar: "معتمد",                    en: "Approved"    },
  coPending:            { ar: "قيد الدراسة",               en: "Pending"     },
  coRejected:           { ar: "مرفوض",                    en: "Rejected"    },
  noChangeOrders:       { ar: "لا توجد أوامر تغيير",       en: "No change orders"        },

  // ── Certificate labels ────────────────────────────────────
  certNumber:           { ar: "رقم الشهادة",               en: "Certificate No."        },
  certPeriod:           { ar: "الفترة",                    en: "Period"                  },
  certGross:            { ar: "المبلغ الإجمالي",            en: "Gross Amount"            },
  certDeductions:       { ar: "الخصومات",                  en: "Deductions"              },
  certNet:              { ar: "المبلغ الصافي",              en: "Net Amount"              },
  certIssuedOn:         { ar: "تاريخ الإصدار",             en: "Issued On"               },
  noCertificates:       { ar: "لا توجد شهادات دفع",        en: "No payment certificates" },

  // ── Direct payment labels ─────────────────────────────────
  paymentAmount:        { ar: "مبلغ الدفعة",               en: "Payment Amount"         },
  paymentType:          { ar: "نوع الدفعة",                en: "Payment Type"           },
  paymentTypeFull:      { ar: "دفعة كاملة",                en: "Full Payment"           },
  paymentTypePartial:   { ar: "دفعة جزئية",               en: "Partial Payment"        },
  paymentDate:          { ar: "تاريخ الدفع",               en: "Payment Date"           },
  paymentDescription:   { ar: "وصف الدفعة",                en: "Payment Description"    },
  paymentReference:     { ar: "رقم المرجع",                en: "Reference No."          },
  noPayments:           { ar: "لا توجد دفعات مباشرة",      en: "No direct payments"     },
  remainingToPay:       { ar: "المبلغ المتبقي للدفع",       en: "Remaining to Pay"       },

  // ── Edit contract ─────────────────────────────────────────
  editContractTitle:    { ar: "تعديل بيانات العقد",        en: "Edit Contract"          },
  editContractSubtitle: { ar: "يمكن تعديل الحالة وبيانات الإنهاء والاستبقاء", en: "Edit status, end date, retention & penalties" },

  // ── Delete contract ───────────────────────────────────────
  deleteTitle:          { ar: "حذف العقد",                 en: "Delete Contract"        },
  deleteQuestion:       { ar: "هل أنت متأكد من حذف العقد", en: "Are you sure you want to delete contract" },
  deleteWarning:        { ar: "سيتم حذف جميع البيانات المرتبطة بهذا العقد نهائياً.", en: "All associated data will be permanently deleted." },
  deleteConfirmBtn:     { ar: "حذف نهائي",                 en: "Permanently Delete"     },
  deleting:             { ar: "جارٍ الحذف…",               en: "Deleting…"              },

  // ── Inline delete confirmations ───────────────────────────
  deleteCoQuestion:     { ar: "هل تريد حذف هذا الأمر نهائياً؟",      en: "Permanently delete this change order?"  },
  deleteCertQuestion:   { ar: "هل تريد حذف هذه الشهادة نهائياً؟",    en: "Permanently delete this certificate?"   },
  deletePaymentQuestion:{ ar: "هل تريد حذف هذه الدفعة نهائياً؟",     en: "Permanently delete this payment?"       },

  // ── Inline edit titles (used in ContractDetail) ───────────
  editChangeOrder:      { ar: "تعديل أمر التغيير",         en: "Edit Change Order"      },
  editCertificate:      { ar: "تعديل شهادة الدفع",         en: "Edit Certificate"       },
  editPayment:          { ar: "تعديل الدفعة",              en: "Edit Payment"           },
  deleteChangeOrder:    { ar: "حذف أمر التغيير",           en: "Delete Change Order"    },
  deleteCertificate:    { ar: "حذف الشهادة",               en: "Delete Certificate"     },
  deletePayment:        { ar: "حذف الدفعة",                en: "Delete Payment"         },

  // ── Field labels (generic, used in ContractDetail inline) ─
  fieldDescription:     { ar: "الوصف",                    en: "Description"            },
  fieldAmount:          { ar: "المبلغ",                    en: "Amount"                 },
  fieldStatus:          { ar: "الحالة",                    en: "Status"                 },
  fieldApprovedOn:      { ar: "تاريخ الاعتماد",            en: "Approved On"            },
  fieldPeriodFrom:      { ar: "بداية الفترة",              en: "Period From"            },
  fieldPeriodTo:        { ar: "نهاية الفترة",              en: "Period To"              },

  // ── Alerts ────────────────────────────────────────────────
  penaltyAlert:         { ar: "غرامات مطبقة",              en: "Penalties Applied"    },
  noContracts:          { ar: "لا توجد عقود",              en: "No contracts found"   },
  noContractsForProject:{ ar: "لا توجد عقود لهذا المشروع", en: "No contracts for this project" },

  // ── Common actions ────────────────────────────────────────
  view:                 { ar: "عرض",            en: "View"            },
  edit:                 { ar: "تعديل",          en: "Edit"            },
  delete:               { ar: "حذف",            en: "Delete"          },
  close:                { ar: "إغلاق",          en: "Close"           },
  cancel:               { ar: "إلغاء",          en: "Cancel"          },
  save:                 { ar: "حفظ",            en: "Save"            },
  saving:               { ar: "جارٍ الحفظ…",    en: "Saving…"         },
  add:                  { ar: "إضافة",          en: "Add"             },
  addContract:          { ar: "إضافة عقد جديد", en: "Add Contract"    },
  addCertificate:       { ar: "إضافة شهادة دفع",en: "Add Certificate" },
  addChangeOrder:       { ar: "إضافة أمر تغيير",en: "Add Change Order"},
  addPayment:           { ar: "إضافة دفعة",     en: "Add Payment"     },

  // ── Widget title ──────────────────────────────────────────
  widgetTitle:          { ar: "عقود المشروع",   en: "Project Contracts" },

  // ── Misc ─────────────────────────────────────────────────
  currency:             { ar: "ر.س",            en: "SAR"                          },
  loading:              { ar: "جارٍ التحميل…",  en: "Loading…"                     },
  loadError:            { ar: "تعذّر تحميل العقود", en: "Failed to load contracts" },
  dateFormat:           { ar: "{day}/{month}/{year}", en: "{month}/{day}/{year}"   },
  dateSeparator:        { ar: " — ",            en: " – "                          },

  // ── Add-contract modal ────────────────────────────────────
  addContractTitle:           { ar: "إضافة عقد جديد للمشروع",        en: "Add New Contract to Project"    },
  addContractSubtitle:        { ar: "أدخل بيانات العقد والمقاول",     en: "Enter contract and contractor details" },
  fieldContractorName:        { ar: "اسم المقاول / الشركة",           en: "Contractor / Company Name"      },
  fieldContractorPlaceholder: { ar: "مثال: شركة الإنشاءات السعودية", en: "e.g. Saudi Construction Co."   },
  fieldScope:                 { ar: "نطاق العمل",                     en: "Scope of Work"                  },
  fieldScopePlaceholder:      { ar: "وصف الأعمال المشمولة بالعقد",    en: "Describe the contracted work"   },
  fieldContractStatus:        { ar: "حالة العقد",                     en: "Contract Status"                },
  fieldOriginalValue:         { ar: "القيمة الأصلية للعقد (ر.س)",     en: "Original Contract Value (SAR)"  },
  fieldAdvancePayment:        { ar: "الدفعة المقدمة (ر.س)",           en: "Advance Payment (SAR)"          },
  fieldRetentionPercent:      { ar: "نسبة الاستبقاء (%)",             en: "Retention Percent (%)"          },
  fieldPenalties:             { ar: "الغرامات (ر.س)",                 en: "Penalties (SAR)"                },
  fieldStartDate:             { ar: "تاريخ بدء العقد",                en: "Contract Start Date"            },
  fieldEndDate:               { ar: "تاريخ انتهاء العقد",             en: "Contract End Date"              },
  fieldDay:                   { ar: "اليوم",                          en: "Day"                            },
  fieldMonth:                 { ar: "الشهر",                          en: "Month"                          },
  fieldYear:                  { ar: "السنة",                          en: "Year"                           },

  // ── Add-certificate modal ─────────────────────────────────
  addCertTitle:               { ar: "إضافة شهادة دفع",                en: "Add Payment Certificate"        },
  addCertSubtitle:            { ar: "أدخل بيانات شهادة الدفع",        en: "Enter payment certificate details" },
  fieldGrossAmount:           { ar: "المبلغ الإجمالي (ر.س)",          en: "Gross Amount (SAR)"             },
  fieldDeductions:            { ar: "الخصومات (ر.س)",                 en: "Deductions (SAR)"               },
  fieldPaymentStatus:         { ar: "حالة الدفع",                     en: "Payment Status"                 },
  certNetCalc:                { ar: "المبلغ الصافي (محسوب تلقائياً)",  en: "Net Amount (auto-calculated)"   },

  // ── Add-change-order modal ────────────────────────────────
  addCoTitle:                 { ar: "إضافة أمر تغيير",                en: "Add Change Order"               },
  addCoSubtitle:              { ar: "أدخل بيانات أمر التغيير",        en: "Enter change order details"     },
  fieldCoDescription:         { ar: "وصف التغيير",                    en: "Change Description"             },
  fieldCoDescPlaceholder:     { ar: "وصف تفصيلي للأعمال المضافة أو المعدلة", en: "Detailed description of added or modified work" },
  fieldCoAmount:              { ar: "مبلغ التغيير (ر.س)",             en: "Change Amount (SAR)"            },
  fieldCoStatus:              { ar: "حالة أمر التغيير",               en: "Change Order Status"            },
  fieldCoApprovedOn:          { ar: "تاريخ الاعتماد / التقديم",       en: "Approval / Submission Date"     },

  // ── Add-payment modal ─────────────────────────────────────
  addPaymentTitle:            { ar: "إضافة دفعة للعقد",               en: "Add Payment to Contract"        },
  addPaymentSubtitle:         { ar: "سجّل دفعة جزئية أو كاملة",       en: "Record a partial or full payment" },
  fieldPaymentAmount:         { ar: "مبلغ الدفعة (ر.س)",              en: "Payment Amount (SAR)"           },
  fieldPaymentType:           { ar: "نوع الدفعة",                     en: "Payment Type"                   },
  fieldPaymentDescription:    { ar: "وصف الدفعة",                     en: "Payment Description"            },
  fieldPaymentDescPH:         { ar: "مثال: دفعة شهر مارس 2025",       en: "e.g. March 2025 instalment"     },
  fieldPaymentDate:           { ar: "تاريخ الدفع",                    en: "Payment Date"                   },
  fieldPaymentReference:      { ar: "رقم المرجع / الحوالة",            en: "Reference / Transfer No."       },
  fieldPaymentRefPH:          { ar: "مثال: TRF-20250315",              en: "e.g. TRF-20250315"              },
  fullPaymentNote:            { ar: "سيتم دفع المبلغ المتبقي كاملاً",  en: "Full remaining balance will be paid" },

  // ── Validation errors ─────────────────────────────────────
  errRequired:                { ar: "هذا الحقل مطلوب",               en: "This field is required"         },
  errPositiveNumber:          { ar: "يجب إدخال رقم موجب",            en: "Must be a positive number"      },
  errInvalidDate:             { ar: "تاريخ غير صحيح",                en: "Invalid date"                   },
  errEndBeforeStart:          { ar: "تاريخ الانتهاء قبل تاريخ البدء", en: "End date is before start date"  },
  errRetentionRange:          { ar: "النسبة يجب أن تكون بين 0 و 100", en: "Must be between 0 and 100"      },
  errExceedsRemaining:        { ar: "المبلغ يتجاوز المتبقي",          en: "Amount exceeds remaining balance" },
} as const;

export type ContractStringKey = keyof typeof CONTRACT_STRINGS;

export function tContract(lang: Lang, key: ContractStringKey): string {
  return CONTRACT_STRINGS[key][lang];
}

export function tContractInterp(
  lang: Lang,
  key: ContractStringKey,
  vars: Record<string, string | number>,
): string {
  let result = CONTRACT_STRINGS[key][lang] as string;
  for (const [k, v] of Object.entries(vars)) {
    result = result.replace(`{${k}}`, String(v));
  }
  return result;
}

// ── Status badge config ───────────────────────────────────────

export const CONTRACT_STATUS_BADGE: Record<ContractStatus, { key: ContractStringKey; className: string }> = {
  active:     { key: "statusActive",     className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  completed:  { key: "statusCompleted",  className: "bg-blue-500/20    text-blue-400    border-blue-500/30"    },
  suspended:  { key: "statusSuspended",  className: "bg-orange-500/20  text-orange-400  border-orange-500/30"  },
  terminated: { key: "statusTerminated", className: "bg-red-500/20     text-red-400     border-red-500/30"     },
};

export const PAYMENT_STATUS_BADGE: Record<PaymentStatus, { key: ContractStringKey; className: string }> = {
  paid:    { key: "payStatusPaid",    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  pending: { key: "payStatusPending", className: "bg-orange-500/20  text-orange-400  border-orange-500/30"  },
  overdue: { key: "payStatusOverdue", className: "bg-red-500/20     text-red-400     border-red-500/30"     },
  partial: { key: "payStatusPartial", className: "bg-blue-500/20    text-blue-400    border-blue-500/30"    },
};

export function resolveContractStatusBadge(lang: Lang, status: ContractStatus) {
  const cfg = CONTRACT_STATUS_BADGE[status];
  return { label: tContract(lang, cfg.key), className: cfg.className };
}

export function resolvePaymentStatusBadge(lang: Lang, status: PaymentStatus) {
  const cfg = PAYMENT_STATUS_BADGE[status];
  return { label: tContract(lang, cfg.key), className: cfg.className };
}

// ── Date formatter ────────────────────────────────────────────
import { SHORT_MONTHS } from "./util.i18n";
import type { CalendarDate } from "../models/contracts.types";

export function formatContractDate(date: CalendarDate, lang: Lang): string {
  const monthName = SHORT_MONTHS[lang][date.month - 1];
  return lang === "ar"
    ? `${date.day} ${monthName} ${date.year}`
    : `${monthName} ${date.day}, ${date.year}`;
}

// ── RTL helpers ───────────────────────────────────────────────
export const isRTL   = (lang: Lang) => lang === "ar";
export const dirAttr = (lang: Lang) => (isRTL(lang) ? "rtl" : "ltr") as "rtl" | "ltr";
export const flip    = (lang: Lang, ltr: string, rtl: string) => isRTL(lang) ? rtl : ltr;
