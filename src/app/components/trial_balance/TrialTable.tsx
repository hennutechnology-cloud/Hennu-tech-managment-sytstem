// ============================================================
// TrialTable.tsx
// ============================================================
import { motion } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { TrialTableProps } from "../../core/models/TrialBalance.types";

export default function TrialTable({ items, summary }: TrialTableProps) {
  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-4 px-4 text-gray-400 font-medium">رمز الحساب</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">اسم الحساب</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium">مدين</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium">دائن</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-500">
                  لا توجد بيانات في هذه الفترة
                </td>
              </tr>
            ) : items.map((item, index) => (
              <motion.tr
                key={item.code}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4 text-gray-400 font-mono text-sm">{item.code}</td>
                <td className="py-3 px-4 text-white">{item.account}</td>
                <td className="py-3 px-4 text-center">
                  {item.debit > 0
                    ? <span className="text-emerald-400 font-medium">{item.debit.toLocaleString()}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.credit > 0
                    ? <span className="text-red-400 font-medium">{item.credit.toLocaleString()}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-white/20 bg-white/5">
              <td colSpan={2} className="py-4 px-4 text-right font-bold text-white text-lg">
                الإجمالي
              </td>
              <td className="py-4 px-4 text-center font-bold text-emerald-400 text-lg">
                {summary.totalDebit.toLocaleString()}
              </td>
              <td className="py-4 px-4 text-center font-bold text-red-400 text-lg">
                {summary.totalCredit.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </GlassCard>
  );
}
