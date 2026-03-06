// ============================================================
// TrialTable.tsx
// Column headers and totals label go through tTB().
// item.code and item.account are plain API strings — rendered directly.
// item.debit / item.credit are plain numbers — formatted with formatNum().
// ============================================================
import { motion }    from "motion/react";
import GlassCard     from "../../core/shared/components/GlassCard";
import { tTB, formatNum, dirAttr, flip }
                     from "../../core/i18n/trialBalance.i18n";
import type { TrialTableProps } from "../../core/models/TrialBalance.types";

export default function TrialTable({ lang, items, summary }: TrialTableProps) {
  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full" dir={dirAttr(lang)}>
          <thead>
            <tr className="border-b border-white/10">
              <th className={`py-4 px-4 text-gray-400 font-medium ${flip(lang, "text-left", "text-right")}`}>
                {tTB(lang, "colCode")}
              </th>
              <th className={`py-4 px-4 text-gray-400 font-medium ${flip(lang, "text-left", "text-right")}`}>
                {tTB(lang, "colAccount")}
              </th>
              <th className="py-4 px-4 text-center text-gray-400 font-medium">
                {tTB(lang, "colDebit")}
              </th>
              <th className="py-4 px-4 text-center text-gray-400 font-medium">
                {tTB(lang, "colCredit")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-500">
                  {tTB(lang, "noData")}
                </td>
              </tr>
            ) : items.map((item, index) => (
              <motion.tr
                key={item.code}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                {/* code — plain API string, always LTR (numeric codes never reverse) */}
                <td className="py-3 px-4 text-gray-400 font-mono text-sm" dir="ltr">
                  {item.code}
                </td>
                {/* account — plain API string */}
                <td className="py-3 px-4 text-white">
                  {item.account}
                </td>
                {/* debit — formatted number */}
                <td className="py-3 px-4 text-center">
                  {item.debit > 0
                    ? <span className="text-emerald-400 font-medium">{formatNum(item.debit, lang)}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
                {/* credit — formatted number */}
                <td className="py-3 px-4 text-center">
                  {item.credit > 0
                    ? <span className="text-red-400 font-medium">{formatNum(item.credit, lang)}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-white/20 bg-white/5">
              <td
                colSpan={2}
                className={`py-4 px-4 font-bold text-white text-lg ${
                  flip(lang, "text-left", "text-right")
                }`}
              >
                {tTB(lang, "totalLabel")}
              </td>
              <td className="py-4 px-4 text-center font-bold text-emerald-400 text-lg">
                {formatNum(summary.totalDebit, lang)}
              </td>
              <td className="py-4 px-4 text-center font-bold text-red-400 text-lg">
                {formatNum(summary.totalCredit, lang)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </GlassCard>
  );
}
