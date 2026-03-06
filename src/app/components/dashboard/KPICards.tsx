// ============================================================
// KPICards.tsx
// KPI titles are now static i18n strings — resolved by index
// via KPI_TITLE_KEYS so they switch with the language toggle.
// kpi.change is still a plain API string (e.g. "+12%").
// ============================================================
import { motion }          from "motion/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import GlassCard           from "../../core/shared/components/GlassCard";
import { tDash, formatNum, KPI_TITLE_KEYS } from "../../core/i18n/dashboard.i18n";
import type { KPICardsProps } from "../../core/models/dashboard.types";

export default function KPICards({ kpis, lang }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard hover>
            <div className="flex items-start justify-between">
              <div>
                {/*
                  Title resolves from the static i18n map by position.
                  Falls back to the raw API string if the index is out of range
                  (e.g. the API adds a new KPI before the map is updated).
                */}
                <p className="text-gray-400 text-sm mb-2">
                  {KPI_TITLE_KEYS[index]
                    ? tDash(lang, KPI_TITLE_KEYS[index])
                    : kpi.title}
                </p>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {formatNum(kpi.value, lang)}{" "}
                  <span className="text-sm text-gray-400">{tDash(lang, "currency")}</span>
                </h3>

                <div className="flex items-center gap-2">
                  {kpi.isPositive
                    ? <ArrowUpRight   className="w-4 h-4 text-emerald-400" />
                    : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                  {/* kpi.change is a plain API string e.g. "+12%" */}
                  <span className={`text-sm ${kpi.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>

              <div className={`p-3 bg-gradient-to-br ${kpi.color} rounded-xl shadow-lg`} />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
