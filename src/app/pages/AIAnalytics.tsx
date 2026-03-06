// ============================================================
// AIAnalytics.tsx  (page)
// ============================================================
import { useEffect, useState } from "react";
import AIHeader                    from "../components/AI_analytics/AIHeader";
import { HealthScoreCard, RiskRadarCard }
                                   from "../components/AI_analytics/AIHealthScore";
import AIInsights                  from "../components/AI_analytics/AIInsights";
import PredictionCharts            from "../components/AI_analytics/PredictionCharts";
import AIRecommendations           from "../components/AI_analytics/AIRecommendations";
import { fetchAIAnalytics, applyRecommendation }
                                   from "../core/services/AIAnalytics.service";
import type { AIAnalyticsData }    from "../core/models/AIAnalytics.types";
import { useLang }                 from "../core/context/LangContext";
import { tAI }                     from "../core/i18n/aiAnalytics.i18n";

export default function AIAnalytics() {
  const [data,    setData]    = useState<AIAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();

  // Service returns language-neutral data — no need to re-fetch on lang change
  useEffect(() => {
    fetchAIAnalytics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <span className="w-8 h-8 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
          <span>{tAI(lang, "loading")}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-gray-500 py-20">{tAI(lang, "loadError")}</p>;
  }

  return (
    <div className="space-y-8">
      <AIHeader lang={lang} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HealthScoreCard health={data.health}       lang={lang} />
        <RiskRadarCard   data={data.riskAssessment} lang={lang} />
      </div>

      <AIInsights insights={data.insights} lang={lang} />

      <PredictionCharts
        costPrediction={data.costPrediction}
        cashFlowForecast={data.cashFlowForecast}
        lang={lang}
      />

      <AIRecommendations
        recommendations={data.recommendations}
        onApply={applyRecommendation}
        lang={lang}
      />
    </div>
  );
}
