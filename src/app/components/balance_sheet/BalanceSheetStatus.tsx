// ============================================================
// BalanceSheetStatus.tsx
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useBalanceSheet }          from "../../core/services/BalanceSheet.service";
import { tBS, formatNum, sar }      from "../../core/i18n/balanceSheet.i18n";
import { tUtil }                    from "../../core/i18n/util.i18n";
import type { Lang }                from "../../core/models/Settings.types";

interface Props { lang: Lang; }

export default function BalanceSheetStatus({ lang }: Props) {
  const { data, loading, error } = useBalanceSheet();

  return (
    <AnimatePresence mode="wait">

      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-20 rounded-2xl bg-white/5 animate-pulse"
        />
      )}

      {!loading && error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4"
        >
          <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
          <p className="text-red-300 font-medium">{tUtil(lang, "error")}</p>
        </motion.div>
      )}

      {!loading && data && data.assets.totalAssets === data.totalLiabilitiesAndEquity && (
        <motion.div
          key="balanced"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10
            border border-emerald-500/30 rounded-2xl flex items-center gap-4"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{tBS(lang, "balanced")}</h3>
            <p className="text-gray-300">
              {tBS(lang, "balancedDesc")} ({sar(data.assets.totalAssets, lang)})
            </p>
          </div>
        </motion.div>
      )}

    </AnimatePresence>
  );
}
