// ============================================================
// SaveSuccessToast.tsx
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { t } from "../../core/i18n/settings.i18n";
import type { SaveSuccessToastProps } from "../../core/models/Settings.types";

export default function SaveSuccessToast({ isOpen, onClose, lang }: SaveSuccessToastProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]"
        >
          <div className="flex items-center gap-3 px-6 py-3.5 bg-[#0f1117] border border-emerald-500/30
                          rounded-2xl shadow-2xl shadow-emerald-900/20">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-white">{t(lang, "saveSuccess")}</p>
            <div className="w-px h-5 bg-emerald-500/40" />
            <p className="text-xs text-emerald-400">{t(lang, "allChangesSaved")}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
