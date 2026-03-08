// ============================================================
// BalanceSheetStatus.tsx — responsive
// ============================================================
import { motion, AnimatePresence }   from "motion/react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useBalanceSheet }           from "../../core/services/BalanceSheet.service";
import { tBS, sar }                  from "../../core/i18n/balanceSheet.i18n";
import { tUtil }                     from "../../core/i18n/util.i18n";
import type { Lang }                 from "../../core/models/Settings.types";

interface Props { lang: Lang; }

export default function BalanceSheetStatus({ lang }: Props) {
  const { data, loading, error } = useBalanceSheet();
  const isRtl = lang === "ar";

  const rowCls = `flex items-center gap-3 sm:gap-4 ${isRtl ? "flex-row-reverse" : ""}`;
  const textCls = isRtl ? "text-right" : "text-left";

  return (
    <AnimatePresence mode="wait">

      {/* Loading skeleton */}
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-16 sm:h-20 rounded-2xl bg-white/5 animate-pulse"
        />
      )}

      {/* Error state */}
      {!loading && error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className={`p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-2xl ${rowCls}`}
        >
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 shrink-0" />
          <p className={`text-red-300 font-medium text-sm sm:text-base ${textCls}`}>
            {tUtil(lang, "error")}
          </p>
        </motion.div>
      )}

      {/* Balanced state */}
      {!loading && data && data.assets.totalAssets === data.totalLiabilitiesAndEquity && (
        <motion.div
          key="balanced"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className={`p-4 sm:p-6
                      bg-gradient-to-br from-emerald-500/20 to-emerald-600/10
                      border border-emerald-500/30 rounded-2xl
                      ${rowCls}`}
        >
          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 shrink-0" />
          <div className={textCls}>
            <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1">
              {tBS(lang, "balanced")}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {tBS(lang, "balancedDesc")}{" "}
              <span className="text-emerald-400 font-medium">
                ({sar(data.assets.totalAssets, lang)})
              </span>
            </p>
          </div>
        </motion.div>
      )}

    </AnimatePresence>
  );
}
