// ============================================================
// LedgerTable.tsx
// ============================================================
import { motion } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { LedgerTableProps } from "../../core/models/GeneralLedger.types";

function formatDate(d: string) {
  if (!d) return d;
  const [y, m, day] = d.split("-");
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
                  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
}

export default function LedgerTable({
  entries, summary, accountName, filters,
}: LedgerTableProps) {
  return (
    <GlassCard>
      {/* Sub-header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{accountName}</h2>
          <p className="text-gray-400 text-sm mt-1">
            فترة: من {formatDate(filters.dateFrom)} إلى {formatDate(filters.dateTo)}
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs text-gray-500">رصيد افتتاحي</p>
            <p className="text-sm font-bold text-white">{summary.openingBalance.toLocaleString()} ر.س</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">رصيد ختامي</p>
            <p className="text-sm font-bold text-orange-400">{summary.closingBalance.toLocaleString()} ر.س</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-4 px-4 text-gray-400 font-medium">التاريخ</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">البيان</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium">مدين</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium">دائن</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium">الرصيد</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500">
                  لا توجد حركات في هذه الفترة
                </td>
              </tr>
            ) : entries.map((entry, index) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4 text-white text-sm">{formatDate(entry.date)}</td>
                <td className="py-4 px-4 text-white">{entry.description}</td>
                <td className="py-4 px-4 text-center">
                  {entry.debit > 0
                    ? <span className="text-emerald-400 font-medium">{entry.debit.toLocaleString()}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
                <td className="py-4 px-4 text-center">
                  {entry.credit > 0
                    ? <span className="text-red-400 font-medium">{entry.credit.toLocaleString()}</span>
                    : <span className="text-gray-600">—</span>}
                </td>
                <td className="py-4 px-4 text-center text-white font-medium">
                  {entry.balance.toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-white/20 bg-white/5">
              <td colSpan={2} className="py-4 px-4 text-right font-bold text-white">الإجماليات</td>
              <td className="py-4 px-4 text-center font-bold text-emerald-400">
                {summary.totalDebit.toLocaleString()}
              </td>
              <td className="py-4 px-4 text-center font-bold text-red-400">
                {summary.totalCredit.toLocaleString()}
              </td>
              <td className="py-4 px-4 text-center font-bold text-orange-400">
                {summary.closingBalance.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </GlassCard>
  );
}
