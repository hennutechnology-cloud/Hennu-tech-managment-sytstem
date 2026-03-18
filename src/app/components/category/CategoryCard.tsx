// ============================================================
// CategoryCard.tsx
// ============================================================
import { motion }                    from "motion/react";
import { Edit2, Trash2, Link2 }      from "lucide-react";
import GlassCard                     from "../../core/shared/components/GlassCard";
import { tCat, getColorOption }      from "../../core/i18n/category.i18n";
import type { CategoryCardProps }    from "../../core/models/category.types";

export default function CategoryCard({ category, lang, onEdit, onDelete }: CategoryCardProps) {
  const isRtl = lang === "ar";
  const color = getColorOption(category.color);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <GlassCard hover className="group relative overflow-hidden">

        {/* Subtle color tint in the top-right corner */}
        <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl ${color.dot}`} />

        {/* Top row: icon + name + actions */}
        <div className={`flex items-start justify-between gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>

          {/* Icon badge */}
          <div className={`flex items-center gap-3 min-w-0 ${isRtl ? "flex-row-reverse" : ""}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
                              ${color.bg} border ${color.border}`}>
              {category.icon}
            </div>
            <div className={`min-w-0 ${isRtl ? "text-right" : "text-left"}`}>
              <h3 className="text-base font-bold text-white truncate">{category.name}</h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">{category.nameEn}</p>
            </div>
          </div>

          {/* Action buttons — visible on hover */}
          <div className={`flex items-center gap-1 shrink-0
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            ${isRtl ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => onEdit(category)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-white/8" />

        {/* Footer: usage count + color dot */}
        <div className={`flex items-center justify-between ${isRtl ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-1.5 text-xs text-gray-400 ${isRtl ? "flex-row-reverse" : ""}`}>
            <Link2 className="w-3.5 h-3.5" />
            <span>
              <span className={`font-semibold ${color.text}`}>{category.usageCount}</span>
              {" "}{tCat(lang, "usageCount")}
            </span>
          </div>

          {/* Color dot badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                            ${color.bg} border ${color.border} ${color.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
            {category.color}
          </div>
        </div>

      </GlassCard>
    </motion.div>
  );
}
