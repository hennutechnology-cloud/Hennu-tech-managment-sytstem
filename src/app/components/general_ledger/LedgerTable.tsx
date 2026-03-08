// ============================================================
// LedgerTable.tsx — Responsive
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-white">{accountName}</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {tGLInterp(lang, "periodLabel", {
              from: formatLedgerDate(lang, filters.dateFrom),
              to:   formatLedgerDate(lang, filters.dateTo),
            })}
          </p>
        </div>

        {/* Opening / closing balances */}
        <div className="flex gap-4 sm:gap-6 sm:text-right">
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

      {/* ── MOBILE CARD VIEW (< md) ── */}
      <div className="md:hidden">
        {entries.length === 0 ? (
          <p className="py-10 text-center text-gray-500 text-sm">{tGL(lang, "noEntries")}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-xl bg-white/[0.04] border border-white/8 px-4 py-3 flex flex-col gap-2"
              >
                {/* Date + description */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white text-sm font-medium flex-1 leading-snug">{entry.description}</p>
                  <p className="text-gray-500 text-xs shrink-0">{formatLedgerDate(lang, entry.date)}</p>
                </div>

                {/* Debit / Credit / Balance */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/[0.04] rounded-lg px-2 py-1.5">
                    <p className="text-[10px] text-gray-500 mb-0.5">{tGL(lang, "colDebit")}</p>
                    {entry.debit > 0
                      ? <p className="text-xs text-emerald-400 font-semibold">{formatNum(entry.debit, lang)}</p>
                      : <p className="text-xs text-gray-600">—</p>}
                  </div>
                  <div className="bg-white/[0.04] rounded-lg px-2 py-1.5">
                    <p className="text-[10px] text-gray-500 mb-0.5">{tGL(lang, "colCredit")}</p>
                    {entry.credit > 0
                      ? <p className="text-xs text-red-400 font-semibold">{formatNum(entry.credit, lang)}</p>
                      : <p className="text-xs text-gray-600">—</p>}
                  </div>
                  <div className="bg-white/[0.04] rounded-lg px-2 py-1.5">
                    <p className="text-[10px] text-gray-500 mb-0.5">{tGL(lang, "colBalance")}</p>
                    <p className="text-xs text-white font-semibold">{formatNum(entry.balance, lang)}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Mobile totals summary */}
            <div className="mt-2 rounded-xl bg-white/[0.06] border border-white/15 px-4 py-3 grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5">{tGL(lang, "totals")} — {tGL(lang, "colDebit")}</p>
                <p className="text-xs text-emerald-400 font-bold">{formatNum(summary.totalDebit, lang)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5">{tGL(lang, "colCredit")}</p>
                <p className="text-xs text-red-400 font-bold">{formatNum(summary.totalCredit, lang)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5">{tGL(lang, "colBalance")}</p>
                <p className="text-xs text-orange-400 font-bold">{formatNum(summary.closingBalance, lang)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── TABLE VIEW (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
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
                <td className="py-4 px-4 text-white text-sm">{formatLedgerDate(lang, entry.date)}</td>
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
