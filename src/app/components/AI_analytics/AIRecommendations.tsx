// ============================================================
// AIRecommendations.tsx
// ============================================================
import { Target, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import GlassCard from "../../core/shared/components/GlassCard";
import type {
  AIRecommendationsProps,
  RecommendationPriority,
} from "../../core/models/AIAnalytics.types";

// Mirrors the original priorityColors object exactly
const PRIORITY_STYLE: Record<RecommendationPriority, string> = {
  عالية:  "bg-red-500/20    text-red-400    border border-red-500/30",
  متوسطة: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  منخفضة: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};

export default function AIRecommendations({ recommendations, onApply }: AIRecommendationsProps) {
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<number | null>(null);

  const handleApply = async (index: number) => {
    setLoading(index);
    await onApply(index);
    setApplied((prev) => new Set(prev).add(index));
    setLoading(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Target className="w-6 h-6 text-[#F97316]" />
        التوصيات الذكية
      </h2>
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isApplied = applied.has(index);
          const isLoading = loading === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4 className="text-lg font-bold text-white">{rec.title}</h4>
                      <span className={`px-3 py-1 rounded-lg border text-sm ${PRIORITY_STYLE[rec.priority]}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2 text-sm leading-relaxed">{rec.action}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">التأثير المتوقع:</span>
                      <span className="text-emerald-400 font-medium">{rec.impact}</span>
                    </div>
                  </div>

                  {isApplied ? (
                    <div className="flex items-center gap-2 px-5 py-2.5 flex-shrink-0
                                    bg-emerald-500/15 border border-emerald-500/30 rounded-xl
                                    text-emerald-400 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      تم التطبيق
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(index)}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white
                                 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all
                                 flex items-center gap-2 flex-shrink-0
                                 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading && (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                         rounded-full animate-spin" />
                      )}
                      {isLoading ? "جارٍ التطبيق…" : "تطبيق"}
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
