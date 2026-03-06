// ============================================================
// BalanceStatus.tsx
// All static text goes through tTB().
// summary.totalDebit / summary.difference are plain numbers
// formatted with formatNum() — not translated.
// ============================================================
import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion }    from "motion/react";
import { tTB, tTBInterp, formatNum, dirAttr }
                     from "../../core/i18n/trialBalance.i18n";
import type { BalanceStatusProps } from "../../core/models/TrialBalance.types";

export default function BalanceStatus({ lang, summary }: BalanceStatusProps) {
  if (summary.isBalanced) {
    return (
      <motion.div
        dir={dirAttr(lang)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10
                   border border-emerald-500/30 rounded-2xl flex items-center gap-4"
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            {tTB(lang, "balancedTitle")}
          </h3>
          <p className="text-gray-300">
            {tTB(lang, "balancedBody")} —{" "}
            <span className="text-emerald-400 font-semibold">
              {formatNum(summary.totalDebit, lang)} {tTB(lang, "currency")}
            </span>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      dir={dirAttr(lang)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-gradient-to-br from-red-500/20 to-red-600/10
                 border border-red-500/30 rounded-2xl flex items-center gap-4"
    >
      <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
      <div>
        <h3 className="text-xl font-bold text-white mb-1">
          {tTB(lang, "unbalancedTitle")}
        </h3>
        <p className="text-gray-300">
          {/* interpolate the formatted number into the translated sentence */}
          {tTBInterp(lang, "unbalancedBody", {
            amount: `${formatNum(summary.difference, lang)} ${tTB(lang, "currency")}`,
          })}
        </p>
      </div>
    </motion.div>
  );
}
