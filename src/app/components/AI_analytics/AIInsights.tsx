// ============================================================
// AIInsights.tsx — responsive: mobile / tablet / desktop
// Mobile:  single column
// Tablet:  2 columns
// Desktop: 2 columns (cards are naturally tall — grid works well)
// RTL:     icon + confidence badge placement flips
// title/description are plain API strings — rendered directly.
// ============================================================
import { Brain, TrendingUp, AlertTriangle, ShoppingCart, ShieldAlert } from "lucide-react";
import { motion }    from "motion/react";
import GlassCard     from "../../core/shared/components/GlassCard";
import { tAI }       from "../../core/i18n/aiAnalytics.i18n";
import type { AIInsightsProps, AIInsight } from "../../core/models/AIAnalytics.types";
import type { Lang } from "../../core/models/Settings.types";

const ICON_MAP = {
  trending: TrendingUp,
  alert:    AlertTriangle,
  cart:     ShoppingCart,
  shield:   ShieldAlert,
} as const;

const RISK_GRADIENT: Record<string, string> = {
  high:   "from-red-500/20 to-red-600/10 border-red-500/30",
  medium: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  low:    "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
};

function InsightCard({
  insight, index, lang,
}: { insight: AIInsight; index: number; lang: Lang }) {
  const Icon  = ICON_MAP[insight.iconKey];
  const isRtl = lang === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <GlassCard className={`bg-gradient-to-br h-full p-4 sm:p-6 ${RISK_GRADIENT[insight.risk]}`}>
        <div className={`flex items-start gap-3 sm:gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>

          {/* Icon */}
          <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl shrink-0">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316]" />
          </div>

          {/* Content */}
          <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : "text-left"}`}>

            {/* Title row + confidence badge */}
            <div className={`flex items-start gap-2 mb-2 flex-wrap
                             ${isRtl ? "flex-row-reverse" : ""}`}>
              <h4 className="font-bold text-white text-sm sm:text-base leading-tight flex-1 min-w-0">
                {insight.title}
              </h4>
              <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300 shrink-0 whitespace-nowrap">
                {tAI(lang, "confidenceLabel")} {insight.confidence}%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {insight.description}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function AIInsights({ insights, lang }: AIInsightsProps) {
  const isRtl = lang === "ar";

  return (
    <div>
      {/* Section header */}
      <h2 className={`text-xl sm:text-2xl font-bold text-white mb-4
                       flex items-center gap-2
                       ${isRtl ? "flex-row-reverse" : ""}`}>
        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316] shrink-0" />
        <span>{tAI(lang, "insightsTitle")}</span>
      </h2>

      {/* Cards grid: 1 col mobile → 2 col tablet+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} index={i} lang={lang} />
        ))}
      </div>
    </div>
  );
}
