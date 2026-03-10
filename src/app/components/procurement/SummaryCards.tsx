// ============================================================
// SummaryCards.tsx
// ============================================================
import { ShoppingCart, Award, Clock, TrendingDown, Star } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import { tPro }  from "../../core/i18n/procurement.i18n";
import type { SummaryCardsProps } from "../../core/models/procurement.types";

export default function SummaryCards({ summary, lang }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {/* Total suppliers */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
          <p className="text-xs sm:text-sm text-gray-400 truncate">{tPro(lang, "totalSuppliers")}</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white">{summary.totalSuppliers}</p>
      </GlassCard>

      {/* Avg rating */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
          <p className="text-xs sm:text-sm text-gray-400 truncate">{tPro(lang, "avgRating")}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-2xl sm:text-3xl font-bold text-white">{summary.avgRating}</p>
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
        </div>
      </GlassCard>

      {/* Avg delivery */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
          <p className="text-xs sm:text-sm text-gray-400 truncate">{tPro(lang, "avgDelivery")}</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white">
          {summary.avgDeliveryDays}{" "}
          <span className="text-sm text-gray-400">{tPro(lang, "days")}</span>
        </p>
      </GlassCard>

      {/* Annual saving */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
          <p className="text-xs sm:text-sm text-gray-400 truncate">{tPro(lang, "annualSaving")}</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-emerald-500">
          {summary.annualSaving}%
        </p>
      </GlassCard>
    </div>
  );
}
