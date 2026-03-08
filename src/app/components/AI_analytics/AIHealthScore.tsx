// ============================================================
// AIHealthScore.tsx — responsive: mobile / tablet / desktop
// Mobile:  HealthScoreCard stacks above RiskRadarCard (full width)
// Tablet:  side-by-side (1/3 + 2/3 split)
// Desktop: same side-by-side with lg:col-span class hints
// RTL:     stat rows flip via flex-row-reverse
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  tAI, resolveHealthLabel, resolveRiskLevel, resolveRiskCategory,
} from "../../core/i18n/aiAnalytics.i18n";
import { tUtil } from "../../core/i18n/util.i18n";
import type {
  AIHealthScoreProps, RiskRadarProps, RiskItem,
} from "../../core/models/AIAnalytics.types";

const CIRCUMFERENCE = 2 * Math.PI * 70;

function ringColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#F97316";
  return "#ef4444";
}

// ── Score ring SVG — size scales between mobile and desktop ──
function ScoreRing({ score, label }: { score: number; label: string }) {
  const offset = CIRCUMFERENCE * (1 - score / 100);
  const color  = ringColor(score);

  return (
    // w-32 h-32 on mobile → w-40 h-40 on sm+
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 160 160">
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
          <div className="text-4xl sm:text-5xl font-bold text-white">{score}</div>
          <div className="text-xs sm:text-sm text-gray-400 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}

// ── Health Score card ─────────────────────────────────────────
export function HealthScoreCard({ health, lang }: AIHealthScoreProps) {
  const label       = resolveHealthLabel(lang, health.labelKey);
  const riskDisplay = resolveRiskLevel(lang, health.riskLevelKey);
  const isRtl       = lang === "ar";

  const updatedDate = new Date(health.lastUpdatedIso);
  const hoursAgo    = Math.round((Date.now() - updatedDate.getTime()) / 3_600_000);
  const lastUpdated = hoursAgo <= 1
    ? tUtil(lang, "oneHourAgo")
    : tUtil(lang, "hoursAgo").replace("{n}", String(hoursAgo));

  return (
    <GlassCard className="p-4 sm:p-6 lg:col-span-1">
      <div className="flex flex-col items-center">
        <h3 className={`text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 w-full
                         ${isRtl ? "text-right" : "text-left"}`}>
          {tAI(lang, "healthTitle")}
        </h3>

        <ScoreRing score={health.score} label={label} />

        <div className="w-full space-y-2.5 mt-2">
          {[
            { label: tAI(lang, "successRateLabel"), value: `${health.successRate}%`,  cls: "text-emerald-400" },
            { label: tAI(lang, "riskLevelLabel"),   value: riskDisplay,               cls: "text-orange-400"  },
            { label: tAI(lang, "lastUpdatedLabel"), value: lastUpdated,               cls: "text-gray-400"    },
          ].map(({ label: lbl, value, cls }) => (
            <div
              key={lbl}
              className={`flex items-center justify-between text-sm gap-2
                          ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <span className="text-gray-400 truncate">{lbl}</span>
              <span className={`${cls} font-medium shrink-0`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

// ── Risk Radar card ───────────────────────────────────────────
export function RiskRadarCard({ data, lang }: RiskRadarProps) {
  const isRtl = lang === "ar";

  const translated: { category: string; score: number }[] = data.map((item: RiskItem) => ({
    category: resolveRiskCategory(lang, item.categoryKey),
    score:    item.score,
  }));

  return (
    <GlassCard className="p-4 sm:p-6 lg:col-span-2">
      <h3 className={`text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6
                       ${isRtl ? "text-right" : "text-left"}`}>
        {tAI(lang, "riskRadarTitle")}
      </h3>

      {/* Chart height: shorter on mobile */}
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={translated} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="category"
            stroke="#94A3B8"
            style={{ fontSize: "11px" }}
            tick={{ fill: "#94A3B8", fontSize: 11 }}
          />
          <PolarRadiusAxis
            stroke="#94A3B8"
            style={{ fontSize: "9px" }}
            tick={{ fill: "#94A3B8", fontSize: 9 }}
          />
          <Radar
            name={tAI(lang, "radarSeriesName")}
            dataKey="score"
            stroke="#F97316"
            fill="#F97316"
            fillOpacity={0.55}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30,41,59,0.95)",
              border:          "1px solid rgba(255,255,255,0.1)",
              borderRadius:    "12px",
              color:           "#fff",
              fontSize:        "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
