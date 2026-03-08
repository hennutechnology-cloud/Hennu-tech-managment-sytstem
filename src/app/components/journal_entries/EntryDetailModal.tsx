// ============================================================
// EntryDetailModal.tsx — Responsive
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { X, Edit2, Trash2, CheckCircle2, AlertCircle, Calendar, Hash } from "lucide-react";
import type { EntryDetailModalProps } from "../../core/models/JournalEntries.types";
import { ACCOUNT_OPTIONS } from "../../core/models/JournalEntries.types";
import { tJE, tJEInterp } from "../../core/i18n/journalEntries.i18n";

function accountName(code: string) {
  return ACCOUNT_OPTIONS.find((a) => a.code === code)?.name ?? code;
}

export default function EntryDetailModal({
  lang, isOpen, entry, onClose, onEdit, onDelete,
}: EntryDetailModalProps) {
  if (!entry) return null;

  // ── Shared body ────────────────────────────────────────────
  const body = (
    <div className="space-y-4">
      {/* Meta */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
          <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{tJE(lang, "metaDate")}</p>
            <p className="text-xs sm:text-sm text-white font-medium">{entry.date}</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
          <Hash className="w-4 h-4 text-orange-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{tJE(lang, "metaLines")}</p>
            <p className="text-xs sm:text-sm text-white font-medium">
              {tJEInterp(lang, "linesCount", { n: entry.lines.length })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl px-4 py-3">
        <p className="text-xs text-gray-500 mb-1">{tJE(lang, "metaDescription")}</p>
        <p className="text-sm text-white">{entry.description}</p>
      </div>

      {/* Lines — mobile cards */}
      <div className="sm:hidden flex flex-col gap-2">
        {entry.lines.map((line) => (
          <div key={line.id} className="rounded-xl bg-white/[0.04] border border-white/8 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-orange-400">{line.accountCode}</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs text-white">{accountName(line.accountCode)}</span>
            </div>
            {line.description && <p className="text-xs text-gray-400">{line.description}</p>}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white/[0.04] rounded px-2 py-1">
                <p className="text-[10px] text-gray-500">{tJE(lang, "colDebit")}</p>
                <p className="text-xs font-semibold text-white">
                  {line.debit > 0 ? line.debit.toLocaleString() : "—"}
                </p>
              </div>
              <div className="bg-white/[0.04] rounded px-2 py-1">
                <p className="text-[10px] text-gray-500">{tJE(lang, "colCredit")}</p>
                <p className="text-xs font-semibold text-white">
                  {line.credit > 0 ? line.credit.toLocaleString() : "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Mobile totals */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/[0.06] rounded-lg px-3 py-2 text-center">
            <p className="text-[10px] text-gray-500">{tJE(lang, "total")} — {tJE(lang, "colDebit")}</p>
            <p className="text-sm font-bold text-white">{entry.totalDebit.toLocaleString()}</p>
          </div>
          <div className="bg-white/[0.06] rounded-lg px-3 py-2 text-center">
            <p className="text-[10px] text-gray-500">{tJE(lang, "total")} — {tJE(lang, "colCredit")}</p>
            <p className="text-sm font-bold text-white">{entry.totalCredit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Lines — sm+ table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-3 px-3 text-gray-400 text-xs">{tJE(lang, "colAccount")}</th>
              <th className="text-right py-3 px-3 text-gray-400 text-xs">{tJE(lang, "colLineDesc")}</th>
              <th className="text-center py-3 px-3 text-gray-400 text-xs">{tJE(lang, "colDebit")}</th>
              <th className="text-center py-3 px-3 text-gray-400 text-xs">{tJE(lang, "colCredit")}</th>
            </tr>
          </thead>
          <tbody>
            {entry.lines.map((line) => (
              <tr key={line.id} className="border-b border-white/5">
                <td className="py-3 px-3">
                  <span className="text-xs font-mono text-orange-400">{line.accountCode}</span>
                  <p className="text-sm text-white">{accountName(line.accountCode)}</p>
                </td>
                <td className="py-3 px-3 text-sm text-gray-300">{line.description || "—"}</td>
                <td className="py-3 px-3 text-center text-sm text-white">
                  {line.debit  > 0 ? line.debit.toLocaleString()  : "—"}
                </td>
                <td className="py-3 px-3 text-center text-sm text-white">
                  {line.credit > 0 ? line.credit.toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-white/20">
              <td colSpan={2} className="py-3 px-3 text-sm text-gray-400">{tJE(lang, "total")}</td>
              <td className="py-3 px-3 text-center font-bold text-white">{entry.totalDebit.toLocaleString()}</td>
              <td className="py-3 px-3 text-center font-bold text-white">{entry.totalCredit.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Balance badge */}
      <div className={`flex items-center gap-3 p-3 rounded-xl ${
        entry.isBalanced
          ? "bg-emerald-500/10 border border-emerald-500/20"
          : "bg-red-500/10 border border-red-500/20"
      }`}>
        {entry.isBalanced
          ? <><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span className="text-sm text-emerald-400 font-medium">{tJE(lang, "isBalanced")}</span></>
          : <><AlertCircle  className="w-5 h-5 text-red-400"     /><span className="text-sm text-red-400 font-medium">{tJE(lang, "isNotBalanced")}</span></>}
      </div>
    </div>
  );

  // ── Shared footer ──────────────────────────────────────────
  const footer = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onDelete(entry)}
        className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" />{tJE(lang, "deleteBtn")}
      </button>
      <button
        onClick={() => onEdit(entry)}
        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
      >
        <Edit2 className="w-4 h-4" />{tJE(lang, "editBtn")}
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="detail-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

          {/* Mobile: bottom sheet */}
          <motion.div key="detail-mobile"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-[#0f1117] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[92dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
              <div>
                <h2 className="text-base font-bold text-white">{tJE(lang, "detailTitle")}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{tJEInterp(lang, "entryNo", { id: entry.id })}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">{body}</div>
            <div className="px-5 py-4 border-t border-white/10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          </motion.div>

          {/* sm+: centered dialog */}
          <motion.div key="detail-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 20  }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white">{tJE(lang, "detailTitle")}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{tJEInterp(lang, "entryNo", { id: entry.id })}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5 overflow-y-auto space-y-5 flex-1">{body}</div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 shrink-0">{footer}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
