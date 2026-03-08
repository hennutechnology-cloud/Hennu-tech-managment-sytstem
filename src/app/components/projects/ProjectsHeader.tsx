// ============================================================
// ProjectsHeader.tsx — Responsive
// ============================================================
import { Plus } from "lucide-react";
import { tProj, dirAttr } from "../../core/i18n/projects.i18n";
import type { ProjectsHeaderProps } from "../../core/models/projects.types";

export default function ProjectsHeader({ lang, onAddProject }: ProjectsHeaderProps) {
  return (
    <div dir={dirAttr(lang)} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {tProj(lang, "pageTitle")}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">{tProj(lang, "pageSubtitle")}</p>
      </div>
      <button
        onClick={onAddProject}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all font-medium shrink-0"
      >
        <Plus className="w-5 h-5" />
        {tProj(lang, "addProject")}
      </button>
    </div>
  );
}
