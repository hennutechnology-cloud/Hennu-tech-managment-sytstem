// ============================================================
// ProjectsTable.tsx — Responsive table (desktop) + card stack (mobile)
// ============================================================
import { Eye, Pencil, Trash2 }      from "lucide-react";
import { motion }                   from "motion/react";
import GlassCard                    from "../../core/shared/components/GlassCard";
import { tProj, dirAttr, resolveRiskBadge, formatNum } from "../../core/i18n/projects.i18n";
import type { ProjectsTableProps }  from "../../core/models/projects.types";

export default function ProjectsTable({
  projects, lang, selectedProjectId, onSelect, onView, onEdit, onDelete,
}: ProjectsTableProps) {
  const t   = (k: any) => tProj(lang, k);
  const dir = dirAttr(lang);
  const fmt = (n: number) => formatNum(n, lang);
  const cur = t("currency");

  if (projects.length === 0) {
    return (
      <GlassCard>
        <p className="text-center text-gray-500 py-12">{t("noProjects")}</p>
      </GlassCard>
    );
  }

  // ── Mobile: card stack ────────────────────────────────────
  const mobileCards = (
    <div className="md:hidden space-y-3">
      {projects.map((project, i) => {
        const risk = resolveRiskBadge(lang, project.riskLevel);
        const isSelected = project.id === selectedProjectId;
        return (
          <motion.div key={project.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div
              onClick={() => onSelect(project)}
              className={`cursor-pointer rounded-2xl border transition-all ${isSelected ? "border-orange-500/50" : "border-white/10 hover:border-white/20"}`}
            >
            <GlassCard
              hover
              className={`${isSelected ? "border-orange-500/50 bg-orange-500/5" : ""}`}
            >
              <div dir={dir} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-white text-sm leading-snug flex-1">{project.name}</p>
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] whitespace-nowrap ${risk.className}`}>
                    {risk.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">{t("colBudget")}</p>
                    <p className="text-white font-medium">{fmt(project.budget)} {cur}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t("colActualCost")}</p>
                    <p className="text-white font-medium">{fmt(project.actualCost)} {cur}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t("colProfitMargin")}</p>
                    <p className="text-emerald-400 font-medium">{project.profitMargin}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t("colProgress")}</p>
                    <p className="text-orange-400 font-medium">{project.progress}%</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F97316] to-[#10B981] rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                {/* Actions */}
                <div className={`flex gap-2 pt-1 ${dir === "rtl" ? "justify-start" : "justify-end"}`}
                  onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onView(project)}
                    className="p-2 rounded-lg hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(project)}
                    className="p-2 rounded-lg hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(project)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // ── Desktop: table ────────────────────────────────────────
  const desktopTable = (
    <GlassCard className="hidden md:block overflow-x-auto">
      <table className="w-full" dir={dir}>
        <thead>
          <tr className="border-b border-white/10">
            {["colProject","colBudget","colActualCost","colProgress","colProfitMargin","colRisk","colActions"].map((k) => (
              <th key={k} className="py-3 px-4 text-gray-400 font-medium text-xs text-start whitespace-nowrap">
                {t(k as any)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((project, i) => {
            const risk = resolveRiskBadge(lang, project.riskLevel);
            const isSelected = project.id === selectedProjectId;
            return (
              <motion.tr key={project.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => onSelect(project)}
                className={`border-b border-white/5 cursor-pointer transition-colors
                  ${isSelected ? "bg-orange-500/10 border-orange-500/20" : "hover:bg-white/5"}`}
              >
                <td className="py-3.5 px-4">
                  <p className="text-white font-medium text-sm">{project.name}</p>
                </td>
                <td className="py-3.5 px-4 text-gray-300 text-sm whitespace-nowrap">
                  {fmt(project.budget)} <span className="text-gray-500 text-xs">{cur}</span>
                </td>
                <td className="py-3.5 px-4 text-gray-300 text-sm whitespace-nowrap">
                  {fmt(project.actualCost)} <span className="text-gray-500 text-xs">{cur}</span>
                </td>
                <td className="py-3.5 px-4 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F97316] to-[#10B981] rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{project.progress}%</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-emerald-400 text-sm font-medium">
                  {project.profitMargin}%
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-lg border text-xs ${risk.className}`}>
                    {risk.label}
                  </span>
                </td>
                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onView(project)}
                      className="p-2 rounded-lg hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(project)}
                      className="p-2 rounded-lg hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(project)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </GlassCard>
  );

  return (
    <>
      {mobileCards}
      {desktopTable}
    </>
  );
}
