// ============================================================
// AIAnalytics.types.ts
// ============================================================

export interface RiskItem {
  category: string;
  score: number;
}

export interface CostPredictionPoint {
  month: string;
  actual?: number;      // undefined for future months
  predicted: number;
}

export interface CashFlowPoint {
  month: string;
  inflow: number;
  outflow: number;
}

export type InsightRisk = "high" | "medium" | "low";

export interface AIInsight {
  title: string;
  description: string;
  risk: InsightRisk;
  /** Maps to a Lucide icon in the component */
  iconKey: "trending" | "alert" | "cart" | "shield";
  confidence: string;
}

export type RecommendationPriority = "عالية" | "متوسطة" | "منخفضة";

export interface AIRecommendation {
  title: string;
  action: string;
  impact: string;
  priority: RecommendationPriority;
}

export interface AIHealthData {
  score: number;
  label: string;
  successRate: number;
  riskLevel: string;
  lastUpdated: string;
}

export interface AIAnalyticsData {
  health: AIHealthData;
  riskAssessment: RiskItem[];
  costPrediction: CostPredictionPoint[];
  cashFlowForecast: CashFlowPoint[];
  insights: AIInsight[];
  recommendations: AIRecommendation[];
}

// ── Component Props ────────────────────────────────────────────

export interface AIHealthScoreProps {
  health: AIHealthData;
}

export interface RiskRadarProps {
  data: RiskItem[];
}

export interface AIInsightsProps {
  insights: AIInsight[];
}

export interface PredictionChartsProps {
  costPrediction: CostPredictionPoint[];
  cashFlowForecast: CashFlowPoint[];
}

export interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  onApply: (index: number) => Promise<void>;
}
