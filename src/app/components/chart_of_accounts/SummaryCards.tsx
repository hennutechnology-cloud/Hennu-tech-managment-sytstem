// ============================================================
// SummaryCards.tsx
// ============================================================
import GlassCard  from "../../core/shared/components/GlassCard";
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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {CARDS.map(({ labelKey, valueKey, colorClass }) => (
        <GlassCard key={valueKey} hover>
          <p className="text-gray-400 text-sm mb-2">{tCOA(lang, labelKey)}</p>
          <h3 className={`text-xl font-bold ${colorClass}`}>
            {formatNum(summary[valueKey], lang)} {tCOA(lang, "currency")}
          </h3>
        </GlassCard>
      ))}
    </div>
  );
}
