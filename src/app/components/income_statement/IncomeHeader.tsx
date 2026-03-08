// ============================================================
// IncomeHeader.tsx — Responsive
// ============================================================
import { Download } from "lucide-react";
import { tIS }      from "../../core/i18n/incomeStatement.i18n";
import type { IncomeHeaderProps } from "../../core/models/IncomeStatement.types";

export default function IncomeHeader({ onExport, exporting, lang }: IncomeHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {tIS(lang, "pageTitle")}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">{tIS(lang, "pageSubtitle")}</p>
      </div>
      <button
        onClick={onExport}
        disabled={exporting}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
                   hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2
                   disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
      >
        {exporting
          ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Download className="w-5 h-5" />}
        {exporting ? tIS(lang, "exporting") : tIS(lang, "exportPdf")}
      </button>
    </div>
  );
}
