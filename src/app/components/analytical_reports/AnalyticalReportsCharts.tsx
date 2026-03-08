// ============================================================
// AnalyticalReportsCharts.tsx — responsive
// ============================================================
import { useEffect, useState } from "react";
import GlassCard               from "../../core/shared/components/GlassCard";
import { useAnalyticalReports } from "../../core/services/AnalyticalReports.service";
import { tAR }                 from "../../core/i18n/analyticalReports.i18n";
import { SHORT_MONTHS }        from "../../core/i18n/util.i18n";
import type { Lang }           from "../../core/models/Settings.types";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    border:          "1px solid rgba(255,255,255,0.1)",
    borderRadius:    "12px",
    color:           "#fff",
    fontSize:        "12px",
  },
};

const AXIS_STYLE = { fontSize: "11px" } as const;

// ── Responsive chart height ───────────────────────────────────
function useChartHeight(): number {
  const [h, setH] = useState(300);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setH(w < 640 ? 200 : w < 1024 ? 250 : 300);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return h;
}

// ── Responsive YAxis label width ─────────────────────────────
function useYAxisWidth(): number {
  const [w, setW] = useState(80);
  useEffect(() => {
    const update = () => setW(window.innerWidth < 640 ? 60 : 80);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="rounded-xl bg-white/5 animate-pulse"
      style={{ height }}
    />
  );
}

interface Props { lang: Lang; }

export default function AnalyticalReportsCharts({ lang }: Props) {
  const { data, loading } = useAnalyticalReports();
  const chartHeight       = useChartHeight();
  const yAxisWidth        = useYAxisWidth();
  const isRtl             = lang === "ar";
  const yOrientation      = isRtl ? ("right" as const) : ("left" as const);

  const profitData = data?.profitability.map((p) => ({
    ...p,
    month: SHORT_MONTHS[lang][p.month - 1],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

      {/* ── Profitability Line Chart ── */}
      <GlassCard className="p-4 sm:p-6">
        <h3 className={`text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6
                         ${isRtl ? "text-right" : "text-left"}`}>
          {tAR(lang, "profitabilityTitle")}
        </h3>

        {loading || !data
          ? <ChartSkeleton height={chartHeight} />
          : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart
                data={profitData}
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
                  orientation={yOrientation}
                  stroke="#94A3B8"
                  style={AXIS_STYLE}
                  tick={{ fill: "#94A3B8" }}
                  tickLine={false}
                  width={36}
                />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} iconType="circle" />
                <Line
                  type="monotone" dataKey="margin"
                  stroke="#10B981" strokeWidth={2}
                  name={tAR(lang, "profitMargin")}
                  dot={{ fill: "#10B981", r: 3 }} activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone" dataKey="roi"
                  stroke="#F97316" strokeWidth={2}
                  name={tAR(lang, "roi")}
                  dot={{ fill: "#F97316", r: 3 }} activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )
        }
      </GlassCard>

      {/* ── Expense Breakdown Horizontal Bar Chart ── */}
      <GlassCard className="p-4 sm:p-6">
        <h3 className={`text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6
                         ${isRtl ? "text-right" : "text-left"}`}>
          {tAR(lang, "expensesTitle")}
        </h3>

        {loading || !data
          ? <ChartSkeleton height={chartHeight} />
          : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={data.expenseBreakdown}
                layout="vertical"
                margin={isRtl
                  ? { top: 5, right: 0,  left: 0,          bottom: 5 }
                  : { top: 5, right: 16, left: 0,          bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#94A3B8"
                  style={AXIS_STYLE}
                  tick={{ fill: "#94A3B8" }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  orientation={yOrientation}
                  stroke="#94A3B8"
                  style={AXIS_STYLE}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  tickLine={false}
                  width={yAxisWidth}
                />
                <Tooltip {...tooltipStyle} />
                <Bar
                  dataKey="amount"
                  fill="#F97316"
                  radius={isRtl ? [8, 0, 0, 8] : [0, 8, 8, 0]}
                  name={tAR(lang, "amountLabel")}
                />
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </GlassCard>

    </div>
  );
}
