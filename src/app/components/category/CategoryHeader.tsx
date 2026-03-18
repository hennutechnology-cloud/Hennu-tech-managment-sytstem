// ============================================================
// CategoryHeader.tsx
// ============================================================
import { Tag, Plus } from "lucide-react";
import { tCat }      from "../../core/i18n/category.i18n";
import type { CategoryHeaderProps } from "../../core/models/category.types";

export default function CategoryHeader({ lang, total, onAdd }: CategoryHeaderProps) {
  const isRtl = lang === "ar";

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                     ${isRtl ? "sm:flex-row-reverse" : ""}`}>

      {/* Icon + title */}
      <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700
                        flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
          <Tag className="w-5 h-5 text-white" />
        </div>
        <div className={isRtl ? "text-right" : "text-left"}>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {tCat(lang, "title")}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {tCat(lang, "subtitle")}
            <span className="mx-2 text-white/20">·</span>
            <span className="text-orange-400 font-semibold">{total}</span>
            {" "}{tCat(lang, "totalLabel")}
          </p>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={onAdd}
        className={`flex items-center justify-center gap-2
                    px-5 py-2.5 rounded-xl w-full sm:w-auto shrink-0
                    bg-gradient-to-l from-orange-500 to-orange-600
                    hover:shadow-lg hover:shadow-orange-500/30
                    text-white text-sm font-medium transition-all
                    ${isRtl ? "flex-row-reverse" : ""}`}
      >
        <Plus className="w-4 h-4 shrink-0" />
        {tCat(lang, "addCategory")}
      </button>
    </div>
  );
}
