// ============================================================
// AIAnalytics.tsx  (page)
// ============================================================
import { useEffect, useState } from "react";
import AIHeader             from "../components/AI_analytics/AIHeader";
import { HealthScoreCard, RiskRadarCard }
                            from "../components/AI_analytics/AIHealthScore";
import AIInsights           from "../components/AI_analytics/AIInsights";
import PredictionCharts     from "../components/AI_analytics/PredictionCharts";
import AIRecommendations    from "../components/AI_analytics/AIRecommendations";
import {
  fetchAIAnalytics,
  applyRecommendation,
}                           from "../core/services/AIAnalytics.service";
import type { AIAnalyticsData } from "../core/models/AIAnalytics.types";

export default function AIAnalytics() {
  const [data,    setData]    = useState<AIAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIAnalytics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <span className="w-8 h-8 border-2 border-gray-600 border-t-orange-500
                           rounded-full animate-spin" />
          <span>جارٍ تحليل البيانات بالذكاء الاصطناعي…</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-center text-gray-500 py-20">تعذّر تحميل بيانات التحليل</p>
    );
  }

  return (
    <div className="space-y-8">

      {/* 1. Header */}
      <AIHeader />

      {/* 2. AI Health Score  +  Risk Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HealthScoreCard health={data.health} />
        <RiskRadarCard   data={data.riskAssessment} />
      </div>

      {/* 3. AI Insights */}
      <AIInsights insights={data.insights} />

      {/* 4. Prediction Charts */}
      <PredictionCharts
        costPrediction={data.costPrediction}
        cashFlowForecast={data.cashFlowForecast}
      />

      {/* 5. AI Recommendations */}
      <AIRecommendations
        recommendations={data.recommendations}
        onApply={applyRecommendation}
      />

    </div>
  );
}
