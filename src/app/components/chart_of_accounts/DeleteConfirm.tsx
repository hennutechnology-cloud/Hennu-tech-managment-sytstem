// ============================================================
// DeleteConfirm.tsx
// account.name and account.code are plain API strings — rendered directly.
// All dialog text goes through tCOA() / tCOAInterp().
// ============================================================
import { useState }             from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { tCOA, tCOAInterp }     from "../../core/i18n/chartOfAccounts.i18n";
import type { DeleteConfirmProps } from "../../core/models/ChartOfAccounts.types";

export default function DeleteConfirm({ isOpen, account, onConfirm, onCancel, lang }: DeleteConfirmProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); }
    finally { setDeleting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && account && (
        <>
          <motion.div key="del-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          <motion.div key="del-dialog"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.85,  y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-sm bg-[#0f1117] border border-red-500/20 rounded-2xl shadow-2xl shadow-red-900/30 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-l from-red-600 to-red-400" />
              <div className="px-6 py-7 flex flex-col items-center text-center">

                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{tCOA(lang, "deleteTitle")}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-1">{tCOA(lang, "deleteQuestion")}</p>

                {/* account.name and account.code come from the API */}
                <p className="text-base font-semibold text-white mb-1">{account.name}</p>
                <p className="text-xs font-mono text-orange-400 mb-5">[{account.code}]</p>

                {account.children?.length ? (
                  <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-5 text-xs text-amber-300 text-right">
                    {tCOAInterp(lang, "deleteWarning", { n: account.children.length })}
                  </div>
                ) : null}

                <p className="text-xs text-gray-500 mb-6">{tCOA(lang, "deleteIrreversible")}</p>

                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {tCOA(lang, "cancel")}
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-red-600 to-red-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                    {deleting ? tCOA(lang, "deleting") : tCOA(lang, "deleteConfirmBtn")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
