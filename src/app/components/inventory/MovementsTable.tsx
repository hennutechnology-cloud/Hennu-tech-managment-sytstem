// ============================================================
// MovementsTable.tsx
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { tInv, MOVEMENT_STYLES, movementLabel } from "../../core/i18n/inventory.i18n";
import { formatNum } from "../../core/i18n/dashboard.i18n";
import type { MovementsTableProps } from "../../core/models/inventory.types";

export default function MovementsTable({ movements, lang }: MovementsTableProps) {
  const isAr = lang === "ar";

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-white/10">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {tInv(lang, "tableMovementsTitle")}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]" dir={isAr ? "rtl" : "ltr"}>
          <thead>
            <tr className="border-b border-white/10">
              {(["colItem","colType","colQty","colDate","colReference","colPerformedBy"] as const).map((k) => (
                <th
                  key={k}
                  className={`px-4 sm:px-5 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap
                              ${isAr ? "text-right" : "text-left"}`}
                >
                  {tInv(lang, k)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                {/* Item name */}
                <td className="px-4 sm:px-5 py-3">
                  <p className="text-white text-sm font-medium">{m.itemName}</p>
                  {m.notes && (
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[160px]">{m.notes}</p>
                  )}
                </td>

                {/* Type badge */}
                <td className="px-4 sm:px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                                   ${MOVEMENT_STYLES[m.type]}`}>
                    {movementLabel(lang, m.type)}
                  </span>
                </td>

                {/* Quantity — signed for adjustment */}
                <td className="px-4 sm:px-5 py-3">
                  <span className={`text-sm font-semibold ${
                    m.type === "in"
                      ? "text-emerald-400"
                      : m.type === "out"
                      ? "text-red-400"
                      : "text-blue-400"
                  }`}>
                    {m.type === "in" ? "+" : m.type === "out" ? "−" : "±"}
                    {formatNum(Math.abs(m.quantity), lang)}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 sm:px-5 py-3 text-gray-400 text-sm whitespace-nowrap">{m.date}</td>

                {/* Reference */}
                <td className="px-4 sm:px-5 py-3">
                  <span className="font-mono text-xs text-orange-300">{m.reference}</span>
                </td>

                {/* Performed by */}
                <td className="px-4 sm:px-5 py-3 text-gray-300 text-sm whitespace-nowrap">
                  {m.performedBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
