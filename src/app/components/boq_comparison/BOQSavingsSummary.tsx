// ============================================================
// BOQSavingsSummary.tsx
// Three KPI cards: total savings, item count, AI accuracy.
// Mirrors the KPICards pattern from dashboard.
// ============================================================
import { TrendingDown, FileSpreadsheet, Brain } from "lucide-react";
import GlassCard             from "../../core/shared/components/GlassCard";
import { tBOQ, formatCurrency, formatNum } from "../../core/i18n/boqComparison.i18n";
import type { BOQSavingsSummaryProps }     from "../../core/models/BOQComparison.types";

export default function BOQSavingsSummary({ summary, lang }: BOQSavingsSummaryProps) {
  const isRtl = lang === "ar";
  const align = isRtl ? "text-right" : "text-left";

  const cards = [
    {
      icon:      <TrendingDown className="w-5 h-5 text-emerald-500" />,
      label:     tBOQ(lang, "totalSavingsLabel"),
      sub:       tBOQ(lang, "totalSavingsSub"),
      value:     formatCurrency(summary.totalSavings, lang),
      valueClass:"text-3xl font-bold text-emerald-500",
      glow:      true,
    },
    {
      icon:      <FileSpreadsheet className="w-5 h-5 text-orange-500" />,
      label:     tBOQ(lang, "itemCountLabel"),
      sub:       null,
      value:     formatNum(summary.itemCount, lang),
      valueClass:"text-3xl font-bold text-white",
      glow:      false,
    },
    {
      icon:      <Brain className="w-5 h-5 text-blue-500" />,
      label:     tBOQ(lang, "aiAccuracyLabel"),
      sub:       null,
      value:     `${formatNum(summary.aiAccuracyPct, lang)}%`,
      valueClass:"text-3xl font-bold text-blue-500",
      glow:      false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {cards.map((card) => (
        <GlassCard key={card.label} className="p-4 sm:p-6">
          <div className={`flex items-center gap-3 mb-2 ${isRtl ? "flex-row-reverse" : ""}`}>
            {card.icon}
            <p className={`text-sm text-gray-400 ${align}`}>{card.label}</p>
          </div>
          <p className={`${card.valueClass} ${align}`}>{card.value}</p>
          {card.sub && (
            <p className={`text-xs text-gray-500 mt-1 ${align}`}>{card.sub}</p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
