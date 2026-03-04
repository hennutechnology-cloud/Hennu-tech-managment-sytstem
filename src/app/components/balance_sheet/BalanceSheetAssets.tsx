// ============================================================
// BalanceSheetAssets.tsx
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

function Subtotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-white/10">
      <span className="text-white font-bold">{label}</span>
      <span className="text-emerald-400 font-bold">{num(value)}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-8 rounded-lg bg-white/5" />
      ))}
    </div>
  );
}

export default function BalanceSheetAssets() {
  const { data, loading } = useBalanceSheet();

  return (
    <GlassCard>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">
          الأصول
        </h2>

        {loading && <Skeleton />}

        {!loading && data && (
          <>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">الأصول المتداولة</h3>
              <div className="space-y-1 pr-6">
                <Row label="الصندوق"         value={data.assets.currentAssets.cash} />
                <Row label="البنك - الراجحي" value={data.assets.currentAssets.bank1} />
                <Row label="البنك - الأهلي"  value={data.assets.currentAssets.bank2} />
                <Row label="العملاء"          value={data.assets.currentAssets.receivables} />
                <Row label="المخزون"          value={data.assets.currentAssets.inventory} />
                <Subtotal label="إجمالي الأصول المتداولة" value={data.assets.currentAssets.total} />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">الأصول الثابتة</h3>
              <div className="space-y-1 pr-6">
                <Row label="الأراضي"  value={data.assets.fixedAssets.land} />
                <Row label="المباني"  value={data.assets.fixedAssets.buildings} />
                <Row label="المعدات"  value={data.assets.fixedAssets.equipment} />
                <Row label="السيارات" value={data.assets.fixedAssets.vehicles} />
                <Subtotal label="إجمالي الأصول الثابتة" value={data.assets.fixedAssets.total} />
              </div>
            </div>

            <div className="py-4 bg-emerald-500/10 rounded-xl px-4 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xl">إجمالي الأصول</span>
                <span className="text-emerald-400 font-bold text-2xl">{num(data.assets.totalAssets)}</span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </GlassCard>
  );
}
