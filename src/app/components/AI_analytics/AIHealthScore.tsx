// ============================================================
// AIHealthScore.tsx
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from "recharts";
import { tAI, resolveHealthLabel, resolveRiskLevel, resolveRiskCategory } from "../../core/i18n/aiAnalytics.i18n";
import { tUtil }                from "../../core/i18n/util.i18n";
import type { AIHealthScoreProps, RiskRadarProps, RiskItem } from "../../core/models/AIAnalytics.types";

const CIRCUMFERENCE = 2 * Math.PI * 70;

function ringColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#F97316";
  return "#ef4444";
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const offset = CIRCUMFERENCE * (1 - score / 100);
  const color  = ringColor(score);
  return (
    <div className="relative w-40 h-40 mb-4">
      <svg className="transform -rotate-90 w-40 h-40">
        <circle cx="80" cy="80" r="70" stroke="#374151" strokeWidth="12" fill="transparent" />
        <circle
          cx="80" cy="80" r="70"
          stroke={color} strokeWidth="12" fill="transparent"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold text-white">{score}</div>
          <div className="text-sm text-gray-400 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}

export function HealthScoreCard({ health, lang }: AIHealthScoreProps) {
  // Translate API keys → display strings here, not in the service
  const label       = resolveHealthLabel(lang, health.labelKey);
  const riskDisplay = resolveRiskLevel(lang, health.riskLevelKey);

  // Format ISO date using util.i18n relative time
  const updatedDate = new Date(health.lastUpdatedIso);
  const hoursAgo    = Math.round((Date.now() - updatedDate.getTime()) / 3_600_000);
  const lastUpdated = hoursAgo <= 1
    ? tUtil(lang, "oneHourAgo")
    : tUtil(lang, "hoursAgo").replace("{n}", String(hoursAgo));

  return (
    <GlassCard className="lg:col-span-1">
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-white mb-6">{tAI(lang, "healthTitle")}</h3>
        <ScoreRing score={health.score} label={label} />
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{tAI(lang, "successRateLabel")}</span>
            <span className="text-emerald-400 font-medium">{health.successRate}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{tAI(lang, "riskLevelLabel")}</span>
            <span className="text-orange-400 font-medium">{riskDisplay}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{tAI(lang, "lastUpdatedLabel")}</span>
            <span className="text-gray-400">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function RiskRadarCard({ data, lang }: RiskRadarProps) {
  // Translate categoryKey → display label for the chart axis
  const translated: { category: string; score: number }[] = data.map((item: RiskItem) => ({
    category: resolveRiskCategory(lang, item.categoryKey),
    score:    item.score,
  }));

  return (
    <GlassCard className="lg:col-span-2">
      <h3 className="text-xl font-bold text-white mb-6">{tAI(lang, "riskRadarTitle")}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={translated}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="category" stroke="#94A3B8" style={{ fontSize: "12px" }} />
          <PolarRadiusAxis stroke="#94A3B8" style={{ fontSize: "10px" }} />
          <Radar
            name={tAI(lang, "radarSeriesName")} dataKey="score"
            stroke="#F97316" fill="#F97316" fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30,41,59,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#fff",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
