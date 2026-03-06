// ============================================================
// TrialNoDataAlert.tsx
// All static text goes through tTB(). No hardcoded strings.
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X }  from "lucide-react";
import { tTB, dirAttr }    from "../../core/i18n/trialBalance.i18n";
import type { NoDataAlertProps } from "../../core/models/TrialBalance.types";

export default function TrialNoDataAlert({ lang, isOpen, onClose }: NoDataAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="tb-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            key="tb-dialog"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit  ={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              dir={dirAttr(lang)}
              className="w-full max-w-sm bg-[#0f1117] border border-amber-500/20
                         rounded-2xl shadow-2xl shadow-amber-900/20 overflow-hidden"
            >
              <div className="h-1 w-full bg-gradient-to-l from-amber-500 to-amber-400" />
              <div className="px-6 py-7 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20
                                flex items-center justify-center mb-5">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {tTB(lang, "alertTitle")}
                </h3>

                {/* Split on \n to render the two lines */}
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {tTB(lang, "alertBody").split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </p>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-400
                             text-white font-medium flex items-center justify-center gap-2
                             hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm"
                >
                  <X className="w-4 h-4" />
                  {tTB(lang, "alertClose")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
