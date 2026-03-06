// ============================================================
// ChartsGrid.tsx
// month is numeric (1–12) → converted to SHORT_MONTHS[lang].
// category is a plain API string → rendered directly.
// All chart titles and series names go through tDash().
//
// RTL / overflow fixes:
//   • formatAxisNum() keeps Y-axis tick labels short (e.g. "1.5M" / "١.٥م")
//   • chartLayout() centralises yAxisSide, widths, and margins per language
//   • margin.right / margin.left give each axis room so labels never
//     clip into the plot area when the language switches
// ============================================================
import GlassCard          from "../../core/shared/components/GlassCard";
import { tDash, formatAxisNum, chartLayout } from "../../core/i18n/dashboard.i18n";
import { SHORT_MONTHS }   from "../../core/i18n/util.i18n";
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

export default function ChartsGrid({ data, lang }: ChartsGridProps) {
  // Convert numeric month to localised short label
  const revenueData  = data.revenueExpense.map((d) => ({ ...d, month: SHORT_MONTHS[lang][d.month - 1] }));
  const profitData   = data.profit.map((d)         => ({ ...d, month: SHORT_MONTHS[lang][d.month - 1] }));
  const cashFlowData = data.cashFlow.map((d)        => ({ ...d, month: SHORT_MONTHS[lang][d.month - 1] }));

  const cl = chartLayout(lang);

  /**
   * Shared Y-axis tick formatter.
   * Converts raw numbers → compact labels so they fit inside the reserved width.
   */
  const yTickFormatter = (v: number) => formatAxisNum(v, lang);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ── Revenue vs Expenses ── */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">{tDash(lang, "revenueExpenseTitle")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData} margin={cl.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              tick={axisTickStyle}
            />
            <YAxis
              orientation={cl.yAxisSide}
              stroke="#94A3B8"
              tick={axisTickStyle}
              width={cl.yAxisWidth}
              tickFormatter={yTickFormatter}
            />
            <Tooltip {...tooltipStyle} />
            <Legend />
            <Line
              type="monotone" dataKey="revenue"
              stroke="#10B981" strokeWidth={3}
              name={tDash(lang, "revenueLabel")}
              dot={{ fill: "#10B981", r: 3 }}
            />
            <Line
              type="monotone" dataKey="expenses"
              stroke="#EF4444" strokeWidth={3}
              name={tDash(lang, "expensesLabel")}
              dot={{ fill: "#EF4444", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Monthly Profit ── */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">{tDash(lang, "profitTitle")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitData} margin={cl.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              tick={axisTickStyle}
            />
            <YAxis
              orientation={cl.yAxisSide}
              stroke="#94A3B8"
              tick={axisTickStyle}
              width={cl.yAxisWidth}
              tickFormatter={yTickFormatter}
            />
            <Tooltip {...tooltipStyle} />
            <Bar
              dataKey="profit"
              fill="#F97316"
              radius={[8, 8, 0, 0]}
              name={tDash(lang, "profitLabel")}
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Cash Flow Forecast ── */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">{tDash(lang, "cashFlowTitle")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowData} margin={cl.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              tick={axisTickStyle}
            />
            <YAxis
              orientation={cl.yAxisSide}
              stroke="#94A3B8"
              tick={axisTickStyle}
              width={cl.yAxisWidth}
              tickFormatter={yTickFormatter}
            />
            <Tooltip {...tooltipStyle} />
            <Area
              type="monotone" dataKey="cashFlow"
              stroke="#3B82F6" fill="#3B82F6"
              strokeWidth={3} fillOpacity={0.3}
              name={tDash(lang, "cashFlowLabel")}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">{tDash(lang, "cashFlowNote")}</p>
      </GlassCard>

      {/* ── Budget vs Actual — horizontal bar ── */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">{tDash(lang, "budgetActualTitle")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.budgetActual} layout="vertical" margin={cl.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            {/* Numeric axis (horizontal) */}
            <XAxis
              type="number"
              stroke="#94A3B8"
              tick={axisTickStyle}
              tickFormatter={yTickFormatter}
            />
            {/*
              Category axis (vertical) — category is a plain API string.
              orientation flips so labels sit on the leading edge in RTL.
              width is generous enough for the longest Arabic category name.
            */}
            <YAxis
              dataKey="category"
              type="category"
              orientation={cl.categoryAxisSide}
              stroke="#94A3B8"
              tick={{ ...axisTickStyle, textAnchor: lang === "ar" ? "start" : "end" }}
              width={cl.categoryAxisWidth}
            />
            <Tooltip {...tooltipStyle} />
            <Legend />
            <Bar
              dataKey="budget"
              fill="#94A3B8"
              radius={cl.barRadius}
              name={tDash(lang, "budgetLabel")}
            />
            <Bar
              dataKey="actual"
              fill="#F97316"
              radius={cl.barRadius}
              name={tDash(lang, "actualLabel")}
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

    </div>
  );
}
