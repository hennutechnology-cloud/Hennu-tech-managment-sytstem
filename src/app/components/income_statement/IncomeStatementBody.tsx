// ============================================================
// IncomeStatementBody.tsx
// ============================================================
import { TrendingUp, TrendingDown, Activity, Minus } from "lucide-react";
import { motion } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { IncomeStatementBodyProps } from "../../core/models/IncomeStatement.types";

function fmt(n: number) { return n.toLocaleString(); }

function Row({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-gray-300 text-sm">{label}</span>
      <span className="text-white font-medium text-sm">{fmt(amount)} ر.س</span>
    </div>
  );
}

function NegRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-gray-300 text-sm">{label}</span>
      <span className="text-white font-medium text-sm">({fmt(amount)}) ر.س</span>
    </div>
  );
}

function Subtotal({
  label, amount, color = "text-white", negative = false,
}: { label: string; amount: number; color?: string; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-white/10 mt-1">
      <span className="text-white font-bold text-sm">{label}</span>
      <span className={"font-bold text-base " + color}>
        {negative ? `(${fmt(amount)})` : fmt(amount)} ر.س
      </span>
    </div>
  );
}

export default function IncomeStatementBody({ data }: IncomeStatementBodyProps) {
  return (
    <GlassCard>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

        {/* Revenue */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            الإيرادات
          </h2>
          <div className="space-y-0 pr-8">
            <Row label="إيرادات المبيعات" amount={data.revenue.sales} />
            <Row label="إيرادات أخرى"     amount={data.revenue.otherIncome} />
            <Subtotal label="إجمالي الإيرادات" amount={data.revenue.total} color="text-emerald-400" />
          </div>
        </div>

        {/* COGS */}
        <div className="pt-4 border-t border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Minus className="w-6 h-6 text-red-400" />
            تكلفة البضاعة المباعة
          </h2>
          <div className="space-y-0 pr-8">
            <Row label="مواد خام"     amount={data.cogs.materials} />
            <Row label="عمالة مباشرة" amount={data.cogs.labor} />
            <Row label="تكاليف أخرى" amount={data.cogs.other} />
            <Subtotal label="إجمالي التكلفة" amount={data.cogs.total} color="text-red-400" negative />
          </div>
        </div>

        {/* Gross Profit */}
        <div className="py-4 bg-emerald-500/10 rounded-xl px-6 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg">إجمالي الربح</span>
            <span className="text-emerald-400 font-bold text-2xl">{fmt(data.grossProfit)} ر.س</span>
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="pt-4 border-t border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-red-400" />
            المصروفات التشغيلية
          </h2>
          <div className="space-y-0 pr-8">
            <Row label="الرواتب والأجور"    amount={data.operatingExpenses.salaries} />
            <Row label="الإيجارات"           amount={data.operatingExpenses.rent} />
            <Row label="المصاريف الإدارية"  amount={data.operatingExpenses.administrative} />
            <Row label="المرافق والخدمات"   amount={data.operatingExpenses.utilities} />
            <Row label="التسويق والإعلان"   amount={data.operatingExpenses.marketing} />
            <Row label="الإهلاك والاستهلاك" amount={data.operatingExpenses.depreciation} />
            <Subtotal label="إجمالي المصروفات التشغيلية"
                      amount={data.operatingExpenses.total} color="text-red-400" negative />
          </div>
        </div>

        {/* Operating Income */}
        <div className="py-4 bg-blue-500/10 rounded-xl px-6 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-lg">الدخل التشغيلي</span>
            <span className="text-blue-400 font-bold text-2xl">{fmt(data.operatingIncome)} ر.س</span>
          </div>
        </div>

        {/* Other Expenses */}
        <div className="pt-4 border-t border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-400" />
            مصروفات أخرى
          </h2>
          <div className="space-y-0 pr-8">
            <Row label="فوائد بنكية" amount={data.otherExpenses.interest} />
            <Row label="ضرائب"        amount={data.otherExpenses.taxes} />
            <Subtotal label="إجمالي المصروفات الأخرى"
                      amount={data.otherExpenses.total} color="text-red-400" negative />
          </div>
        </div>

        {/* Net Income */}
        <div className="py-6 bg-gradient-to-l from-[#F97316]/20 to-[#EA580C]/10 rounded-xl
                        px-6 border border-[#F97316]/30">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-2xl">صافي الربح</span>
            <span className="text-[#F97316] font-bold text-3xl">{fmt(data.netIncome)} ر.س</span>
          </div>
        </div>

      </motion.div>
    </GlassCard>
  );
}
