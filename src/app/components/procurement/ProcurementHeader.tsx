// ============================================================
// ProcurementHeader.tsx
// ============================================================
import { Plus } from "lucide-react";
import { tPro } from "../../core/i18n/procurement.i18n";
import type { ProcurementHeaderProps } from "../../core/models/procurement.types";

export default function ProcurementHeader({ lang, onAdd }: ProcurementHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {tPro(lang, "pageTitle")}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">{tPro(lang, "pageSubtitle")}</p>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 w-full sm:w-auto justify-center px-5 py-3
                   bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
                   hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm sm:text-base"
      >
        <Plus className="w-4 h-4" />
        {tPro(lang, "addSupplier")}
      </button>
    </div>
  );
}
