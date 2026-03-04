import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import { dashboardService } from "../../core/services/dashboard.service";
import type { KPI } from "../../core/models/dashboard.types";

function KPICards() {
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKpis() {
      const data = await dashboardService.getKpis();
      setKpiData(data);
      setLoading(false);
    }

    loadKpis();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">{kpi.title}</p>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {kpi.value.toLocaleString()}{" "}
                  <span className="text-sm text-gray-400">ر.س</span>
                </h3>

                <div className="flex items-center gap-2">
                  {kpi.isPositive ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}

                  <span
                    className={`text-sm ${
                      kpi.isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>

              <div
                className={`p-3 bg-gradient-to-br ${kpi.color} rounded-xl shadow-lg`}
              />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

export default KPICards;
