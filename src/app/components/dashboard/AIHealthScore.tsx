// ============================================================
// AIHealthScore.tsx
// health.status is a fixed enum → resolved by i18n.
// health.score is a number → rendered directly.
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { tDash, resolveHealthStatus, HEALTH_STATUS_COLOR }
                 from "../../core/i18n/dashboard.i18n";
import type { AIHealthScoreProps } from "../../core/models/dashboard.types";

export default function AIHealthScore({ health, lang }: AIHealthScoreProps) {
  const radius       = 56;
  const circumference = 2 * Math.PI * radius;
  const offset        = circumference * (1 - health.score / 100);
  const colorClass    = HEALTH_STATUS_COLOR[health.status];

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{tDash(lang, "healthTitle")}</h3>
          <p className="text-gray-400">{tDash(lang, "healthSubtitle")}</p>
        </div>

        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8"
              fill="transparent" className="text-gray-700" />
            <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={colorClass}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{health.score}</div>
              <div className={`text-xs ${colorClass}`}>
                {resolveHealthStatus(lang, health.status)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
