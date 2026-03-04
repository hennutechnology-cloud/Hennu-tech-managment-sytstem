import GlassCard from "../../core/shared/components/GlassCard";
import type { SummaryCardsProps, AccountSummary } from "../../core/models/ChartOfAccounts.types";

interface CardConfig {
  label: string;
  valueKey: keyof AccountSummary;
  colorClass: string;
}

const CARDS: CardConfig[] = [
  { label: "إجمالي الأصول",  valueKey: "totalAssets",      colorClass: "text-white"       },
  { label: "إجمالي الخصوم", valueKey: "totalLiabilities", colorClass: "text-white"       },
  { label: "حقوق الملكية",  valueKey: "equity",           colorClass: "text-white"       },
  { label: "الإيرادات",      valueKey: "revenues",         colorClass: "text-emerald-400" },
  { label: "المصروفات",      valueKey: "expenses",         colorClass: "text-red-400"     },
];

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {CARDS.map(({ label, valueKey, colorClass }) => (
        <GlassCard key={valueKey} hover>
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          <h3 className={`text-xl font-bold ${colorClass}`}>
            {summary[valueKey].toLocaleString()} ر.س
          </h3>
        </GlassCard>
      ))}
    </div>
  );
}
