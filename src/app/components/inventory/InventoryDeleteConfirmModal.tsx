// ============================================================
// InventoryDeleteConfirmModal.tsx
// ============================================================
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { tInv } from "../../core/i18n/inventory.i18n";
import type { DeleteConfirmModalProps } from "../../core/models/inventory.types";

export default function InventoryDeleteConfirmModal({
  lang, itemName, onConfirm, onCancel,
}: DeleteConfirmModalProps) {
  const isAr = lang === "ar";

  return (
    <AnimatePresence>
      <motion.div
        key="idel-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />

      <motion.div
        key="idel-panel"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1  }}
        exit={{   opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        dir={isAr ? "rtl" : "ltr"}
        className="fixed inset-0 z-[61] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-sm bg-gradient-to-b from-[#0F172A] to-[#1A2236]
                        border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden">

          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <h2 className="text-base font-bold text-white">{tInv(lang, "deleteTitle")}</h2>
            </div>
            <button onClick={onCancel} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="px-5 py-6">
            <p className={`text-sm text-gray-300 leading-relaxed ${isAr ? "text-right" : "text-left"}`}>
              {tInv(lang, "deleteBody")}{" "}
              <span className="font-semibold text-white">{itemName}</span>
              {tInv(lang, "deleteBodySuffix")}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/10">
            <button onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300
                         hover:bg-white/5 transition-colors text-sm">
              {tInv(lang, "btnCancel")}
            </button>
            <button onClick={onConfirm}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700
                         text-white transition-colors text-sm font-medium">
              {tInv(lang, "btnConfirmDelete")}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
