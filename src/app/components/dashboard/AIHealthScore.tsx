import { useEffect, useState } from "react";
import GlassCard from "../../core/shared/components/GlassCard";
import { dashboardService } from "../../core/services/dashboard.service";
import type { AIHealthScoreModel } from "../../core/models/dashboard.types";

function AIHealthScore() {
  const [health, setHealth] = useState<AIHealthScoreModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHealth() {
      const data = await dashboardService.getAIHealthScore();
      setHealth(data);
      setLoading(false);
    }

    loadHealth();
  }, []);

  if (loading || !health) {
    return <div className="text-white">Loading...</div>;
  }

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - health.score / 100);

  const statusLabel: Record<string, string> = {
    excellent: "ممتاز",
    good: "جيد",
    warning: "تحذير",
    critical: "خطر",
  };

  const statusColor: Record<string, string> = {
    excellent: "text-emerald-400",
    good: "text-emerald-500",
    warning: "text-yellow-400",
    critical: "text-red-500",
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            مؤشر صحة المشروع (AI)
          </h3>
          <p className="text-gray-400">
            تحليل شامل لأداء المشروع بالذكاء الاصطناعي
          </p>
        </div>

        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-700"
            />

            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={statusColor[health.status]}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {health.score}
              </div>

              <div className={`text-xs ${statusColor[health.status]}`}>
                {statusLabel[health.status]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default AIHealthScore;
