// ============================================================
// AIInsights.tsx
// ============================================================
import { Brain, TrendingUp, AlertTriangle, ShoppingCart, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { AIInsightsProps, AIInsight } from "../../core/models/AIAnalytics.types";

// ── Icon map (keeps JSX components out of the service layer) ──
const ICON_MAP = {
  trending: TrendingUp,
  alert:    AlertTriangle,
  cart:     ShoppingCart,
  shield:   ShieldAlert,
} as const;

// ── Style maps (mirror the original inline riskColors object) ──
const RISK_GRADIENT: Record<string, string> = {
  high:   "from-red-500/20 to-red-600/10 border-red-500/30",
  medium: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  low:    "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
};

function InsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  const Icon = ICON_MAP[insight.iconKey];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <GlassCard className={`bg-gradient-to-br h-full ${RISK_GRADIENT[insight.risk]}`}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl flex-shrink-0">
            <Icon className="w-6 h-6 text-[#F97316]" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-white">{insight.title}</h4>
              <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 flex-shrink-0 mr-2">
                ثقة {insight.confidence}
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function AIInsights({ insights }: AIInsightsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Brain className="w-6 h-6 text-[#F97316]" />
        رؤى الذكاء الاصطناعي
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} index={i} />
        ))}
      </div>
    </div>
  );
}
