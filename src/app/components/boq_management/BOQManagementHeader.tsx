// ============================================================
// BOQManagementHeader.tsx — responsive
// ============================================================
import { ClipboardList, Plus } from "lucide-react";
import { tBOQMgt }             from "../../core/i18n/boqManagement.i18n";
import type { BOQManagementHeaderProps } from "../../core/models/BOQManagement.types";

export default function BOQManagementHeader({ onAdd, lang }: BOQManagementHeaderProps) {
  const isRtl = lang === "ar";

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                     ${isRtl ? "sm:flex-row-reverse" : ""}`}>

      {/* Icon + title block */}
      <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700
                        flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div className={isRtl ? "text-right" : "text-left"}>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {tBOQMgt(lang, "pageTitle")}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {tBOQMgt(lang, "pageSubtitle")}
          </p>
        </div>
      </div>

      {/* Add button — full width on mobile, auto on sm+ */}
      <button
        onClick={onAdd}
        className={`flex items-center justify-center gap-2
                    px-4 py-2.5 rounded-xl
                    bg-gradient-to-l from-orange-500 to-orange-600
                    hover:shadow-lg hover:shadow-orange-500/30
                    text-white text-sm font-medium transition-all
                    w-full sm:w-auto shrink-0
                    ${isRtl ? "flex-row-reverse" : ""}`}
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span>{tBOQMgt(lang, "addBtn")}</span>
      </button>
    </div>
  );
}
