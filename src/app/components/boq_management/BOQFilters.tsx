// ============================================================
// BOQFilters.tsx — responsive
// ============================================================
import { Search }  from "lucide-react";
import GlassCard   from "../../core/shared/components/GlassCard";
import { tBOQMgt } from "../../core/i18n/boqManagement.i18n";
import type { BOQFiltersProps } from "../../core/models/BOQManagement.types";

export default function BOQFilters({
  search, onSearch, viewMode, onViewMode, lang,
}: BOQFiltersProps) {
  const isRtl = lang === "ar";

  return (
    <GlassCard className="p-4">
      <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4
                        items-stretch sm:items-center
                        ${isRtl ? "sm:flex-row-reverse" : ""}`}>

        {/* Search — fills available width */}
        <div className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl
                          bg-white/5 border border-white/10 focus-within:border-orange-500/50
                          transition-colors min-w-0
                          ${isRtl ? "flex-row-reverse" : ""}`}>
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            dir={isRtl ? "rtl" : "ltr"}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={tBOQMgt(lang, "searchPlaceholder")}
            className="bg-transparent border-none outline-none text-sm flex-1 min-w-0
                       text-white placeholder:text-gray-500"
          />
        </div>

        {/* View mode toggles — equal width and full-width on mobile */}
        <div className={`flex gap-2 shrink-0 ${isRtl ? "flex-row-reverse" : ""}`}>
          {(["standard", "comparison"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewMode(mode)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm
                           transition-all whitespace-nowrap text-center
                           ${viewMode === mode
                              ? "bg-gradient-to-l from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20"
                              : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                           }`}
            >
              {tBOQMgt(lang, mode === "standard" ? "viewStandard" : "viewComparison")}
            </button>
          ))}
        </div>

      </div>
    </GlassCard>
  );
}
