// ============================================================
// DepreciationHeader.tsx — Responsive
// ============================================================
import { Plus }            from "lucide-react";
import { useDepreciation } from "../../core/services/Depreciation.service";
import { tDep }            from "../../core/i18n/depreciation.i18n";
import type { DepreciationHeaderProps } from "../../core/models/Depreciation.types";

export default function DepreciationHeader({ lang }: DepreciationHeaderProps) {
  const { openCreate } = useDepreciation();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {tDep(lang, "pageTitle")}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">{tDep(lang, "pageSubtitle")}</p>
      </div>
      <button
        onClick={openCreate}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
          hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 shrink-0"
      >
        <Plus className="w-5 h-5" />
        {tDep(lang, "addAsset")}
      </button>
    </div>
  );
}
