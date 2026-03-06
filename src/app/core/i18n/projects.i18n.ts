// ============================================================
// projects.i18n.ts
// Only static UI chrome — titles, labels, button text,
// validation messages, and fixed enum resolvers.
//
// NOT here: project.name, project.phase names — those are
// dynamic API strings rendered directly.
// ============================================================
import type { Lang } from "../models/Settings.types";
import type { RiskLevel } from "../models/projects.types";

const PROJ_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:            { ar: "إدارة المشاريع",                           en: "Project Management"                  },
  pageSubtitle:         { ar: "عرض شامل لجميع المشاريع وتحليل الأداء",    en: "Full overview and performance analysis" },
  addProject:           { ar: "إضافة مشروع",                              en: "Add Project"                         },

  // ── Table headers ─────────────────────────────────────────
  colName:              { ar: "اسم المشروع",      en: "Project Name"    },
  colBudget:            { ar: "الميزانية",         en: "Budget"          },
  colActualCost:        { ar: "التكلفة الفعلية",   en: "Actual Cost"     },
  colProgress:          { ar: "نسبة الإنجاز",      en: "Progress"        },
  colProfitMargin:      { ar: "هامش الربح",        en: "Profit Margin"   },
  colRisk:              { ar: "مستوى المخاطرة",    en: "Risk Level"      },
  colActions:           { ar: "إجراءات",            en: "Actions"         },

  // ── Action buttons ────────────────────────────────────────
  view:                 { ar: "عرض",               en: "View"            },
  edit:                 { ar: "تعديل",              en: "Edit"            },
  delete:               { ar: "حذف",               en: "Delete"          },
  save:                 { ar: "حفظ التعديلات",      en: "Save Changes"    },
  saving:               { ar: "جارٍ الحفظ…",        en: "Saving…"         },
  addBtn:               { ar: "إضافة المشروع",      en: "Add Project"     },
  cancel:               { ar: "إلغاء",              en: "Cancel"          },
  editProject:          { ar: "تعديل المشروع",      en: "Edit Project"    },
  viewDetails:          { ar: "عرض التفاصيل",       en: "View Details"    },
  close:                { ar: "إغلاق",              en: "Close"           },

  // ── Modal titles ──────────────────────────────────────────
  modalAddTitle:        { ar: "إضافة مشروع جديد",   en: "Add New Project" },
  modalAddSubtitle:     { ar: "أدخل بيانات المشروع الجديد", en: "Enter the new project details" },
  modalViewTitle:       { ar: "تفاصيل المشروع",     en: "Project Details" },
  modalEditTitle:       { ar: "تعديل المشروع",      en: "Edit Project"    },

  // ── Form fields ───────────────────────────────────────────
  fieldName:            { ar: "اسم المشروع",         en: "Project Name"    },
  fieldNamePlaceholder: { ar: "مثال: مشروع برج الرياض", en: "e.g. Riyadh Tower Project" },
  fieldBudget:          { ar: "الميزانية (ر.س)",     en: "Budget (SAR)"    },
  fieldActualCost:      { ar: "التكلفة الفعلية (ر.س)", en: "Actual Cost (SAR)" },
  fieldProgress:        { ar: "نسبة الإنجاز (%)",    en: "Progress (%)"    },
  fieldProfitMargin:    { ar: "هامش الربح (%)",      en: "Profit Margin (%)" },
  fieldRisk:            { ar: "مستوى المخاطرة",      en: "Risk Level"      },

  // ── Risk enum labels ──────────────────────────────────────
  riskLow:              { ar: "منخفض",  en: "Low"    },
  riskMedium:           { ar: "متوسط",  en: "Medium" },
  riskHigh:             { ar: "عالي",   en: "High"   },

  // ── Validation ────────────────────────────────────────────
  errNameRequired:      { ar: "اسم المشروع مطلوب",          en: "Project name is required"        },
  errBudgetRequired:    { ar: "الميزانية مطلوبة",            en: "Budget is required"              },
  errBudgetInvalid:     { ar: "يجب إدخال رقم صحيح موجب",    en: "Must be a valid positive number" },
  errProgressRange:     { ar: "يجب أن تكون النسبة بين 0 و 100", en: "Must be between 0 and 100"  },
  errMarginInvalid:     { ar: "يجب إدخال نسبة صحيحة",       en: "Must be a valid percentage"      },

  // ── Delete confirm ────────────────────────────────────────
  deleteTitle:          { ar: "تأكيد الحذف",                  en: "Confirm Delete"                  },
  deleteQuestion:       { ar: "هل أنت متأكد من حذف المشروع", en: "Are you sure you want to delete" },
  deleteWarning:        { ar: "لا يمكن التراجع عن هذه العملية", en: "This action cannot be undone"  },
  deleteConfirmBtn:     { ar: "نعم، احذف",                    en: "Yes, Delete"                     },
  deleting:             { ar: "جارٍ الحذف…",                  en: "Deleting…"                       },

  // ── Project details section ───────────────────────────────
  detailsTitle:         { ar: "تفاصيل المشروع",               en: "Project Details"                 },
  budgetVsActualChart:  { ar: "الميزانية مقابل الفعلي",       en: "Budget vs Actual"                },
  costBreakdownChart:   { ar: "توزيع التكاليف",               en: "Cost Breakdown"                  },
  budgetLabel:          { ar: "الميزانية",                    en: "Budget"                          },
  actualLabel:          { ar: "الفعلي",                       en: "Actual"                          },

  // ── AI cards ──────────────────────────────────────────────
  aiOverrunTitle:       { ar: "توقع تجاوز التكلفة (AI)",      en: "Cost Overrun Prediction (AI)"    },
  aiOverrunBody:        { ar: "بناءً على معدل الإنفاق الحالي، هناك احتمالية {pct}% لتجاوز الميزانية بمقدار {amt} ر.س",
                          en: "Based on current spend rate, there is a {pct}% chance of exceeding the budget by {amt} SAR" },
  aiDelayTitle:         { ar: "توقع التأخير (AI)",             en: "Delay Prediction (AI)"           },
  aiDelayBody:          { ar: "معدل الإنجاز الحالي أقل من المخطط بنسبة {gap}%، مما قد يؤدي إلى تأخير {weeks} أسابيع في التسليم النهائي",
                          en: "Current completion rate is {gap}% behind schedule, potentially causing a {weeks}-week delay in final delivery" },
  viewSolutions:        { ar: "عرض الحلول المقترحة",           en: "View Suggested Solutions"        },
  lastUpdated:          { ar: "آخر تحديث: منذ ساعتين",         en: "Last updated: 2 hours ago"       },

  // ── Project stats ─────────────────────────────────────────
  statsTotal:           { ar: "إجمالي المشاريع",  en: "Total Projects"   },
  statsActive:          { ar: "قيد التنفيذ",       en: "Active"           },
  statsCompleted:       { ar: "مكتملة",            en: "Completed"        },
  statsDelayed:         { ar: "متأخرة",            en: "Delayed"          },

  // ── Currency / misc ───────────────────────────────────────
  currency:             { ar: "ر.س",               en: "SAR"              },
  loading:              { ar: "جارٍ التحميل…",      en: "Loading…"         },
  loadError:            { ar: "تعذّر تحميل البيانات", en: "Failed to load data" },
} as const;

