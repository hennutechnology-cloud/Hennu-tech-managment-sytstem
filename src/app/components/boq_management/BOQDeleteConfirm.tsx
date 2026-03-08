// ============================================================
// BOQDeleteConfirm.tsx — responsive
// ============================================================
import { useState }                 from "react";
import { motion, AnimatePresence }  from "motion/react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { tBOQMgt }                  from "../../core/i18n/boqManagement.i18n";
import type { BOQDeleteConfirmProps } from "../../core/models/BOQManagement.types";

export default function BOQDeleteConfirm({
  isOpen, item, onClose, onConfirm, lang,
}: BOQDeleteConfirmProps) {
  const [deleting, setDeleting] = useState(false);
  const isRtl = lang === "ar";

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); onClose(); }
    finally { setDeleting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="del-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Mobile: slide up from bottom; Tablet+: scale from center */}
          <motion.div
            key="del-dialog"
            // Mobile animation: slide up
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-50
                       sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* sm+ override: scale animation via inner wrapper */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              dir={isRtl ? "rtl" : "ltr"}
              className="w-full sm:max-w-md
                         bg-[#0f1117] border border-red-500/20
                         rounded-t-2xl sm:rounded-2xl
                         shadow-2xl shadow-black/60 overflow-hidden"
            >
              {/* Drag handle (mobile only) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5
                               border-b border-white/10
                               bg-gradient-to-l from-red-500/10 to-transparent`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-500/15
                                  flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {tBOQMgt(lang, "deleteTitle")}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors
                             text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-4">
                {/* Warning banner */}
                <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl
                                  bg-red-500/5 border border-red-500/20
                                  ${isRtl ? "flex-row-reverse text-right" : ""}`}>
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {tBOQMgt(lang, "deleteMessage")}
                  </p>
                </div>

                {/* Item info */}
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10
                                  ${isRtl ? "text-right" : ""}`}>
                  <p className="text-xs text-gray-500 mb-1">{tBOQMgt(lang, "colCode")}</p>
                  <p dir="ltr" className="text-sm font-mono text-gray-300">{item.code}</p>
                  <p className="text-xs text-gray-500 mt-2 mb-1">
                    {tBOQMgt(lang, "colDescription")}
                  </p>
                  <p className="text-sm text-white">{item.description}</p>
                </div>
              </div>

              {/* Footer — stacked on mobile, row on sm+ */}
              <div className={`flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end
                               gap-2 sm:gap-3
                               px-5 py-4 sm:px-6 sm:py-4
                               border-t border-white/10
                               ${isRtl ? "sm:flex-row-reverse" : ""}`}>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10
                             text-gray-300 hover:bg-white/5 transition-all text-sm"
                >
                  {tBOQMgt(lang, "cancel")}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={deleting}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl
                               bg-gradient-to-l from-red-600 to-red-700
                               text-white text-sm font-medium
                               flex items-center justify-center gap-2
                               hover:shadow-lg hover:shadow-red-500/20 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${isRtl ? "flex-row-reverse" : ""}`}
                >
                  {deleting
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Trash2 className="w-4 h-4" />
                  }
                  <span>{deleting ? tBOQMgt(lang, "deleting") : tBOQMgt(lang, "deleteConfirm")}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
