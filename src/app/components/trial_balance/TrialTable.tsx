// ============================================================
// TrialTable.tsx
// ============================================================
import { motion }    from "motion/react";
import GlassCard     from "../../core/shared/components/GlassCard";
import { tTB, formatNum, dirAttr, flip }
                     from "../../core/i18n/trialBalance.i18n";
import type { TrialTableProps } from "../../core/models/TrialBalance.types";

export default function TrialTable({ lang, items, summary }: TrialTableProps) {
  return (
    <GlassCard>
      {/* ── Desktop / tablet: standard table (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
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
                <td className="py-3 px-4 text-gray-400 font-mono text-sm" dir="ltr">{item.code}</td>
                <td className="py-3 px-4 text-white">{item.account}</td>
                <td className="py-3 px-4 text-center">
                  {item.debit > 0
                    ? <span className="text-emerald-400 font-medium">{formatNum(item.debit, lang)}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
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
              <td colSpan={2} className={`py-4 px-4 font-bold text-white text-lg ${flip(lang, "text-left", "text-right")}`}>
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

      {/* ── Mobile: rich card layout (< md) ── */}
      <div className="md:hidden" dir={dirAttr(lang)}>
        {items.length === 0 ? (
          <p className="py-16 text-center text-gray-500">{tTB(lang, "noData")}</p>
        ) : (
          <ul className="flex flex-col gap-2 py-1">
            {items.map((item, index) => {
              const hasDebit  = item.debit  > 0;
              const hasCredit = item.credit > 0;

              // Border accent: emerald if debit-only, red if credit-only, amber if both
              const accentClass =
                hasDebit && hasCredit ? "border-l-amber-400"
                : hasDebit            ? "border-l-emerald-400"
                :                       "border-l-red-400";

              return (
                <motion.li
                  key={item.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025 }}
                  className={`
                    rounded-xl border border-white/8 border-l-2 ${accentClass}
                    bg-white/4 hover:bg-white/8 transition-colors px-4 py-3
                  `}
                >
                  {/* Top row: code badge + account name */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-white font-medium text-sm leading-snug flex-1">
                      {item.account}
                    </span>
                    <span
                      dir="ltr"
                      className="shrink-0 text-[10px] font-mono bg-white/8 text-gray-400
                                 px-2 py-0.5 rounded-md border border-white/10 leading-5"
                    >
                      {item.code}
                    </span>
                  </div>

                  {/* Bottom row: debit pill + credit pill */}
                  <div className="flex gap-2">
                    {/* Debit */}
                    <div className={`
                      flex-1 rounded-lg px-3 py-2 flex flex-col gap-0.5
                      ${hasDebit ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/4 border border-white/8"}
                    `}>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                        {tTB(lang, "colDebit")}
                      </span>
                      {hasDebit
                        ? <span className="text-emerald-400 font-semibold text-sm tabular-nums">
                            {formatNum(item.debit, lang)}
                          </span>
                        : <span className="text-gray-600 text-sm">—</span>}
                    </div>

                    {/* Credit */}
                    <div className={`
                      flex-1 rounded-lg px-3 py-2 flex flex-col gap-0.5
                      ${hasCredit ? "bg-red-500/10 border border-red-500/20" : "bg-white/4 border border-white/8"}
                    `}>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                        {tTB(lang, "colCredit")}
                      </span>
                      {hasCredit
                        ? <span className="text-red-400 font-semibold text-sm tabular-nums">
                            {formatNum(item.credit, lang)}
                          </span>
                        : <span className="text-gray-600 text-sm">—</span>}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}

        {/* Mobile totals footer — styled as a summary card */}
        <div className="mt-3 rounded-xl bg-white/8 border border-white/12 px-4 py-3"
             dir={dirAttr(lang)}>
          <p className={`text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ${flip(lang, "text-left", "text-right")}`}>
            {tTB(lang, "totalLabel")}
          </p>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
              <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                {tTB(lang, "colDebit")}
              </span>
              <span className="text-emerald-400 font-bold text-sm tabular-nums">
                {formatNum(summary.totalDebit, lang)}
              </span>
            </div>
            <div className="flex-1 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
              <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                {tTB(lang, "colCredit")}
              </span>
              <span className="text-red-400 font-bold text-sm tabular-nums">
                {formatNum(summary.totalCredit, lang)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
