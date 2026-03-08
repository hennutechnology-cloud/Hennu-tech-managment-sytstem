// ============================================================
// ChartHeader.tsx — Responsive
// ============================================================
import { Plus } from "lucide-react";
import { tCOA } from "../../core/i18n/chartOfAccounts.i18n";
import type { ChartHeaderProps } from "../../core/models/ChartOfAccounts.types";

export default function ChartHeader({ onAddAccount, lang }: ChartHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {tCOA(lang, "pageTitle")}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          {tCOA(lang, "pageSubtitle")}
        </p>
      </div>
      <button
        onClick={onAddAccount}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
                   hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 shrink-0"
      >
        <Plus className="w-5 h-5" />
        {tCOA(lang, "addAccount")}
      </button>
    </div>
  );
}
