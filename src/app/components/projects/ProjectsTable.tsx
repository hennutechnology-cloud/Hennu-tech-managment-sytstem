import { motion } from "motion/react";
import { Building2 } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { Project } from "../../core/models/projects.types";

interface ProjectsTableProps {
  projects: Project[];
  selectedProjectId?: number;
  onSelect: (project: Project) => void;
}

const riskBadges = {
  low: { label: "منخفض", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { label: "متوسط", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  high: { label: "مرتفع", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function ProjectTable({ projects, selectedProjectId, onSelect }: ProjectsTableProps) {
  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-4 px-4 text-gray-400 font-medium">اسم المشروع</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">الميزانية</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">التكلفة الفعلية</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">نسبة الإنجاز</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">هامش الربح</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">مستوى المخاطرة</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <motion.tr
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                  selectedProjectId === project.id ? "bg-white/10" : ""
                }`}
                onClick={() => onSelect(project)}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F97316]/20 rounded-lg">
                      <Building2 className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <span className="text-white font-medium">{project.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-white">
                  {project.budget.toLocaleString()} ر.س
                </td>
                <td className="py-4 px-4 text-white">
                  {project.actualCost.toLocaleString()} ر.س
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-l from-[#F97316] to-[#EA580C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-12">{project.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-emerald-400 font-medium">{project.profitMargin}%</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-lg border text-sm ${riskBadges[project.riskLevel].color}`}>
                    {riskBadges[project.riskLevel].label}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button
                    className={`px-4 py-2 rounded-lg text-white transition-colors text-sm ${
                      selectedProjectId === project.id
                        ? "bg-[#F97316]/30 border border-[#F97316]/50"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(project);
                    }}
                  >
                    عرض التفاصيل
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
