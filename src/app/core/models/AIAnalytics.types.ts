// ============================================================
// AIAnalytics.types.ts
// ============================================================
import type { Lang } from "./Settings.types";

export type InsightRisk            = "high" | "medium" | "low";
export type RecommendationPriority = "high" | "medium" | "low";
export type HealthLabelKey         = "good" | "fair" | "poor";
export type RiskLevelKey           = "low" | "medium" | "high" | "critical";
export type RiskCategoryKey        = "cost" | "quality" | "time" | "liquidity" | "compliance" | "resources";

// ── API shapes ────────────────────────────────────────────────

export interface RiskItem {
  categoryKey: RiskCategoryKey; // fixed enum → resolved by i18n
  score:       number;
}

export interface CostPredictionPoint {
  month:      number;   // 1–12 → formatted by util.i18n
  actual?:    number;
  predicted:  number;
}

export interface CashFlowPoint {
  month:   number;      // 1–12
  inflow:  number;
  outflow: number;
}

export interface AIInsight {
  title:       string;  // ← plain string from API, already in user's language
  description: string;  // ← plain string from API, already in user's language
  risk:        InsightRisk;
  iconKey:     "trending" | "alert" | "cart" | "shield"; // fixed enum → i18n not needed
  confidence:  number;  // 0–100, component adds "%"
}

export interface AIRecommendation {
  title:    string;                  // ← plain string from API
  action:   string;                  // ← plain string from API
  impact:   string;                  // ← plain string from API (already formatted)
  priority: RecommendationPriority;  // fixed enum → resolved by i18n
}

export interface AIHealthData {
  score:          number;
  labelKey:       HealthLabelKey;  // fixed enum → resolved by i18n
  successRate:    number;
  riskLevelKey:   RiskLevelKey;    // fixed enum → resolved by i18n
  lastUpdatedIso: string;          // ISO 8601 → formatted by util.i18n
}

export interface AIAnalyticsData {
  health:           AIHealthData;
  riskAssessment:   RiskItem[];
  costPrediction:   CostPredictionPoint[];
  cashFlowForecast: CashFlowPoint[];
  insights:         AIInsight[];
  recommendations:  AIRecommendation[];
}

// ── Component prop types ──────────────────────────────────────

export interface AIHealthScoreProps   { health: AIHealthData;             lang: Lang; }
export interface RiskRadarProps       { data:   RiskItem[];               lang: Lang; }
export interface AIInsightsProps      { insights: AIInsight[];            lang: Lang; }
export interface PredictionChartsProps {
  costPrediction:   CostPredictionPoint[];
  cashFlowForecast: CashFlowPoint[];
  lang:             Lang;
}
export interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  onApply:         (index: number) => Promise<void>;
  lang:            Lang;
}
