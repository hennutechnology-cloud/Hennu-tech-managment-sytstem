// ============================================================
// TrialHeader.tsx
// ============================================================
import { Download }  from "lucide-react";
import { tTB, dirAttr } from "../../core/i18n/trialBalance.i18n";
import type { TrialHeaderProps } from "../../core/models/TrialBalance.types";

export default function TrialHeader({ lang, onExport, exporting }: TrialHeaderProps) {
  return (
    <div
      dir={dirAttr(lang)}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {tTB(lang, "pageTitle")}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">{tTB(lang, "pageSubtitle")}</p>
      </div>

      <button
        onClick={onExport}
        disabled={exporting}
        className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C]
                   text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all
                   flex items-center justify-center gap-2 text-sm sm:text-base
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {exporting
          ? <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Download className="w-4 h-4 sm:w-5 sm:h-5" />}
        {exporting ? tTB(lang, "exporting") : tTB(lang, "exportExcel")}
      </button>
    </div>
  );
}
