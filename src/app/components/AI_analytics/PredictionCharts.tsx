// ============================================================
// PredictionCharts.tsx
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
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

export default function PredictionCharts({ costPrediction, cashFlowForecast }: PredictionChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ── Cost Prediction ── */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">توقع التكاليف (AI)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={costPrediction}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" style={AXIS_STYLE} />
            <YAxis stroke="#94A3B8" style={AXIS_STYLE} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend />
            <Line
              type="monotone" dataKey="actual"
              stroke="#10B981" strokeWidth={3}
              name="فعلي" dot={{ fill: "#10B981", r: 4 }}
            />
            <Line
              type="monotone" dataKey="predicted"
              stroke="#F97316" strokeWidth={3} strokeDasharray="5 5"
              name="متوقع" dot={{ fill: "#F97316", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">
          * التوقعات مبنية على خوارزميات التعلم الآلي
        </p>
      </GlassCard>

      {/* ── Cash Flow Forecast ── */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">توقع التدفق النقدي (AI)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" style={AXIS_STYLE} />
            <YAxis stroke="#94A3B8" style={AXIS_STYLE} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend />
            <Area
              type="monotone" dataKey="inflow" stackId="1"
              stroke="#10B981" fill="#10B981" fillOpacity={0.6}
              name="التدفقات الداخلة"
            />
            <Area
              type="monotone" dataKey="outflow" stackId="2"
              stroke="#EF4444" fill="#EF4444" fillOpacity={0.6}
              name="التدفقات الخارجة"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">
          * توقعات مبنية على البيانات التاريخية والأنماط الموسمية
        </p>
      </GlassCard>

    </div>
  );
}
