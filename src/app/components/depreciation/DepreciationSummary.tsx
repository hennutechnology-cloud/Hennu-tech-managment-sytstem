// ============================================================
// DepreciationSummary.tsx — Responsive
// ============================================================
import GlassCard           from "../../core/shared/components/GlassCard";
import { TrendingDown }    from "lucide-react";
import { useDepreciation } from "../../core/services/Depreciation.service";
import { tDep, formatNum } from "../../core/i18n/depreciation.i18n";
import type { DepreciationSummaryProps } from "../../core/models/Depreciation.types";

export default function DepreciationSummary({ lang }: DepreciationSummaryProps) {
  const { data } = useDepreciation();
  if (!data) return null;

  const { summary } = data;
  const cur = tDep(lang, "currency");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <GlassCard hover>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">
              {tDep(lang, "totalAssetValue")}
            </p>
            <h3 className="text-base sm:text-xl font-bold text-white truncate">
              {formatNum(summary.totalAssetValue, lang)}
              <span className="text-xs sm:text-sm text-gray-400 font-normal ml-1">{cur}</span>
            </h3>
          </div>
          <TrendingDown className="w-7 h-7 sm:w-10 sm:h-10 text-blue-400 shrink-0" />
        </div>
      </GlassCard>

      <GlassCard hover>
        <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">
          {tDep(lang, "totalAccumulated")}
        </p>
        <h3 className="text-base sm:text-xl font-bold text-red-400 truncate">
          {formatNum(summary.totalAccumulated, lang)}
          <span className="text-xs sm:text-sm text-gray-400 font-normal ml-1">{cur}</span>
        </h3>
      </GlassCard>

      <GlassCard hover>
        <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">
          {tDep(lang, "totalBookValue")}
        </p>
        <h3 className="text-base sm:text-xl font-bold text-emerald-400 truncate">
          {formatNum(summary.totalBookValue, lang)}
          <span className="text-xs sm:text-sm text-gray-400 font-normal ml-1">{cur}</span>
        </h3>
      </GlassCard>

      <GlassCard hover>
        <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">
          {tDep(lang, "annualDepreciation")}
        </p>
        <h3 className="text-base sm:text-xl font-bold text-[#F97316] truncate">
          {formatNum(summary.annualDepreciation, lang)}
          <span className="text-xs sm:text-sm text-gray-400 font-normal ml-1">{cur}</span>
        </h3>
      </GlassCard>
    </div>
  );
}
