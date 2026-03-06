// ============================================================
// Dashboard.tsx — page
// Single fetchAll() call → one loading state for the whole page.
// All data passed down as props — no component fetches its own data.
// ============================================================
import { useEffect, useState } from "react";
import DashboardHeader  from "../components/dashboard/DashboardHeader";
import KPICards         from "../components/dashboard/KPICards";
import AIHealthScore    from "../components/dashboard/AIHealthScore";
import ChartsGrid       from "../components/dashboard/ChartsGrid";
import AIAlertPanel     from "../components/dashboard/AIAlertPanel";
import { dashboardService } from "../core/services/dashboard.service";
import { useLang }          from "../core/context/LangContext";
import { tDash }            from "../core/i18n/dashboard.i18n";
import type { DashboardData } from "../core/models/dashboard.types";

export default function Dashboard() {
  const { lang } = useLang();
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    dashboardService.fetchAll()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── Single full-page loading skeleton ────────────────────
  if (loading) {
    return (
      <div className="space-y-8">
        <DashboardHeader lang={lang} />
        {/* KPI skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        {/* Health + charts skeletons */}
        <div className="h-28 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        {/* Alerts skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm">{tDash(lang, "loading")}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tDash(lang, "loadError")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader lang={lang} />

      <KPICards kpis={data.kpis} lang={lang} />

      <AIHealthScore health={data.healthScore} lang={lang} />

      <ChartsGrid
        data={{
          revenueExpense: data.revenueExpense,
          profit:         data.profit,
          cashFlow:       data.cashFlow,
          budgetActual:   data.budgetActual,
        }}
        lang={lang}
      />

      <AIAlertPanel alerts={data.aiAlerts} lang={lang} />
    </div>
  );
}
