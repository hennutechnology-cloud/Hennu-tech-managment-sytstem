// ============================================================
// KPICards.tsx — Responsive
// ============================================================
import { motion }          from "motion/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import GlassCard           from "../../core/shared/components/GlassCard";
import { tDash, formatNum, KPI_TITLE_KEYS } from "../../core/i18n/dashboard.i18n";
import type { KPICardsProps } from "../../core/models/dashboard.types";

export default function KPICards({ kpis, lang }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          // If there's an odd number of KPIs, let the last one span full width on mobile
          className={kpis.length % 2 !== 0 && index === kpis.length - 1 ? "col-span-2 lg:col-span-1" : ""}
        >
          <GlassCard hover>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 truncate">
                  {KPI_TITLE_KEYS[index]
                    ? tDash(lang, KPI_TITLE_KEYS[index])
                    : kpi.title}
                </p>

                <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">
                  {formatNum(kpi.value, lang)}{" "}
                  <span className="text-xs sm:text-sm text-gray-400">{tDash(lang, "currency")}</span>
                </h3>

                <div className="flex items-center gap-1 sm:gap-2">
                  {kpi.isPositive
                    ? <ArrowUpRight   className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                    : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 shrink-0" />}
                  <span className={`text-xs sm:text-sm ${kpi.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>

              <div className={`p-2.5 sm:p-3 bg-gradient-to-br ${kpi.color} rounded-xl shadow-lg shrink-0`} />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
