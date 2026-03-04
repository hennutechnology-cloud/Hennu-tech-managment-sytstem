// ============================================================
// BalanceSheetLiabilities.tsx
// ============================================================
import { motion } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import { useBalanceSheet } from "../../core/services/BalanceSheet.service";

function num(n: number): string { return n.toLocaleString("ar-SA"); }

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-300">{label}</span>
      <span className="text-white font-medium">{num(value)}</span>
    </div>
  );
}

function Subtotal({ label, value, color = "text-red-400" }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-white/10">
      <span className="text-white font-bold">{label}</span>
      <span className={`${color} font-bold`}>{num(value)}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-8 rounded-lg bg-white/5" />
      ))}
    </div>
  );
}

export default function BalanceSheetLiabilities() {
  const { data, loading } = useBalanceSheet();

  return (
    <GlassCard>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">
          الخصوم وحقوق الملكية
        </h2>

        {loading && <Skeleton />}

        {!loading && data && (
          <>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">الخصوم المتداولة</h3>
              <div className="space-y-1 pr-6">
                <Row label="الموردون"          value={data.liabilities.currentLiabilities.payables} />
                <Row label="قروض قصيرة الأجل" value={data.liabilities.currentLiabilities.shortTermLoans} />
                <Row label="مستحقات ضريبية"   value={data.liabilities.currentLiabilities.taxes} />
                <Subtotal label="إجمالي الخصوم المتداولة" value={data.liabilities.currentLiabilities.total} />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">الخصوم طويلة الأجل</h3>
              <div className="space-y-1 pr-6">
                <Row label="قروض طويلة الأجل" value={data.liabilities.longTermLiabilities.longTermLoans} />
                <Row label="سندات"             value={data.liabilities.longTermLiabilities.bonds} />
                <Subtotal label="إجمالي الخصوم طويلة الأجل" value={data.liabilities.longTermLiabilities.total} />
              </div>
            </div>

            <div className="py-3 bg-red-500/10 rounded-xl px-4 border border-red-500/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">إجمالي الخصوم</span>
                <span className="text-red-400 font-bold text-lg">{num(data.liabilities.totalLiabilities)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">حقوق الملكية</h3>
              <div className="space-y-1 pr-6">
                <Row label="رأس المال"         value={data.equity.capital} />
                <Row label="الأرباح المحتجزة" value={data.equity.retainedEarnings} />
                <Subtotal label="إجمالي حقوق الملكية" value={data.equity.totalEquity} color="text-blue-400" />
              </div>
            </div>

            <div className="py-4 bg-[#F97316]/10 rounded-xl px-4 border border-[#F97316]/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xl">إجمالي الخصوم وحقوق الملكية</span>
                <span className="text-[#F97316] font-bold text-2xl">{num(data.totalLiabilitiesAndEquity)}</span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </GlassCard>
  );
}
