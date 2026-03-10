// ============================================================
// InventorySummaryCards.tsx
// ============================================================
import { motion }         from "motion/react";
import { Package, DollarSign, AlertTriangle, XCircle, Tag } from "lucide-react";
import GlassCard          from "../../core/shared/components/GlassCard";
import { tInv }           from "../../core/i18n/inventory.i18n";
import { formatNum }      from "../../core/i18n/dashboard.i18n";
import type { InventorySummaryCardsProps } from "../../core/models/inventory.types";

export default function InventorySummaryCards({ summary, lang }: InventorySummaryCardsProps) {
  const cards = [
    {
      icon: Package,
      labelKey: "totalItems" as const,
      value: summary.totalItems.toString(),
      color: "text-blue-400",
      bg:    "bg-blue-500/10",
    },
    {
      icon: DollarSign,
      labelKey: "totalValue" as const,
      value: `${formatNum(summary.totalValue, lang)} ${tInv(lang, "currency")}`,
      color: "text-emerald-400",
      bg:    "bg-emerald-500/10",
    },
    {
      icon: AlertTriangle,
      labelKey: "lowStock" as const,
      value: summary.lowStockCount.toString(),
      color: "text-yellow-400",
      bg:    "bg-yellow-500/10",
    },
    {
      icon: XCircle,
      labelKey: "outOfStock" as const,
      value: summary.outOfStockCount.toString(),
      color: "text-red-400",
      bg:    "bg-red-500/10",
    },
    {
      icon: Tag,
      labelKey: "totalCategories" as const,
      value: summary.totalCategories.toString(),
      color: "text-purple-400",
      bg:    "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        // Last card spans 2 cols on the 2-col breakpoint (mobile) to stay centred
        const spanCls = i === 4 ? "col-span-2 sm:col-span-1" : "";
        return (
          <motion.div
            key={card.labelKey}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={spanCls}
          >
            <GlassCard className="p-4 sm:p-5" hover>
              <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 truncate">
                {tInv(lang, card.labelKey)}
              </p>
              <p className={`text-base sm:text-xl font-bold ${card.color} leading-tight`}>
                {card.value}
              </p>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
