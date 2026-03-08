// ============================================================
// AIAlertPanel.tsx — Responsive
// ============================================================
import { motion }          from "motion/react";
import { AlertTriangle, TrendingDown, Activity } from "lucide-react";
import GlassCard           from "../../core/shared/components/GlassCard";
import { tDash, RISK_GRADIENT } from "../../core/i18n/dashboard.i18n";
import type { AIAlertPanelProps, AiAlert } from "../../core/models/dashboard.types";
import type { Lang } from "../../core/models/Settings.types";

function getAlertIcon(type: AiAlert["iconType"]) {
  switch (type) {
    case "alert":    return AlertTriangle;
    case "trend":    return TrendingDown;
    case "activity": return Activity;
    default:         return AlertTriangle;
  }
}

export default function AIAlertPanel({ alerts, lang }: AIAlertPanelProps) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316] shrink-0" />
        {tDash(lang, "alertsTitle")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {alerts.map((alert, index) => {
          const Icon = getAlertIcon(alert.iconType);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className={`bg-gradient-to-br ${RISK_GRADIENT[alert.risk]}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316] flex-shrink-0 mt-0.5 sm:mt-1" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white mb-1 sm:mb-2 text-sm sm:text-base">
                      {alert.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
