// ============================================================
// ContractsHeader.tsx — Summary stat cards
// ============================================================
import { motion }       from "motion/react";
import { FileText, DollarSign, Clock, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import GlassCard        from "../../core/shared/components/GlassCard";
import { tContract, dirAttr } from "../../core/i18n/contracts.i18n";
import { formatNum }    from "../../core/i18n/projects.i18n";
import type { ContractsHeaderProps } from "../../core/models/contracts.types";

export default function ContractsHeader({ stats, lang }: ContractsHeaderProps) {
  const fmt = (n: number) => formatNum(n, lang);

  const cards = [
    {
      labelKey:  "statsTotalContracts"  as const,
      value:     stats.totalContracts,
      sub:       null,
      icon:      FileText,
      color:     "text-orange-400",
      bg:        "bg-orange-500/15",
      numeric:   false,
    },
    {
      labelKey:  "statsActiveContracts" as const,
      value:     stats.activeContracts,
      sub:       null,
      icon:      CheckCircle2,
      color:     "text-emerald-400",
      bg:        "bg-emerald-500/15",
      numeric:   false,
    },
    {
      labelKey:  "statsTotalValue"      as const,
      value:     stats.totalValue,
      sub:       tContract(lang, "currency"),
      icon:      DollarSign,
      color:     "text-blue-400",
      bg:        "bg-blue-500/15",
      numeric:   true,
    },
    {
      labelKey:  "statsTotalPaid"       as const,
      value:     stats.totalPaid,
      sub:       tContract(lang, "currency"),
      icon:      TrendingUp,
      color:     "text-purple-400",
      bg:        "bg-purple-500/15",
      numeric:   true,
    },
    {
      labelKey:  "statsTotalRetention"  as const,
      value:     stats.totalRetention,
      sub:       tContract(lang, "currency"),
      icon:      Clock,
      color:     "text-yellow-400",
      bg:        "bg-yellow-500/15",
      numeric:   true,
    },
    {
      labelKey:  "statsTotalPending"    as const,
      value:     stats.totalPending,
      sub:       tContract(lang, "currency"),
      icon:      AlertCircle,
      color:     "text-red-400",
      bg:        "bg-red-500/15",
      numeric:   true,
    },
  ] as const;

  return (
    <div dir={dirAttr(lang)} className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map(({ labelKey, value, sub, icon: Icon, color, bg, numeric }, i) => (
        <motion.div
          key={labelKey}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <GlassCard hover>
            <div className="flex flex-col gap-2">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1 leading-snug">{tContract(lang, labelKey)}</p>
                <p className={`text-lg sm:text-xl font-bold text-white leading-none`}>
                  {numeric ? fmt(value) : value}
                </p>
                {sub && (
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
