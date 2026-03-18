// ============================================================
// CategoryDeleteConfirm.tsx
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { tCat, getColorOption }    from "../../core/i18n/category.i18n";
import type { CategoryDeleteConfirmProps } from "../../core/models/category.types";

export default function CategoryDeleteConfirm({
  isOpen, category, lang, onClose, onConfirm,
}: CategoryDeleteConfirmProps) {
  const isRtl    = lang === "ar";
  const [del, setDel] = useState(false);

  const handleConfirm = () => {
    setDel(true);
    setTimeout(() => { onConfirm(); onClose(); setDel(false); }, 400);
  };

  const color = category ? getColorOption(category.color) : getColorOption("orange");

  return (
    <AnimatePresence>
      {isOpen && category && (
        <>
          <motion.div key="del-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <motion.div
              key="del-modal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              dir={isRtl ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full sm:max-w-md
                         bg-[#0d0f18] border border-red-500/20
                         rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/70"
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 sm:px-6
                               border-b border-white/10
                               bg-gradient-to-r from-red-500/10 to-transparent
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/20
                                  flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">{tCat(lang, "deleteTitle")}</h2>
                </div>
                <button onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5 sm:px-6 space-y-4">

                {/* Warning */}
                <div className={`flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">{tCat(lang, "deleteMsg")}</p>
                </div>

                {/* Category preview */}
                <div className={`flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0
                                   ${color.bg} border ${color.border}`}>
                    {category.icon}
                  </div>
                  <div className={`min-w-0 ${isRtl ? "text-right" : "text-left"}`}>
                    <p className="text-sm font-semibold text-white">{category.name}</p>
                    <p className="text-xs text-gray-400">{category.nameEn}</p>
                  </div>
                  {category.usageCount > 0 && (
                    <div className="ml-auto mr-0 shrink-0 text-right">
                      <p className="text-xs text-orange-400 font-semibold">{category.usageCount}</p>
                      <p className="text-[10px] text-gray-500">{tCat(lang, "usageCount")}</p>
                    </div>
                  )}
                </div>

                {/* Usage warning */}
                {category.usageCount > 0 && (
                  <div className={`px-4 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 ${isRtl ? "text-right" : "text-left"}`}>
                    <p className="text-xs text-amber-400">
                      {tCat(lang, "deleteHasItems")}{" "}
                      <span className="font-bold">{category.usageCount}</span>{" "}
                      {tCat(lang, "deleteHasItems2")}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`px-5 py-4 sm:px-6 border-t border-white/10
                               flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3
                               ${isRtl ? "sm:flex-row-reverse" : ""}`}>
                <button onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10
                             text-gray-300 hover:bg-white/5 transition-all text-sm">
                  {tCat(lang, "cancel")}
                </button>
                <button onClick={handleConfirm} disabled={del}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl
                               bg-gradient-to-l from-red-600 to-red-700
                               text-white text-sm font-medium
                               flex items-center justify-center gap-2
                               hover:shadow-lg hover:shadow-red-500/25 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                  {del
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Trash2 className="w-4 h-4" />
                  }
                  <span>{del ? tCat(lang, "deleting") : tCat(lang, "confirmDelete")}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
