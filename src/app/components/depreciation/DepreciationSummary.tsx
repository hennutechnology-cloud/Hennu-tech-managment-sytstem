// ============================================================
// DepreciationSummary.tsx
// All labels through tDep(). Numbers formatted with formatNum().
// ============================================================
import GlassCard          from "../../core/shared/components/GlassCard";
import { TrendingDown }   from "lucide-react";
import { useDepreciation } from "../../core/services/Depreciation.service";
import { tDep, formatNum } from "../../core/i18n/depreciation.i18n";
import type { DepreciationSummaryProps } from "../../core/models/Depreciation.types";

export default function DepreciationSummary({ lang }: DepreciationSummaryProps) {
  const { data } = useDepreciation();
  if (!data) return null;

  const { summary } = data;
  const cur = tDep(lang, "currency");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <GlassCard hover>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{tDep(lang, "totalAssetValue")}</p>
            <h3 className="text-xl font-bold text-white">{formatNum(summary.totalAssetValue, lang)} {cur}</h3>
          </div>
          <TrendingDown className="w-10 h-10 text-blue-400" />
        </div>
      </GlassCard>

      <GlassCard hover>
        <p className="text-gray-400 text-sm mb-1">{tDep(lang, "totalAccumulated")}</p>
        <h3 className="text-xl font-bold text-red-400">{formatNum(summary.totalAccumulated, lang)} {cur}</h3>
      </GlassCard>

      <GlassCard hover>
        <p className="text-gray-400 text-sm mb-1">{tDep(lang, "totalBookValue")}</p>
        <h3 className="text-xl font-bold text-emerald-400">{formatNum(summary.totalBookValue, lang)} {cur}</h3>
      </GlassCard>

      <GlassCard hover>
        <p className="text-gray-400 text-sm mb-1">{tDep(lang, "annualDepreciation")}</p>
        <h3 className="text-xl font-bold text-[#F97316]">{formatNum(summary.annualDepreciation, lang)} {cur}</h3>
      </GlassCard>
    </div>
  );
}
