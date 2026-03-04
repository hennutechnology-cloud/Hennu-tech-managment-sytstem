// ============================================================
// DepreciationSummary.tsx
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { TrendingDown } from "lucide-react";
import { useDepreciation } from "../../core/services/Depreciation.service";

function num(n: number): string { return n.toLocaleString("ar-SA"); }

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

export default function DepreciationSummary() {
  const { data, loading } = useDepreciation();

  if (loading) return <Skeleton />;
  if (!data)   return null;

  const { summary } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <GlassCard hover>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">إجمالي قيمة الأصول</p>
            <h3 className="text-xl font-bold text-white">{num(summary.totalAssetValue)} ر.س</h3>
          </div>
          <TrendingDown className="w-10 h-10 text-blue-400" />
        </div>
      </GlassCard>

      <GlassCard hover>
        <div>
          <p className="text-gray-400 text-sm mb-1">الإهلاك المتراكم</p>
          <h3 className="text-xl font-bold text-red-400">{num(summary.totalAccumulated)} ر.س</h3>
        </div>
      </GlassCard>

      <GlassCard hover>
        <div>
          <p className="text-gray-400 text-sm mb-1">القيمة الدفترية</p>
          <h3 className="text-xl font-bold text-emerald-400">{num(summary.totalBookValue)} ر.س</h3>
        </div>
      </GlassCard>

      <GlassCard hover>
        <div>
          <p className="text-gray-400 text-sm mb-1">الإهلاك السنوي</p>
          <h3 className="text-xl font-bold text-[#F97316]">{num(summary.annualDepreciation)} ر.س</h3>
        </div>
      </GlassCard>
    </div>
  );
}
