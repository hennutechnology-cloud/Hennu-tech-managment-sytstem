// ============================================================
// NoDataAlert.tsx — Responsive
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X }          from "lucide-react";
import { tGL }                     from "../../core/i18n/generalLedger.i18n";
import type { NoDataAlertProps }   from "../../core/models/GeneralLedger.types";

export default function NoDataAlert({ isOpen, onClose, lang }: NoDataAlertProps) {
  const innerContent = (
    <>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/10 border border-amber-500/20
                      flex items-center justify-center mb-4 sm:mb-5">
        <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white mb-2">{tGL(lang, "noDataTitle")}</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-5 sm:mb-6 whitespace-pre-line">
        {tGL(lang, "noDataBody")}
      </p>
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-amber-400
                   text-white font-medium flex items-center justify-center gap-2
                   hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm"
      >
        <X className="w-4 h-4" />
        {tGL(lang, "noDataOk")}
      </button>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="nodata-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

          {/* Mobile: bottom sheet */}
          <motion.div key="nodata-mobile"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-[51] bg-[#0f1117] border-t border-amber-500/20
                       rounded-t-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-l from-amber-500 to-amber-400" />
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="px-5 py-5 flex flex-col items-center text-center
                            pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {innerContent}
            </div>
          </motion.div>

          {/* sm+: centered dialog */}
          <motion.div key="nodata-dialog"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit   ={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="hidden sm:flex fixed inset-0 z-[51] items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-sm bg-[#0f1117] border border-amber-500/20
                            rounded-2xl shadow-2xl shadow-amber-900/20 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-l from-amber-500 to-amber-400" />
              <div className="px-6 py-7 flex flex-col items-center text-center">
                {innerContent}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
