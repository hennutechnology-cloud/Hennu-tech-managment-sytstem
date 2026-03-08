// ============================================================
// DashboardHeader.tsx — Responsive
// ============================================================
import { tDash } from "../../core/i18n/dashboard.i18n";
import type { DashboardHeaderProps } from "../../core/models/dashboard.types";

export default function DashboardHeader({ lang }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {tDash(lang, "pageTitle")}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">{tDash(lang, "pageSubtitle")}</p>
      </div>
      <div className="flex items-center">
        <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm sm:text-base">
          {tDash(lang, "exportReport")}
        </button>
      </div>
    </div>
  );
}
