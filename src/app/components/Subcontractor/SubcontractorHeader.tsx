// ============================================================
// SubcontractorHeader.tsx
// ============================================================
import { Plus } from "lucide-react";
import { tSub } from "../../core/i18n/subcontractor.i18n";
import type { SubcontractorHeaderProps } from "../../core/models/subcontractor.types";

export default function SubcontractorHeader({ lang, onAdd }: SubcontractorHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {tSub(lang, "title")}
        </h1>
        <p className="text-gray-400">{tSub(lang, "subtitle")}</p>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl"
      >
        <Plus size={16} />
        {tSub(lang, "newSub")}
      </button>
    </div>
  );
}
