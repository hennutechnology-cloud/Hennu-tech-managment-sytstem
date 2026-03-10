// ============================================================
// AiBanner.tsx
// ============================================================
import { Brain, TrendingDown } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import { tPro }  from "../../core/i18n/procurement.i18n";
import type { AiBannerProps } from "../../core/models/procurement.types";

export default function AiBanner({ lang, onCreateOrder }: AiBannerProps) {
  return (
    <GlassCard className="p-5 sm:p-6" >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 shrink-0">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
            {tPro(lang, "aiBannerTitle")}
          </h3>
          <p className="text-sm sm:text-base text-gray-300 mb-4">
            {tPro(lang, "aiBannerBody")}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingDown className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold">{tPro(lang, "potentialSaving")}</span>
            </div>

            <button
              onClick={onCreateOrder}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600
                         text-white transition-colors text-sm font-medium"
            >
              {tPro(lang, "createOrder")}
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
