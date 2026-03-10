// ============================================================
// DeleteConfirm.tsx — Delete confirmation dialog
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, AlertTriangle }   from "lucide-react";
import { tProj, dirAttr, flip }    from "../../core/i18n/projects.i18n";
import type { DeleteConfirmProps }  from "../../core/models/projects.types";

export default function DeleteConfirm({ isOpen, project, lang, onConfirm, onCancel }: DeleteConfirmProps) {
  const [confirming, setConfirming] = useState(false);
  const t   = (k: any) => tProj(lang, k);
  const dir = dirAttr(lang);

  const handleConfirm = async () => {
    setConfirming(true);
    try { await onConfirm(); }
    finally { setConfirming(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="dc-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          <motion.div key="dc-dialog" dir={dir}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-sm bg-[#0f1117] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-400" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{t("deleteProject")}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{t("deleteWarning")}</p>
                  </div>
                </div>
                {project && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                    <p className="text-sm text-white font-medium">{project.name}</p>
                  </div>
                )}
                <p className="text-sm text-gray-400">{t("deleteConfirm")}</p>
                <div className={`flex gap-3 ${flip(lang, "justify-end", "justify-start")}`}>
                  <button onClick={onCancel}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition-all">
                    {t("cancel")}
                  </button>
                  <button onClick={handleConfirm} disabled={confirming}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {confirming
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                    {t("delete")}
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
