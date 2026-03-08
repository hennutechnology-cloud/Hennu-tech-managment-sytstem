// ============================================================
// AIRecommendations.tsx — responsive: mobile / tablet / desktop
// Mobile:  card content stacks vertically, button full-width below
// Tablet+: original side-by-side row layout
// RTL:     priority badge + button placement flips
// title, action, impact = plain API strings, rendered directly.
// Only priority is an enum resolved by i18n.
// ============================================================
import { Target, CheckCircle } from "lucide-react";
import { motion }              from "motion/react";
import { useState }            from "react";
import GlassCard               from "../../core/shared/components/GlassCard";
import { tAI, PRIORITY_STYLE, resolvePriority } from "../../core/i18n/aiAnalytics.i18n";
import type { AIRecommendationsProps }           from "../../core/models/AIAnalytics.types";

export default function AIRecommendations({
  recommendations, onApply, lang,
}: AIRecommendationsProps) {
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<number | null>(null);
  const isRtl = lang === "ar";

  const handleApply = async (index: number) => {
    setLoading(index);
    await onApply(index);
    setApplied((prev) => new Set(prev).add(index));
    setLoading(null);
  };

  return (
    <div>
      {/* Section title */}
      <h2 className={`text-xl sm:text-2xl font-bold text-white mb-4
                       flex items-center gap-2
                       ${isRtl ? "flex-row-reverse" : ""}`}>
        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316] shrink-0" />
        <span>{tAI(lang, "recommendationsTitle")}</span>
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {recommendations.map((rec, index) => {
          const isApplied = applied.has(index);
          const isLoading = loading === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4 sm:p-6">
                {/*
                  Mobile:  flex-col  (content above, button below)
                  Tablet+: flex-row  (content left, button right)
                  RTL:     flex-row-reverse on sm+
                */}
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4
                                 ${isRtl ? "sm:flex-row-reverse" : ""}`}>

                  {/* Content */}
                  <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : "text-left"}`}>

                    {/* Title + priority badge */}
                    <div className={`flex items-center gap-2 sm:gap-3 mb-2 flex-wrap
                                     ${isRtl ? "flex-row-reverse" : ""}`}>
                      <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {rec.title}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-lg border text-xs sm:text-sm shrink-0
                                        ${PRIORITY_STYLE[rec.priority]}`}>
                        {resolvePriority(lang, rec.priority)}
                      </span>
                    </div>

                    {/* Action description */}
                    <p className="text-xs sm:text-sm text-gray-300 mb-2 leading-relaxed">
                      {rec.action}
                    </p>

                    {/* Expected impact */}
                    <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs sm:text-sm text-gray-400">
                        {tAI(lang, "expectedImpactLabel")}
                      </span>
                      <span className="text-emerald-400 font-medium text-xs sm:text-sm">
                        {rec.impact}
                      </span>
                    </div>
                  </div>

                  {/* CTA button — full width on mobile, auto on sm+ */}
                  {isApplied ? (
                    <div className={`flex items-center justify-center gap-2
                                     px-4 sm:px-5 py-2.5 shrink-0
                                     bg-emerald-500/15 border border-emerald-500/30 rounded-xl
                                     text-emerald-400 text-sm font-medium
                                     w-full sm:w-auto
                                     ${isRtl ? "flex-row-reverse" : ""}`}>
                      <CheckCircle className="w-4 h-4" />
                      <span>{tAI(lang, "applied")}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(index)}
                      disabled={isLoading}
                      className={`flex items-center justify-center gap-2
                                  px-4 sm:px-6 py-2.5 sm:py-3 shrink-0
                                  bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white
                                  rounded-xl hover:shadow-lg hover:shadow-orange-500/30
                                  transition-all text-sm font-medium
                                  w-full sm:w-auto
                                  disabled:opacity-60 disabled:cursor-not-allowed
                                  ${isRtl ? "flex-row-reverse" : ""}`}
                    >
                      {isLoading && (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      )}
                      <span>{isLoading ? tAI(lang, "applying") : tAI(lang, "apply")}</span>
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
