// ============================================================
// RecentEntries.tsx — Responsive
// ============================================================
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { RecentEntriesProps } from "../../core/models/JournalEntries.types";
import { tJE } from "../../core/i18n/journalEntries.i18n";

export default function RecentEntries({ lang, entries, onView, onDelete }: RecentEntriesProps) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{tJE(lang, "recentTitle")}</h2>
      <GlassCard>

        {/* ── MOBILE CARD VIEW (< md) ── */}
        <div className="md:hidden flex flex-col gap-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl bg-white/[0.04] border border-white/8 px-4 py-3 flex flex-col gap-3"
            >
              {/* Description + date */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-white text-sm font-medium flex-1 leading-snug">{entry.description}</p>
                <span className="text-gray-500 text-xs shrink-0">{entry.date}</span>
              </div>

              {/* Debit / Credit / Lines */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/[0.04] rounded-lg px-2 py-1.5">
                  <p className="text-[10px] text-gray-500 mb-0.5">{tJE(lang, "colTotalDebit")}</p>
                  <p className="text-xs text-white font-semibold">
                    {entry.totalDebit.toLocaleString()}
                    <span className="text-gray-500 font-normal ml-0.5 text-[10px]">{tJE(lang, "currency")}</span>
                  </p>
                </div>
                <div className="bg-white/[0.04] rounded-lg px-2 py-1.5">
                  <p className="text-[10px] text-gray-500 mb-0.5">{tJE(lang, "colTotalCredit")}</p>
                  <p className="text-xs text-white font-semibold">
                    {entry.totalCredit.toLocaleString()}
                    <span className="text-gray-500 font-normal ml-0.5 text-[10px]">{tJE(lang, "currency")}</span>
                  </p>
                </div>
                <div className="bg-white/[0.04] rounded-lg px-2 py-1.5">
                  <p className="text-[10px] text-gray-500 mb-0.5">{tJE(lang, "colLines")}</p>
                  <p className="text-xs text-gray-300 font-semibold">{entry.lines.length}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                <button
                  onClick={() => onView(entry)}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors text-xs font-medium"
                >
                  {tJE(lang, "viewBtn")}
                </button>
                <button
                  onClick={() => onDelete(entry)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TABLE VIEW (md+) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-4 px-4 text-gray-400 font-medium">{tJE(lang, "colDate")}</th>
                <th className="text-right py-4 px-4 text-gray-400 font-medium">{tJE(lang, "colDesc")}</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">{tJE(lang, "colTotalDebit")}</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">{tJE(lang, "colTotalCredit")}</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">{tJE(lang, "colLines")}</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium">{tJE(lang, "colActionsTable")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 text-white">{entry.date}</td>
                  <td className="py-4 px-4 text-white">{entry.description}</td>
                  <td className="py-4 px-4 text-center text-white">
                    {entry.totalDebit.toLocaleString()} {tJE(lang, "currency")}
                  </td>
                  <td className="py-4 px-4 text-center text-white">
                    {entry.totalCredit.toLocaleString()} {tJE(lang, "currency")}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-400">{entry.lines.length}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => onView(entry)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors text-sm"
                      >
                        {tJE(lang, "viewBtn")}
                      </button>
                      <button
                        onClick={() => onDelete(entry)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

      </GlassCard>
    </div>
  );
}
