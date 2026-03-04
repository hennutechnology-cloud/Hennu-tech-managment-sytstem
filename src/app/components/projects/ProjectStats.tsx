import { motion } from "motion/react";
import { Building2, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { Project } from "../../core/models/projects.types";

interface ProjectsStatsProps {
  projects: Project[];
}

export default function ProjectsStats({ projects }: ProjectsStatsProps) {
  const stats = [
    {
      label: "إجمالي المشاريع",
      value: projects.length,
      icon: Building2,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      border: "border-blue-500/30",
    },
    {
      label: "المشاريع النشطة",
      value: projects.filter((p) => p.status === "active").length,
      icon: Clock,
      color: "text-[#F97316]",
      bg: "bg-[#F97316]/20",
      border: "border-[#F97316]/30",
    },
    {
      label: "المشاريع المكتملة",
      value: projects.filter((p) => p.status === "completed").length,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/30",
    },
    {
      label: "المشاريع المتأخرة",
      value: projects.filter((p) => p.status === "delayed").length,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/20",
      border: "border-red-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className={`border ${stat.border}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 ${stat.bg} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
