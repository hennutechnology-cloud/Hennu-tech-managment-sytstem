// ============================================================
// AnalyticalReportsCharts.tsx
// month and category come as plain API strings — render directly.
// Only chart titles and series names go through tAR().
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { useAnalyticalReports } from "../../core/services/AnalyticalReports.service";
import { tAR }         from "../../core/i18n/analyticalReports.i18n";
import { SHORT_MONTHS } from "../../core/i18n/util.i18n";
import type { Lang }   from "../../core/models/Settings.types";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
  },
};

function ChartSkeleton() {
  return <div className="h-[300px] rounded-xl bg-white/5 animate-pulse" />;
}

interface Props { lang: Lang; }

export default function AnalyticalReportsCharts({ lang }: Props) {
  const { data, loading } = useAnalyticalReports();

  // Convert numeric month (1–12) → localised short name for chart axis
  const profitData = data?.profitability.map((p) => ({
    ...p,
    month: SHORT_MONTHS[lang][p.month - 1],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Profitability */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">{tAR(lang, "profitabilityTitle")}</h3>
        {loading || !data ? <ChartSkeleton /> : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#94A3B8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94A3B8" style={{ fontSize: "12px" }} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Line
                type="monotone" dataKey="margin"
                stroke="#10B981" strokeWidth={3}
                name={tAR(lang, "profitMargin")}
                dot={{ fill: "#10B981", r: 4 }}
              />
              <Line
                type="monotone" dataKey="roi"
                stroke="#F97316" strokeWidth={3}
                name={tAR(lang, "roi")}
                dot={{ fill: "#F97316", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      {/* Expenses */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">{tAR(lang, "expensesTitle")}</h3>
        {loading || !data ? <ChartSkeleton /> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.expenseBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#94A3B8" style={{ fontSize: "12px" }} />
              <YAxis
                dataKey="category" type="category"
                stroke="#94A3B8" style={{ fontSize: "12px" }} width={80}
              />
              <Tooltip {...tooltipStyle} />
              <Bar
                dataKey="amount" fill="#F97316"
                radius={[0, 8, 8, 0]}
                name={tAR(lang, "amountLabel")}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

    </div>
  );
}