export type ProjStringKey = keyof typeof PROJ_STRINGS;

export function tProj(lang: Lang, key: ProjStringKey): string {
  return PROJ_STRINGS[key][lang];
}

// ── Interpolation helper ──────────────────────────────────────
export function tProjInterp(
  lang: Lang,
  key: ProjStringKey,
  vars: Record<string, string | number>,
): string {
  let result = PROJ_STRINGS[key][lang] as string;
  for (const [k, v] of Object.entries(vars)) {
    result = result.replace(`{${k}}`, String(v));
  }
  return result;
}

// ── Risk enum → badge config ──────────────────────────────────
export const RISK_BADGE_CLASS: Record<RiskLevel, string> = {
  low:    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-orange-500/20  text-orange-400  border-orange-500/30",
  high:   "bg-red-500/20     text-red-400     border-red-500/30",
};

const RISK_LABEL_KEY: Record<RiskLevel, ProjStringKey> = {
  low:    "riskLow",
  medium: "riskMedium",
  high:   "riskHigh",
};

export function resolveRiskBadge(
  lang: Lang,
  risk: RiskLevel,
): { label: string; className: string } {
  return { label: tProj(lang, RISK_LABEL_KEY[risk]), className: RISK_BADGE_CLASS[risk] };
}

// ── Number formatter ──────────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
}

// ── Compact axis number (for charts) ─────────────────────────
export function formatAxisNum(n: number, lang: Lang): string {
  const isAr = lang === "ar";
  if (Math.abs(n) >= 1_000_000) {
    const v = (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return isAr ? `${v}م` : `${v}M`;
  }
  if (Math.abs(n) >= 1_000) {
    const v = (n / 1_000).toFixed(0);
    return isAr ? `${v}ك` : `${v}K`;
  }
  return String(n);
}

// ── Chart layout per direction ────────────────────────────────
export function chartLayout(lang: Lang) {
  const isAr = lang === "ar";
  return {
    yAxisSide:     (isAr ? "right" : "left") as "right" | "left",
    yAxisWidth:    52,
    margin:        isAr
      ? { top: 5, right: 16, left: 8,  bottom: 5 }
      : { top: 5, right: 8,  left: 16, bottom: 5 },
    barRadius:     [8, 8, 0, 0] as [number, number, number, number],
  };
}

// ── RTL helpers ───────────────────────────────────────────────
export const isRTL  = (lang: Lang) => lang === "ar";
export const dirAttr = (lang: Lang) => (isRTL(lang) ? "rtl" : "ltr") as "rtl" | "ltr";
export const flip   = (lang: Lang, ltr: string, rtl: string) => isRTL(lang) ? rtl : ltr;
