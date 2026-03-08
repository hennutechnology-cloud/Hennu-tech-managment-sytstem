// ============================================================
// DeleteConfirm.tsx — Responsive
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X }        from "lucide-react";
import { tProj, dirAttr, flip }    from "../../core/i18n/projects.i18n";
import type { DeleteConfirmProps }  from "../../core/models/projects.types";

export default function DeleteConfirm({
  isOpen, project, lang, onConfirm, onCancel,
}: DeleteConfirmProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !project) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); }
    finally { setDeleting(false); }
  };

  const inner = (
    <div dir={dirAttr(lang)}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-red-500/20 rounded-xl">
          <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
        </div>
        <button onClick={onCancel} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white mb-2">{tProj(lang, "deleteTitle")}</h3>
      <p className="text-gray-300 text-sm mb-1">
        {tProj(lang, "deleteQuestion")}{" "}
        <span className="text-white font-semibold">"{project.name}"</span>?
      </p>
      <p className="text-red-400/80 text-xs mb-5 sm:mb-6">{tProj(lang, "deleteWarning")}</p>
      <div className={`flex gap-3 ${flip(lang, "flex-row-reverse", "flex-row")}`}>
        <button onClick={handleConfirm} disabled={deleting}
          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-60">
          {deleting ? tProj(lang, "deleting") : tProj(lang, "deleteConfirmBtn")}
        </button>
        <button onClick={onCancel}
          className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors">
          {tProj(lang, "cancel")}
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="del-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onCancel} />

          {/* Mobile: bottom sheet */}
          <motion.div key="del-mobile"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-[51] bg-[#0F172A] border-t border-red-500/30 rounded-t-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-400" />
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-white/20" /></div>
            <div className="p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{inner}</div>
          </motion.div>

          {/* sm+: centered dialog */}
          <motion.div key="del-dialog"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 16  }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="hidden sm:flex fixed inset-0 z-[51] items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-sm bg-[#0F172A] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-400" />
              <div className="p-6">{inner}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
