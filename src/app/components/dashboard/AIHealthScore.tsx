// ============================================================
// AIHealthScore.tsx — Responsive
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import { tDash, resolveHealthStatus, HEALTH_STATUS_COLOR }
                 from "../../core/i18n/dashboard.i18n";
import type { AIHealthScoreProps } from "../../core/models/dashboard.types";

export default function AIHealthScore({ health, lang }: AIHealthScoreProps) {
  // Gauge params — two sizes
  const smRadius = 44;   // mobile  (svg 96×96, cx/cy = 48)
  const lgRadius = 56;   // sm+     (svg 128×128, cx/cy = 64)

  const smCircumference = 2 * Math.PI * smRadius;
  const lgCircumference = 2 * Math.PI * lgRadius;

  const smOffset = smCircumference * (1 - health.score / 100);
  const lgOffset = lgCircumference * (1 - health.score / 100);

  const colorClass = HEALTH_STATUS_COLOR[health.status];

  return (
    <GlassCard>
      {/* Stack on mobile, row on sm+ */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Text */}
        <div className="text-center sm:text-start">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
            {tDash(lang, "healthTitle")}
          </h3>
          <p className="text-sm text-gray-400">{tDash(lang, "healthSubtitle")}</p>
        </div>

        {/* Gauge — small on mobile */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
          {/* Mobile SVG */}
          <svg className="block sm:hidden transform -rotate-90 w-24 h-24">
            <circle cx="48" cy="48" r={smRadius} stroke="currentColor" strokeWidth="7"
              fill="transparent" className="text-gray-700" />
            <circle cx="48" cy="48" r={smRadius} stroke="currentColor" strokeWidth="7"
              fill="transparent"
              strokeDasharray={smCircumference}
              strokeDashoffset={smOffset}
              className={colorClass}
              strokeLinecap="round" />
          </svg>
          {/* Desktop SVG */}
          <svg className="hidden sm:block transform -rotate-90 w-32 h-32">
            <circle cx="64" cy="64" r={lgRadius} stroke="currentColor" strokeWidth="8"
              fill="transparent" className="text-gray-700" />
            <circle cx="64" cy="64" r={lgRadius} stroke="currentColor" strokeWidth="8"
              fill="transparent"
              strokeDasharray={lgCircumference}
              strokeDashoffset={lgOffset}
              className={colorClass}
              strokeLinecap="round" />
          </svg>

          {/* Score overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{health.score}</div>
              <div className={`text-[10px] sm:text-xs ${colorClass}`}>
                {resolveHealthStatus(lang, health.status)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
