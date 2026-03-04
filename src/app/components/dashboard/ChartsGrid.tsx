import { useEffect, useState } from "react";
import GlassCard from "../../core/shared/components/GlassCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { dashboardService } from "../../core/services/dashboard.service";
import type {
  RevenueExpense,
  Profit,
  CashFlow,
  BudgetActual,
} from "../../core/models/dashboard.types";

function ChartsGrid() {
  const [revenueExpenseData, setRevenueExpenseData] = useState<RevenueExpense[]>([]);
  const [profitData, setProfitData] = useState<Profit[]>([]);
  const [cashFlowData, setCashFlowData] = useState<CashFlow[]>([]);
  const [budgetActualData, setBudgetActualData] = useState<BudgetActual[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCharts() {
      const [
        revenue,
        profit,
        cashFlow,
        budgetActual,
      ] = await Promise.all([
        dashboardService.getRevenueExpenseData(),
        dashboardService.getProfitData(),
        dashboardService.getCashFlowData(),
        dashboardService.getBudgetActualData(),
      ]);

      setRevenueExpenseData(revenue);
      setProfitData(profit);
      setCashFlowData(cashFlow);
      setBudgetActualData(budgetActual);
      setLoading(false);
    }

    loadCharts();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Revenue vs Expenses */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">
          الإيرادات مقابل المصروفات
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueExpenseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={3}
              name="الإيرادات"
            />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={3}
              name="المصروفات"
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Monthly Profit */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">
          صافي الربح الشهري
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip />

            <Bar
              dataKey="profit"
              fill="#F97316"
              radius={[8, 8, 0, 0]}
              name="الربح"
            />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Cash Flow Forecast */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">
          توقعات التدفق النقدي
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="cashFlow"
              stroke="#3B82F6"
              fill="#3B82F6"
              strokeWidth={3}
              name="التدفق النقدي"
            />
          </AreaChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-400 mt-2 text-center">
          * البيانات المستقبلية هي توقعات بناءً على الذكاء الاصطناعي
        </p>
      </GlassCard>

      {/* Budget vs Actual */}
      <GlassCard>
        <h3 className="text-xl font-bold text-white mb-6">
          الميزانية مقابل الفعلي
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetActualData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" stroke="#94A3B8" />
            <YAxis
              dataKey="category"
              type="category"
              stroke="#94A3B8"
              width={100}
            />
            <Tooltip />
            <Legend />

            <Bar dataKey="budget" fill="#94A3B8" name="الميزانية" />
            <Bar dataKey="actual" fill="#F97316" name="الفعلي" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

    </div>
  );
}

export default ChartsGrid;
