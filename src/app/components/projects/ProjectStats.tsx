// ============================================================
// ProjectStats.tsx
// ============================================================
import { Building2, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion }              from "motion/react";
import GlassCard               from "../../core/shared/components/GlassCard";
import { tProj, dirAttr }      from "../../core/i18n/projects.i18n";
import type { ProjectStatsProps } from "../../core/models/projects.types";

export default function ProjectStats({ stats, lang }: ProjectStatsProps) {
  const cards = [
    { key: "statsTotal",     value: stats.total,     icon: Building2,    color: "text-[#F97316]"   },
    { key: "statsActive",    value: stats.active,    icon: Clock,         color: "text-blue-400"    },
    { key: "statsCompleted", value: stats.completed, icon: CheckCircle2,  color: "text-emerald-400" },
    { key: "statsDelayed",   value: stats.delayed,   icon: AlertTriangle, color: "text-red-400"     },
  ] as const;

  return (
    <div dir={dirAttr(lang)} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {cards.map(({ key, value, icon: Icon, color }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <GlassCard hover>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">{tProj(lang, key)}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{value}</h3>
              </div>
              <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${color} shrink-0`} />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
