// ============================================================
// AnalyticalReportsCharts.tsx
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { useAnalyticalReports } from "../../core/services/AnalyticalReports.service";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

interface ProfitabilityChartProps {
  data: { month: string; margin: number; roi: number }[];
}

function ProfitabilityChart({ data }: ProfitabilityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="month" stroke="#94A3B8" style={{ fontSize: "12px" }} />
        <YAxis stroke="#94A3B8" style={{ fontSize: "12px" }} />
        <Tooltip {...tooltipStyle} />
        <Legend />
        <Line
          type="monotone"
          dataKey="margin"
          stroke="#10B981"
          strokeWidth={3}
          name="هامش الربح %"
          dot={{ fill: "#10B981", r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="roi"
          stroke="#F97316"
          strokeWidth={3}
          name="العائد على الاستثمار %"
          dot={{ fill: "#F97316", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ExpenseChartProps {
  data: { category: string; amount: number }[];
}

function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis type="number" stroke="#94A3B8" style={{ fontSize: "12px" }} />
        <YAxis
          dataKey="category"
          type="category"
          stroke="#94A3B8"
          style={{ fontSize: "12px" }}
          width={80}
        />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="amount" fill="#F97316" radius={[0, 8, 8, 0]} name="المبلغ" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function AnalyticalReportsCharts() {
  const { data, loading } = useAnalyticalReports();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">تحليل الربحية</h3>
        {loading || !data
          ? <ChartSkeleton />
          : <ProfitabilityChart data={data.profitability} />
        }
      </GlassCard>

      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">تحليل المصروفات</h3>
        {loading || !data
          ? <ChartSkeleton />
          : <ExpenseChart data={data.expenseBreakdown} />
        }
      </GlassCard>

    </div>
  );
}
