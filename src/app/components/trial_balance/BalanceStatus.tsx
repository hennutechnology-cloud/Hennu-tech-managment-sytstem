// ============================================================
// BalanceStatus.tsx
// ============================================================
import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import type { BalanceStatusProps } from "../../core/models/TrialBalance.types";

export default function BalanceStatus({ summary }: BalanceStatusProps) {
  if (summary.isBalanced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10
                   border border-emerald-500/30 rounded-2xl flex items-center gap-4"
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-white mb-1">الميزان متوازن</h3>
          <p className="text-gray-300">
            مجموع الجانب المدين يساوي مجموع الجانب الدائن —{" "}
            <span className="text-emerald-400 font-semibold">
              {summary.totalDebit.toLocaleString()} ر.س
            </span>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-gradient-to-br from-red-500/20 to-red-600/10
                 border border-red-500/30 rounded-2xl flex items-center gap-4"
    >
      <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
      <div>
        <h3 className="text-xl font-bold text-white mb-1">الميزان غير متوازن</h3>
        <p className="text-gray-300">
          يوجد فرق بمقدار{" "}
          <span className="text-red-400 font-semibold">
            {summary.difference.toLocaleString()} ر.س
          </span>{" "}
          — يرجى المراجعة
        </p>
      </div>
    </motion.div>
  );
}
