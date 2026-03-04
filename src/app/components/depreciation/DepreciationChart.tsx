// ============================================================
// DepreciationChart.tsx
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { useDepreciation } from "../../core/services/Depreciation.service";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

function Skeleton() {
  return <div className="h-[300px] rounded-xl bg-white/5 animate-pulse" />;
}

export default function DepreciationChart() {
  const { data, loading } = useDepreciation();

  return (
    <GlassCard>
      <h2 className="text-xl font-bold text-white mb-6">اتجاه الإهلاك السنوي</h2>
      {loading || !data
        ? <Skeleton />
        : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="year" stroke="#94A3B8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94A3B8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 41, 59, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="depreciation" fill="#F97316" radius={[8, 8, 0, 0]} name="الإهلاك" />
            </BarChart>
          </ResponsiveContainer>
        )
      }
    </GlassCard>
  );
}
