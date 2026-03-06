// ============================================================
// ProjectDetails.tsx
// Chart titles, AI card text, and labels go through tProj().
// phase/name are plain API strings — rendered directly.
//
// Pie chart: NO SVG labels at all — replaced with a clean HTML
// legend below the chart. Works perfectly in both AR and EN.
// ============================================================
import { TrendingUp, AlertTriangle, Clock } from "lucide-react";
import GlassCard      from "../../core/shared/components/GlassCard";
import { tProj, tProjInterp, formatAxisNum, formatNum, chartLayout, dirAttr }
                      from "../../core/i18n/projects.i18n";
import type { ProjectDetailsProps, CostBreakdownItem } from "../../core/models/projects.types";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(15,23,42,0.97)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  // label row (e.g. the phase name or month)
  labelStyle: {
    color: "#fff",
    fontWeight: 600,
    marginBottom: 4,
  },
  // each data row (series name + value)
  itemStyle: {
    color: "#fff",
  },
  cursor: { fill: "rgba(255,255,255,0.05)" },
};
const axisTickStyle = { fontSize: 11, fill: "#94A3B8" };

// ── Custom HTML legend for the pie ────────────────────────────
function PieLegend({
  data,
  lang,
}: {
  data: CostBreakdownItem[];
  lang: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 px-1">
      {data.map((entry) => {
        const pct = total > 0 ? ((entry.value / total) * 100).toFixed(0) : "0";
        return (
          <div key={entry.name} className="flex items-center gap-2 min-w-0">
            {/* colour dot */}
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            {/* name — plain API string, truncate if too long */}
            <span className="text-gray-300 text-xs truncate flex-1">{entry.name}</span>
            {/* percentage */}
            <span
              className="text-xs font-semibold shrink-0"
              style={{ color: entry.color }}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────
export default function ProjectDetails({
  project, costBreakdown, budgetActual, lang,
}: ProjectDetailsProps) {
  const cl         = chartLayout(lang);
  const yTickFmt   = (v: number) => formatAxisNum(v, lang);
  const overrunPct = 35;
  const overrunAmt = "2,500,000";
  const delayGap   = 8;
  const delayWeeks = 3;

  return (
    <div dir={dirAttr(lang)}>
      <h2 className="text-2xl font-bold text-white mb-4">
        {tProj(lang, "detailsTitle")}:{" "}
        <span className="text-[#F97316]">{project.name}</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Budget vs Actual ── */}
        <GlassCard>
          <h3 className="text-xl font-bold text-white mb-6">
            {tProj(lang, "budgetVsActualChart")}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={budgetActual} margin={cl.margin}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="phase" stroke="#94A3B8" tick={axisTickStyle} />
              <YAxis
                orientation={cl.yAxisSide}
                stroke="#94A3B8"
                tick={axisTickStyle}
                width={cl.yAxisWidth}
                tickFormatter={yTickFmt}
              />
              <Tooltip
                contentStyle={tooltipStyle.contentStyle}
                labelStyle={tooltipStyle.labelStyle}
                itemStyle={tooltipStyle.itemStyle}
                cursor={tooltipStyle.cursor}
                wrapperStyle={{ outline: "none" }}
              />
              <Bar
                dataKey="budget"
                fill="#94A3B8"
                radius={cl.barRadius}
                name={tProj(lang, "budgetLabel")}
              />
              <Bar
                dataKey="actual"
                fill="#F97316"
                radius={cl.barRadius}
                name={tProj(lang, "actualLabel")}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Inline bar legend */}
          <div className="flex items-center gap-6 mt-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#94A3B8] shrink-0" />
              <span className="text-xs text-gray-400">{tProj(lang, "budgetLabel")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#F97316] shrink-0" />
              <span className="text-xs text-gray-400">{tProj(lang, "actualLabel")}</span>
            </div>
          </div>
        </GlassCard>

        {/* ── Cost Breakdown Pie — NO SVG labels ── */}
        <GlassCard>
          <h3 className="text-xl font-bold text-white mb-4">
            {tProj(lang, "costBreakdownChart")}
          </h3>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}   // donut style gives centre breathing room
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={false}      // no SVG labels at all
                labelLine={false}
              >
                {costBreakdown.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle.contentStyle}
                labelStyle={tooltipStyle.labelStyle}
                itemStyle={tooltipStyle.itemStyle}
                wrapperStyle={{ outline: "none" }}
                formatter={(value: number, name: string) => [
                  formatNum(value, lang),
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/*
            HTML legend — renders perfectly in AR and EN.
            Two columns, colour dot + name + percentage per row.
          */}
          <PieLegend data={costBreakdown} lang={lang} />
        </GlassCard>

        {/* ── AI Overrun Prediction ── */}
        <GlassCard className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl shrink-0">
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {tProj(lang, "aiOverrunTitle")}
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {tProjInterp(lang, "aiOverrunBody", {
                  pct: overrunPct,
                  amt: overrunAmt,
                }).split(/(\d[\d,.]*%?(?:\s*(?:ر\.س|SAR))?)/g).map((chunk, i) =>
                  /^\d/.test(chunk)
                    ? <span key={i} className="text-orange-400 font-bold">{chunk}</span>
                    : chunk
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{tProj(lang, "lastUpdated")}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ── AI Delay Prediction ── */}
        <GlassCard className="bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {tProj(lang, "aiDelayTitle")}
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {tProjInterp(lang, "aiDelayBody", {
                  gap:   delayGap,
                  weeks: delayWeeks,
                }).split(/(\d+%?)/g).map((chunk, i) =>
                  /^\d/.test(chunk)
                    ? <span key={i} className="text-red-400 font-bold">{chunk}</span>
                    : chunk
                )}
              </p>
              <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm">
                {tProj(lang, "viewSolutions")}
              </button>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
