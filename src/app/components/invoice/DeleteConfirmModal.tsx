// ============================================================
// DeleteConfirmModal.tsx  — Reusable delete confirmation
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import type { DeleteConfirmModalProps } from "../../core/models/invoice.types";

const L = {
  cancel:  { ar: "إلغاء",       en: "Cancel"  },
  confirm: { ar: "تأكيد الحذف", en: "Confirm" },
  deleting:{ ar: "جارٍ الحذف…", en: "Deleting…"},
} as const;

export default function DeleteConfirmModal({
  isOpen, title, description, lang, onClose, onConfirm,
}: DeleteConfirmModalProps) {
  const isRtl = lang === "ar";
  const [busy, setBusy] = useState(false);

  const handle = () => {
    setBusy(true);
    setTimeout(() => { onConfirm(); onClose(); setBusy(false); }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="dcm-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60]"
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="dcm-panel"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.92, y: 12  }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              dir={isRtl ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-sm bg-[#0d0f18]
                         border border-red-500/25 rounded-2xl shadow-2xl shadow-black/70 overflow-hidden"
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4
                               bg-gradient-to-r from-red-500/10 to-transparent border-b border-white/10
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/20
                                  flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </div>
                  <h2 className="text-base font-bold text-white">{title}</h2>
                </div>
                <button onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5 space-y-4">
                <div className={`flex items-start gap-3 p-4 rounded-xl
                                 bg-red-500/5 border border-red-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
                </div>
              </div>

              {/* Footer */}
              <div className={`px-5 pb-5 flex gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-white/10
                             text-gray-300 hover:bg-white/5 transition-all text-sm">
                  {L.cancel[lang]}
                </button>
                <button onClick={handle} disabled={busy}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                               bg-gradient-to-l from-red-600 to-red-700 text-white text-sm font-medium
                               hover:shadow-lg hover:shadow-red-500/25 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                  {busy
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Trash2 className="w-4 h-4" />
                  }
                  <span>{busy ? L.deleting[lang] : L.confirm[lang]}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
