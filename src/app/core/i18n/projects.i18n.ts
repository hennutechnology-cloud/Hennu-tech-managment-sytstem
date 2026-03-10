// ============================================================
// projects.i18n.ts
// ============================================================
import type { Lang } from "../models/Settings.types";

const PROJECT_STRINGS = {
  // ── Page ─────────────────────────────────────────────────
  pageTitle:         { ar: "إدارة المشاريع",                          en: "Project Management"                   },
  pageSubtitle:      { ar: "متابعة المشاريع والميزانيات والأداء",     en: "Track projects, budgets & performance" },

  // ── Header stats ──────────────────────────────────────────
  statsTotal:        { ar: "إجمالي المشاريع",  en: "Total Projects"    },
  statsActive:       { ar: "المشاريع النشطة",  en: "Active Projects"   },
  statsCompleted:    { ar: "المشاريع المكتملة", en: "Completed"         },
  statsDelayed:      { ar: "المشاريع المتأخرة", en: "Delayed"           },

  // ── Table columns ─────────────────────────────────────────
  colProject:        { ar: "المشروع",          en: "Project"           },
  colBudget:         { ar: "الميزانية",         en: "Budget"            },
  colActualCost:     { ar: "التكلفة الفعلية",   en: "Actual Cost"       },
  colProgress:       { ar: "التقدم",            en: "Progress"          },
  colProfitMargin:   { ar: "هامش الربح",        en: "Profit Margin"     },
  colRisk:           { ar: "مستوى المخاطرة",    en: "Risk Level"        },
  colActions:        { ar: "إجراءات",           en: "Actions"           },

  // ── Risk levels ───────────────────────────────────────────
  riskLow:           { ar: "منخفض",  en: "Low"    },
  riskMedium:        { ar: "متوسط",  en: "Medium" },
  riskHigh:          { ar: "مرتفع",  en: "High"   },

  // ── Detail panel ─────────────────────────────────────────
  detailTitle:       { ar: "تفاصيل المشروع",      en: "Project Details"      },
  costBreakdown:     { ar: "توزيع التكاليف",        en: "Cost Breakdown"       },
  budgetVsActual:    { ar: "الميزانية مقابل الفعلي",en: "Budget vs Actual"     },
  financialSummary:  { ar: "الملخص المالي",         en: "Financial Summary"    },

  labelBudget:       { ar: "الميزانية الإجمالية",   en: "Total Budget"         },
  labelActualCost:   { ar: "التكلفة الفعلية",        en: "Actual Cost"          },
  labelVariance:     { ar: "الفارق",                 en: "Variance"             },
  labelProfitMargin: { ar: "هامش الربح",             en: "Profit Margin"        },
  labelProgress:     { ar: "نسبة الإنجاز",           en: "Completion"           },
  labelRisk:         { ar: "مستوى المخاطرة",         en: "Risk Level"           },

  // ── Contracts section inside project detail ───────────────
  contractsTitle:    { ar: "عقود المشروع",           en: "Project Contracts"    },

  // ── Modals ────────────────────────────────────────────────
  addProject:        { ar: "إضافة مشروع",            en: "Add Project"          },
  editProject:       { ar: "تعديل المشروع",           en: "Edit Project"         },
  viewProject:       { ar: "تفاصيل المشروع",          en: "Project Details"      },
  deleteProject:     { ar: "حذف المشروع",             en: "Delete Project"       },
  deleteConfirm:     { ar: "هل أنت متأكد من حذف هذا المشروع؟", en: "Are you sure you want to delete this project?" },
  deleteWarning:     { ar: "هذا الإجراء لا يمكن التراجع عنه.", en: "This action cannot be undone." },
  save:              { ar: "حفظ",                     en: "Save"                 },
  saving:            { ar: "جارٍ الحفظ…",             en: "Saving…"              },
  cancel:            { ar: "إلغاء",                   en: "Cancel"               },
  edit:              { ar: "تعديل",                   en: "Edit"                 },
  delete:            { ar: "حذف",                     en: "Delete"               },
  close:             { ar: "إغلاق",                   en: "Close"                },
  confirm:           { ar: "تأكيد",                   en: "Confirm"              },

  // ── Form labels ───────────────────────────────────────────
  fieldName:         { ar: "اسم المشروع",             en: "Project Name"         },
  fieldNamePH:       { ar: "مثال: برج الأعمال المركزي", en: "e.g. Central Business Tower" },
  fieldBudget:       { ar: "الميزانية الإجمالية (ر.س)", en: "Total Budget (SAR)"  },
  fieldActualCost:   { ar: "التكلفة الفعلية (ر.س)",   en: "Actual Cost (SAR)"    },
  fieldProgress:     { ar: "نسبة الإنجاز (%)",        en: "Completion (%)"       },
  fieldProfitMargin: { ar: "هامش الربح (%)",           en: "Profit Margin (%)"    },
  fieldRisk:         { ar: "مستوى المخاطرة",           en: "Risk Level"           },

  // ── Validation ────────────────────────────────────────────
  errRequired:       { ar: "هذا الحقل مطلوب",         en: "This field is required"   },
  errPositiveNumber: { ar: "يجب إدخال رقم موجب",      en: "Must be a positive number" },
  errRange0100:      { ar: "القيمة بين 0 و 100",       en: "Value must be 0–100"       },

  // ── Table / list misc ─────────────────────────────────────
  noProjects:        { ar: "لا توجد مشاريع",           en: "No projects found"    },
  loading:           { ar: "جارٍ التحميل…",            en: "Loading…"             },
  loadError:         { ar: "تعذّر تحميل المشاريع",      en: "Failed to load projects" },

  // ── Misc ─────────────────────────────────────────────────
  currency:          { ar: "ر.س",  en: "SAR"  },
  budget:            { ar: "الميزانية", en: "Budget" },
  actual:            { ar: "الفعلي",    en: "Actual" },
} as const;

export type ProjectStringKey = keyof typeof PROJECT_STRINGS;

export function tProj(lang: Lang, key: ProjectStringKey): string {
  return PROJECT_STRINGS[key][lang];
}

export function tProjInterp(
  lang: Lang, key: ProjectStringKey, vars: Record<string, string | number>,
): string {
  let result = PROJECT_STRINGS[key][lang] as string;
  for (const [k, v] of Object.entries(vars)) result = result.replace(`{${k}}`, String(v));
  return result;
}

// ── Number formatter (locale-aware) ──────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
}

// ── Risk badge ────────────────────────────────────────────────
import type { RiskLevel } from "../models/projects.types";

export const RISK_BADGE: Record<RiskLevel, { key: ProjectStringKey; className: string }> = {
  low:    { key: "riskLow",    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { key: "riskMedium", className: "bg-orange-500/20  text-orange-400  border-orange-500/30"  },
  high:   { key: "riskHigh",   className: "bg-red-500/20     text-red-400     border-red-500/30"     },
};

export function resolveRiskBadge(lang: Lang, risk: RiskLevel) {
  const cfg = RISK_BADGE[risk];
  return { label: tProj(lang, cfg.key), className: cfg.className };
}

// ── RTL helpers ───────────────────────────────────────────────
export const isRTL   = (lang: Lang) => lang === "ar";
export const dirAttr = (lang: Lang) => (isRTL(lang) ? "rtl" : "ltr") as "rtl" | "ltr";
export const flip    = (lang: Lang, ltr: string, rtl: string) => isRTL(lang) ? rtl : ltr;

// Month names used by contract date formatter
export const SHORT_MONTHS = {
  ar: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};
