// ============================================================
// RecentEntries.tsx
// ============================================================
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { RecentEntriesProps } from "../../core/models/JournalEntries.types";
import { tJE } from "../../core/i18n/journalEntries.i18n";

export default function RecentEntries({ lang, entries, onView, onDelete }: RecentEntriesProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">{tJE(lang, "recentTitle")}</h2>
      <GlassCard>
        <div className="overflow-x-auto">
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
