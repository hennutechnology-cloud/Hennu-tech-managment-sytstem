// ============================================================
// ChartsGrid.tsx — Responsive
// ============================================================
import { useEffect, useState } from "react";
import GlassCard               from "../../core/shared/components/GlassCard";
import { tDash, formatAxisNum, chartLayout } from "../../core/i18n/dashboard.i18n";
import { SHORT_MONTHS }        from "../../core/i18n/util.i18n";
import type { ChartsGridProps } from "../../core/models/dashboard.types";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── Shared recharts style ──────────────────────────────────────
const tooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(30,41,59,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
  },
};
const axisTickStyle = { fontSize: 11, fill: "#94A3B8" };

/** Returns a chart height that matches the current viewport width. */
function useChartHeight() {
  const getHeight = () => {
    if (typeof window === "undefined") return 300;
    if (window.innerWidth < 768) return 220;
    if (window.innerWidth < 1024) return 260;
    return 300;
  };
  const [height, setHeight] = useState(getHeight);
  useEffect(() => {
    const handler = () => setHeight(getHeight());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return height;
}

export default function ChartsGrid({ data, lang }: ChartsGridProps) {
  const chartHeight = useChartHeight();

  const revenueData  = data.revenueExpense.map((d) => ({ ...d, month: SHORT_MONTHS[lang][d.month - 1] }));
  const profitData   = data.profit.map((d)         => ({ ...d, month: SHORT_MONTHS[lang][d.month - 1] }));
  const cashFlowData = data.cashFlow.map((d)        => ({ ...d, month: SHORT_MONTHS[lang][d.month - 1] }));

  const cl = chartLayout(lang);
  const yTickFormatter = (v: number) => formatAxisNum(v, lang);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

      {/* ── Revenue vs Expenses ── */}
      <GlassCard>
        <h3 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6">
          {tDash(lang, "revenueExpenseTitle")}
        </h3>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={revenueData} margin={cl.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" tick={axisTickStyle} />
            <YAxis
              orientation={cl.yAxisSide}
              stroke="#94A3B8"
              tick={axisTickStyle}
              width={cl.yAxisWidth}
              tickFormatter={yTickFormatter}
            />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="revenue"
              stroke="#10B981" strokeWidth={2.5}
              name={tDash(lang, "revenueLabel")}
              dot={{ fill: "#10B981", r: 2.5 }}
            />
            <Line type="monotone" dataKey="expenses"
              stroke="#EF4444" strokeWidth={2.5}
              name={tDash(lang, "expensesLabel")}
              dot={{ fill: "#EF4444", r: 2.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Monthly Profit ── */}
      <GlassCard>
        <h3 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6">
          {tDash(lang, "profitTitle")}
        </h3>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={profitData} margin={cl.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" tick={axisTickStyle} />
            <YAxis
              orientation={cl.yAxisSide}
              stroke="#94A3B8"
              tick={axisTickStyle}
              width={cl.yAxisWidth}
              tickFormatter={yTickFormatter}
            />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="profit" fill="#F97316" radius={[6, 6, 0, 0]}
              name={tDash(lang, "profitLabel")}
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Cash Flow Forecast ── */}
      <GlassCard>
        <h3 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6">
          {tDash(lang, "cashFlowTitle")}
        </h3>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={cashFlowData} margin={cl.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" tick={axisTickStyle} />
            <YAxis
              orientation={cl.yAxisSide}
              stroke="#94A3B8"
              tick={axisTickStyle}
              width={cl.yAxisWidth}
              tickFormatter={yTickFormatter}
            />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="cashFlow"
              stroke="#3B82F6" fill="#3B82F6"
              strokeWidth={2.5} fillOpacity={0.3}
              name={tDash(lang, "cashFlowLabel")}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">{tDash(lang, "cashFlowNote")}</p>
      </GlassCard>

      {/* ── Budget vs Actual ── */}
      <GlassCard>
        <h3 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6">
          {tDash(lang, "budgetActualTitle")}
        </h3>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={data.budgetActual} layout="vertical" margin={cl.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              type="number"
              stroke="#94A3B8"
              tick={axisTickStyle}
              tickFormatter={yTickFormatter}
            />
            <YAxis
              dataKey="category"
              type="category"
              orientation={cl.categoryAxisSide}
              stroke="#94A3B8"
              tick={{ ...axisTickStyle, textAnchor: lang === "ar" ? "start" : "end" }}
              width={cl.categoryAxisWidth}
            />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="budget" fill="#94A3B8" radius={cl.barRadius}
              name={tDash(lang, "budgetLabel")}
            />
            <Bar dataKey="actual" fill="#F97316" radius={cl.barRadius}
              name={tDash(lang, "actualLabel")}
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

    </div>
  );
}
