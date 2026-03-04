// ============================================================
// IncomeNoDataAlert.tsx
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X } from "lucide-react";
import type { NoDataAlertProps } from "../../core/models/IncomeStatement.types";

export default function IncomeNoDataAlert({ isOpen, onClose }: NoDataAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="inc-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            key="inc-dialog"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit  ={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-sm bg-[#0f1117] border border-amber-500/20
                            rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-l from-amber-500 to-amber-400" />
              <div className="px-6 py-7 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20
                                flex items-center justify-center mb-5">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">لا توجد بيانات</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  لا توجد بيانات لقائمة الدخل للفترة المحددة.
                  <br />يرجى اختيار فترة مالية مختلفة.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-400
                             text-white font-medium flex items-center justify-center gap-2
                             hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm"
                >
                  <X className="w-4 h-4" />
                  حسناً، فهمت
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
