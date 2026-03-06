// ============================================================
// DepreciationChart.tsx
// trend.year is a string ("2022"–"2026") — not a month, rendered directly.
// Only chart title and series name go through tDep().
// RTL-aware YAxis orientation.
// ============================================================
import GlassCard          from "../../core/shared/components/GlassCard";
import { useDepreciation } from "../../core/services/Depreciation.service";
import { tDep }           from "../../core/i18n/depreciation.i18n";
import type { DepreciationChartProps } from "../../core/models/Depreciation.types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
  },
};

export default function DepreciationChart({ lang }: DepreciationChartProps) {
  const { data } = useDepreciation();
  if (!data) return <div className="h-[300px] rounded-xl bg-white/5 animate-pulse" />;

  const isRtl     = lang === "ar";
  const yAxisSide = isRtl ? "right" : "left" as "right" | "left";

  return (
    <GlassCard>
      <h2 className="text-xl font-bold text-white mb-6">{tDep(lang, "chartTitle")}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          {/* year is always a 4-digit year string from the API — render directly */}
          <XAxis dataKey="year" stroke="#94A3B8" style={{ fontSize: "12px" }} />
          <YAxis orientation={yAxisSide} stroke="#94A3B8" style={{ fontSize: "12px" }} />
          <Tooltip {...tooltipStyle} />
          <Legend />
          <Bar
            dataKey="depreciation"
            fill="#F97316"
            radius={[8, 8, 0, 0]}
            name={tDep(lang, "depreciationLabel")}
          />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
