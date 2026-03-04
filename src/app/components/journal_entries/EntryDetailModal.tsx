// ============================================================
// EntryDetailModal.tsx
// View-only modal with Edit + Delete actions
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { X, Edit2, Trash2, CheckCircle2, AlertCircle, Calendar, Hash } from "lucide-react";
import type { EntryDetailModalProps } from "../../core/models/JournalEntries.types";
import { ACCOUNT_OPTIONS } from "../../core/models/JournalEntries.types";

function accountName(code: string) {
  return ACCOUNT_OPTIONS.find((a) => a.code === code)?.name ?? code;
}

export default function EntryDetailModal({
  isOpen, entry, onClose, onEdit, onDelete,
}: EntryDetailModalProps) {
  if (!entry) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="detail-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            key="detail-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white">تفاصيل القيد</h2>
                  <p className="text-xs text-gray-400 mt-0.5">قيد رقم #{entry.id}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 overflow-y-auto space-y-5 flex-1">

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">التاريخ</p>
                      <p className="text-sm text-white font-medium">{entry.date}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Hash className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">عدد الأسطر</p>
                      <p className="text-sm text-white font-medium">{entry.lines.length} سطر</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">البيان</p>
                  <p className="text-sm text-white">{entry.description}</p>
                </div>

                {/* Lines table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-right py-3 px-3 text-gray-400 text-xs">الحساب</th>
                        <th className="text-right py-3 px-3 text-gray-400 text-xs">البيان</th>
                        <th className="text-center py-3 px-3 text-gray-400 text-xs">مدين</th>
                        <th className="text-center py-3 px-3 text-gray-400 text-xs">دائن</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.lines.map((line) => (
                        <tr key={line.id} className="border-b border-white/5">
                          <td className="py-3 px-3">
                            <div>
                              <span className="text-xs font-mono text-orange-400">{line.accountCode}</span>
                              <p className="text-sm text-white">{accountName(line.accountCode)}</p>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-sm text-gray-300">{line.description || "—"}</td>
                          <td className="py-3 px-3 text-center text-sm text-white">
                            {line.debit > 0 ? line.debit.toLocaleString() : "—"}
                          </td>
                          <td className="py-3 px-3 text-center text-sm text-white">
                            {line.credit > 0 ? line.credit.toLocaleString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-white/20">
                        <td colSpan={2} className="py-3 px-3 text-sm text-gray-400">الإجمالي</td>
                        <td className="py-3 px-3 text-center font-bold text-white">{entry.totalDebit.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center font-bold text-white">{entry.totalCredit.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Balance badge */}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${entry.isBalanced ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                  {entry.isBalanced
                    ? <><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span className="text-sm text-emerald-400 font-medium">القيد متوازن</span></>
                    : <><AlertCircle  className="w-5 h-5 text-red-400"     /><span className="text-sm text-red-400     font-medium">القيد غير متوازن</span></>}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 shrink-0">
                <button
                  onClick={() => onDelete(entry)}
                  className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
                <button
                  onClick={() => onEdit(entry)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  تعديل
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
