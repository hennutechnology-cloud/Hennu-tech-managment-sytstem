// ============================================================
// BOQSummaryCards.tsx — responsive
// ============================================================
import { Wallet, Receipt, TrendingUp } from "lucide-react";
import GlassCard  from "../../core/shared/components/GlassCard";
import { tBOQMgt, formatCurrency, varianceClass } from "../../core/i18n/boqManagement.i18n";
import type { BOQSummaryCardsProps } from "../../core/models/BOQManagement.types";

export default function BOQSummaryCards({ summary, lang }: BOQSummaryCardsProps) {
  const isRtl = lang === "ar";
  const align = isRtl ? "text-right" : "text-left";

  const cards = [
    {
      icon:       <Wallet className="w-5 h-5 text-blue-400 shrink-0" />,
      label:      tBOQMgt(lang, "totalEstimated"),
      value:      formatCurrency(summary.totalEstimated, lang),
      valueClass: "text-xl sm:text-2xl lg:text-3xl font-bold text-white",
      extra:      null as string | null,
    },
    {
      icon:       <Receipt className="w-5 h-5 text-orange-400 shrink-0" />,
      label:      tBOQMgt(lang, "totalActual"),
      value:      formatCurrency(summary.totalActual, lang),
      valueClass: "text-xl sm:text-2xl lg:text-3xl font-bold text-white",
      extra:      null as string | null,
    },
    {
      icon:       <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />,
      label:      tBOQMgt(lang, "totalDeviation"),
      value:      formatCurrency(summary.totalActual - summary.totalEstimated, lang),
      valueClass: `text-xl sm:text-2xl lg:text-3xl font-bold ${varianceClass(summary.totalVariance)}`,
      extra:      `${summary.totalVariance > 0 ? "+" : ""}${summary.totalVariance.toFixed(2)}%`,
    },
  ];

  return (
    // 1 col on mobile → 3 cols on sm+
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {cards.map((card) => (
        <GlassCard key={card.label} className="p-4 sm:p-5 lg:p-6">
          {/* Icon + label row */}
          <div className={`flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3
                            ${isRtl ? "flex-row-reverse" : ""}`}>
            {card.icon}
            <p className={`text-xs sm:text-sm text-gray-400 leading-snug ${align}`}>
              {card.label}
            </p>
          </div>

          {/* Value */}
          <p className={`${card.valueClass} ${align} tabular-nums leading-tight`}>
            {card.value}
          </p>

          {/* Variance % badge */}
          {card.extra && (
            <p className={`text-xs sm:text-sm mt-1 tabular-nums
                            ${varianceClass(summary.totalVariance)} ${align}`}>
              {card.extra}
            </p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
