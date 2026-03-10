// ============================================================
// RecommendationCards.tsx
// ============================================================
import { Brain, TrendingDown } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import { tPro }  from "../../core/i18n/procurement.i18n";
import type { RecommendationCardsProps } from "../../core/models/procurement.types";

export default function RecommendationCards({
  bestSupplier,
  savingOpportunities,
  lang,
}: RecommendationCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
      {/* Best supplier */}
      <GlassCard className="p-5 sm:p-6" >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-white">{tPro(lang, "bestSupplierTitle")}</h3>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg
                        bg-emerald-500/5 border border-emerald-500/20">
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{bestSupplier.supplierName}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{bestSupplier.reason}</p>
          </div>
          <div className="shrink-0 ms-3 text-right">
            <p className="text-sm text-emerald-500 font-semibold whitespace-nowrap">
              {lang === "ar" ? "درجة" : "Score"} {bestSupplier.aiScore}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Saving opportunities */}
      <GlassCard className="p-5 sm:p-6" >
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-white">{tPro(lang, "savingOppsTitle")}</h3>
        </div>

        <div className="space-y-2.5">
          {savingOpportunities.map((opp) => (
            <div key={opp.id} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <p className="text-xs sm:text-sm text-gray-300">{opp.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
