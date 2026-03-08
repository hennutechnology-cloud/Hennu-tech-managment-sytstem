// ============================================================
// ProjectsTable.tsx — Responsive
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

      {/* ── MOBILE CARD VIEW (< md) ── */}
      <div className="md:hidden flex flex-col gap-4" dir={dirAttr(lang)}>
        {projects.map((project, index) => {
          const badge      = resolveRiskBadge(lang, project.riskLevel);
          const isSelected = project.id === selectedProjectId;

          // Derive a spend-vs-budget colour for the cost indicator
          const overBudget = project.actualCost > project.budget;
          const costColor  = overBudget ? "text-red-400" : "text-emerald-400";

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              onClick={() => onSelect(project)}
              className={`rounded-2xl border cursor-pointer transition-all active:scale-[0.99] overflow-hidden ${
                isSelected
                  ? "border-orange-500/50 shadow-lg shadow-orange-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* ── Selected accent strip ── */}
              {isSelected && (
                <div className="h-0.5 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C]" />
              )}

              <div className={`px-4 py-4 flex flex-col gap-4 ${isSelected ? "bg-orange-500/[0.07]" : "bg-white/[0.03]"}`}>

                {/* Row 1: icon + name + risk badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-[#F97316]/25" : "bg-[#F97316]/15"}`}>
                      <Building2 className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm leading-snug truncate ${isSelected ? "text-orange-300" : "text-white"}`}>
                        {project.name}
                      </p>
                      {isSelected && (
                        <p className="text-[10px] text-orange-400/70 mt-0.5">
                          {tProj(lang, "detailsTitle")}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-medium shrink-0 ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Row 2: progress bar with label */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-gray-500">{tProj(lang, "colProgress")}</span>
                    <span className={`text-xs font-bold ${isSelected ? "text-orange-300" : "text-white"}`}>
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/60 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.07 + 0.1 }}
                      className="bg-gradient-to-l from-[#F97316] to-[#EA580C] h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Row 3: Budget / Actual / Margin chips */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5 bg-white/[0.05] rounded-xl px-3 py-2.5">
                    <span className="text-[10px] text-gray-500 leading-none">{tProj(lang, "colBudget")}</span>
                    <span className="text-xs text-white font-semibold mt-1 leading-none">
                      {formatNum(project.budget, lang)}
                    </span>
                    <span className="text-[10px] text-gray-600 leading-none">{tProj(lang, "currency")}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-white/[0.05] rounded-xl px-3 py-2.5">
                    <span className="text-[10px] text-gray-500 leading-none">{tProj(lang, "colActualCost")}</span>
                    <span className={`text-xs font-semibold mt-1 leading-none ${costColor}`}>
                      {formatNum(project.actualCost, lang)}
                    </span>
                    <span className="text-[10px] text-gray-600 leading-none">{tProj(lang, "currency")}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 bg-white/[0.05] rounded-xl px-3 py-2.5">
                    <span className="text-[10px] text-gray-500 leading-none">{tProj(lang, "colProfitMargin")}</span>
                    <span className="text-sm font-bold mt-1 leading-none text-emerald-400">
                      {project.profitMargin}%
                    </span>
                  </div>
                </div>

                {/* Row 4: Action buttons — full-width, labelled, easy tap targets */}
                <div
                  className="grid grid-cols-3 gap-2 pt-1 border-t border-white/8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onView(project)}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 active:bg-blue-500/30 border border-blue-500/20 rounded-xl transition-colors text-blue-400 text-xs font-medium"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    {tProj(lang, "view")}
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 border border-amber-500/20 rounded-xl transition-colors text-amber-400 text-xs font-medium"
                  >
                    <Pencil className="w-3.5 h-3.5 shrink-0" />
                    {tProj(lang, "edit")}
                  </button>
                  <button
                    onClick={() => onDelete(project)}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 border border-red-500/20 rounded-xl transition-colors text-red-400 text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    {tProj(lang, "delete")}
                  </button>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── TABLE VIEW (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" dir={dirAttr(lang)}>
          <thead>
            <tr className="border-b border-white/10">
              {[
                "colName", "colBudget", "colActualCost",
                "colProgress", "colProfitMargin", "colRisk", "colActions",
              ].map((key) => (
                <th key={key} className={`py-4 px-4 text-gray-400 font-medium ${flip(lang, "text-left", "text-right")}`}>
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
                  className={`border-b border-white/5 transition-colors cursor-pointer group ${
                    isSelected ? "bg-orange-500/10 border-l-2 border-l-orange-500" : "hover:bg-white/5"
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-[#F97316]/30" : "bg-[#F97316]/20"}`}>
                        <Building2 className="w-5 h-5 text-[#F97316]" />
                      </div>
                      <span className={`font-medium ${isSelected ? "text-orange-300" : "text-white"}`}>
                        {project.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                          {tProj(lang, "detailsTitle")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white whitespace-nowrap">
                    {formatNum(project.budget, lang)}{" "}
                    <span className="text-gray-500 text-xs">{tProj(lang, "currency")}</span>
                  </td>
                  <td className="py-4 px-4 text-white whitespace-nowrap">
                    {formatNum(project.actualCost, lang)}{" "}
                    <span className="text-gray-500 text-xs">{tProj(lang, "currency")}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-l from-[#F97316] to-[#EA580C] h-full rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-white font-medium w-10 shrink-0">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-emerald-400 font-medium">{project.profitMargin}%</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg border text-sm ${badge.className}`}>{badge.label}</span>
                  </td>
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className={`flex items-center gap-2 ${isAr ? "justify-start" : "justify-end"}`}>
                      <button onClick={() => onView(project)} title={tProj(lang, "view")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEdit(project)} title={tProj(lang, "edit")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-amber-400">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(project)} title={tProj(lang, "delete")}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
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
