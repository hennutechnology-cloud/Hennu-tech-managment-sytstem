// ============================================================
// util.i18n.ts — Reusable time, date, calendar, and number
// ============================================================
import type { Lang } from "../models/Settings.types";

const UTIL_STRINGS = {
  // ── Full month names ──────────────────────────────────────
  january:    { ar: "يناير",    en: "January"    },
  february:   { ar: "فبراير",   en: "February"   },
  march:      { ar: "مارس",     en: "March"      },
  april:      { ar: "أبريل",    en: "April"      },
  may:        { ar: "مايو",     en: "May"        },
  june:       { ar: "يونيو",    en: "June"       },
  july:       { ar: "يوليو",    en: "July"       },
  august:     { ar: "أغسطس",    en: "August"     },
  september:  { ar: "سبتمبر",   en: "September"  },
  october:    { ar: "أكتوبر",   en: "October"    },
  november:   { ar: "نوفمبر",   en: "November"   },
  december:   { ar: "ديسمبر",   en: "December"   },

  // ── Short month names (charts, tight spaces) ──────────────
  janShort:   { ar: "يناير",    en: "Jan"        },
  febShort:   { ar: "فبراير",   en: "Feb"        },
  marShort:   { ar: "مارس",     en: "Mar"        },
  aprShort:   { ar: "أبريل",    en: "Apr"        },
  mayShort:   { ar: "مايو",     en: "May"        },
  junShort:   { ar: "يونيو",    en: "Jun"        },
  julShort:   { ar: "يوليو",    en: "Jul"        },
  augShort:   { ar: "أغسطس",    en: "Aug"        },
  sepShort:   { ar: "سبتمبر",   en: "Sep"        },
  octShort:   { ar: "أكتوبر",   en: "Oct"        },
  novShort:   { ar: "نوفمبر",   en: "Nov"        },
  decShort:   { ar: "ديسمبر",   en: "Dec"        },

  // ── Full day names ────────────────────────────────────────
  monday:     { ar: "الاثنين",   en: "Monday"     },
  tuesday:    { ar: "الثلاثاء",  en: "Tuesday"    },
  wednesday:  { ar: "الأربعاء",  en: "Wednesday"  },
  thursday:   { ar: "الخميس",    en: "Thursday"   },
  friday:     { ar: "الجمعة",    en: "Friday"     },
  saturday:   { ar: "السبت",     en: "Saturday"   },
  sunday:     { ar: "الأحد",     en: "Sunday"     },

  // ── Short day names ───────────────────────────────────────
  monShort:   { ar: "إث",        en: "Mon"        },
  tueShort:   { ar: "ثل",        en: "Tue"        },
  wedShort:   { ar: "أر",        en: "Wed"        },
  thuShort:   { ar: "خم",        en: "Thu"        },
  friShort:   { ar: "جم",        en: "Fri"        },
  satShort:   { ar: "سب",        en: "Sat"        },
  sunShort:   { ar: "أح",        en: "Sun"        },

  // ── Quarters ──────────────────────────────────────────────
  q1:         { ar: "الربع الأول",   en: "Q1"         },
  q2:         { ar: "الربع الثاني",  en: "Q2"         },
  q3:         { ar: "الربع الثالث",  en: "Q3"         },
  q4:         { ar: "الربع الرابع",  en: "Q4"         },

  // ── Relative time — past ──────────────────────────────────
  justNow:        { ar: "الآن",                   en: "Just now"          },
  minutesAgo:     { ar: "منذ {n} دقيقة",          en: "{n} min ago"       },
  hoursAgo:       { ar: "منذ {n} ساعة",            en: "{n} hr ago"        },
  oneHourAgo:     { ar: "منذ ساعة",               en: "1 hour ago"        },
  daysAgo:        { ar: "منذ {n} أيام",            en: "{n} days ago"      },
  oneDayAgo:      { ar: "منذ يوم",                en: "1 day ago"         },
  weeksAgo:       { ar: "منذ {n} أسابيع",          en: "{n} weeks ago"     },
  monthsAgo:      { ar: "منذ {n} أشهر",            en: "{n} months ago"    },
  yearsAgo:       { ar: "منذ {n} سنوات",           en: "{n} years ago"     },

  // ── Relative time — future ────────────────────────────────
  inMinutes:      { ar: "خلال {n} دقيقة",         en: "in {n} min"        },
  inHours:        { ar: "خلال {n} ساعة",           en: "in {n} hr"         },
  inDays:         { ar: "خلال {n} أيام",           en: "in {n} days"       },
  inWeeks:        { ar: "خلال {n} أسابيع",         en: "in {n} weeks"      },
  inMonths:       { ar: "خلال {n} أشهر",           en: "in {n} months"     },

  // ── Time of day ───────────────────────────────────────────
  morning:        { ar: "صباحاً",                  en: "AM"                },
  evening:        { ar: "مساءً",                   en: "PM"                },
  midnight:       { ar: "منتصف الليل",             en: "Midnight"          },
  noon:           { ar: "الظهر",                   en: "Noon"              },

  // ── Duration units (singular) ─────────────────────────────
  second:         { ar: "ثانية",                   en: "second"            },
  minute:         { ar: "دقيقة",                   en: "minute"            },
  hour:           { ar: "ساعة",                    en: "hour"              },
  day:            { ar: "يوم",                     en: "day"               },
  week:           { ar: "أسبوع",                   en: "week"              },
  month:          { ar: "شهر",                     en: "month"             },
  year:           { ar: "سنة",                     en: "year"              },

  // ── Duration units (plural) ───────────────────────────────
  seconds:        { ar: "ثوانٍ",                   en: "seconds"           },
  minutes:        { ar: "دقائق",                   en: "minutes"           },
  hours:          { ar: "ساعات",                   en: "hours"             },
  days:           { ar: "أيام",                    en: "days"              },
  weeks:          { ar: "أسابيع",                  en: "weeks"             },
  months:         { ar: "أشهر",                    en: "months"            },
  years:          { ar: "سنوات",                   en: "years"             },

  // ── Date labels ───────────────────────────────────────────
  today:          { ar: "اليوم",                   en: "Today"             },
  yesterday:      { ar: "أمس",                     en: "Yesterday"         },
  tomorrow:       { ar: "غداً",                    en: "Tomorrow"          },
  thisWeek:       { ar: "هذا الأسبوع",              en: "This week"         },
  lastWeek:       { ar: "الأسبوع الماضي",           en: "Last week"         },
  thisMonth:      { ar: "هذا الشهر",               en: "This month"        },
  lastMonth:      { ar: "الشهر الماضي",             en: "Last month"        },
  thisYear:       { ar: "هذا العام",               en: "This year"         },
  lastYear:       { ar: "العام الماضي",             en: "Last year"         },
  lastUpdated:    { ar: "آخر تحديث",               en: "Last updated"      },
  updatedAt:      { ar: "تم التحديث في",            en: "Updated at"        },
  createdAt:      { ar: "تم الإنشاء في",            en: "Created at"        },
  dateRange:      { ar: "من {start} إلى {end}",    en: "{start} to {end}"  },

  // ── Status / state ────────────────────────────────────────
  active:         { ar: "نشط",                     en: "Active"            },
  inactive:       { ar: "غير نشط",                 en: "Inactive"          },
  pending:        { ar: "قيد الانتظار",             en: "Pending"           },
  completed:      { ar: "مكتمل",                   en: "Completed"         },
  cancelled:      { ar: "ملغى",                    en: "Cancelled"         },
  inProgress:     { ar: "قيد التنفيذ",              en: "In Progress"       },
  overdue:        { ar: "متأخر",                   en: "Overdue"           },
  upcoming:       { ar: "قادم",                    en: "Upcoming"          },
  expired:        { ar: "منتهي الصلاحية",           en: "Expired"           },

  // ── Number / amount helpers ───────────────────────────────
  total:          { ar: "الإجمالي",                en: "Total"             },
  subtotal:       { ar: "المجموع الجزئي",           en: "Subtotal"          },
  average:        { ar: "المتوسط",                 en: "Average"           },
  minimum:        { ar: "الحد الأدنى",              en: "Minimum"           },
  maximum:        { ar: "الحد الأقصى",              en: "Maximum"           },
  percentage:     { ar: "النسبة المئوية",            en: "Percentage"        },
  amount:         { ar: "المبلغ",                  en: "Amount"            },
  balance:        { ar: "الرصيد",                  en: "Balance"           },
  increase:       { ar: "زيادة",                   en: "Increase"          },
  decrease:       { ar: "انخفاض",                  en: "Decrease"          },
  noChange:       { ar: "لا تغيير",                en: "No change"         },

  // ── Common UI actions ─────────────────────────────────────
  loading:        { ar: "جارٍ التحميل…",           en: "Loading…"          },
  saving:         { ar: "جارٍ الحفظ…",             en: "Saving…"           },
  deleting:       { ar: "جارٍ الحذف…",             en: "Deleting…"         },
  processing:     { ar: "جارٍ المعالجة…",           en: "Processing…"       },
  noData:         { ar: "لا توجد بيانات",           en: "No data available" },
  error:          { ar: "حدث خطأ",                 en: "An error occurred" },
  retry:          { ar: "إعادة المحاولة",           en: "Retry"             },
  refresh:        { ar: "تحديث",                   en: "Refresh"           },
} as const;

export type UtilStringKey = keyof typeof UTIL_STRINGS;

export function tUtil(lang: Lang, key: UtilStringKey): string {
  return UTIL_STRINGS[key][lang];
}

// ── Interpolation helper ──────────────────────────────────────
// Usage: tUtilInterp(lang, "minutesAgo", { n: 5 }) → "منذ 5 دقيقة" / "5 min ago"
export function tUtilInterp(
  lang: Lang,
  key: UtilStringKey,
  vars: Record<string, string | number>,
): string {
  let result = UTIL_STRINGS[key][lang] as string;
  for (const [k, v] of Object.entries(vars)) {
    result = result.replace(`{${k}}`, String(v));
  }
  return result;
}

// ── Ordered month arrays (short) — index 0 = January ─────────
export const SHORT_MONTHS: Record<Lang, string[]> = {
  ar: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};

// ── Ordered month arrays (full) ───────────────────────────────
export const FULL_MONTHS: Record<Lang, string[]> = {
  ar: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
};

// ── Ordered day arrays (full) — index 0 = Monday ─────────────
export const FULL_DAYS: Record<Lang, string[]> = {
  ar: ["الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"],
  en: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
};
