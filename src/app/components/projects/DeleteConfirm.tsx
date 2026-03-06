// ============================================================
// DeleteConfirm.tsx
// project.name is a plain API string — rendered directly.
// All chrome goes through tProj().
// ============================================================
import { useState }              from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X }      from "lucide-react";
import { tProj, dirAttr, flip }  from "../../core/i18n/projects.i18n";
import type { DeleteConfirmProps } from "../../core/models/projects.types";

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            dir={dirAttr(lang)}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 16  }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-sm bg-[#0F172A] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-400" />

            <div className="p-6">
              {/* Icon + close */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <button
                  onClick={onCancel}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2">
                {tProj(lang, "deleteTitle")}
              </h3>

              {/* Question — project.name is plain API string */}
              <p className="text-gray-300 text-sm mb-1">
                {tProj(lang, "deleteQuestion")}{" "}
                <span className="text-white font-semibold">"{project.name}"</span>?
              </p>

              {/* Warning */}
              <p className="text-red-400/80 text-xs mb-6">
                {tProj(lang, "deleteWarning")}
              </p>

              {/* Actions */}
              <div className={`flex gap-3 ${flip(lang, "flex-row-reverse", "flex-row")}`}>
                <button
                  onClick={handleConfirm}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-60"
                >
                  {deleting ? tProj(lang, "deleting") : tProj(lang, "deleteConfirmBtn")}
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors"
                >
                  {tProj(lang, "cancel")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
