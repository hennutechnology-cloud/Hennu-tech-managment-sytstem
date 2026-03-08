// ============================================================
// JournalDeleteConfirm.tsx — Responsive
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import type { DeleteConfirmProps }  from "../../core/models/JournalEntries.types";
import { tJE, tJEInterp }          from "../../core/i18n/journalEntries.i18n";

export default function JournalDeleteConfirm({ lang, isOpen, entry, onConfirm, onCancel }: DeleteConfirmProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); }
    finally { setDeleting(false); }
  };

  // Shared inner content
  const inner = entry && (
    <>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 sm:mb-5">
        <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white mb-2">{tJE(lang, "deleteTitle")}</h3>
      <p className="text-sm text-gray-400 mb-1">{tJE(lang, "deleteQuestion")}</p>
      <p className="text-base font-semibold text-white mb-1 px-2">{entry.description}</p>
      <p className="text-xs font-mono text-orange-400 mb-2">{entry.date}</p>
      <p className="text-xs text-gray-500 mb-2">
        {entry.totalDebit.toLocaleString()} {tJE(lang, "currency")} —{" "}
        {tJEInterp(lang, "linesCount", { n: entry.lines.length })}
      </p>
      <p className="text-xs text-gray-500 mb-5 sm:mb-6">{tJE(lang, "deleteIrreversible")}</p>
      <div className="flex items-center gap-3 w-full">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2">
          <X className="w-4 h-4" /> {tJE(lang, "cancel")}
        </button>
        <button onClick={handleConfirm} disabled={deleting}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-red-600 to-red-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {deleting
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Trash2 className="w-4 h-4" />}
          {deleting ? tJE(lang, "deleting") : tJE(lang, "deleteConfirmBtn")}
        </button>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && entry && (
        <>
          <motion.div key="jdel-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]" />

          {/* Mobile: bottom sheet */}
          <motion.div key="jdel-mobile"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-[61] bg-[#0f1117] border-t border-red-500/20 rounded-t-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-l from-red-600 to-red-400" />
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-white/20" /></div>
            <div className="px-5 py-5 flex flex-col items-center text-center pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {inner}
            </div>
          </motion.div>

          {/* sm+: centered dialog */}
          <motion.div key="jdel-dialog"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.85, y: 16  }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="hidden sm:flex fixed inset-0 z-[61] items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-sm bg-[#0f1117] border border-red-500/20 rounded-2xl shadow-2xl shadow-red-900/30 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-l from-red-600 to-red-400" />
              <div className="px-6 py-7 flex flex-col items-center text-center">{inner}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
