import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../../core/shared/components/GlassCard";
import {
  AlertTriangle,
  TrendingDown,
  Activity,
} from "lucide-react";

import { dashboardService } from "../../core/services/dashboard.service";
import type { AiAlert } from "../../core/models/dashboard.types";

function AIAlertPanel() {
  const [alerts, setAlerts] = useState<AiAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      const data = await dashboardService.getAiAlerts();
      setAlerts(data);
      setLoading(false);
    }

    loadAlerts();
  }, []);

  const getAlertIcon = (type: AiAlert["iconType"]) => {
    switch (type) {
      case "alert":
        return AlertTriangle;
      case "trend":
        return TrendingDown;
      case "activity":
        return Activity;
      default:
        return AlertTriangle;
    }
  };

  const riskColors = {
    high: "from-red-500/20 to-red-600/10 border-red-500/30",
    medium: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    low: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-[#F97316]" />
        تنبيهات الذكاء الاصطناعي
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert, index) => {
          const Icon = getAlertIcon(alert.iconType);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className={`bg-gradient-to-br ${
                  riskColors[alert.risk]
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-6 h-6 text-[#F97316] flex-shrink-0 mt-1" />

                  <div>
                    <h4 className="font-bold text-white mb-2">
                      {alert.title}
                    </h4>

                    <p className="text-sm text-gray-300 leading-relaxed">
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

export default AIAlertPanel;
