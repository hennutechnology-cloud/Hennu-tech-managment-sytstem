// ============================================================
// PredictionCharts.tsx
// month is a number (1-12) from the API — formatted via util.i18n
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { tAI }                from "../../core/i18n/aiAnalytics.i18n";
import { SHORT_MONTHS }       from "../../core/i18n/util.i18n";
import type { PredictionChartsProps } from "../../core/models/AIAnalytics.types";

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "rgba(30,41,59,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
  },
};

const AXIS_STYLE = { fontSize: "12px" } as const;

export default function PredictionCharts({ costPrediction, cashFlowForecast, lang }: PredictionChartsProps) {
  // Convert numeric months to localised short labels
  const costData = costPrediction.map((p) => ({
    ...p,
    month: SHORT_MONTHS[lang][p.month - 1],
  }));

  const cashData = cashFlowForecast.map((p) => ({
    ...p,
    month: SHORT_MONTHS[lang][p.month - 1],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Cost Prediction */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">{tAI(lang, "costPredTitle")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" style={AXIS_STYLE} />
            <YAxis stroke="#94A3B8" style={AXIS_STYLE} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend />
            <Line type="monotone" dataKey="actual"    stroke="#10B981" strokeWidth={3} name={tAI(lang, "costActual")}    dot={{ fill: "#10B981", r: 4 }} />
            <Line type="monotone" dataKey="predicted" stroke="#F97316" strokeWidth={3} name={tAI(lang, "costPredicted")} dot={{ fill: "#F97316", r: 4 }} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">{tAI(lang, "costPredNote")}</p>
      </GlassCard>

      {/* Cash Flow Forecast */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">{tAI(lang, "cashFlowTitle")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" style={AXIS_STYLE} />
            <YAxis stroke="#94A3B8" style={AXIS_STYLE} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend />
            <Area type="monotone" dataKey="inflow"  stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name={tAI(lang, "inflow")}  />
            <Area type="monotone" dataKey="outflow" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name={tAI(lang, "outflow")} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">{tAI(lang, "cashFlowNote")}</p>
      </GlassCard>

    </div>
  );
}
