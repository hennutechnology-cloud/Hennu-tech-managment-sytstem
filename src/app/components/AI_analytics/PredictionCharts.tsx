// ============================================================
// PredictionCharts.tsx — responsive: mobile / tablet / desktop
// Mobile:  stacked single column, shorter chart height (220px)
// Tablet:  stacked, medium height (260px)
// Desktop: 2-column grid, full height (300px)
// Charts use useWindowSize to pick dynamic heights.
// YAxis hidden on mobile to save horizontal space.
// RTL:     YAxis side flips (right in AR, left in EN).
// month is a number (1-12) from the API — formatted via util.i18n
// ============================================================
import { useEffect, useState }   from "react";
import GlassCard                 from "../../core/shared/components/GlassCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { tAI }          from "../../core/i18n/aiAnalytics.i18n";
import { SHORT_MONTHS } from "../../core/i18n/util.i18n";
import type { PredictionChartsProps } from "../../core/models/AIAnalytics.types";

// ── Responsive chart height hook ─────────────────────────────
function useChartHeight(): number {
  const [height, setHeight] = useState(300);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setHeight(w < 640 ? 200 : w < 1024 ? 250 : 300);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return height;
}

// ── Shared tooltip style ──────────────────────────────────────
const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "rgba(30,41,59,0.95)",
    border:          "1px solid rgba(255,255,255,0.1)",
    borderRadius:    "12px",
    color:           "#fff",
  },
};

const AXIS_STYLE = { fontSize: "11px" } as const;

export default function PredictionCharts({
  costPrediction, cashFlowForecast, lang,
}: PredictionChartsProps) {
  const chartHeight = useChartHeight();
  const isRtl       = lang === "ar";

  // Convert numeric months → localised short labels
  const costData = costPrediction.map((p) => ({
    ...p,
    month: SHORT_MONTHS[lang][p.month - 1],
  }));

  const cashData = cashFlowForecast.map((p) => ({
    ...p,
    month: SHORT_MONTHS[lang][p.month - 1],
  }));

  // YAxis orientation flips for RTL
  const yAxisOrientation = isRtl ? ("right" as const) : ("left" as const);

  return (
    // 1 col on mobile/tablet → 2 cols on desktop
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

      {/* ── Cost Prediction ── */}
      <GlassCard className="p-4 sm:p-6">
        <h3 className={`text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6
                         ${isRtl ? "text-right" : "text-left"}`}>
          {tAI(lang, "costPredTitle")}
        </h3>

        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart
            data={costData}
            margin={isRtl
              ? { top: 5, right: 16, left: 0, bottom: 5 }
              : { top: 5, right: 0,  left: 16, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              style={AXIS_STYLE}
              tick={{ fill: "#94A3B8" }}
              tickLine={false}
            />
            <YAxis
              orientation={yAxisOrientation}
              stroke="#94A3B8"
              style={AXIS_STYLE}
              tick={{ fill: "#94A3B8" }}
              tickLine={false}
              width={40}
              // Hide on very small screens to save space
              hide={typeof window !== "undefined" && window.innerWidth < 400}
            />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="circle"
            />
            <Line
              type="monotone" dataKey="actual"
              stroke="#10B981" strokeWidth={2}
              name={tAI(lang, "costActual")}
              dot={{ fill: "#10B981", r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone" dataKey="predicted"
              stroke="#F97316" strokeWidth={2}
              name={tAI(lang, "costPredicted")}
              dot={{ fill: "#F97316", r: 3 }}
              activeDot={{ r: 5 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-400 mt-2 sm:mt-3 text-center leading-relaxed">
          {tAI(lang, "costPredNote")}
        </p>
      </GlassCard>

      {/* ── Cash Flow Forecast ── */}
      <GlassCard className="p-4 sm:p-6">
        <h3 className={`text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6
                         ${isRtl ? "text-right" : "text-left"}`}>
          {tAI(lang, "cashFlowTitle")}
        </h3>

        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart
            data={cashData}
            margin={isRtl
              ? { top: 5, right: 16, left: 0, bottom: 5 }
              : { top: 5, right: 0,  left: 16, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              style={AXIS_STYLE}
              tick={{ fill: "#94A3B8" }}
              tickLine={false}
            />
            <YAxis
              orientation={yAxisOrientation}
              stroke="#94A3B8"
              style={AXIS_STYLE}
              tick={{ fill: "#94A3B8" }}
              tickLine={false}
              width={40}
              hide={typeof window !== "undefined" && window.innerWidth < 400}
            />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="circle"
            />
            <Area
              type="monotone" dataKey="inflow"  stackId="1"
              stroke="#10B981" fill="#10B981" fillOpacity={0.5}
              name={tAI(lang, "inflow")}
            />
            <Area
              type="monotone" dataKey="outflow" stackId="2"
              stroke="#EF4444" fill="#EF4444" fillOpacity={0.5}
              name={tAI(lang, "outflow")}
            />
          </AreaChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-400 mt-2 sm:mt-3 text-center leading-relaxed">
          {tAI(lang, "cashFlowNote")}
        </p>
      </GlassCard>
    </div>
  );
}
