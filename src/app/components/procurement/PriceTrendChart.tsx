// ============================================================
// PriceTrendChart.tsx
// ============================================================
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import GlassCard from "../../core/shared/components/GlassCard";
import { tPro }  from "../../core/i18n/procurement.i18n";
import { SHORT_MONTHS } from "../../core/i18n/util.i18n";
import { formatAxisNum, chartLayout } from "../../core/i18n/dashboard.i18n";
import type { PriceTrendChartProps } from "../../core/models/procurement.types";

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

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(30,41,59,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
  },
};
const axisTickStyle = { fontSize: 11, fill: "#94A3B8" };

export default function PriceTrendChart({ data, lang }: PriceTrendChartProps) {
  const chartHeight = useChartHeight();
  const cl = chartLayout(lang);

  const chartData = data.map((d) => ({
    month: SHORT_MONTHS[lang][d.month - 1],
    price: d.price,
  }));

  return (
    <GlassCard className="p-5 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">
        {tPro(lang, "priceTrendTitle")}
      </h3>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={chartData} margin={cl.margin}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
          <XAxis dataKey="month" stroke="#94A3B8" tick={axisTickStyle} />
          <YAxis
            orientation={cl.yAxisSide}
            stroke="#94A3B8"
            tick={axisTickStyle}
            width={cl.yAxisWidth}
            tickFormatter={(v) => formatAxisNum(v, lang)}
          />
          <Tooltip {...tooltipStyle} />
          <Bar
            dataKey="price"
            fill="#F97316"
            radius={[8, 8, 0, 0]}
            name={tPro(lang, "priceLabel")}
          />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
