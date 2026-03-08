// ============================================================
// BOQComparisonTable.tsx
// Horizontally scrollable comparison table.
// Dynamic supplier columns — built from items[0].suppliers.
// Best supplier cell is highlighted in emerald.
// ============================================================
import { Brain } from "lucide-react";
import GlassCard             from "../../core/shared/components/GlassCard";
import { tBOQ, formatNum, formatCurrency, priceDelta }
                             from "../../core/i18n/boqComparison.i18n";
import type { BOQComparisonTableProps } from "../../core/models/BOQComparison.types";

export default function BOQComparisonTable({
  items, onAIOptimise, lang,
}: BOQComparisonTableProps) {
  if (!items.length) return null;

  const isRtl       = lang === "ar";
  const thAlign     = isRtl ? "text-right" : "text-left";
  const supplierCols = items[0].suppliers;   // derive columns from first row

  return (
    <GlassCard className="overflow-hidden">
      {/* Table header row */}
      <div className={`p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row
                       sm:items-center gap-3 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
        <h3 className={`text-base sm:text-lg font-semibold text-white flex-1 ${thAlign}`}>
          {tBOQ(lang, "tableTitle")}
        </h3>
        <button
          onClick={onAIOptimise}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500
                     hover:bg-orange-600 text-white text-sm transition-colors w-fit
                     ${isRtl ? "flex-row-reverse self-end sm:self-auto" : ""}`}
        >
          <Brain className="w-4 h-4" />
          <span>{tBOQ(lang, "aiOptimiseBtn")}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]" dir={isRtl ? "rtl" : "ltr"}>
          <thead>
            <tr className="border-b border-white/10">
              <th className={`${thAlign} px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-400 whitespace-nowrap`}>
                {tBOQ(lang, "colItem")}
              </th>
              <th className={`${thAlign} px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-400 whitespace-nowrap`}>
                {tBOQ(lang, "colQuantity")}
              </th>
              <th className={`${thAlign} px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-400 whitespace-nowrap`}>
                {tBOQ(lang, "colEstimated")}
              </th>
              {supplierCols.map((s) => (
                <th key={s.id} className={`${thAlign} px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-400 whitespace-nowrap`}>
                  {s.name}
                </th>
              ))}
              <th className={`${thAlign} px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-400 whitespace-nowrap`}>
                {tBOQ(lang, "colSavings")}
              </th>
              <th className={`${thAlign} px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-400 whitespace-nowrap`}>
                {tBOQ(lang, "colRecommendation")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const bestSupplier = item.suppliers.find((s) => s.id === item.bestSupplierId);

              return (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {/* Item name */}
                  <td className="px-4 sm:px-6 py-4 text-sm text-white font-medium">
                    {item.item}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    {item.quantity}
                  </td>

                  {/* Estimated */}
                  <td className="px-4 sm:px-6 py-4 text-sm text-white whitespace-nowrap">
                    {formatNum(item.estimated, lang)} {tBOQ(lang, "currency")}
                  </td>

                  {/* Supplier columns */}
                  {item.suppliers.map((s) => {
                    const isBest  = s.id === item.bestSupplierId;
                    const delta   = priceDelta(s.unitPrice, item.estimated);
                    const isAbove = delta > 0;

                    return (
                      <td
                        key={s.id}
                        className={`px-4 sm:px-6 py-4 text-sm whitespace-nowrap ${
                          isBest ? "text-emerald-500 font-semibold" : "text-gray-300"
                        }`}
                      >
                        {formatNum(s.unitPrice, lang)} {tBOQ(lang, "currency")}
                        {/* Delta badge */}
                        <span
                          className={`text-xs ${isRtl ? "mr-1" : "ml-1"} ${
                            isAbove ? "text-red-400" : "text-emerald-400"
                          }`}
                        >
                          {isAbove ? "+" : ""}{delta.toFixed(1)}%
                        </span>
                      </td>
                    );
                  })}

                  {/* Savings */}
                  <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                    <span className="text-emerald-500 font-semibold">
                      {formatCurrency(item.savings, lang)}
                    </span>
                  </td>

                  {/* Recommendation pill */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1
                                    rounded-full bg-emerald-500/10 text-emerald-400
                                    border border-emerald-500/30`}>
                      <Brain className="w-3 h-3 shrink-0" />
                      <span className="text-xs whitespace-nowrap">
                        {bestSupplier?.name ?? "—"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
