// ============================================================
// ProjectsTable.tsx
// project.name is a plain API string — rendered directly.
// Column headers, button labels, risk badges go through tProj().
//
// UX rules:
//   • Clicking anywhere on a row (except the action buttons)
//     calls onSelect(project) — updates ProjectDetails below.
//   • The currently-selected row gets a visible highlight.
//   • Action button clicks call stopPropagation so they never
//     also trigger onSelect.
// ============================================================
import { motion }    from "motion/react";
import { Building2, Eye, Pencil, Trash2 } from "lucide-react";
import GlassCard     from "../../core/shared/components/GlassCard";
import { tProj, resolveRiskBadge, formatNum, dirAttr, flip }
                     from "../../core/i18n/projects.i18n";
import type { ProjectsTableProps } from "../../core/models/projects.types";

export default function ProjectsTable({
  projects, lang, selectedProjectId, onSelect, onView, onEdit, onDelete,
}: ProjectsTableProps) {
  const isAr = lang === "ar";

  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full" dir={dirAttr(lang)}>
          <thead>
            <tr className="border-b border-white/10">
              {[
                "colName", "colBudget", "colActualCost",
                "colProgress", "colProfitMargin", "colRisk", "colActions",
              ].map((key) => (
                <th
                  key={key}
                  className={`py-4 px-4 text-gray-400 font-medium ${
                    flip(lang, "text-left", "text-right")
                  }`}
                >
                  {tProj(lang, key as any)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {projects.map((project, index) => {
              const badge      = resolveRiskBadge(lang, project.riskLevel);
              const isSelected = project.id === selectedProjectId;

              return (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  onClick={() => onSelect(project)}
                  className={`
                    border-b border-white/5 transition-colors cursor-pointer group
                    ${isSelected
                      ? "bg-orange-500/10 border-l-2 border-l-orange-500"
                      : "hover:bg-white/5"
                    }
                  `}
                >
                  {/* Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isSelected ? "bg-[#F97316]/30" : "bg-[#F97316]/20"
                      }`}>
                        <Building2 className="w-5 h-5 text-[#F97316]" />
                      </div>
                      <span className={`font-medium transition-colors ${
                        isSelected ? "text-orange-300" : "text-white"
                      }`}>
                        {project.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                          {tProj(lang, "detailsTitle")}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="py-4 px-4 text-white whitespace-nowrap">
                    {formatNum(project.budget, lang)}{" "}
                    <span className="text-gray-500 text-xs">{tProj(lang, "currency")}</span>
                  </td>

                  {/* Actual Cost */}
                  <td className="py-4 px-4 text-white whitespace-nowrap">
                    {formatNum(project.actualCost, lang)}{" "}
                    <span className="text-gray-500 text-xs">{tProj(lang, "currency")}</span>
                  </td>

                  {/* Progress bar */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-l from-[#F97316] to-[#EA580C] h-full rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-white font-medium w-10 shrink-0">
                        {project.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Profit margin */}
                  <td className="py-4 px-4">
                    <span className="text-emerald-400 font-medium">
                      {project.profitMargin}%
                    </span>
                  </td>

                  {/* Risk badge */}
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg border text-sm ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>

                  {/* Actions — stopPropagation prevents row-click from firing */}
                  <td
                    className="py-4 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={`flex items-center gap-2 ${isAr ? "justify-start" : "justify-end"}`}>
                      {/* View */}
                      <button
                        onClick={() => onView(project)}
                        title={tProj(lang, "view")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => onEdit(project)}
                        title={tProj(lang, "edit")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-amber-400"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => onDelete(project)}
                        title={tProj(lang, "delete")}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
