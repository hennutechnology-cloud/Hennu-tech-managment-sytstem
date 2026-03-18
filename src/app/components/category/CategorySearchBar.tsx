// ============================================================
// CategorySearchBar.tsx
// ============================================================
import { Search, X }   from "lucide-react";
import GlassCard        from "../../core/shared/components/GlassCard";
import { tCat }         from "../../core/i18n/category.i18n";
import type { CategorySearchBarProps } from "../../core/models/category.types";

export default function CategorySearchBar({ value, onChange, lang }: CategorySearchBarProps) {
  const isRtl = lang === "ar";

  return (
    <GlassCard className="p-3">
      <div className={`flex items-center gap-3 px-3 py-2 rounded-xl
                        bg-white/5 border border-white/10 focus-within:border-orange-500/50
                        transition-colors ${isRtl ? "flex-row-reverse" : ""}`}>
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          dir={isRtl ? "rtl" : "ltr"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={tCat(lang, "searchPH")}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500 min-w-0"
        />
        {value && (
          <button onClick={() => onChange("")} className="text-gray-500 hover:text-white transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </GlassCard>
  );
}
