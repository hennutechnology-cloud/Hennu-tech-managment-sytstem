// ============================================================
// SummaryCards.tsx — Responsive
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { tCOA, formatNum } from "../../core/i18n/chartOfAccounts.i18n";
import type { SummaryCardsProps, AccountSummary } from "../../core/models/ChartOfAccounts.types";
import type { COAStringKey } from "../../core/i18n/chartOfAccounts.i18n";
import type { Lang } from "../../core/models/Settings.types";

interface CardConfig {
  labelKey:   COAStringKey;
  valueKey:   keyof AccountSummary;
  colorClass: string;
}

const CARDS: CardConfig[] = [
  { labelKey: "totalAssets",      valueKey: "totalAssets",      colorClass: "text-white"       },
  { labelKey: "totalLiabilities", valueKey: "totalLiabilities", colorClass: "text-white"       },
  { labelKey: "equity",           valueKey: "equity",           colorClass: "text-white"       },
  { labelKey: "revenues",         valueKey: "revenues",         colorClass: "text-emerald-400" },
  { labelKey: "expenses",         valueKey: "expenses",         colorClass: "text-red-400"     },
];

export default function SummaryCards({ summary, lang }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {CARDS.map(({ labelKey, valueKey, colorClass }, idx) => (
        <GlassCard
          key={valueKey}
          hover
          // Last card spans full width on mobile when count is odd (5 cards → last one)
          className={idx === CARDS.length - 1 && CARDS.length % 2 !== 0 ? "col-span-2 md:col-span-1" : ""}
        >
          <p className="text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2">
            {tCOA(lang, labelKey)}
          </p>
          <h3 className={`text-lg sm:text-xl font-bold ${colorClass}`}>
            {formatNum(summary[valueKey], lang)}
            <span className="text-gray-500 text-xs sm:text-sm font-normal ml-1">
              {tCOA(lang, "currency")}
            </span>
          </h3>
        </GlassCard>
      ))}
    </div>
  );
}
