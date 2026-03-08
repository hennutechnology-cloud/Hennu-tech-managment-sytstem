// ============================================================
// DepreciationChart.tsx — Responsive
// ============================================================
import { useEffect, useState }  from "react";
import GlassCard                from "../../core/shared/components/GlassCard";
import { useDepreciation }      from "../../core/services/Depreciation.service";
import { tDep }                 from "../../core/i18n/depreciation.i18n";
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

function useChartHeight() {
  const get = () => {
    if (typeof window === "undefined") return 300;
    if (window.innerWidth < 768)  return 220;
    if (window.innerWidth < 1024) return 260;
    return 300;
  };
  const [h, setH] = useState(get);
  useEffect(() => {
    const handler = () => setH(get());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return h;
}

export default function DepreciationChart({ lang }: DepreciationChartProps) {
  const { data }    = useDepreciation();
  const chartHeight = useChartHeight();

  if (!data) return <div className="h-[220px] sm:h-[260px] lg:h-[300px] rounded-xl bg-white/5 animate-pulse" />;

  const isRtl     = lang === "ar";
  const yAxisSide = (isRtl ? "right" : "left") as "right" | "left";

  return (
    <GlassCard>
      <h2 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6">
        {tDep(lang, "chartTitle")}
      </h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data.trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="year" stroke="#94A3B8" style={{ fontSize: "11px" }} />
          <YAxis orientation={yAxisSide} stroke="#94A3B8" style={{ fontSize: "11px" }} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar
            dataKey="depreciation"
            fill="#F97316"
            radius={[6, 6, 0, 0]}
            name={tDep(lang, "depreciationLabel")}
          />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
