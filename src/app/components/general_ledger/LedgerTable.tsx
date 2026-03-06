// ============================================================
// LedgerTable.tsx
// entry.description is a plain API string — rendered directly.
// entry.date is "YYYY-MM-DD" — formatted by formatLedgerDate(lang, iso).
// accountName is pre-built by the page (code + name from API) — rendered directly.
// All labels and column headers go through tGL().
// ============================================================
import { motion }    from "motion/react";
import GlassCard     from "../../core/shared/components/GlassCard";
import { tGL, tGLInterp, formatLedgerDate, formatNum } from "../../core/i18n/generalLedger.i18n";
import type { LedgerTableProps } from "../../core/models/GeneralLedger.types";

export default function LedgerTable({
  entries, summary, accountName, filters, lang,
}: LedgerTableProps) {
  const cur = tGL(lang, "currency");

  return (
    <GlassCard>
      {/* Sub-header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          {/* accountName built from API strings — rendered directly */}
          <h2 className="text-xl font-bold text-white">{accountName}</h2>
          <p className="text-gray-400 text-sm mt-1">
            {tGLInterp(lang, "periodLabel", {
              from: formatLedgerDate(lang, filters.dateFrom),
              to:   formatLedgerDate(lang, filters.dateTo),
            })}
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs text-gray-500">{tGL(lang, "openingBalance")}</p>
            <p className="text-sm font-bold text-white">{formatNum(summary.openingBalance, lang)} {cur}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{tGL(lang, "closingBalance")}</p>
            <p className="text-sm font-bold text-orange-400">{formatNum(summary.closingBalance, lang)} {cur}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tGL(lang, "colDate")}</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tGL(lang, "colDescription")}</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium">{tGL(lang, "colDebit")}</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium">{tGL(lang, "colCredit")}</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium">{tGL(lang, "colBalance")}</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500">
                  {tGL(lang, "noEntries")}
                </td>
              </tr>
            ) : entries.map((entry, index) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                {/* entry.date formatted by formatLedgerDate */}
                <td className="py-4 px-4 text-white text-sm">{formatLedgerDate(lang, entry.date)}</td>
                {/* entry.description is a plain API string */}
                <td className="py-4 px-4 text-white">{entry.description}</td>
                <td className="py-4 px-4 text-center">
                  {entry.debit > 0
                    ? <span className="text-emerald-400 font-medium">{formatNum(entry.debit, lang)}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
                <td className="py-4 px-4 text-center">
                  {entry.credit > 0
                    ? <span className="text-red-400 font-medium">{formatNum(entry.credit, lang)}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
                <td className="py-4 px-4 text-center text-white font-medium">
                  {formatNum(entry.balance, lang)}
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-white/20 bg-white/5">
              <td colSpan={2} className="py-4 px-4 text-right font-bold text-white">
                {tGL(lang, "totals")}
              </td>
              <td className="py-4 px-4 text-center font-bold text-emerald-400">
                {formatNum(summary.totalDebit, lang)}
              </td>
              <td className="py-4 px-4 text-center font-bold text-red-400">
                {formatNum(summary.totalCredit, lang)}
              </td>
              <td className="py-4 px-4 text-center font-bold text-orange-400">
                {formatNum(summary.closingBalance, lang)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </GlassCard>
  );
}
