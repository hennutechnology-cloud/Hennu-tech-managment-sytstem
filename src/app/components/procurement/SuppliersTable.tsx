// ============================================================
// SuppliersTable.tsx
// ============================================================
import { Star, Brain, Pencil, Trash2 } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import { tPro, AI_SCORE_COLORS, aiScoreTier } from "../../core/i18n/procurement.i18n";
import type { SuppliersTableProps }           from "../../core/models/procurement.types";

export default function SuppliersTable({ suppliers, lang, onEdit, onDelete }: SuppliersTableProps) {
  const isAr = lang === "ar";

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-white/10">
        <h3 className="text-base sm:text-lg font-semibold text-white">{tPro(lang, "tableTitle")}</h3>
      </div>

      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]" dir={isAr ? "rtl" : "ltr"}>
          <thead>
            <tr className="border-b border-white/10">
              {[
                "colName", "colAvgPrice", "colDelivery",
                "colRating", "colOnTime", "colAiScore",
                "colCategory", "colActions",
              ].map((key) => (
                <th
                  key={key}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-400
                              ${isAr ? "text-right" : "text-left"}`}
                >
                  {tPro(lang, key as any)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                {/* Name */}
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">{supplier.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {supplier.totalOrders} {tPro(lang, "orders")}
                    </p>
                  </div>
                </td>

                {/* Avg price */}
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-white text-sm sm:text-base whitespace-nowrap">
                  {new Intl.NumberFormat(isAr ? "ar-SA" : "en-US").format(supplier.avgPrice)}{" "}
                  {tPro(lang, "currency")}
                </td>

                {/* Delivery */}
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-white text-sm sm:text-base whitespace-nowrap">
                  {supplier.deliveryTime} {tPro(lang, "days")}
                </td>

                {/* Rating */}
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                    <span className="text-white font-semibold text-sm">{supplier.performanceRating}</span>
                  </div>
                </td>

                {/* On-time progress */}
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 sm:w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${supplier.onTimeDelivery}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-white shrink-0">{supplier.onTimeDelivery}%</span>
                  </div>
                </td>

                {/* AI Score badge */}
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm
                                  ${AI_SCORE_COLORS[aiScoreTier(supplier.aiScore)]}`}>
                    <Brain className="w-3 h-3 shrink-0" />
                    <span className="font-semibold">{supplier.aiScore}</span>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-white/5 text-gray-300 whitespace-nowrap">
                    {supplier.category}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(supplier)}
                      title={tPro(lang, "btnEdit")}
                      className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(supplier)}
                      title={tPro(lang, "btnDelete")}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
