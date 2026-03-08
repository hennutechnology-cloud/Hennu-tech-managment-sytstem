// ============================================================
// boqComparison.i18n.ts
// Only static UI chrome: titles, labels, button text, tooltips.
//
// NOT here:
//   • item names / quantity strings      → plain API strings
//   • supplier names                     → plain API strings
//   • optimisation suggestion text       → plain API strings
//
// Follows the exact same pattern as dashboard.i18n.ts
// ============================================================
import type { Lang }           from "../models/Settings.types";
import type { SuggestionType } from "../models/BOQComparison.types";

const BOQ_STRINGS = {
  // ── Page header ───────────────────────────────────────────
  pageTitle:          { ar: "مقايسات الأعمال",                          en: "BOQ Comparison"                        },
  pageSubtitle:       { ar: "مقارنة ذكية للأسعار وتحسين التكاليف",      en: "Smart price comparison & cost optimisation" },

  // ── Upload area ───────────────────────────────────────────
  uploadBOQTitle:     { ar: "رفع ملف BOQ",                              en: "Upload BOQ File"                       },
  uploadBOQSub:       { ar: "اسحب وأفلت أو انقر للتحميل",               en: "Drag & drop or click to upload"        },
  uploadBOQHint:      { ar: "Excel, CSV (حتى 10MB)",                    en: "Excel, CSV (up to 10 MB)"              },
  uploadQuotesTitle:  { ar: "رفع عروض الأسعار",                         en: "Upload Supplier Quotes"                },
  uploadQuotesSub:    { ar: "عروض الموردين",                            en: "Supplier price offers"                 },
  uploadQuotesHint:   { ar: "Excel, PDF (ملفات متعددة)",                en: "Excel, PDF (multiple files)"           },
  uploadSuccess:      { ar: "تم التحميل بنجاح",                         en: "Uploaded successfully"                 },
  uploadUploading:    { ar: "جارٍ الرفع…",                              en: "Uploading…"                            },
  uploadError:        { ar: "فشل الرفع، حاول مجدداً",                   en: "Upload failed, please retry"           },

  // ── Savings summary cards ─────────────────────────────────
  totalSavingsLabel:  { ar: "إجمالي التوفير المتوقع",                   en: "Total Expected Savings"                },
  totalSavingsSub:    { ar: "بناءً على أفضل العروض",                    en: "Based on best quotes"                  },
  itemCountLabel:     { ar: "عدد البنود",                               en: "Line Items"                            },
  aiAccuracyLabel:    { ar: "دقة التوصيات",                             en: "AI Accuracy"                           },
  currency:           { ar: "ر.س",                                      en: "SAR"                                   },

  // ── Comparison table ──────────────────────────────────────
  tableTitle:         { ar: "جدول المقارنة",                            en: "Comparison Table"                      },
  colItem:            { ar: "البند",                                    en: "Item"                                  },
  colQuantity:        { ar: "الكمية",                                   en: "Quantity"                              },
  colEstimated:       { ar: "السعر المقدر",                             en: "Estimated Price"                       },
  colSavings:         { ar: "التوفير",                                  en: "Savings"                               },
  colRecommendation:  { ar: "التوصية",                                  en: "Recommendation"                        },
  aiOptimiseBtn:      { ar: "تحسين AI",                                 en: "AI Optimise"                           },

  // ── Optimisation suggestions ──────────────────────────────
  suggestionsTitle:   { ar: "اقتراحات التحسين",                         en: "Optimisation Suggestions"              },
  suggestionSaving:   { ar: "فرصة توفير",                               en: "Saving Opportunity"                    },
  suggestionRisk:     { ar: "مخاطر محتملة",                             en: "Potential Risk"                        },

  // ── Loading / error ───────────────────────────────────────
  loading:            { ar: "جارٍ التحميل…",                            en: "Loading…"                              },
  loadError:          { ar: "تعذّر تحميل البيانات",                     en: "Failed to load data"                   },
  awaitingUpload:     { ar: "يرجى رفع ملف BOQ وعروض الأسعار أولاً",    en: "Please upload BOQ and supplier quotes first" },
} as const;

export type BOQStringKey = keyof typeof BOQ_STRINGS;

export function tBOQ(lang: Lang, key: BOQStringKey): string {
  return BOQ_STRINGS[key][lang];
}

// ── Suggestion type label resolver ───────────────────────────
export function resolveSuggestionType(lang: Lang, type: SuggestionType): string {
  const map: Record<SuggestionType, BOQStringKey> = {
    saving: "suggestionSaving",
    risk:   "suggestionRisk",
  };
  return tBOQ(lang, map[type]);
}

// ── Suggestion type colour classes ────────────────────────────
export const SUGGESTION_STYLE: Record<SuggestionType, {
  card:  string;
  icon:  string;
  label: string;
}> = {
  saving: {
    card:  "bg-emerald-500/5  border border-emerald-500/20",
    icon:  "text-emerald-500",
    label: "text-white",
  },
  risk: {
    card:  "bg-orange-500/5   border border-orange-500/20",
    icon:  "text-orange-500",
    label: "text-white",
  },
};

// ── Currency formatter (matches dashboard pattern) ───────────
export function formatCurrency(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
    style:                 "currency",
    currency:              "SAR",
    minimumFractionDigits: 0,
  }).format(n);
}

// ── Plain number formatter ────────────────────────────────────
export function formatNum(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
}

// ── Percentage delta vs estimated ────────────────────────────
export function priceDelta(price: number, estimated: number): number {
  return ((price / estimated) - 1) * 100;
}
